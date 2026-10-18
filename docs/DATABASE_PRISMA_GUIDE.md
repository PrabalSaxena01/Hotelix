# Hotelix: PostgreSQL & Prisma ORM Architecture

This document details the complete database architecture, schema definitions, and migration workflow for the **Hotelix** Hotel Booking App, powered by **PostgreSQL** and **Prisma ORM**.

---

## 1. Overview & Architecture

- **Database:** PostgreSQL (Neon Serverless / Local PostgreSQL / Supabase)
- **ORM:** Prisma Client `v6.19.3`
- **Schema Namespace:** Dedicated `hotelix` PostgreSQL schema (`?schema=hotelix`)
  - Isolates Hotelix tables (`users`, `hotels`, `rooms`, `bookings`) cleanly from any other tables in the database.
- **Frontend Compatibility:** 100% Zero-Breakage Adapter (`withLegacyId`) dynamically presents both `_id` and `id` for seamless compatibility with the React 19 + Vite frontend.

---

## 2. Relational Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("HOTELIX_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id                   String    @id // Clerk user ID (e.g. user_2unqy...)
  email                String    @unique
  username             String
  image                String?
  role                 String    @default("user") // "user" | "hotelOwner"
  recentSearchedCities String[]  @default([])
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  hotels   Hotel[]
  bookings Booking[]

  @@map("users")
}

model Hotel {
  id        String    @id @default(uuid())
  name      String
  address   String
  contact   String
  city      String
  ownerId   String
  owner     User      @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  rooms    Room[]
  bookings Booking[]

  @@map("hotels")
}

model Room {
  id            String    @id @default(uuid())
  hotelId       String
  hotel         Hotel     @relation(fields: [hotelId], references: [id], onDelete: Cascade)
  roomType      String    // "Single Bed", "Double Bed", etc.
  pricePerNight Float
  amenities     String[]  // Native PostgreSQL TEXT[]
  images        String[]  // Cloudinary image URLs
  isAvailable   Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  bookings Booking[]

  @@map("rooms")
}

model Booking {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  roomId        String
  room          Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
  hotelId       String
  hotel         Hotel    @relation(fields: [hotelId], references: [id], onDelete: Cascade)
  checkInDate   DateTime
  checkOutDate  DateTime
  totalPrice    Float
  guests        Int      @default(1)
  status        String   @default("pending") // "pending" | "confirmed" | "cancelled"
  paymentMethod String   @default("Pay at hotel")
  isPaid        Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("bookings")
}
```

---

## 3. Environment Variables (`server/.env`)

```env
PORT=3000

# PostgreSQL Connection String with dedicated 'hotelix' schema namespace
HOTELIX_DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<dbname>?sslmode=require&schema=hotelix"

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Nodemailer / Email Service
SMTP_USER=...
SMTP_PASS=...
SENDER_EMAIL=...
```

---

## 4. Useful NPM Scripts

Run from `server`:

| Command | Action |
|---|---|
| `npm run prisma:generate` | Generates the TypeScript / JavaScript Prisma client into `node_modules/@prisma/client` |
| `npm run prisma:push` | Synchronizes `schema.prisma` directly with PostgreSQL without creating migration files |
| `npm run prisma:migrate` | Creates and runs SQL migration files (for production workflows) |
| `npm run prisma:studio` | Launches Prisma Studio GUI at `http://localhost:5555` to view and edit database rows visually |
| `npm start` | Starts the Express server |
| `npm run server` | Starts development server with hot-reload via nodemon |

---

## 5. Zero-Breakage Frontend Compatibility

The frontend React application previously queried MongoDB fields using `item._id`. 

The adapter exported in [`configs/prisma.js`](../server/configs/prisma.js):
```javascript
export const withLegacyId = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(withLegacyId);
  const mapped = { ...data, _id: data.id };
  if (data.hotel && typeof data.hotel === 'object') mapped.hotel = withLegacyId(data.hotel);
  if (data.room && typeof data.room === 'object') mapped.room = withLegacyId(data.room);
  if (data.user && typeof data.user === 'object') mapped.user = withLegacyId(data.user);
  return mapped;
};
```
Every response guarantees:
- `booking._id === booking.id`
- `room._id === room.id`
- `hotel._id === hotel.id`
- `user._id === user.id`
Ensuring 100% compatibility across all UI components without requiring modifications to the React client.
