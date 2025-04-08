import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload, Payload } from '../auth.interface';
import { ConfiguredEnv } from '../../typing';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<ConfiguredEnv>) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['Authorization'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  public async validate(payload: JwtPayload): Promise<Payload> {
    console.log('payload', payload);
    return { userId: payload.sub, name: payload.name };
  }
}
