// Multer middleware factory. All uploads use in-memory storage so the
// buffer can be forwarded to ImgBB (see middlewares/imgbbUpload.js) without
// ever touching the filesystem.
//
// The legacy signature `fileUpload(UPLOADS_FOLDER)` is preserved so existing
// callers don't break — the folder argument is silently ignored.

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

module.exports = function fileUpload(/* _legacyUploadsFolder */) {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: (config.imgbb.maxImageSizeMb || 32) * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (ALLOWED_IMAGE_MIME.has(file.mimetype)) return cb(null, true);
      cb(new Error(`Unsupported image type: ${file.mimetype}`));
    },
  });
};

module.exports.ALLOWED_IMAGE_MIME = ALLOWED_IMAGE_MIME;
