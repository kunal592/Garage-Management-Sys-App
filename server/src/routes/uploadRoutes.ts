import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Setup storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/upload-image-vehicle', upload.single('imageFile'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  const { serviceId, vehicleId } = req.body;

  // Logic: Store image for 7 days only
  // For now, just return the path
  res.json({
    message: 'Image uploaded successfully',
    url: `/uploads/${req.file.filename}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  });
});

export default router;
