import { Body, Controller, Inject, Post } from '@nestjs/common';
import { classToClass } from 'class-transformer';

import { CreateUserDto } from './interfaces/create-user.dto';
import { AuthenticateUserDto } from './interfaces/authenticate-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    @Inject('UserService')
    private userService: UserService,
  ) {}

  @Post()
  async create(@Body() { email, password, key }: CreateUserDto) {
    const user = await this.userService.create({ email, password, key });

    return classToClass(user);
  }

  @Post('auth')
  async authenticate(@Body() { email, password }: AuthenticateUserDto) {
    const userAndToken = await this.userService.authenticate({
      email,
      password,
    });

    return classToClass(userAndToken);
  }
}
