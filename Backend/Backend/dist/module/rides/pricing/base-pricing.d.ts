export interface PricingStrategy {
    calculate(distance: number, time: number): number;
}
