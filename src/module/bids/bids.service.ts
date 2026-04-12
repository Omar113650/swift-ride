import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateRideBidDto } from './dto/create-bid.dto';
import { UpdateRideBidDto } from './dto/update-bid.dto';
// import{SocketService} from '../../core/socket/socket.service'

@Injectable()
export class RideBidService {
  constructor(
    private readonly prisma: PrismaService,
    //  private socketService: SocketService,
    // private readonly socketService: SocketService, // real-time notifications
  ) {}

  //  Driver creates a bid
  async createBid(createRideBidDto: CreateRideBidDto, driverId: string) {
    const ride = await this.prisma.ride.findUnique({
      where: { id: createRideBidDto.rideId },
    });


    
    const driver = await this.prisma.driver.findUnique({
  where: { userId: driverId }, // أو id حسب تصميمك
});

if (!driver) {
  throw new NotFoundException('Driver not found');
}
    if (!ride) throw new NotFoundException('Ride not found');
    if (ride.status !== 'BIDDING' && ride.status !== 'PENDING') {
      throw new BadRequestException('Cannot bid on this ride now');

    }
    const newBid = await this.prisma.rideBid.create({
      data: {
        ...createRideBidDto,
        driverId:driverId,
      },
    });

    // 🚀 notify rider in real-time
    // this.socketService.emitToUser(ride.riderId, 'driver_bid', newBid);

    return newBid;
  }


  // 2️⃣ Update bid (driver can edit before selection)

  async updateBid(
    bidId: string,
    updateDto: UpdateRideBidDto,
    driverId: string,
  ) {
    const bid = await this.prisma.rideBid.findUnique({ where: { id: bidId } });
    if (!bid) throw new NotFoundException('Bid not found');
    if (bid.driverId !== driverId)
      throw new BadRequestException('Cannot update others bid');
    if (bid.isSelected)
      throw new BadRequestException('Cannot update selected bid');

    const updatedBid = await this.prisma.rideBid.update({
      where: { id: bidId },
      data: updateDto,
    });

    // 🚀 notify rider about update
    // this.socketService.emitToUser(bid.rideId, 'driver_bid_updated', updatedBid);

    return updatedBid;
  }


  // 3️⃣ Delete bid (driver before selection)

  async deleteBid(bidId: string, driverId: string) {
    const bid = await this.prisma.rideBid.findUnique({ where: { id: bidId } });
    if (!bid) throw new NotFoundException('Bid not found');
    if (bid.driverId !== driverId)
      throw new BadRequestException('Cannot delete others bid');
    if (bid.isSelected)
      throw new BadRequestException('Cannot delete selected bid');

    const deletedBid = await this.prisma.rideBid.delete({
      where: { id: bidId },
    });

    // 🚀 notify rider about deletion
    // this.socketService.emitToUser(bid.rideId, 'driver_bid_deleted', deletedBid);

    return deletedBid;
  }


  // 4️⃣ Rider sees all bids for a ride

  async getBidsForRide(rideId: string) {
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
      include: { rideBids: true },
    });
    if (!ride) throw new NotFoundException('Ride not found');
    return ride.rideBids;
  }


  // 5️⃣ Rider selects a bid
  async selectBid(rideId: string, bidId: string) {
    const bid = await this.prisma.rideBid.findUnique({ where: { id: bidId } });
    if (!bid) throw new NotFoundException('Bid not found');
    if (bid.rideId !== rideId)
      throw new BadRequestException('Bid does not belong to this ride');

    // update ride with driver info
    const ride = await this.prisma.ride.update({
      where: { id: rideId },
      data: { 
        driverId: bid.driverId,
        selectedPrice: bid.price,
        status: 'DRIVER_SELECTED',
      },
    });

    // mark the bid as selected
    await this.prisma.rideBid.update({
      where: { id: bidId },
      data: { isSelected: true, status: 'ACCEPTED' },
    });

    // reject all other bids
    await this.prisma.rideBid.updateMany({
      where: { rideId, id: { not: bidId } },
      data: { status: 'REJECTED' },
    });

    // // 🚀 real-time notifications
    // this.socketService.emitToUser(bid.driverId, 'bid_selected', { rideId, bidId });
    // this.socketService.emitToUser(ride.riderId, 'bid_confirmed', { rideId, bidId });

    // ride.rideBids = await this.prisma.rideBid.findMany({ where: { rideId } });
    return ride;
  }
}










// enum BidStatus {
//   PENDING
//   ACCEPTED
//   REJECTED
// }









