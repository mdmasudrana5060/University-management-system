import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import config from '../config';
import multer from 'multer';
cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  try {
    return await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        path,
        { public_id: imageName.trim() },
        function (error, result_1) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result_1 as UploadApiResponse);
        },
      );
    });
  } finally {
    // Always try to delete the file after Cloudinary operation completes
    fs.unlink(path, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('File is deleted.');
      }
    });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
