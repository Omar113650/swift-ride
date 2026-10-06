# Swite-Ride

**Modern Real-Time Ride-Hailing Platform with a Dynamic Bidding System**

Swite-Ride is a real-time ride-hailing backend platform built with NestJS, TypeScript, PostgreSQL, Prisma, Redis, and Socket.IO.

Unlike traditional ride-hailing systems that follow a simple request-and-accept model, Swite-Ride introduces a dynamic bidding mechanism where nearby drivers can submit offers containing their proposed price and estimated arrival time.

The rider receives these offers in real time and selects the most suitable driver.

The project focuses on real-world backend engineering challenges including real-time communication, geospatial driver discovery, high concurrency, race conditions, transactional consistency, ride state management, caching, and scalable system architecture.

---

## Table of Contents

1. Project Overview
2. Problem Statement
3. Solution Overview
4. User Roles
5. Core Features
6. Tech Stack
7. System Architecture
8. Ride Workflow
9. Dynamic Bidding System
10. Real-Time Communication
11. Driver Discovery
12. Live GPS Tracking
13. Ride State Machine
14. Concurrency Management
15. Database Transactions
16. Authentication and Authorization
17. Redis
18. Database Design
19. Why PostgreSQL
20. Engineering Challenges
21. Project Structure
22. Environment Configuration
23. Installation and Setup
24. Scalability
25. Future Enhancements
26. Use Cases
27. Author

---

# Project Overview

Swite-Ride is a real-time ride-hailing platform that connects riders with nearby drivers using a dynamic bidding system.

Instead of automatically assigning a driver or allowing the first available driver to accept the request, the platform allows multiple nearby drivers to compete for a ride by submitting offers.

Each bid may contain:

- Proposed ride price
- Estimated arrival time
- Driver information
- Vehicle information

The rider receives the bids in real time and chooses the most suitable offer.

The complete ride lifecycle is managed by the backend.

---

# Problem Statement

Ride-hailing platforms involve several complex backend engineering challenges.

The system must handle:

- Real-time ride requests
- Nearby driver discovery
- Driver location updates
- Multiple drivers bidding simultaneously
- Concurrent ride acceptance
- Ride lifecycle management
- GPS tracking
- Data consistency
- Authentication and authorization
- High-frequency location updates
- Real-time notifications
- Race conditions
- Database transactions
- Scalable communication

A simple CRUD-based architecture is not enough for this type of application.

Swite-Ride is designed around these real-time and concurrency requirements.

---

# Solution Overview

Swite-Ride provides a backend architecture that combines:

- NestJS REST APIs
- Socket.IO real-time communication
- PostgreSQL relational storage
- Prisma ORM
- Redis caching and fast-access data
- JWT authentication
- Role-Based Access Control
- Transactional operations
- Ride State Machine
- Dynamic Driver Bidding
- Live GPS Tracking

The architecture separates persistent business data from temporary real-time data to improve performance and scalability.

---

# User Roles

The platform primarily supports two user roles.

## Rider

A rider can:

- Create a ride request
- Specify pickup location
- Specify destination
- Receive driver bids
- Compare available offers
- Select a driver
- Track the driver
- Track the active ride
- Complete the ride
- Review the driver

---

## Driver

A driver can:

- Update availability
- Update current location
- Receive nearby ride requests
- Submit ride bids
- Track bid status
- Start accepted rides
- Update ride status
- Complete rides
- Receive ratings

---

# Core Features

The platform includes:

- Dynamic ride bidding
- Real-time ride requests
- Nearby driver discovery
- Live GPS tracking
- Ride lifecycle management
- Role-Based Access Control
- JWT authentication
- Redis caching
- Transactional ride operations
- Concurrent bid processing
- Driver availability management
- Real-time notifications
- Ratings and reviews

---

# Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Backend Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Real-Time Communication | Socket.IO |
| Authentication | JWT |
| Authorization | RBAC |
| Caching | Redis |
| Architecture | Modular / Clean Architecture |
| Communication Style | REST + Event-Driven |

---

# System Architecture

The high-level architecture follows:

```text id="2s7psn"
                         Client Applications
                                |
                    -------------------------
                    |                       |
                    v                       v
                 REST API               WebSocket
                    |                       |
                    -----------+-------------
                               |
                               v
                           NestJS API
                               |
             -----------------------------------------
             |                    |                  |
             v                    v                  v
        Ride Service         Bid Service       Tracking Service
             |                    |                  |
             ----------------+-----------------------
                              |
                    ---------------------
                    |                   |
                    v                   v
                PostgreSQL            Redis
                    |
                    v
                  Prisma
```

REST APIs handle standard application operations while WebSocket connections handle real-time events.

---

# Ride Workflow

The primary ride flow follows:

```text id="k9h0wb"
Rider
  |
  v
Create Ride Request
  |
  v
Validate Request
  |
  v
Find Nearby Drivers
  |
  v
Broadcast Ride Request
  |
  v
Drivers Receive Request
  |
  v
Drivers Submit Bids
  |
  v
Rider Receives Bids
  |
  v
Rider Selects Bid
  |
  v
Assign Driver
  |
  v
Start Ride
  |
  v
Live GPS Tracking
  |
  v
Complete Ride
  |
  v
Payment / Rating
```

This differs from traditional systems because the rider participates directly in driver selection.

---

# Dynamic Bidding System

The bidding system is one of the core features of Swite-Ride.

After a ride request is created, nearby drivers can submit offers.

A bid may contain:

```text id="4wtkt6"
Bid
 |
 +---- Driver
 |
 +---- Ride Request
 |
 +---- Proposed Price
 |
 +---- Estimated Arrival Time
 |
 +---- Created At
 |
 +---- Status
```

Multiple drivers may submit bids for the same ride.

Example:

```text id="nyh9cu"
Ride Request
      |
      +---- Driver A -> 120 EGP -> ETA 5 min
      |
      +---- Driver B -> 100 EGP -> ETA 8 min
      |
      +---- Driver C -> 110 EGP -> ETA 4 min
```

The rider can evaluate both price and arrival time before selecting a driver.

---

# Bidding Workflow

```text id="d4x7wc"
Ride Created
     |
     v
Nearby Drivers Discovered
     |
     v
Ride Request Broadcast
     |
     v
Driver A ----\
Driver B -----+---- Submit Bids
Driver C ----/
     |
     v
Store Bids
     |
     v
Emit Bids to Rider
     |
     v
Rider Selects Bid
     |
     v
Validate Ride State
     |
     v
Accept Winning Bid
     |
     v
Reject / Close Other Bids
     |
     v
Assign Driver
```

The backend must ensure that only one bid becomes the winning bid.

---

# Real-Time Communication

Socket.IO handles real-time communication between riders and drivers.

Possible WebSocket events include:

```text id="t13jgr"
ride:created
ride:available
bid:created
bid:received
bid:accepted
bid:rejected
ride:driver_assigned
driver:location_updated
ride:started
ride:location_updated
ride:completed
ride:cancelled
```

This allows the platform to update connected clients without continuous HTTP polling.

---

# Driver Discovery

When a rider creates a request, the backend must determine which drivers should receive it.

The basic workflow:

```text id="opgq63"
Ride Request
     |
     v
Pickup Coordinates
     |
     v
Search Nearby Drivers
     |
     v
Filter Available Drivers
     |
     v
Select Eligible Drivers
     |
     v
Broadcast Request
```

Redis can be used to store frequently changing driver location information.

This prevents the primary relational database from being overloaded with high-frequency location operations.

---

# Geospatial Driver Search

A scalable driver discovery system can use Redis GEO.

Conceptually:

```text id="8m03xr"
Driver Location Update
        |
        v
Latitude + Longitude
        |
        v
Redis GEO
        |
        v
Geospatial Index
```

When a rider requests a trip:

```text id="rt8g4p"
Pickup Location
      |
      v
Redis GEO Search
      |
      v
Drivers Within Radius
      |
      v
Filter Available Drivers
      |
      v
Broadcast Ride
```

This provides faster nearby-driver lookup than repeatedly scanning persistent database records.

---

# Live GPS Tracking

Drivers continuously send location updates during active rides.

Example:

```text id="pp6zb6"
Driver Device
     |
     v
GPS Coordinates
     |
     v
Socket.IO
     |
     v
Tracking Service
     |
     +---- Redis
     |
     +---- Rider WebSocket
```

The rider can receive updated driver coordinates in real time.

Not every GPS update necessarily needs to be permanently stored in PostgreSQL.

Temporary current-location data can be maintained in Redis while important historical tracking points can be persisted separately when required.

---

# Ride State Machine

Ride lifecycle management is implemented using explicit states.

A possible ride lifecycle:

```text id="n3lljp"
PENDING
   |
   v
BIDDING
   |
   v
DRIVER_ASSIGNED
   |
   v
DRIVER_ARRIVING
   |
   v
IN_PROGRESS
   |
   v
COMPLETED
```

Alternative transitions may include:

```text id="u7sugw"
PENDING
   |
   v
CANCELLED
```

or:

```text id="a5q9ps"
BIDDING
   |
   v
EXPIRED
```

Using explicit states prevents invalid business operations.

For example:

```text id="e25g65"
COMPLETED -> BIDDING
```

should never be allowed.

---

# State Transition Validation

Before changing a ride state, the backend validates whether the transition is allowed.

Conceptually:

```typescript id="s1dk92"
const transitions = {
  PENDING: ['BIDDING', 'CANCELLED'],
  BIDDING: ['DRIVER_ASSIGNED', 'EXPIRED', 'CANCELLED'],
  DRIVER_ASSIGNED: ['DRIVER_ARRIVING', 'CANCELLED'],
  DRIVER_ARRIVING: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};
```

This makes the ride lifecycle predictable and easier to maintain.

---

# Concurrency Management

Concurrency is one of the most important challenges in Swite-Ride.

Consider the following situation:

```text id="krq7of"
Ride has multiple bids

Rider accepts Driver A
        |
        |
        +------ Request A

At nearly the same time:

Rider / Client retries
        |
        |
        +------ Request B
```

Without concurrency protection, multiple requests could attempt to assign different drivers to the same ride.

The backend must guarantee:

```text id="8f6t4v"
One Ride
   |
   v
Maximum One Accepted Driver
```

---

# Race Condition Prevention

Possible protection mechanisms include:

- Database transactions
- Conditional updates
- Row-level locking
- Unique constraints
- Optimistic concurrency
- Distributed locks when required

Conceptually:

```text id="5en1q9"
Accept Bid Request
       |
       v
Begin Transaction
       |
       v
Lock / Validate Ride
       |
       v
Is Ride Still BIDDING?
       |
      / \
    Yes  No
     |    |
     v    v
Assign   Reject
Driver   Request
     |
     v
Update Winning Bid
     |
     v
Close Other Bids
     |
     v
Commit Transaction
```

This ensures that competing requests cannot leave the ride in an inconsistent state.

---

# Database Transactions

Transactions are important for operations that modify multiple related records.

For example, accepting a bid may require:

1. Updating the ride
2. Assigning the driver
3. Accepting the selected bid
4. Rejecting other bids
5. Updating driver availability

These operations should behave as a single logical unit.

Conceptually:

```text id="xgyf3a"
BEGIN TRANSACTION

Update Ride
Assign Driver
Accept Bid
Reject Other Bids
Update Driver Status

COMMIT
```

If any critical operation fails:

```text id="mg9yk6"
ROLLBACK
```

This protects data consistency.

---

# Authentication and Authorization

The platform uses JWT authentication.

Authentication identifies the user.

Authorization determines whether the user can perform a specific operation.

Roles include:

```text id="zxssbd"
RIDER
DRIVER
ADMIN
```

Example permissions:

```text id="os5d7m"
POST /rides
RIDER

POST /rides/:id/bids
DRIVER

POST /rides/:id/accept-bid
RIDER

PATCH /drivers/location
DRIVER
```

Resource-level authorization is also important.

A rider should only be able to accept bids for their own ride.

---

# Redis

Redis can support multiple performance-sensitive parts of the platform.

Possible uses include:

- Driver locations
- Nearby driver discovery
- Driver availability
- Ride request caching
- Temporary ride data
- Rate limiting
- Real-time state
- Socket.IO scaling

Example:

```text id="p06vg1"
driver:123:location
{
  latitude,
  longitude
}
```

Frequently changing data is better suited to Redis than repeatedly updating relational database rows.

---

# Database Design

The system follows an ERD-first design approach.

The database schema is designed before implementing the main business logic.

Core entities include:

```text id="mwx4fe"
Users
Drivers
Vehicles
RideRequests
Bids
Rides
Payments
TrackingLogs
Reviews
Notifications
```

---

# Entity Relationships

A simplified model:

```text id="16qmbb"
User
 |
 +---- Rider Profile
 |
 +---- Driver Profile
          |
          +---- Vehicle

Rider
 |
 +---- Ride Requests
          |
          +---- Bids
          |
          +---- Ride
                 |
                 +---- Driver
                 |
                 +---- Payment
                 |
                 +---- Tracking Logs
                 |
                 +---- Review
```

The relational nature of the system makes PostgreSQL a strong database choice.

---

# Why PostgreSQL Instead of MongoDB?

Swite-Ride contains highly relational and transactional data.

A single ride may be associated with:

- Rider
- Driver
- Vehicle
- Ride request
- Multiple bids
- Payment
- Tracking information
- Notifications
- Review

These relationships require strong consistency.

PostgreSQL provides:

- ACID transactions
- Referential integrity
- Foreign key constraints
- Unique constraints
- Complex joins
- Strong transactional consistency
- Advanced indexing
- Row-level locking

These capabilities are especially valuable for operations such as driver assignment and payment processing.

---

# PostgreSQL vs Redis Responsibilities

The system uses each database for a different purpose.

```text id="9kgp0k"
PostgreSQL
|
+---- Users
+---- Drivers
+---- Vehicles
+---- Ride Requests
+---- Bids
+---- Completed Rides
+---- Payments
+---- Reviews


Redis
|
+---- Current Driver Locations
+---- Driver Availability
+---- Temporary Ride Data
+---- Cached Data
+---- Geospatial Search
```

PostgreSQL acts as the primary source of truth while Redis handles fast-changing and temporary data.

---

# Engineering Challenges

Swite-Ride addresses several backend engineering challenges.

## Real-Time Communication

Ride requests, bids, location updates, and ride states must reach connected users immediately.

## High Concurrency

Multiple drivers may interact with the same ride simultaneously.

## Race Conditions

Only one driver can ultimately be assigned to a ride.

## Data Consistency

Ride, bid, driver, and payment data must remain synchronized.

## Geospatial Search

Nearby drivers must be discovered efficiently.

## High-Frequency Location Updates

GPS updates should not overload the primary database.

## Ride State Management

Invalid ride transitions must be prevented.

## Authentication and Authorization

Riders and drivers must only access operations they are authorized to perform.

## Scalability

The architecture should support increasing numbers of riders, drivers, rides, bids, and WebSocket connections.

---

# Project Structure

A possible NestJS structure:

```text id="sln1mh"
src/
|
|-- auth/
|   |-- guards/
|   |-- strategies/
|   |-- decorators/
|   |-- auth.controller.ts
|   |-- auth.service.ts
|   `-- auth.module.ts
|
|-- users/
|
|-- drivers/
|
|-- vehicles/
|
|-- rides/
|   |-- dto/
|   |-- rides.controller.ts
|   |-- rides.service.ts
|   `-- rides.module.ts
|
|-- bids/
|   |-- dto/
|   |-- bids.controller.ts
|   |-- bids.service.ts
|   `-- bids.module.ts
|
|-- tracking/
|
|-- payments/
|
|-- reviews/
|
|-- notifications/
|
|-- gateways/
|   `-- ride.gateway.ts
|
|-- redis/
|
|-- prisma/
|
|-- common/
|   |-- guards/
|   |-- decorators/
|   |-- filters/
|   |-- interceptors/
|   `-- pipes/
|
|-- app.module.ts
`-- main.ts
```

This modular structure separates the main business domains and keeps responsibilities clear.

---

# Environment Configuration

Create a `.env` file in the project root.

Example:

```env id="6l7jhb"
PORT=3000

DATABASE_URL=postgresql://username:password@localhost:5432/swite_ride

JWT_SECRET=your_jwt_secret

REDIS_HOST=localhost
REDIS_PORT=6379
```

Production credentials should never be committed to source control.

Add `.env` to `.gitignore`.

---

# Installation and Setup

## Requirements

Install:

- Node.js 18 or later
- PostgreSQL
- Redis
- npm or Yarn

---

## Clone Repository

```bash id="c5r43e"
git clone https://github.com/yourusername/swite-ride.git
cd swite-ride
```

---

## Install Dependencies

Using Yarn:

```bash id="2b0u6n"
yarn install
```

Or npm:

```bash id="n6vdq4"
npm install
```

---

## Configure Environment Variables

```bash id="5y50wq"
cp .env.example .env
```

Update the environment variables before starting the application.

---

## Generate Prisma Client

```bash id="25a89r"
npx prisma generate
```

---

## Run Database Migrations

```bash id="7u11yw"
npx prisma migrate dev
```

Or:

```bash id="7b4dz8"
yarn prisma migrate dev
```

---

## Start Development Server

```bash id="vwpafz"
npm run start:dev
```

Or:

```bash id="rrx84f"
yarn start:dev
```

The API will run on the configured port.

For example:

```text id="nm3xc9"
http://localhost:3000
```

---

# Scalability

A production-scale architecture could evolve into:

```text id="bjqf7e"
                       Load Balancer
                            |
           ---------------------------------
           |                               |
           v                               v
    NestJS Instance                 NestJS Instance
           |                               |
           +---------------+---------------+
                           |
          -----------------------------------------
          |                    |                  |
          v                    v                  v
      PostgreSQL             Redis            Message Broker
          |                    |
          v                    v
     Read Replica        Redis Pub/Sub
                               |
                               v
                        Socket.IO Adapter
```

This architecture allows multiple backend instances to process HTTP and WebSocket traffic.

---

# Scaling Socket.IO

Running multiple NestJS instances introduces an important issue.

A rider may be connected to:

```text id="ql5ycr"
Server A
```

while the selected driver may be connected to:

```text id="1ex95y"
Server B
```

Without shared communication, Server A cannot directly emit an event to a socket connected to Server B.

A Redis Socket.IO adapter can solve this:

```text id="l34z3a"
Server A
   |
   v
Redis Pub/Sub
   |
   v
Server B
   |
   v
Driver Socket
```

This allows real-time events to work across horizontally scaled backend instances.

---

# Future Enhancements

Possible future improvements include:

- Payment gateway integration
- Advanced route calculation
- Dynamic pricing
- Surge pricing
- Ride scheduling
- Driver earnings dashboard
- Rider wallet
- Driver wallet
- Promotional codes
- Emergency ride features
- Background jobs
- Message broker integration
- Push notifications
- Docker containerization
- Nginx reverse proxy
- CI/CD pipelines
- Structured logging
- Distributed tracing
- Error monitoring
- API metrics
- Database replication
- Horizontal scaling

---

# Use Cases

## Rider

A rider can:

- Login
- Create a ride request
- Select pickup and destination
- Receive nearby driver bids
- Compare prices and ETAs
- Select a driver
- Track the driver
- Follow the ride in real time
- Complete the trip
- Rate the driver

## Driver

A driver can:

- Login
- Set availability
- Update location
- Receive nearby ride requests
- Submit bids
- Receive bid acceptance
- Navigate toward the rider
- Start the ride
- Update location
- Complete the ride

---

# Security Considerations

Important security measures include:

- JWT validation
- Password hashing
- Role-Based Access Control
- Resource-level authorization
- Input validation
- Rate limiting
- WebSocket authentication
- Secure environment variables
- Transactional operations
- Validation of ride ownership

WebSocket connections should also be authenticated before users are allowed to join private ride rooms or receive sensitive events.

---

# Final Note

Swite-Ride demonstrates the architecture of a real-time ride-hailing backend rather than a traditional CRUD application.

The project focuses on backend engineering challenges such as dynamic bidding, WebSocket communication, geospatial driver discovery, GPS tracking, concurrency management, race condition prevention, transactional consistency, ride state machines, Redis-based real-time data, and scalable system architecture.

The combination of PostgreSQL for durable transactional data, Redis for fast-changing real-time data, Socket.IO for event-driven communication, and NestJS for modular backend architecture provides a strong foundation for building a scalable ride-hailing platform.

---

# Author

**Omar Elhelaly**

Backend Developer specializing in:

- Node.js
- NestJS
- TypeScript
- PostgreSQL
- Prisma
- Redis
- Socket.IO
- RESTful APIs
- Real-Time Systems
- Geospatial Systems
- Concurrency Management
- Database Transactions
- Scalable Backend Architecture
