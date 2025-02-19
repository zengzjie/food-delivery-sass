import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { PrismaService } from '../../../../prisma/prisma.service';

@Module({
  imports: [],
  providers: [PrismaService, PostsService, PostsResolver],
  exports: [PostsService, PostsResolver],
})
export class PostsModule {}
