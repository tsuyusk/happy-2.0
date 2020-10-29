import { Injectable, Inject, HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import { HashProvider } from '../../shared/providers/Hash/Hash.provider';
import { CreateUserDto } from './interfaces/create-user.dto';
import { AuthenticateUserDto } from './interfaces/authenticate-user.dto';
import { UsersRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject('UsersRepository')
    private usersRepository: UsersRepository,
    @Inject('HashProvider')
    private hashProvider: HashProvider,
  ) {}

  async create({ email, password, key }: CreateUserDto) {
    if (key !== process.env.ADM_KEY) {
      console.log({ key, admKey: process.env.ADM_KEY });
      throw new HttpException('Invalid Key.', 400);
    }

    const hasUserWithSameEmail = await this.usersRepository.findByEmail(email);

    if (hasUserWithSameEmail) {
      throw new HttpException('E-mail already taken', 400);
    }

    const hashedPassword = await this.hashProvider.generate(password);

    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    return user;
  }

  async authenticate({ email, password }: AuthenticateUserDto) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new HttpException('Invalid Email/Password', 400);
    }

    const passwordMatches = await this.hashProvider.verify(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new HttpException('Invalid Email/Password', 400);
    }

    const {
      jwt: { secret, expiresIn },
    } = authConfig;

    const token = jwt.sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}
