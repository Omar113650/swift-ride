// import { Controller, Get, Query } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { SearchService } from './search.service';
// import { SearchProductsDto } from './dto/search-products.dto';

// @ApiTags('search')
// @Controller('products')
// export class SearchController {
//   constructor(private readonly searchService: SearchService) {}

//   @Get('search')
//   @ApiOperation({ summary: 'Search products with filters and facets' })
//   @ApiResponse({ status: 200, description: 'Search results with total, page, results, and facets' })
//   @ApiResponse({ status: 500, description: 'Search service unavailable' })
//   async search(@Query() query: SearchProductsDto) {
//     const data = await this.searchService.search(query);
//     return { success: true, data };
//   }
// }