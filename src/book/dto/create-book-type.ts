import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateBookInput {
    @Field()
   name: string;

   @Field()
   description: string;

   @Field()
   image: string;

   @Field(() => Date)
   createdYear: string

   @Field(() => Number)
   pages: number;

   @Field()
   authorName: string;

   @Field(() => Boolean)
   isAvaiable: boolean;

   @Field(() => Boolean)
   isBorrowed: boolean;

   @Field(() =>Boolean)
   isReturned: boolean;

   @Field(() => Number)
   stockNumber: number;

   @Field()
   serialNumber: string;

}