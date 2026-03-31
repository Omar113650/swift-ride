// 1️⃣ وظائف الـ Driver الأساسية (Driver Actions)

// في المشروع بتاعك، السائق (Driver) عنده شوية أدوار أساسية:

// 🔹 1. إدارة الحساب الشخصي
// تسجيل بياناته (licenseNumber, nationalId) عند الإنشاء.
// تحديث بياناته (مثلاً لو غير السيارة أو الرقم القومي).
// تحديث الحالة (status):
// ONLINE → جاهز لاستقبال الرحلات.
// OFFLINE → غير متاح.
// ON_RIDE → في رحلة شغّالة.
// متابعة تقييمه (rating) وتحديثه تلقائياً بعد كل رحلة.
// معرفة الـ currentRideId لو عنده رحلة شغّالة.
// 🔹 2. إدارة العروض على الرحلات (Ride Bids)
// إنشاء عرض (Bid) على رحلة متاحة (BIDDING) → يرسل السعر ووقت الوصول المتوقع.
// تعديل العرض قبل ما يختاره الراكب.
// حذف العرض قبل ما يختاره الراكب.
// معرفة حالة العروض (isSelected, status) بعد اختيار الراكب.
// استقبال إشعارات real-time لما يختار الراكب عرض من العروض (bid_selected).
// 🔹 3. إدارة الموقع (Driver Location)
// تحديث الموقع الحالي (lat, lng) بشكل دوري.
// إرسال الموقع للراكب أو النظام لتتبع الرحلة.
// معلومات إضافية (اختيارية):
// accuracy → دقة GPS
// speed → السرعة الحالية
// heading → اتجاه الحركة
// 🔹 4. إدارة المحفظة (Driver Wallet)
// معرفة الرصيد (balance).
// إضافة أو خصم قيمة بعد الرحلة.
// متابعة آخر عملية (lastTransactionAt).
// 🔹 5. إدارة الرحلات (Rides)
// معرفة كل الرحلات اللي اختاروه فيها كـ Driver.
// تحديث حالة الرحلة عند البدء (STARTED) أو الوصول (DRIVER_ARRIVING) أو الانتهاء (COMPLETED).
// 🔹 6. التقييمات (Ratings)
// معرفة التقييمات اللي استلمها من الركاب.
// الاستفادة من التقييم لتحسين الخدمة أو التحقق من الموثوقية.
// 🔹 7. الإشعارات (Notifications)
// استلام إشعارات مثل:
// رحلة جديدة (RIDE_REQUEST)
// عرض جديد (NEW_BID)
// اختيار عرضه (DRIVER_SELECTED)
// الرحلة بدأت أو انتهت (RIDE_STARTED, RIDE_COMPLETED)

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateDriverLocationDto } from './dto/create-driver.dto';
import { DriverStatus } from '@prisma/client';

@Injectable()
export class DriverService {
  constructor(
    private prisma: PrismaService,
    // private socketService: SocketService, // for real-time notifications
  ) {}

  // ================================
  // 1️⃣ إنشاء حساب سائق
  // ================================
  async createDriver(userId: string, dto: CreateDriverDto) {
    const existingDriver = await this.prisma.driver.findUnique({
      where: { userId },
    });
    if (existingDriver) throw new BadRequestException('Driver already exists');

    return this.prisma.driver.create({
      data: {
        userId,
        licenseNumber: dto.licenseNumber,
        nationalId: dto.nationalId,
        status: dto.status || DriverStatus.OFFLINE,
      },
    });
  }

async getDrivers() {
  const drivers = await this.prisma.driver.findMany();

  if (!drivers.length) {
    throw new NotFoundException('No drivers found');
  }

  return {
    data: drivers,
  };
}

  // ================================
  // 2️⃣ تحديث بيانات السائق
  // ================================
  async updateDriver(driverId: string, dto: UpdateDriverDto) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });
    if (!driver) throw new NotFoundException('Driver not found');

    return this.prisma.driver.update({
      where: { id: driverId },
      data: dto,
    });
  }

  // ================================
  // 3️⃣ تحديث حالة السائق
  // ================================
  async updateStatus(driverId: string, status: DriverStatus) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });
    if (!driver) throw new NotFoundException('Driver not found');

    return this.prisma.driver.update({
      where: { id: driverId },
      data: { status },
    });
  }

  // ================================
  // 4️⃣ تحديث موقع السائق
  // ================================
  async updateLocation(driverId: string, dto: UpdateDriverLocationDto) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });
    if (!driver) throw new NotFoundException('Driver not found');

    // return this.prisma.driverLocation.upsert({
    //   where: { driverId },
    //   update: {
    //     lat: dto.lat,
    //     lng: dto.lng,
    //     accuracy: dto.accuracy,
    //     speed: dto.speed,
    //     heading: dto.heading,
    //   },
    //   create: {
    //     driverId,
    //     lat: dto.lat,
    //     lng: dto.lng,
    //     accuracy: dto.accuracy,
    //     speed: dto.speed,
    //     heading: dto.heading,
    //   },
    // }
    // );
  }

  // ================================
  // 5️⃣ الحصول على الرحلات الخاصة بالسائق
  // ================================
  async getDriverRides(driverId: string) {
    return this.prisma.ride.findMany({
      where: { driverId },
      include: { rideBids: true, rider: true },
    });
  }

  // ================================
  // 6️⃣ معرفة تقييمات السائق
  // ================================
  async getRatings(driverId: string) {
    return this.prisma.rating.findMany({ where: { driverId } });
  }

  // ================================
  // 7️⃣ إدارة محفظة السائق
  // ================================
  async getWallet(driverId: string) {
    const wallet = await this.prisma.driverWallet.findUnique({
      where: { driverId },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async updateWalletBalance(driverId: string, amount: number) {
    const wallet = await this.prisma.driverWallet.update({
      where: { driverId },
      data: { balance: { increment: amount } },
    });
    return wallet;
  }

  // ================================
  // 8️⃣ إرسال إشعارات للسائق
  // ================================
  async notifyDriver(driverId: string, type: string, data: any) {
    // this.socketService.emitToUser(driverId, type, data);
  }
}

// بقت الدات بيز

// تمام يا عمر، الموديلات اللي انت كتبتها دلوقتي هي مكملة لموديلات السائق والرحلات وهتستخدمها كده:

// 1️⃣ DriverLocation

// الغرض: تتبع موقع السائق الحالي بشكل لحظي.

// هتستخدمه في:

// تحديث الموقع: كل مرة السائق يحرك العربية، التطبيق يرسل الموقع الجديد → Service هتعمل upsert في DriverLocation.
// تتبع الرحلات: الركاب أو النظام ممكن يشوفوا موقع السائق في الوقت الحقيقي.
// تطبيقات real-time: ممكن تبعت البيانات دي عبر WebSocket أو Socket.IO.

// مثال عملي:

// async updateLocation(driverId: string, lat: number, lng: number) {
//   return this.prisma.driverLocation.upsert({
//     where: { driverId },
//     update: { lat, lng, updatedAt: new Date() },
//     create: { driverId, lat, lng }
//   });
// }
// 2️⃣ DriverWallet

// الغرض: إدارة رصيد السائق، إضافة/خصم الأموال بعد الرحلات.

// هتستخدمه في:

// عرض الرصيد للسائق: Service هترجع balance وlastTransactionAt.
// تحديث الرصيد بعد الرحلة: Service تستخدم increment أو decrement على balance.
// عمليات الدفع: لو ركاب دفعوا بالكارت أو المحفظة، أو السائق استلم فلوس نقدي، يتم تحديث الرصيد.

// مثال عملي:

// async updateWalletBalance(driverId: string, amount: number) {
//   return this.prisma.driverWallet.update({
//     where: { driverId },
//     data: { balance: { increment: amount }, updatedAt: new Date() }
//   });
// }
// 3️⃣ RideRoute

// الغرض: تسجيل خط سير الرحلة (GPS coordinates) لكل رحلة.

// هتستخدمه في:

// تتبع الرحلة للراكب: عرض المسار على الخريطة بشكل حي.
// تحليل الرحلات: معرفة طول الرحلة أو وقت الرحلة، حفظ بيانات لكل رحلة.
// أرشفة الرحلات: يمكن استخدامها لحل نزاعات أو تحسين الخوارزميات.

// مثال عملي:

// async addRideRoute(rideId: string, lat: number, lng: number) {
//   return this.prisma.rideRoute.create({
//     data: { rideId, lat, lng, timestamp: new Date() }
//   });
// }
// 4️⃣ Rating

// الغرض: تقييم السائق أو الركاب بعد الرحلة.

// هتستخدمه في:

// إضافة تقييم: بعد انتهاء الرحلة، الراكب يقيم السائق → Service تعمل create في Rating.
// جلب تقييمات السائق: Service تعرض متوسط التقييم أو كل التعليقات → يمكن استخدامها في لوحة تحكم السائق.
// تحسين الخدمة: تقييمات منخفضة يمكن تنبيه الإدارة أو تعطيل السائق مؤقتًا.

// مثال عملي:

// async addRating(driverId: string, raterId: string, score: number, comment?: string) {
//   return this.prisma.rating.create({
//     data: { driverId, raterId, score, comment }
//   });
// }

// async getDriverRatings(driverId: string) {
//   return this.prisma.rating.findMany({ where: { driverId } });
// }

// // 💡 الخلاصة:

// // DriverLocation → تتبع الموقع
// // DriverWallet → إدارة الرصيد
// // RideRoute → حفظ مسار الرحلة
// // Rating → تقييمات السائق والراكب
