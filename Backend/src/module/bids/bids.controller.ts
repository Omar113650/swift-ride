import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { RideBidService } from './bids.service';
import { CreateRideBidDto } from './dto/create-bid.dto';
import { UpdateRideBidDto } from './dto/update-bid.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';


@Controller('bids')
export class RideBidController {
  constructor(private readonly rideBidService: RideBidService) {}

  @Post('add-bids')
  @UseGuards(RolesGuard)
  @Roles('RIDER', 'DRIVER', 'ADMIN')
  async createBid(@Body() dto: CreateRideBidDto, @Req() req: any) {
    console.log('USER FROM REQUEST:', req.User); 

    const driverId = req.User?.sub; 

    if (!driverId) {
      return {
        message: 'User not found in request',
      };
    }

    return this.rideBidService.createBid(dto, driverId);
  }

  @UseGuards(RolesGuard)
 
  @Roles('RIDER', 'DRIVER', 'ADMIN')

  // id= BidId
  @Patch(':id')
  async updateBid(
    @Param('id') bidId: string,
    @Body() dto: UpdateRideBidDto,
    @Req() req: any,
  ) {
    const driverUserId = req.User?.sub; 

    if (!driverUserId) {
      throw new UnauthorizedException('User not found in request');
    }

    return this.rideBidService.updateBid(bidId, dto, driverUserId);
  }

 
  @Delete(':id')
  async deleteBid(@Param('id') bidId: string, @Req() req: any) {
    const driverId = req.user.id;
    return this.rideBidService.deleteBid(bidId, driverId);
  }


  @Get('ride/:rideId')
  async getBidsForRide(@Param('rideId') rideId: string) {
    return this.rideBidService.getBidsForRide(rideId);
  }

  @Patch('ride/:rideId/select/:bidId')
  async selectBid(
    @Param('rideId') rideId: string,
    @Param('bidId') bidId: string,
  ) {
    return this.rideBidService.selectBid(rideId, bidId);
  }
}
