import { Injectable } from '@nestjs/common';

@Injectable()
export class MapsService {
  /**
   * Calculate distance + ETA without any external APIs
   */

  async getRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) {
    // 1️⃣ Distance in KM
    const distanceKm = this.getDistance(
      origin.lat,
      origin.lng,
      destination.lat,
      destination.lng,
    );

    // 2️⃣ Duration in minutes
    const durationMinutes = this.estimateDuration(distanceKm);

    return {
      polyline: null, // free version (no Google Maps polyline)
      distance: Math.round(distanceKm * 1000), // meters
      duration: Math.round(durationMinutes * 60), // seconds
    };
  }

  /**
   * 📏 Haversine Formula
   */
  private getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // KM

    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * ⏱️ Estimate duration
   */
  private estimateDuration(distanceKm: number): number {
    const avgSpeed = 40; // km/h
    return (distanceKm / avgSpeed) * 60;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }
}