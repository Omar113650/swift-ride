import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/rate.dto';
import { ThrottlerGuard } from '@nestjs/throttler';



@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  addRate(@Body() dto: CreateRatingDto, @Req() req) {
    return this.ratingService.addRate(dto, req.user);
  }

@UseGuards(ThrottlerGuard)
  @Get()
  getRatings(
    @Query('userId') userId?: string,
    @Query('driverId') driverId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ratingService.getRatings({
      userId,
      driverId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }
@UseGuards(ThrottlerGuard)
  @Get(':id')
  getRatingById(@Param('id') id: string) {
    return this.ratingService.getRatingById(id);
  }

  @Patch(':id')
  updateRating(@Param('id') id: string, @Body() dto: Partial<CreateRatingDto>) {
    return this.ratingService.updateRating(id, dto);
  }

  @Delete(':id')
  deleteRating(@Param('id') id: string) {
    return this.ratingService.deleteRating(id);
  }
}
