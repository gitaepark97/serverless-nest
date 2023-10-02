import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
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
  }

  findUserByEmail(email: string) {
    const user = this.usersRepository.findOne({
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
  }
}
