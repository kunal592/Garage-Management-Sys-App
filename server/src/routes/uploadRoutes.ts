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

import prisma from '../prisma/client';

router.post('/upload-image-vehicle', upload.single('imageFile'), async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  try {
    const { serviceId, vehicleId } = req.body;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const imageRecord = await prisma.vehicleImage.create({
      data: {
        url: `/uploads/${req.file.filename}`,
        serviceId: serviceId || null,
        vehicleId: vehicleId || null,
        expiresAt
      }
    });

    res.json({
      message: 'Image uploaded successfully',
      image: imageRecord
    });
  } catch (error) {
    next(error);
  }
});

export default router;
