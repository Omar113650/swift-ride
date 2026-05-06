import { StandardPricing } from './standard-pricing';
import { PremiumPricing } from './premium-pricing';
import { EconomyPricing } from './economy-pricing';
export declare class PricingFactory {
    static create(type: string): StandardPricing | PremiumPricing | EconomyPricing;
}
