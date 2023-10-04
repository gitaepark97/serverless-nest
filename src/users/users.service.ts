import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender, Users } from '../entities/Users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUser(
    email: string,
    password: string,
    nickname: string,
    gender: Gender,
  ) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await this.usersRepository.save({
        email,
        hashedPassword,
        salt,
        nickname,
        gender,
      });

      delete user.hashedPassword;
      delete user.salt;

      return user;
    } catch (err) {
      switch (err.code) {
        case 'ER_DUP_ENTRY':
          throw new BadRequestException(err.sqlMessage);
      }

      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        select: [
          'userId',
          'email',
          'hashedPassword',
          'nickname',
          'gender',
          'createdAt',
          'updatedAt',
        ],
        where: { email },
      });
      if (!user) {
        throw new NotFoundException('not found user');
      }

      return user;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new InternalServerErrorException();
    }
  }
}
