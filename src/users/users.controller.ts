import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get()
  test(@User() user) {
    return user;
  }
}
