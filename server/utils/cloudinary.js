import { v2 as cloudinary } from 'cloudinary'
import fs, { unlink } from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});
   
const cloudinaryfileupload=async (filepath)=>{
    try {
        if(!filepath) return null;
        const response=await cloudinary.uploader.upload(filepath,{
            resource_type:"auto"
        })
        console.log("file has been uploaded")
        console.log(response.url)
        fs.unlink(filepath, (err) => {
      if (err) {
        console.error("❌ Error deleting temp file:", err.message);
      } else {
        console.log("🗑️ Temp file deleted");
      }
    });
        return response
    } catch (error) {
        try {
      fs.unlinkSync(filepath); // use sync version inside catch
      console.log("🗑️ Temp file deleted after failed upload");
    } catch (err) {
      console.error("❌ Failed to delete temp file after failed upload:", err.message);
    }
    console.error("❌ Cloudinary upload failed:", error.message);
    return null;
  }
}

export {cloudinaryfileupload}