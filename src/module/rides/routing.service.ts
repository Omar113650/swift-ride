//  اجيب الروت علي الخريطه
// استخدمت موقع osrm
// use :: https://map.project-osrm.org/

import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RoutingService {
  private readonly baseUrl = 'http://router.project-osrm.org/route/v1/driving';

  async getRoute(
    pickup: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) {
    try {
      const url = `${this.baseUrl}/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=full&geometries=polyline`;

      const response = await axios.get(url);
      const route = response.data.routes[0];

      return {
        distance: route.distance / 1000,
        duration: route.duration / 60,
        polyline: route.geometry,
      };
    } catch (error) {
      throw new HttpException('Routing service failed ', 500);
    }
  }
}
