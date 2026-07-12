import crypto from "node:crypto";
import path from "node:path";
import multer from "multer";

// Configure Multer storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// Upload directly to public/uploads
		cb(null, path.join(__dirname, "../../public/uploads"));
	},
	filename: (req, file, cb) => {
		// Create a unique filename with random suffix
		const uniqueSuffix = crypto.randomBytes(8).toString("hex");
		const ext = path.extname(file.originalname);
		cb(null, `${file.fieldname}-${Date.now()}-${uniqueSuffix}${ext}`);
	},
});

// Configure Multer upload
export const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB limit
	},
	fileFilter: (req, file, cb) => {
		// Only allow images
		const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
		if (allowedMimeTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Hanya file gambar (JPEG, PNG, WEBP) yang diperbolehkan."));
		}
	},
});
