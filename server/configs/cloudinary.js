import {v2 as cloudinary} from 'cloudinary';

const connectCloudinary = async(res)=>{
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        console.warn("⚠️ Cloudinary credentials not configured in server/.env. Image uploads will be disabled until set.");
        return;
    }
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })
}

export default connectCloudinary;