import { PricingStrategy } from './base-pricing';
export declare class StandardPricing implements PricingStrategy {
    calculate(distance: number, time: number): number;
}
