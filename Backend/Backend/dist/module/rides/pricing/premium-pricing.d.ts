import { PricingStrategy } from './base-pricing';
export declare class PremiumPricing implements PricingStrategy {
    calculate(distance: number, time: number): number;
}
