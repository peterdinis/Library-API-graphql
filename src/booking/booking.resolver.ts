import { Resolver } from "@nestjs/graphql";
import { BookingModel } from "./booking.model";

@Resolver(() => BookingModel)
export class BookingResolver {
    
}