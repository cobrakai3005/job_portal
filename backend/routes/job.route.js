import express from "express";

import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import * as job from "../controllers/jobs.controller.js";
import { validate } from "../middlewares/validation.js";
import { createJobSchema } from "../schemas/index.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizeRoles("admin"),

  job.getAllJobs,
);
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  upload.single("jd_file"),
  validate(createJobSchema),
  job.createJob,
);
router.get("/:id", verifyToken, authorizeRoles("admin"), job.getJobById);
router.delete("/:id", verifyToken, authorizeRoles("admin"), job.deleteJob);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  upload.single("jd_file"),
  job.updateJob,
);
export default router;
