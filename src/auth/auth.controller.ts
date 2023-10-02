import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dtos/register.dto';
import { User } from '../decorators/user.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RenewAccessTokenRequestDto } from './dtos/renewAccessToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterRequestDto) {
    return this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req, @User() user) {
    const userAgent = req.headers['user-agent'];
    const clientIp = req.ip;

    return this.authService.login(user, userAgent, clientIp);
  }

  @Post('renew-access-token')
  renewAccessToken(@Body() body: RenewAccessTokenRequestDto) {
    return this.authService.renewAccessToken(body);
  }
}
