export declare class PrismaApiFeatures {
    private queryString;
    private where;
    private orderBy;
    private skip;
    private take;
    constructor(queryString: any);
    filter(): this;
    sort(): this;
    paginate(): this;
    execute(prismaModel: any): Promise<{
        currentPage: number;
        totalPages: number;
        totalCount: any;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        data: any;
    }>;
}
