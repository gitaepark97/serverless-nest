import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterRequestDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sessions } from '../entities/Sessions';
import { Repository } from 'typeorm';
import { RenewAccessTokenRequestDto } from './dtos/renewAccessToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,
  ) {}

  async register(dto: RegisterRequestDto) {
    try {
      return this.usersService.createUser(
        dto.email,
        dto.password,
        dto.nickname,
        dto.gender,
      );
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findUserByEmail(email);
      if (!(await bcrypt.compare(password, user.hashedPassword))) {
        throw new BadRequestException('wrong password');
      }

      delete user.hashedPassword;

      return user;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new InternalServerErrorException();
    }
  }

  async login(user, userAgent: string, clientIp: string) {
    try {
      const accessTokenPayload = { email: user.email, sub: user.userId };
      const accessToken = this.jwtService.sign(accessTokenPayload, {
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
      });
      const refreshPayload = { id: uuidv4(), userId: user.userId };
      const refreshToken = this.jwtService.sign(refreshPayload, {
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      });

      const session = await this.sessionsRepository.save({
        sessionId: refreshPayload.id,
        refreshToken,
        userId: user.userId,
        userAgent,
        clientIp,
      });

      return { sessionId: session.sessionId, accessToken, refreshToken, user };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async renewAccessToken(dto: RenewAccessTokenRequestDto) {
    try {
      let refreshTokenPayload;
      try {
        refreshTokenPayload = await this.jwtService.verifyAsync(
          dto.refreshToken,
        );
      } catch (err) {
        throw new BadRequestException('invalid refresh token');
      }

      const session = await this.sessionsRepository.findOne({
        where: { sessionId: refreshTokenPayload.id },
      });
      if (!session) {
        throw new NotFoundException('not found session');
      }

      if (dto.refreshToken !== session.refreshToken) {
        throw new UnauthorizedException();
      }
      if (session.userId !== refreshTokenPayload.userId) {
        throw new UnauthorizedException();
      }
      if (session.isBlocked) {
        throw new UnauthorizedException();
      }

      const accessPayload = { user_id: refreshTokenPayload.userId };
      const accessToken = await this.jwtService.signAsync(accessPayload, {
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
      });

      return { accessToken };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new InternalServerErrorException();
    }
  }
}
