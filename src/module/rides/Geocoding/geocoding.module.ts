// geocoding.module.ts
import { Module } from '@nestjs/common';
import { GeocodingService } from './Geocoding.service';

@Module({
  providers: [GeocodingService],
  exports: [GeocodingService],
})
export class GeocodingModule {}
