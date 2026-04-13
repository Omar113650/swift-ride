import { StandardPricing } from './standard-pricing';
import { PremiumPricing } from './premium-pricing';
import { EconomyPricing } from './economy-pricing';

export class PricingFactory {
  static create(type: string) {
    switch (type) {
      case 'standard':
        return new StandardPricing();

      case 'premium':
        return new PremiumPricing();

      case 'economy':
        return new EconomyPricing();

      default:
        return new StandardPricing();
    }
  }
}