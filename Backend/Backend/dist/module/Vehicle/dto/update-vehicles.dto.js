"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVehicleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_vehicles_dto_1 = require("./create-vehicles.dto");
class UpdateVehicleDto extends (0, mapped_types_1.PartialType)(create_vehicles_dto_1.CreateVehicleDto) {
}
exports.UpdateVehicleDto = UpdateVehicleDto;
//# sourceMappingURL=update-vehicles.dto.js.map