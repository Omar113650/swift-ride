import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateRideBidDto } from './dto/create-bid.dto';
import { UpdateRideBidDto } from './dto/update-bid.dto';
import { SocketService } from '../../core/socket/socket.service';

@Injectable()
export class RideBidService {
  constructor(
    private readonly prisma: PrismaService,
    private socketService: SocketService,
  ) {}

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

    this.socketService.emitToUser(ride.riderId, 'new_bid', {
      rideId: ride.id,
      bidId: newBid.id,
      driverId: driver.id,
      price: newBid.price,
      message: ' New driver bid received',
    });

    return newBid;
  }

  async updateBid(
    bidId: string,
    updateDto: UpdateRideBidDto,
    driverUserId: string, 
  ) {
    const bid = await this.prisma.rideBid.findUnique({
      where: { id: bidId },
    });

    if (!bid) {
      throw new NotFoundException('Bid not found');
    }

    const driver = await this.prisma.driver.findUnique({
      where: { userId: driverUserId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

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

    return ride;
  }
}
