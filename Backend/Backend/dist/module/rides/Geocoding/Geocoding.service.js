"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeocodingService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let GeocodingService = class GeocodingService {
    async getCoordinates(address) {
        const url = 'https://nominatim.openstreetmap.org/search';
        const response = await axios_1.default.get(url, {
            params: {
                format: 'json',
                q: address,
                limit: 1,
            },
            headers: {
                'User-Agent': 'SwiftRideBackend/1.0 (omar.elhelaly520@gmail.com)',
                'Accept-Language': 'en',
            },
        });
        if (!response.data || response.data.length === 0) {
            throw new common_1.BadRequestException('Address not found');
        }
        const location = response.data[0];
        return {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lon),
            displayName: location.display_name,
        };
    }
};
exports.GeocodingService = GeocodingService;
exports.GeocodingService = GeocodingService = __decorate([
    (0, common_1.Injectable)()
], GeocodingService);
//# sourceMappingURL=Geocoding.service.js.map