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
exports.CreateDriverDto = exports.DriverStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var DriverStatus;
(function (DriverStatus) {
    DriverStatus["ONLINE"] = "ONLINE";
    DriverStatus["OFFLINE"] = "OFFLINE";
    DriverStatus["ON_RIDE"] = "ON_RIDE";
})(DriverStatus || (exports.DriverStatus = DriverStatus = {}));
class CreateDriverDto {
    licenseNumber;
    nationalId;
    status = DriverStatus.OFFLINE;
}
exports.CreateDriverDto = CreateDriverDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'license-123456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDriverDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345678901234' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDriverDto.prototype, "nationalId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: DriverStatus, default: DriverStatus.OFFLINE }),
    (0, class_validator_1.IsEnum)(DriverStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDriverDto.prototype, "status", void 0);
//# sourceMappingURL=create-driver.dto.js.map