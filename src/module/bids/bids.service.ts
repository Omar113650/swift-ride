import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateRideBidDto } from './dto/create-bid.dto';
import { UpdateRideBidDto } from './dto/update-bid.dto';
import{SocketService} from '../../core/socket/socket.service'

@Injectable()
export class RideBidService {
  constructor(
    private readonly prisma: PrismaService,
     private socketService: SocketService,
  
  ) {}

//   //  Driver creates a bid
//   async createBid(createRideBidDto: CreateRideBidDto, driverId: string) {
//     const ride = await this.prisma.ride.findUnique({
//       where: { id: createRideBidDto.rideId },
//     });

//     const driver = await this.prisma.driver.findUnique({
//   where: { userId: driverId }, 
// });

// if (!driver) {
//   throw new NotFoundException('Driver not found');
// }
//     // if (!ride) throw new NotFoundException('Ride not found');
//     // if (ride.status !== 'BIDDING' && ride.status !== 'PENDING') {
//     //   throw new BadRequestException('Cannot bid on this ride now');

//     // }
// const newBid = await this.prisma.rideBid.create({
//   data: {
//     ...createRideBidDto,
//     driverId: driver.id,
//   },
// });

//     // 🚀 notify rider in real-time
//     // this.socketService.emitToUser(ride.riderId, 'driver_bid', newBid);

//     return newBid;
//   }





async createBid(createRideBidDto: CreateRideBidDto, driverId: string) {
  const ride = await this.prisma.ride.findUnique({
    where: { id: createRideBidDto.rideId },
  });

  if (!ride) {
    throw new NotFoundException('Ride not found');
  }

  const driver = await this.prisma.driver.findUnique({
    where: { userId: driverId },
  });

  if (!driver) {
    throw new NotFoundException('Driver not found');
  }


  const bidsCount = await this.prisma.rideBid.count({
    where: {
      rideId: ride.id,
      driverId: driver.id,
    },
  });
// limit
  if (bidsCount >= 3) {
    throw new BadRequestException('Max bids reached');
  }

  const newBid = await this.prisma.rideBid.create({
    data: {
      ...createRideBidDto,
      driverId: driver.id,
    },
  });

  this.socketService.emitToUser(
    ride.riderId,
    'new_bid',
    {
      rideId: ride.id,
      bidId: newBid.id,
      driverId: driver.id,
      price: newBid.price,
      message: ' New driver bid received',
    },
  );

  return newBid;
}

  


async updateBid(
  bidId: string,
  updateDto: UpdateRideBidDto,
  driverUserId: string, // ده جاي من JWT (sub)
) {
  const bid = await this.prisma.rideBid.findUnique({
    where: { id: bidId },
  });

  if (!bid) {
    throw new NotFoundException('Bid not found');
  }

  // ✅ هات الـ driver الحقيقي من الـ userId
  const driver = await this.prisma.driver.findUnique({
    where: { userId: driverUserId },
  });

  if (!driver) {
    throw new NotFoundException('Driver not found');
  }

  // ✅ قارن بالـ driver.id مش userId
  if (bid.driverId !== driver.id) {
    throw new BadRequestException('Cannot update others bid');
  }

  if (bid.isSelected) {
    throw new BadRequestException('Cannot update selected bid');
  }

  const updatedBid = await this.prisma.rideBid.update({
    where: { id: bidId },
    data: updateDto,
  });

  // 🚀 notify rider about update (هنفعلها بعدين)
  // this.socketService.emitToUser(bid.rideId, 'driver_bid_updated', updatedBid);

  return updatedBid;
}




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




  async getBidsForRide(rideId: string) {
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
      include: { rideBids: true },
    });
    if (!ride) throw new NotFoundException('Ride not found');
    return ride.rideBids;
  }



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

  
    await this.prisma.rideBid.update({
      where: { id: bidId },
      data: { isSelected: true, status: 'ACCEPTED' },
    });

    // reject all other bids
    await this.prisma.rideBid.updateMany({
      where: { rideId, id: { not: bidId } },
      data: { status: 'REJECTED' },
    });


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









