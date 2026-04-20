// تمام 🔥 أنت دلوقتي بتفكر زي Senior Backend / Staff Engineer — وده مستوى مهم جدًا لمشروع زي Swift Ride.

// خليني أطبق لك المفاهيم الأربعة على Schema بتاعك + Prisma + PostgreSQL بشكل عملي جدًا.




// 🚀 أولًا: Indexing (تحسين السرعة)
// 📌 عندك indexes كويسة بس ناقص أهم حاجات
// ✔ موجود عندك:
// @@index([riderId])
// @@index([driverId])
// @@index([status])
// @@index([role])
// 🔥 تحسينات مهمة لازم تضيفها
// 🚗 Ride table
// @@index([status, createdAt])
// @@index([riderId, status])
// @@index([driverId, status])
// 🚗 DriverLocation (مهم جدًا)
// @@index([status])
// @@index([lastSeen])
// 💰 Payment
// @@index([status, createdAt])
// ⭐ Rating
// @@index([driverId, score])
// 🚀 ليه ده مهم؟

// بدون index:

// SELECT * FROM rides WHERE status = 'BIDDING'
// → Full table scan ❌

// مع index:

// → B-tree lookup ⚡
// 🚀 تانيًا: Aggregation (تقارير + Analytics)
// 💡 أمثلة على مشروعك
// ⭐ متوسط تقييم driver
// await prisma.rating.aggregate({
//   where: { driverId },
//   _avg: { score: true },
// });
// 🚗 عدد الرحلات لكل حالة
// await prisma.ride.groupBy({
//   by: ['status'],
//   _count: { id: true },
// });
// 💰 أرباح driver
// await prisma.payment.aggregate({
//   where: {
//     status: 'COMPLETED',
//   },
//   _sum: {
//     amount: true,
//   },
// });
// 📊 أهم use cases عندك

// ✔ Admin dashboard
// ✔ Driver performance
// ✔ Ride analytics
// ✔ Revenue reports

// 🚀 ثالثًا: حل مشكلة N+1 (مهم جدًا في مشروعك)
// ❌ مثال مشكلة N+1
// const rides = await prisma.ride.findMany();

// for (const ride of rides) {
//   const driver = await prisma.driver.findUnique({
//     where: { id: ride.driverId },
//   });
// }

// 👉 ده بيعمل:

// 1 query + N queries ❌
// ✅ الحل الصح: include
// const rides = await prisma.ride.findMany({
//   include: {
//     driver: true,
//     rider: true,
//   },
// });
// ⚡ أو select ذكي
// select: {
//   id: true,
//   status: true,
//   driver: {
//     select: {
//       id: true,
//       userId: true,
//       rating: true,
//     },
//   },
// }
// 🚀 في مشروعك أهم N+1 locations:
// Ride → Driver
// Ride → Bids
// User → Notifications
// Driver → Vehicle
// 🚀 رابعًا: Connection Pooling (مهم جدًا جدًا)
// 💥 المشكلة

// لو الضغط زاد:

// 1000 request → 1000 DB connections ❌ → crash
// 🧠 الحل
// ✔ Prisma connection pooling

// في DATABASE_URL:

// DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=30"
// 🔥 إعدادات قوية
// connection_limit=10
// pool_timeout=30
// 🚀 أو الأفضل (Production level)

// لو على Supabase / Neon / RDS:

// 👉 استخدم PgBouncer

// 🚀 خامسًا: منع DB overload تحت الضغط
// 💡 أهم 5 حلول:
// 1️⃣ Use Queue (إنت بدأت صح 👍)
// ride processing في BullMQ
// مش DB مباشرة
// 2️⃣ Caching (Redis)
// redis.set('ride:123', data, 'EX', 60);
// 3️⃣ Rate Limiting
// @UseGuards(ThrottlerGuard)
// @Throttle(10, 60) // 10 req per minute
// 4️⃣ Debounce location updates

// بدل كل ثانية:

// update DB every 1 sec ❌

// 👉 خليه:

// Redis every 200ms + DB every 10s
// 5️⃣ Avoid heavy queries

// بدل:

// SELECT * FROM driver_locations ORDER BY distance

// 👉 استخدم:

// Redis GEO or indexed query
// 🚀 Architecture النهائي بتاعك بعد التحسين
// Client
//  ↓
// API (NestJS)
//  ↓
// Queue (BullMQ)
//  ↓
// Redis (cache + geo)
//  ↓
// PostgreSQL (Prisma)
//  ↓
// PostGIS (optional analytics)
// 🔥 الخلاصة

// أنت دلوقتي عملت:

// ⚡ Performance

// ✔ Indexing
// ✔ Connection pooling
// ✔ Query optimization

// ⚡ Scalability

// ✔ Queue system
// ✔ Redis caching
// ✔ Geo optimization

// ⚡ Stability

// ✔ Prevent DB overload
// ✔ N+1 solved
// ✔ Aggregation ready

// 🚀 لو عايز المستوى الأعلى

// أقدر أزودك:

// 🔥 caching layer architecture (Redis strategy)
// 🔥 CQRS design pattern
// 🔥 event-driven system (Kafka alternative)
// 🔥 autoscaling backend design
// 🔥 load testing + bottleneck analysis

// قولّي 👍

































































  // async createRide(
  //   riderId: string,
  //   dto: CreateRideDto,
  //   calculatePrice: boolean = true,
  // ) {
  //   try {
  //     this.logger.log(`🚗 Creating ride for rider: ${riderId}`);

  //     // 🧠 0️⃣ Idempotency Check (by rideId)
  //     if (dto.rideId) {
  //       const existingRide = await this.prisma.ride.findUnique({
  //         where: {
  //           id: dto.rideId,
  //         },
  //       });

  //       if (existingRide) {
  //         this.logger.log('♻️ Ride already exists, returning existing ride');

  //         return {
  //           ride: existingRide,
  //           message: 'Ride already created (idempotent response) ♻️',
  //         };
  //       }
  //     }

      // 1️⃣ Get coordinates
  //     const pickup = await this.geo.getCoordinates(dto.pickupAddress);
  //     const destination = await this.geo.getCoordinates(dto.destinationAddress);

      // 2️⃣ Distance calculation
  //     const distance = this.calculateDistance(
  //       pickup.lat,
  //       pickup.lng,
  //       destination.lat,
  //       destination.lng,
  //     );

  //     // 3️⃣ ETA
  //     const avgSpeed = 40;
  //     const estimatedTimeMinutes = Math.ceil((distance / avgSpeed) * 60);






      //         const estimatedTimeMinutes = Math.ceil((distance / avgSpeed) * 60);

        // let estimatedPrice: number | null = null;

        // if (calculatePrice) {
        //   estimatedPrice = distance * 0.5 + estimatedTimeMinutes * 0.2;
        // }




  //     // apply  factory design pattern
  //     // 4️⃣ Pricing
  //     let estimatedPrice: number | null = null;

  //     if (calculatePrice) {
  //       const pricingStrategy = PricingFactory.create('standard');

  //       estimatedPrice = pricingStrategy.calculate(
  //         distance,
  //         estimatedTimeMinutes,
  //       );
  //     }

  //     // 5️⃣ Save ride in DB
  //     const ride = await this.prisma.ride.create({
  //       data: {
  //         id: dto.rideId, // 👈 important for idempotency

  //         pickupLat: pickup.lat,
  //         pickupLng: pickup.lng,
  //         destinationLat: destination.lat,
  //         destinationLng: destination.lng,

  //         pickupAddress: dto.pickupAddress,
  //         destinationAddress: dto.destinationAddress,

  //         distance,
  //         selectedPrice: estimatedPrice,
  //         status: 'BIDDING',

  //         rider: {
  //           connect: { id: riderId },
  //         },
  //       },
  //     });

  //     this.logger.log(`✅ Ride created with ID: ${ride.id}`);



  //     // ✔ Retry mechanism
  //     // ✔ Dead Letter Queue (failed handling)
  //     // ✔ Proper BullMQ config
  //     // ✔ Worker safe error handling
  //     // ✔ Queue add options

  //     await this.rideQueue.add(
  //       'ride-created',
  //       {
  //         rideId: ride.id,
  //         riderId,

  //         pickup: {
  //           lat: pickup.lat,
  //           lng: pickup.lng,
  //           address: dto.pickupAddress,
  //         },

  //         destination: {
  //           lat: destination.lat,
  //           lng: destination.lng,
  //           address: dto.destinationAddress,
  //         },

  //         distance,
  //         estimatedTimeMinutes,
  //         estimatedPrice,
  //       },
  //       {
  //         attempts: 5,
  //         backoff: {
  //           type: 'exponential',
  //           delay: 2000,
  //         },
  //         removeOnComplete: true,
  //         removeOnFail: false,
  //       },
  //     );

  //     this.logger.log(`📦 Ride queued for processing: ${ride.id}`);

  //     // 7️⃣ Return response immediately
  //     return {
  //       ride,
  //       estimatedTimeMinutes,
  //       estimatedPrice,
  //       message: 'Ride created successfully and queued 🚀',
  //     };
  //   } catch (error) {
  //     this.logger.error(
  //       '❌ Error creating ride',
  //       error instanceof Error ? error.stack : String(error),
  //     );
  //     throw error;
  //   }
  // }

  // // 📏 Distance formula (Haversine)
  // private calculateDistance(
  //   lat1: number,
  //   lng1: number,
  //   lat2: number,
  //   lng2: number,
  // ) {
  //   const R = 6371; // Earth radius in km

  //   const dLat = this.toRad(lat2 - lat1);
  //   const dLng = this.toRad(lng2 - lng1);

  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(this.toRad(lat1)) *
  //       Math.cos(this.toRad(lat2)) *
  //       Math.sin(dLng / 2) *
  //       Math.sin(dLng / 2);

  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //   return R * c;
  // }

  // private toRad(value: number) {
  //   return (value * Math.PI) / 180;
  // }














