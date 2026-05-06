"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRideDto = exports.RideStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var RideStatus;
(function (RideStatus) {
    RideStatus["PENDING"] = "PENDING";
    RideStatus["BIDDING"] = "BIDDING";
    RideStatus["DRIVER_SELECTED"] = "DRIVER_SELECTED";
    RideStatus["DRIVER_ARRIVING"] = "DRIVER_ARRIVING";
    RideStatus["STARTED"] = "STARTED";
    RideStatus["COMPLETED"] = "COMPLETED";
    RideStatus["CANCELLED"] = "CANCELLED";
})(RideStatus || (exports.RideStatus = RideStatus = {}));
class CreateRideDto {
    rideId;
    pickupAddress;
    destinationAddress;
    note;
    status;
}
exports.CreateRideDto = CreateRideDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRideDto.prototype, "rideId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mansoura, Egypt' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRideDto.prototype, "pickupAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cairo, Egypt' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRideDto.prototype, "destinationAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'منطقة مزدحمة بالمرور', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRideDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ride Is COMPLETED ' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRideDto.prototype, "status", void 0);
//# sourceMappingURL=create-ride.dto.js.map