import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../entities/user.entities';

@ObjectType({ description: 'The Avatar model' })
@Directive(`@key(fields: "id")`)
export class Post {
  @Field(() => ID, { nullable: true, description: 'A unique identifier' })
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  userId: string;

  @Field()
  createAt: Date;

  @Field()
  updateAt: Date;
}
