
# Swite-Ride 🚖

**A Modern Real-Time Ride-Hailing Platform with Dynamic Bidding System**

Swite-Ride هو نظام توصيل ركاب ذكي يعمل في الوقت الفعلي، يعتمد على آلية مزايدة (Bidding) بين السائقين، ومبني بطريقة احترافية لمحاكاة التحديات الحقيقية في الأنظمة الإنتاجية.

---

## نظرة عامة على المشروع

بدلاً من النموذج التقليدي "طلب ← قبول"، صممت Swite-Ride بنموذج أكثر ذكاءً ومرونة:

### تدفق العمل الرئيسي
1. الراكب ينشئ طلب رحلة جديد
2. النظام يبث الطلب للسائقين المتاحين في المنطقة
3. السائقون يرسلون عروض مزايدة في الوقت الفعلي (السعر + الوقت المتوقع للوصول)
4. الراكب يختار أفضل عرض
5. تبدأ الرحلة مع تتبع GPS مباشر وتحديثات فورية

---

## المميزات الرئيسية

- نظام مزايدة في الوقت الفعلي (Real-time Bidding)
- تتبع الموقع المباشر (Live GPS Tracking)
- إدارة حالات الرحلة المتقدمة (Ride State Machine)
- التعامل مع التزامن العالي (High Concurrency)
- نظام صلاحيات وأدوار (RBAC - Rider & Driver)
- مصادقة آمنة باستخدام JWT
- ضمان اتساق البيانات باستخدام Transactions
- معمارية قابلة للتوسع

---

##  Tech Stack

| الطبقة              | التقنية                          |
|---------------------|----------------------------------|
| Backend             | NestJS + TypeScript             |
| Database            | PostgreSQL                      |
| ORM                 | Prisma                          |
| Real-time           | Socket.IO                       |
| Authentication      | JWT + RBAC                      |
| Caching & Performance | Redis                         |
| Language            | TypeScript                      |

---

## 🗄️ لماذا PostgreSQL وليس MongoDB؟

النظام قائم بشكل أساسي على العلاقات المعقدة. رحلة واحدة مرتبطة بـ:
- الراكب والسائق
- عروض المزايدة (Bids)
- المدفوعات
- سجلات التتبع
- الإشعارات والتقييمات

PostgreSQL يوفر:
- Referential Integrity قوية
- ACID Transactions
- Foreign Key Constraints
- أداء ممتاز في الـ Joins والاستعلامات المعقدة

---

## الهيكل المعماري

- **نهج ERD First**: تم تصميم مخطط قاعدة البيانات بشكل كامل قبل كتابة أي كود
- **Clean Architecture** باستخدام NestJS
- **Event-Driven Design** للتواصل في الوقت الفعلي
- **State Machine** لإدارة دورة حياة الرحلة

### الكيانات الرئيسية
- Users (Riders & Drivers)
- Vehicles
- Ride Requests
- Bids
- Active Rides
- Payments
- Tracking Logs
- Reviews & Ratings

---
## طريقة التشغيل

### المتطلبات
- Node.js (v18 أو أحدث)
- PostgreSQL
- Redis
- Yarn أو npm

### Installation

```bash
# استنساخ المشروع
git clone https://github.com/yourusername/swite-ride.git
cd swite-ride

# تثبيت ال dependencies
yarn install

# إعداد ملف البيئة
cp .env.example .env

# تشغيل الـ Migrations
yarn prisma migrate dev

# تشغيل المشروع
yarn start:dev
- Yarn أو npm



