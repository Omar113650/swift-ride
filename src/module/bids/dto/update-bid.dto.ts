import { PartialType } from '@nestjs/mapped-types';
import { CreateRideBidDto } from './create-bid.dto';

export class UpdateBidDto extends PartialType(CreateRideBidDto) {}
