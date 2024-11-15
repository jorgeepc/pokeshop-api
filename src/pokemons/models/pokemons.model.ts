import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Pokemon {
  @Field((type) => Int)
  id: number;

  @Field({ nullable: false })
  name: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  imageUrl?: string;
}
