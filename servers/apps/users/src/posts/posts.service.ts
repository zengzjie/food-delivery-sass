import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(createDto: CreateDto) {
    const { title, content, userId } = createDto;
    return await this.prisma.post.create({
      data: {
        title,
        content,
        userId,
      },
    });
  }

  async getAllPosts() {
    return this.prisma.post.findMany();
  }

  async getPostById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;
  }

  async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
