export class PrismaApiFeatures {
  private where: any = {};
  private orderBy: any = { createdAt: 'desc' };
  private skip: number = 0;
  private take: number = 10;

  constructor(private queryString: any) {}

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit', 'fields', 'order'];
    excludedFields.forEach((el) => delete queryObj[el]);

    Object.keys(queryObj).forEach((key) => {
      const value = queryObj[key];

      // لو فيه operators
      if (typeof value === 'object') {
        this.where[key] = {};

        Object.keys(value).forEach((operator) => {
          switch (operator) {
            case 'gte':
              this.where[key].gte = value[operator];
              break;

            case 'gt':
              this.where[key].gt = value[operator];
              break;

            case 'lte':
              this.where[key].lte = value[operator];
              break;

            case 'lt':
              this.where[key].lt = value[operator];
              break;
          }
        });
      } else {
        // البحث النصي (ILIKE في Prisma)
        this.where[key] = {
          contains: value,
          mode: 'insensitive',
        };
      }
    });

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.orderBy = {
        [this.queryString.sort]:
          this.queryString.order?.toLowerCase() === 'desc' ? 'desc' : 'asc',
      };
    } else {
      this.orderBy = { createdAt: 'desc' };
    }

    return this;
  }

  paginate() {
    const page = Math.max(Number(this.queryString.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(this.queryString.limit) || 10, 1),
      100,
    );

    this.skip = (page - 1) * limit;
    this.take = limit;

    return this;
  }

  async execute(prismaModel: any) {
    const [data, total] = await Promise.all([
      prismaModel.findMany({
        where: this.where,
        orderBy: this.orderBy,
        skip: this.skip,
        take: this.take,
      }),
      prismaModel.count({
        where: this.where,
      }),
    ]);

    const page = Math.floor(this.skip / this.take) + 1;

    return {
      currentPage: page,
      totalPages: Math.ceil(total / this.take),
      totalCount: total,
      hasNextPage: page < Math.ceil(total / this.take),
      hasPrevPage: page > 1,
      data,
    };
  }
}
