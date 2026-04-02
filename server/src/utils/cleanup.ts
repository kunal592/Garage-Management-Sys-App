import prisma from '../prisma/client';
import fs from 'fs';
import path from 'path';

export const cleanupExpiredImages = async () => {
  console.log('Running expired images cleanup...');
  try {
    const now = new Date();
    const expiredImages = await prisma.vehicleImage.findMany({
      where: {
        expiresAt: {
          lte: now
        }
      }
    });

    if (expiredImages.length === 0) {
      console.log('No expired images found.');
      return;
    }

    for (const image of expiredImages) {
      // url is likely like '/uploads/filename.jpg'
      const fileName = path.basename(image.url);
      const filePath = path.join(process.cwd(), 'uploads', fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }

      await prisma.vehicleImage.delete({
        where: { id: image.id }
      });
      console.log(`Deleted database record for image: ${image.id}`);
    }

    console.log(`Cleanup complete. Deleted ${expiredImages.length} images.`);
  } catch (error) {
    console.error('Error during image cleanup:', error);
  }
};
