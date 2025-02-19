import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from '../posts/entities/post.entities';

@ObjectType({ description: 'The Avatar model' })
@Directive(`@key(fields: "id")`)
export class Avatar {
  @Field(() => ID, { nullable: true, description: 'A unique identifier' })
  id: string;

  @Field()
  public_id: string;

  @Field()
  url: string;

  @Field()
  userId: string;
}

@ObjectType({ description: 'The User model' })
export class User {
  @Field(() => ID, { nullable: true, description: 'A unique identifier' })
  id: string;

  @Field()
  name: string;

  @Field()
  sex: number;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  mobile: string;

  @Field({ nullable: true })
  address: string;

  @Field(() => Avatar, { nullable: true })
  avatar?: Avatar | null;

  @Field(() => [Post])
  posts?: Post[];

  @Field()
  role: string;

  @Field()
  createAt: Date;

  @Field()
  updateAt: Date;
}
