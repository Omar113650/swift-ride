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
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bids')
export class RideBidController {
  constructor(private readonly rideBidService: RideBidService) {}

  @Post('add-bids')
  @UseGuards(RolesGuard)
  @Roles('RIDER', 'DRIVER', 'ADMIN')
  async createBid(@Body() dto: CreateRideBidDto, @Req() req: any) {
    console.log('🔥 USER FROM REQUEST:', req.User); // debug مهم

    const driverId = req.User?.sub; // ✅ زي ما التوكن عندك

    if (!driverId) {
      return {
        message: 'User not found in request',
      };
    }

    return this.rideBidService.createBid(dto, driverId);
  }

  @UseGuards(RolesGuard)
  // 2️⃣ Update bid (Driver)
  @Roles('RIDER', 'DRIVER', 'ADMIN')

  // id= BidId
  @Patch(':id')
  async updateBid(
    @Param('id') bidId: string,
    @Body() dto: UpdateRideBidDto,
    @Req() req: any,
  ) {
    const driverUserId = req.User?.sub; // ✅ الصح

    if (!driverUserId) {
      throw new UnauthorizedException('User not found in request');
    }

    return this.rideBidService.updateBid(bidId, dto, driverUserId);
  }

  // 3️⃣ Delete bid (Driver)
  @Delete(':id')
  async deleteBid(@Param('id') bidId: string, @Req() req: any) {
    const driverId = req.user.id;
    return this.rideBidService.deleteBid(bidId, driverId);
  }

  // 4️⃣ Get all bids for a ride (Rider)
  @Get('ride/:rideId')
  async getBidsForRide(@Param('rideId') rideId: string) {
    return this.rideBidService.getBidsForRide(rideId);
  }

  // 5️⃣ Select bid (Rider)
  @Patch('ride/:rideId/select/:bidId')
  async selectBid(
    @Param('rideId') rideId: string,
    @Param('bidId') bidId: string,
  ) {
    return this.rideBidService.selectBid(rideId, bidId);
  }
}
