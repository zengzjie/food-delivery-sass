import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  RedisModule as NRedisModule,
  RedisModuleAsyncOptions,
} from '@liaoliaots/nestjs-redis';
import { RedisService } from './redis.service';

@Global()
@Module({})
export class RedisModule {
  static forRootAsync(
    options: RedisModuleAsyncOptions,
    isGlobal = true,
  ): DynamicModule {
    return {
      module: RedisModule,
      imports: [NRedisModule.forRootAsync(options, isGlobal)],
      providers: [RedisService],
      exports: [RedisService],
    };
  }
}
