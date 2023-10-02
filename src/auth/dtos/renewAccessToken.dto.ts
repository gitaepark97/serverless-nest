import { IsNotEmpty, IsString } from 'class-validator';

export class RenewAccessTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
