import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Post } from './entities/post.entities';
import { CreateResponse } from './types/post.types';
import { CreateDto } from './dto/post.dto';
import { BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { STATUS_CODE } from '../constants';
import { User } from '../entities/user.entities';
import { GraphContextType } from '../typing';
import { UserConfigDataLoader } from '../dataloader/user-config.dataloader';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly userConfigDataLoader: UserConfigDataLoader,
  ) {}
  @Mutation(() => CreateResponse)
  async createPost(
    @Args('createInput') createDto: CreateDto,
  ): Promise<CreateResponse> {
    const { title, content, userId } = createDto;
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }
    if (!title || !content) {
      throw new BadRequestException('Please fill the all fields');
    }
    await this.postsService.createPost(createDto);
    return {
      code: STATUS_CODE.SUCCESS,
    };
  }

  // Query all posts
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return this.postsService.getAllPosts();
  }

  // Query post by ID
  @Query(() => Post)
  async post(@Args('id') id: string): Promise<Post> {
    return this.postsService.getPostById(id);
  }

  @ResolveField(() => User)
  async user(
    @Parent() post: Post,
    @Context() context: GraphContextType,
  ): Promise<User> {
    const { userId } = post;
    /**
     * @description 使用 DataLoader 优化了查询用户信息的性能，因为在查询多个帖子时，会有很多重复的用户信息查询，这样会导致数据库查询次数增多，性能下降。
     * @description 使用 DataLoader 可以将这些重复的查询合并为一次查询，减少了数据库的查询次数，提高了查询性能。
     *
     * @example this.prisma.user.findFirst({ where: { id: userId }, include: { post: true } })，这样去查询用户信息，会导致重复的查询，性能下降。
     */
    const loader =
      context.userConfigDataLoader ||
      this.userConfigDataLoader.generateDataLoader();
    return loader.load(userId);
  }
}
