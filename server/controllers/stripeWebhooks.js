import stripe from 'stripe';
import prisma from '../configs/prisma.js';

export const stripeWebhook = async (req, res) => {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(500).send("Stripe webhook secrets are not configured");
    }

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error("Webhook construction error:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    // Handle payment_intent.succeeded
    if (event.type === 'payment_intent.succeeded') {
        try {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (session.data && session.data.length > 0 && session.data[0].metadata?.bookingId) {
                const bookingId = session.data[0].metadata.bookingId;

                // Update payment status in PostgreSQL via Prisma
                await prisma.booking.update({
                    where: { id: bookingId },
                    data: {
                        isPaid: true,
                        paymentMethod: 'Stripe',
                        status: 'confirmed'
                    }
                });
                console.log(`✅ Booking ${bookingId} marked as paid via Stripe webhook`);
            }
        } catch (dbError) {
            console.error("Error updating booking payment status:", dbError.message);
        }
    } else {
        console.log("Unhandled event type: ", event.type);
    }

    res.json({ received: true });
};