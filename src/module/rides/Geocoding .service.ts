import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';


// هدفي هنا اخد عنوان وارجع الاحدثيات 
@Injectable()
export class GeocodingService {
  async getCoordinates(address: string) {
    const url = 'https://nominatim.openstreetmap.org/search';

    const response = await axios.get(url, {
      params: {
        format: 'json',
        q: address,
        limit: 1,
      },
      headers: {
        'User-Agent': 'SwiftRideBackend/1.0 (omar.elhelaly520@gmail.com)',
        'Accept-Language': 'en',
      },
    });

    if (!response.data || response.data.length === 0) {
      throw new BadRequestException('Address not found');
    }

    const location = response.data[0];

    return {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
      displayName: location.display_name,
    };
  }
}
