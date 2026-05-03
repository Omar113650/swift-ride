import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateRatingDto } from './dto/rate.dto';
import { PrismaApiFeatures } from '../../shared/utils/api-features';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async addRate(dto: CreateRatingDto, user: any) {
    const rate = await this.prisma.rating.create({
      data: {
        ...dto,
        raterId: user.id,
      },
    });

    return rate;
  }

  async getRatings(query: {
    userId?: string;
    driverId?: string;
    page?: number;
    limit?: number;
  }) {
    const { userId, driverId, page = 1, limit = 10 } = query;

    return await this.prisma.rating.findMany({
      where: {
        userId: userId ?? undefined,
        driverId: driverId ?? undefined,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getRatingById(id: string) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    return rating;
  }

  async updateRating(id: string, dto: Partial<CreateRatingDto>) {
    return await this.prisma.rating.update({
      where: { id },
      data: {
        score: dto.score,
        comment: dto.comment,
      },
    });
  }

  async deleteRating(id: string) {
    return await this.prisma.rating.delete({
      where: { id },
    });
  }

async getTopRatedDrivers(query: any) {
  const result = await new PrismaApiFeatures(query)
    .filter()
    .sort()
    .paginate()
    .execute(this.prisma.rating);

  return result;
}

}
