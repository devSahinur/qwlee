// HEIC → PNG conversion. Operates entirely on buffers (no disk I/O) since
// uploads moved to memory storage. The middleware factory still accepts a
// folder argument for backwards compatibility — it's ignored.

const convert = require("heic-convert");

module.exports = function convertHeicToPngMiddleware(/* _legacyFolder */) {
  return async (req, res, next) => {
    try {
      const heicFiles = [];
      if (req.file && (req.file.mimetype === "image/heic" || req.file.mimetype === "image/heif")) {
        heicFiles.push(req.file);
      }
      if (Array.isArray(req.files)) {
        for (const f of req.files) {
          if (f.mimetype === "image/heic" || f.mimetype === "image/heif") {
            heicFiles.push(f);
          }
        }
      }

      for (const file of heicFiles) {
        const pngBuffer = await convert({ buffer: file.buffer, format: "PNG" });
        file.buffer = pngBuffer;
        file.mimetype = "image/png";
        file.originalname = (file.originalname || "upload").replace(
          /\.[^.]+$/,
          ".png"
        );
        file.size = pngBuffer.length;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
