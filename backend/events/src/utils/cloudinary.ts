import {v2 as cloudinary, UploadApiOptions} from 'cloudinary'
import { config } from 'dotenv'

config()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

// export default cloudinary

export const getImgUrl = async (img: string, options?: UploadApiOptions) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(img, options)
        console.log('cloudinary img upload result: ', uploadResult);
        // return { success: true, data: { imgUrl: uploadResult?.url, type: uploadResult.resource_type } }
        return { success: true, data: { imgUrl: uploadResult?.secure_url, type: uploadResult.resource_type } }
    } catch (error) {
        return { success: false, message: 'Image not saved.' }
    }
}