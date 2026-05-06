import { PricingStrategy } from './base-pricing';

export class EconomyPricing implements PricingStrategy {
  calculate(distance: number, time: number): number {
    return distance * 0.3 + time * 0.1;
  }
}