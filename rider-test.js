const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("👤 Rider connected:", socket.id);

  socket.emit("join-ride", { rideId: "ride123" });
});

socket.on("driver-location", (data) => {
  console.log("📍 LIVE LOCATION:", data);
});















// 🟣 الأول (Driver):
// node driver-test.js
// 🔵 التاني (Rider):
// node rider-test.js
// 💥 النتيجة

// في Terminal بتاع Rider هتشوف:

// 📍 LIVE LOCATION: { driverId: 'driver1', lat: ..., lng: ... }

// 🔥 كل شوية
// 🔥 realtime
// 🔥 زي التطبيق الحقيقي




// 💀 الطريقة الأفضل بعد الـ browser
// 👉 باستخدام Node.js Script (Test Client)

// يعني هتشغل driver و rider كأنهم apps حقيقيين 🔥

// 🟢 1. نثبت socket.io-client

// في مشروعك:

// npm install socket.io-client