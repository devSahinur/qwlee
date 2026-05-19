const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const response = require("../config/response");
const verificationService = require("../services/verification.service");

// Multer's .fields([...]) hands us `req.files` as an object keyed by
// field name. The imgbb middleware then upgrades each file with
// .cloudUrl in-place.
function pickFile(req, field) {
  const arr = req.files?.[field];
  if (Array.isArray(arr) && arr[0]) return arr[0];
  return null;
}

const submit = catchAsync(async (req, res) => {
  try {
    const front = pickFile(req, "front");
    const back = pickFile(req, "back");
    const selfie = pickFile(req, "selfie");
    const result = await verificationService.submitDocs(req.user.id, {
      documentType: req.body?.documentType,
      documentNumber: req.body?.documentNumber,
      files: { front, back, selfie },
    });
    res.status(httpStatus.CREATED).json(
      response({
        message: "Verification submitted",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: { user: result },
      })
    );
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, err.message);
  }
});

const list = catchAsync(async (req, res) => {
  const data = await verificationService.listPending({
    status: req.query.status,
    limit: Number(req.query.limit) || 50,
    page: Number(req.query.page) || 1,
  });
  res.status(httpStatus.OK).json(
    response({
      message: "Verifications",
      status: "OK",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

const review = catchAsync(async (req, res) => {
  try {
    const user = await verificationService.review(req.params.userId, {
      action: req.body?.action,
      reason: req.body?.reason,
      reviewerId: req.user.id,
    });
    res.status(httpStatus.OK).json(
      response({
        message:
          req.body?.action === "approve"
            ? "Verification approved"
            : "Verification rejected",
        status: "OK",
        statusCode: httpStatus.OK,
        data: { user },
      })
    );
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, err.message);
  }
});

module.exports = { submit, list, review };
