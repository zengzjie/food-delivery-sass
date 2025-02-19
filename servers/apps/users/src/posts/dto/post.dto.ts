import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateDto {
  @Field()
  @IsNotEmpty({
    message: 'Title is required.',
  })
  @IsString({
    message: 'Title must need to be one string.',
  })
  title: string;

  @Field()
  @IsNotEmpty({
    message: 'Content is required.',
  })
  content: string;

  @Field()
  @IsNotEmpty({
    message: 'User ID is required.',
  })
  userId: string;
}
