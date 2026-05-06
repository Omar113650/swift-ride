"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["RIDE_REQUEST"] = "RIDE_REQUEST";
    NotificationType["NEW_BID"] = "NEW_BID";
    NotificationType["DRIVER_SELECTED"] = "DRIVER_SELECTED";
    NotificationType["DRIVER_ARRIVING"] = "DRIVER_ARRIVING";
    NotificationType["RIDE_STARTED"] = "RIDE_STARTED";
    NotificationType["RIDE_COMPLETED"] = "RIDE_COMPLETED";
    NotificationType["PAYMENT_SUCCESS"] = "PAYMENT_SUCCESS";
    NotificationType["PAYMENT_FAILED"] = "PAYMENT_FAILED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
class Notification {
    id;
    userId;
    title;
    message;
    type;
    isRead;
    data;
    createdAt;
}
exports.Notification = Notification;
//# sourceMappingURL=notification.entity.js.map