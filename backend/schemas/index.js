import { z } from "zod";

// USERS SCHEMA

export const registerUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),

  email: z.string().email("Invalid email address").max(150),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(100),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255),
});

export const loginUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

// LOCATION SCHEMA

export const createLocationSchema = z.object({
  city: z.string().min(2, "Location City is required").max(100),

  state: z.string("State is required").max(100),

  country: z.string().max(100),
});

export const updateLocationSchema = createLocationSchema.partial();

// JOB SCHEMA

export const createJobSchema = z.object({
  title: z.string().min(2, "Title is required").max(50),

  designation: z.string().min(2, "Designation is required").max(100),

  short_description: z.string().max(150),

  location: z.coerce
    .number({
      invalid_type_error: "Location must be a number",
    })
    .int()
    .positive(),
  jd_file: z.string().max(255).optional(),
});

export const updateJobSchema = createJobSchema.partial();

// JOB APPLICATION SCHEMA

export const createJobApplicationSchema = z.object({
  job_id: z
    .number({
      invalid_type_error: "Job ID must be a number",
    })
    .int()
    .positive(),

  name: z.string().min(2, "Name is required").max(100),

  email: z.string().email("Invalid email"),

  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20),

  resume: z.string().max(255).optional(),

  cover_letter: z.string().optional(),

  status: z
    .enum(["pending", "reviewed", "shortlisted", "rejected", "selected"])
    .optional(),
});

export const updateJobApplicationSchema = createJobApplicationSchema.partial();
