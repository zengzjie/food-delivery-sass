import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { ConfiguredEnv } from '../typing';
import { ExtractJwt } from 'passport-jwt';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private globalWhiteList: any[];
  constructor(
    private readonly config: ConfigService<ConfiguredEnv>,
    private readonly redisService: RedisService,
  ) {
    super();
    this.globalWhiteList = [].concat(
      JSON.parse(this.config.get('PERM_ROUTER_WHITE_LIST') ?? '') || [],
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType<GqlContextType>() === 'graphql') {
      const info = GqlExecutionContext.create(context).getInfo();
      const req = this.getRequest(context);
      const isInGlobalWhitelist = this.globalWhiteList.some(
        (fieldName) => fieldName === info.fieldName,
      );
      // 读取 redis 缓存中的用户信息
      const userInfo = await this.redisService.get(`user-info`);
      const paseUserInfo = JSON.parse(userInfo);
      if (isInGlobalWhitelist) {
        req.user = paseUserInfo
          ? {
              userId: paseUserInfo.id,
              name: paseUserInfo.name,
            }
          : {};
        return true;
      } else {
        // 如果没有获取到用户信息则代表缓存已过期，需要重新登录
        if (!paseUserInfo) {
          throw new UnauthorizedException();
        }
        /**
         * 调用父类的 canActivate 方法, 调用 Strategy 的 validate 验证是否登录成功, 成功自动注入到 ctx.req.user 中
         * result 为 true 时表示登录成功, 内部 try catch 会捕获登录失败的异常, catch 捕获到异常默认会抛出 401 Unauthorized, 下面的逻辑不会执行
         */
        const cacheToken = await this.redisService.get(
          `user-token-${JSON.parse(userInfo).id}`,
        );
        const token = req.cookies['Authorization'];

        if (!token) {
          throw new UnauthorizedException();
        }

        // 如果 token 不一致则代表用户已在其他地方登录
        if (token !== cacheToken) {
          throw new UnauthorizedException(
            'Your account has been logged in from another location, please log in again.',
          );
        }

        // super.canActivate(context) 会调用 passport.authenticate 方法验证 token, 默认情况下是 passport-jwt 是从 Authorization 头中获取 token
        // 因为在 JwtStrategy 中配置了 jwtFromRequest: ExtractJwt.fromExtractors([ ... ]) 从 cookie 中获取 token, 所以这里可以直接调用 super.canActivate(context)
        // 如果是设置的 fromAuthHeaderAsBearerToken 则这里会报错, 因为没有 Authorization 头
        return <boolean>await super.canActivate(context);
      }
    } else {
      return <boolean>await super.canActivate(context);
    }
  }

  public override getRequest(context: ExecutionContext): Request {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext<{
        req: Request;
      }>();
      return ctx.req;
    }

    return context.switchToHttp().getRequest<Request>();
  }
}
