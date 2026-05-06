import { PricingStrategy } from './base-pricing';
export declare class EconomyPricing implements PricingStrategy {
    calculate(distance: number, time: number): number;
}
