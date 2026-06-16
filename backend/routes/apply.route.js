import express from "express";

import * as apply from "../controllers/apply.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validate } from "../middlewares/validation.js";
import {
  createJobApplicationSchema,
  updateJobApplicationSchema,
} from "../schemas/index.js";

const router = express.Router();

// CREATE APPLICATION
router.post(
  "/",
  upload.single("resume"),

  validate(createJobApplicationSchema),
  apply.createJobApplication,
);

// GET ALL APPLICATIONS
router.get("/", apply.getJobApplications);

// GET SINGLE APPLICATION
router.get("/:id", apply.getJobApplicationById);

// UPDATE APPLICATION

router.patch(
  "/:id",
  validate(updateJobApplicationSchema),
  apply.updateJobApplication,
);

// DELETE APPLICATION

router.delete("/:id", apply.deleteJobApplication);

export default router;
