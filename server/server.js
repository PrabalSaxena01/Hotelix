// server.js
import express from 'express';
import cors from 'cors';
import "dotenv/config";
import prisma from './configs/prisma.js';
import { clerkMiddleware } from '@clerk/express';
import { functions, inngest } from './inngest/index.js';
import { serve } from 'inngest/express';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import { stripeWebhook } from './controllers/stripeWebhooks.js';

// Connect to Cloudinary
await connectCloudinary();

// Verify PostgreSQL / Prisma connection asynchronously without blocking server startup
prisma.$connect()
  .then(() => {
    console.log("✅ PostgreSQL connected successfully via Prisma ORM");
  })
  .catch((dbErr) => {
    console.warn("⚠️ PostgreSQL connection note:", dbErr.message);
    console.warn("ℹ️ Server running with Prisma configured. Ensure DATABASE_URL is set in server/.env when running PostgreSQL.");
  });

const app = express();
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin like mobile apps or curl requests
    if(!origin) return callback(null, true);
    if(origin.includes("localhost") || origin.includes("127.0.0.1") || origin.endsWith(".vercel.app")){
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Stripe webhook (must be before express.json() to capture raw payload)
app.post('/api/stripe', express.raw({type: 'application/json'}), stripeWebhook);

// JSON body parsing for remaining routes
app.use(express.json());

// Clerk middleware
if (process.env.CLERK_SECRET_KEY) {
  app.use(clerkMiddleware());
} else {
  console.warn("⚠️ CLERK_SECRET_KEY not set in server/.env. Public endpoints active; authenticated routes require key.");
  app.use((req, res, next) => {
    req.auth = () => ({ userId: null });
    next();
  });
}

// Clerk Webhook API via Inngest
app.use('/api/clerk', serve({ client: inngest, functions }));

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Hotelix server is live with PostgreSQL & Prisma ORM!');
});

// Application API routes
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
