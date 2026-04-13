import { PricingStrategy } from './base-pricing';

export class StandardPricing implements PricingStrategy {
  calculate(distance: number, time: number): number {
    return distance * 0.5 + time * 0.2;
  }
}