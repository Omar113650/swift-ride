

// import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
// import { ElasticsearchService } from '@nestjs/elasticsearch';
// import { SearchProductsDto, SortBy } from './dto/search-products.dto';
// import { ES_INDEX } from '../sync/sync.service';

// @Injectable()
// export class SearchService {
//   private readonly logger = new Logger(SearchService.name);

//   constructor(private readonly esService: ElasticsearchService) {}

//   async search(dto: SearchProductsDto) {
//     const { page = 1, limit = 20 } = dto;
//     const from = (page - 1) * limit;
//     const body = this.buildQuery(dto);

//     try {
//       const result = await this.esService.search({
//         index: ES_INDEX,
//         from,
//         size:  limit,
//         body,
//       });
//       return this.formatResponse(result, page, limit);
//     } catch (err) {
//       this.logger.error('Elasticsearch search failed', err);
//       throw new InternalServerErrorException('Search service unavailable');
//     }
//   }

//   private buildQuery(dto: SearchProductsDto): Record<string, any> {
//     const { query, category_id, supplier_id, min_price, max_price, attributes, is_available, sort_by } = dto;

//     const filters: any[] = [{ term: { status: 'active' } }];

//     if (is_available !== undefined) filters.push({ term: { is_available } });
//     if (category_id)                filters.push({ term: { category_id } });
//     if (supplier_id)                filters.push({ term: { supplier_id } });

//     if (min_price !== undefined || max_price !== undefined) {
//       const range: Record<string, number> = {};
//       if (min_price !== undefined) range.gte = min_price;
//       if (max_price !== undefined) range.lte = max_price;
//       filters.push({ range: { price: range } });
//     }

//     if (attributes && Object.keys(attributes).length > 0) {
//       for (const [key, value] of Object.entries(attributes)) {
//         const safeKey = key.replace(/[^a-zA-Z0-9_]/g, '');
//         if (safeKey) filters.push({ term: { [`attributes.${safeKey}`]: value } });
//       }
//     }

//     const mustClauses: any[] = [];
//     if (query?.trim()) {
//       mustClauses.push({
//         multi_match: {
//           query:     query.trim(),
//           fields:    ['name^3', 'description'], // make the name higher priority
//           type:      'best_fields',
//           fuzziness: 'AUTO',
//         },
//       });
//     }

//     const esQuery = {
//       function_score: {
//         query: {
//           bool: {
//             ...(mustClauses.length > 0 ? { must: mustClauses } : {}),
//             filter: filters,
//           },
//         },
//         functions: [
//           {
//             field_value_factor: {
//               field:    'sales_score',
//               modifier: 'log1p',
//               factor:   1.5,
//               missing:  1,
//             },
//           },
//         ],
//         boost_mode: 'sum',
//       },
//     };

//     let sort: any[] | undefined;
//     if (!query?.trim() || sort_by !== SortBy.SALES_SCORE) {
//       switch (sort_by) {
//         case SortBy.PRICE_ASC:  sort = [{ price: { order: 'asc' } }];  break;
//         case SortBy.PRICE_DESC: sort = [{ price: { order: 'desc' } }]; break;
//         case SortBy.NEWEST:     sort = [{ created_at: { order: 'desc' } }]; break;
//         default:                sort = [{ sales_score: { order: 'desc' } }];
//       }
//     }

//     const aggs = {
//       by_category: {
//         terms: { field: 'category_id', size: 50 },
//         aggs: { category_name: { terms: { field: 'category_name.keyword', size: 1 } } },
//       },
//       by_color:    { terms: { field: 'attributes.color', size: 30 } },
//       by_size:     { terms: { field: 'attributes.size',  size: 30 } },
//       price_stats: { stats: { field: 'price' } },
//     };

//     return { query: esQuery, aggs, ...(sort ? { sort } : {}) };
//   }

//   private formatResponse(esResult: any, page: number, limit: number) {
//     const hits  = esResult.hits?.hits  ?? [];
//     const total = esResult.hits?.total?.value ?? 0;
//     const aggs  = esResult.aggregations ?? {};

//     const results = hits.map((hit: any) => ({
//       ...hit._source,
//       _score: hit._score ?? 0,
//     }));

//     const facets = {
//       categories: (aggs.by_category?.buckets ?? []).map((b: any) => ({
//         id: b.key, name: b.category_name?.buckets?.[0]?.key ?? b.key, count: b.doc_count,
//       })),
//       attributes: {
//         color: (aggs.by_color?.buckets ?? []).map((b: any) => ({ value: b.key, count: b.doc_count })),
//         size:  (aggs.by_size?.buckets  ?? []).map((b: any) => ({ value: b.key, count: b.doc_count })),
//       },
//       price_range: { min: aggs.price_stats?.min ?? 0, max: aggs.price_stats?.max ?? 0 },
//     };

//     return { total, page, limit, results, facets };
//   }
// }