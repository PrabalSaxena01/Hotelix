import mongoose from 'mongoose'

const connectDB = async ()=> {
    try {
        if (!process.env.MONGO_URI) {
            console.warn("⚠️ MONGO_URI is not set in server/.env. Database features will be inactive until configured.");
            return;
        }
        mongoose.connection.on('connected', ()=>
            console.log("✅ Database successfully connected")
        );
        await mongoose.connect(`${process.env.MONGO_URI}/hotelix`)
    } catch (error) {
        console.error("❌ Database connection error:", error.message)
    }
}

export default connectDB