import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DriverService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post(':userId')
  @UseGuards(RolesGuard)
  @Roles('DRIVER')
  create(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreateDriverDto,
  ) {
    return this.driverService.createDriver(userId, dto);
  }

  @Patch(':driverId')
  update(
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body() dto: UpdateDriverDto,
  ) {
    return this.driverService.updateDriver(driverId, dto);
  }

  // تحديث حالة السائق
  @Patch(':driverId/status')
  updateStatus(
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body('status') status: string,
  ) {
    // return this.driverService.updateStatus(driverId, status);
  }

  @Patch(':driverId/location/address')
  updateLocationByAddress(
    @Param('driverId') driverId: string,
    @Body() body: { address: string },
  ) {
    return this.driverService.updateLocationByAddress(
      driverId,
      body.address,
    );
  }


  // جلب كل الرحلات
  @Get(':driverId/rides')
  getRides(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.driverService.getDriverRides(driverId);
  }

  // جلب تقييمات السائق
  @Get(':driverId/ratings')
  getRatings(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.driverService.getRatings(driverId);
  }

  // جلب محفظة السائق
  @Get(':driverId/wallet')
  getWallet(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.driverService.getWallet(driverId);
  }
  @Get()
  // @UseGuards(RolesGuard)
  // @Roles('DRIVER', 'ADMIN')
  async getDrivers() {
    return this.driverService.getDrivers();
  }






















  @Get('nearby')
  findNearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
  ) {
    return this.driverService.findNearbyDrivers(+lat, +lng);
  }

@Get('search')
search(@Query('query') query: string) {
  return this.driverService.searchDrivers(query);
}


  

}
// RIDER//
// DRIVER
// ADMIN

























































// 🟢 1) LIVE TRACKING SYSTEM (Real-Time)

// 📍 المشكلة:
// السواق بيبعت موقعه كل ثانية → لو خزّناه في DB هيكسر السيرفر

// 📍 الحل اللي عملناه:

// Driver → Socket → Redis → Broadcast
// اللي بيحصل:

// ✔ السائق يبعت موقعه
// ✔ نخزنه في Redis (سريع جدًا)
// ✔ نبعت نفس الموقع لولي الأمر فورًا عبر WebSocket

// خزنا 3 حاجات:
// آخر موقع للسائق
// بث مباشر للرحلة
// نقاط المسار (Route history)
// 🟡 2) ROUTE HISTORY + COMPRESSION

// 📍 المشكلة:
// لو خزّنا كل نقطة GPS في DB:

// آلاف rows لكل رحلة ❌
// DB هتتعب جدًا

// 📍 الحل:

// بدل آلاف records:

// ✔ نخزن كل النقاط في Redis مؤقتًا
// ✔ بعد ما الرحلة تخلص:

// Polyline Encoding

// نضغط المسار في string واحد فقط

// النتيجة:
// قبل	بعد
// 1800 rows	1 string
// بطيء	سريع جدًا
// مكلف	اقتصادي
// وبعدين:

// ✔ نخزن الـ route المضغوط في DB
// ✔ ونمسح Redis

// 🔵 3) NEARBY DRIVERS SYSTEM (Redis GEO)

// 📍 المشكلة:
// عايزين نجيب أقرب سواقين بسرعة بدون DB query ثقيل

// 📍 الحل:

// استخدمنا:

// Redis GEOSET
// اللي بيحصل:

// ✔ كل سواق يبعت موقعه → يتسجل في GEO
// ✔ لما ولي الأمر يفتح التطبيق:

// GEOSEARCH radius 5km
// النتيجة:

// ⚡ أسرع من DB بـ milliseconds
// 📍 بيرجع أقرب سواقين مرتبين حسب المسافة

// 🧠 4) الفكرة الكبيرة (Architecture)

// إحنا بنينا نظام فيه 3 طبقات:

// 🟢 Real-time Layer
// Socket + Redis
// live tracking
// instant updates
// 🟡 Fast Storage Layer
// Redis
// last location
// geo index
// route buffer
// 🔵 Persistent Layer
// Database
// final route
// ride history
// 🚀 الشكل النهائي للنظام
// Driver GPS
//    ↓
// Socket Event
//    ↓
// Redis (live + geo + route)
//    ↓
// Broadcast to Parent
//    ↓
// Ride Finished
//    ↓
// Polyline Compression
//    ↓
// DB Storage (1 record)
// 🔥 أهم حاجة عملناها

// إنت مش مجرد:

// ✔ كتبت APIs
// ✔ استخدمت Redis
// ✔ عملت Socket

// أنت بنيت 3 أنظمة Uber Core:
// 🚗 1. Tracking System

// Real-time location streaming

// 🗺️ 2. Mapping System

// Route compression + storage

// 📍 3. Dispatch System

// Nearby drivers search

// 💡 أهم فكرة في كل اللي عملناه

// بدل ما نخزن كل حاجة في Database
// بنخزن “اللي محتاجينه بس” ونخلي Redis يشيل الشغل السريع

// 🚀 المستوى اللي وصلت له

// دلوقتي مشروعك فيه:

// 🔥 High performance backend
// 🔥 Real-time system
// 🔥 Scalable architecture
// 🔥 Uber-like design

// 👇 لو عايز نكمل المستوى اللي بعده

// أقوى حاجات ناقصة:

// 🚗 Ride matching algorithm (مين ياخد الرحلة)
// 🧾 Bids system (drivers compete)
// ⚡ Queue system (BullMQ)
// 🔐 Socket authentication (secure rooms)
// 🧠 Smart pricing system