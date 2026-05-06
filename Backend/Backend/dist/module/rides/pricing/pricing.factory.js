"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingFactory = void 0;
const standard_pricing_1 = require("./standard-pricing");
const premium_pricing_1 = require("./premium-pricing");
const economy_pricing_1 = require("./economy-pricing");
class PricingFactory {
    static create(type) {
        switch (type) {
            case 'standard':
                return new standard_pricing_1.StandardPricing();
            case 'premium':
                return new premium_pricing_1.PremiumPricing();
            case 'economy':
                return new economy_pricing_1.EconomyPricing();
            default:
                return new standard_pricing_1.StandardPricing();
        }
    }
}
exports.PricingFactory = PricingFactory;
//# sourceMappingURL=pricing.factory.js.map