import { cloudinaryfileupload } from "../utils/cloudinary.js";

export const handleFileUpload = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const uploaded = await cloudinaryfileupload(file.path);

    if (!uploaded) {
      return res.status(500).json({ message: "Upload failed" });
    }

    return res.status(200).json({ url: uploaded.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
