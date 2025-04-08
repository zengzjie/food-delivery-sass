import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UsersModule);

  // const { httpAdapter } = app.get(HttpAdapterHost);

  // 获取实际的 HTTP 服务器实例
  // const server = httpAdapter.getHttpServer();

  // app.useGlobalFilters(new PrismaClientExceptionFilter(server));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, 'email-templates'));
  app.setViewEngine('ejs');

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? 'https://example.com' : 'http://localhost:6001',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4001);
}
bootstrap();
