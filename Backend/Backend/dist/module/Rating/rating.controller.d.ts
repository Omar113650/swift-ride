import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/rate.dto';
export declare class RatingController {
    private readonly ratingService;
    constructor(ratingService: RatingService);
    addRate(dto: CreateRatingDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        driverId: string | null;
        score: number;
        comment: string | null;
        raterId: string;
    }>;
    getRatings(userId?: string, driverId?: string, page?: number, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        driverId: string | null;
        score: number;
        comment: string | null;
        raterId: string;
    }[]>;
    getRatingById(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        driverId: string | null;
        score: number;
        comment: string | null;
        raterId: string;
    }>;
    updateRating(id: string, dto: Partial<CreateRatingDto>): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        driverId: string | null;
        score: number;
        comment: string | null;
        raterId: string;
    }>;
    deleteRating(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        driverId: string | null;
        score: number;
        comment: string | null;
        raterId: string;
    }>;
    getTopRatedDrivers(query: any): Promise<{
        currentPage: number;
        totalPages: number;
        totalCount: any;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        data: any;
    }>;
}
