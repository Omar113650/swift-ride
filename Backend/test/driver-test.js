// const { io } = require("socket.io-client");

// const socket = io("http://localhost:3000");

// socket.on("connect", () => {
//   console.log("Driver connected:", socket.id);
// });

// setInterval(() => {
//   const data = {
//     driverId: "driver1",
//     rideId: "ride123",
//     lat: 31.04 + Math.random() * 0.01,
//     lng: 31.38 + Math.random() * 0.01,
//   };

//   console.log(" Sending location:", data);

//   socket.emit("driver-location", data);
// }, 2000);