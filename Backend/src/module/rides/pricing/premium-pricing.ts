import { PricingStrategy } from './base-pricing';

export class PremiumPricing implements PricingStrategy {
  calculate(distance: number, time: number): number {
    return distance * 1.2 + time * 0.5;
  }
}