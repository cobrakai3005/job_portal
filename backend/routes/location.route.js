import express from "express";

import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";
import * as location from "../controllers/location.controller.js";
import {
  createLocationSchema,
  updateLocationSchema,
} from "../schemas/index.js";
import { validate } from "../middlewares/validation.js";
const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin"), location.getLocations);
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  validate(createLocationSchema),
  location.createLocation,
);
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  location.getLocationById,
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  location.deleteLocation,
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  validate(updateLocationSchema),
  location.updateLocation,
);

export default router;
