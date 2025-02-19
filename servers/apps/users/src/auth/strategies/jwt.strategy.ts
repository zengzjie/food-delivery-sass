import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload, Payload } from '../auth.interface';
import { ConfiguredEnv } from '../../typing';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<ConfiguredEnv>) {
    super({
      // jwtFromRequest: ExtractJwt.fromHeader('cookie'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  public async validate(payload: JwtPayload): Promise<Payload> {
    console.log('payload', payload);
    return { userId: payload.sub, name: payload.name };
  }
}
