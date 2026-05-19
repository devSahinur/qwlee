// Multer middleware for chat/order-message attachments. Memory storage —
// images get pushed to ImgBB downstream. Non-image attachments are rejected
// (ImgBB doesn't store them); when you add S3/Backblaze, accept the rest
// here.

const multer = require("multer");
const config = require("../config/config");

const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

module.exports = function messageFileUpload() {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: (config.imgbb.maxImageSizeMb || 32) * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (ALLOWED_IMAGE_MIME.has(file.mimetype)) return cb(null, true);
      cb(
        new Error(
          `Only image attachments are supported (received ${file.mimetype})`
        )
      );
    },
  });
};
