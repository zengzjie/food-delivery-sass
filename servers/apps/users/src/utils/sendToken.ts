import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entities';
import { accessTokenExpiresIn, refreshTokenExpiresIn } from '../constants';

export class GenerateToken {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public sendToken(user: User) {
    const access_token = this.jwtService.sign(
      {
        sub: user.id,
        name: user.name,
      },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: accessTokenExpiresIn,
      },
    );

    const refresh_token = this.jwtService.sign(
      {
        sub: user.id,
        name: user.name,
      },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: refreshTokenExpiresIn,
      },
    );

    return {
      access_token,
      refresh_token,
    };
  }
}
