import { Global, Module } from '@nestjs/common';
import { UserConfigDataLoader } from './user-config.dataloader';
import { PrismaService } from '../../../../prisma/prisma.service';

@Global()
@Module({
  providers: [UserConfigDataLoader, PrismaService],
  exports: [UserConfigDataLoader],
})
export class DataLoaderModule {}
