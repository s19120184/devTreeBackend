import { v2 as cloudinary } from 'cloudinary';

 // Configuration
   cloudinary.config({ 
    cloud_name: process.env.ClOUD_NAME, 
    api_key: process.env.API_KEY_CLOUDINARY, 
    api_secret: process.env.API_SECRET_CLOUDINARY 
});

export default cloudinary