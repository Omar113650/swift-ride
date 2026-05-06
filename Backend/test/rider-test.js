const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log(' Rider connected:', socket.id);

  socket.emit('join-ride', { rideId: 'ride123' });
});

socket.on('driver-location', (data) => {
  console.log(' LIVE LOCATION:', data);
});

//   (Driver):
// node driver-test.js
//  (Rider):
// node rider-test.js

//النتجيه
// / LIVE LOCATION: { driverId: 'driver1', lat: ..., lng: ... }
// كل شويه يبعتلي النتجيه
