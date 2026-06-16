import { db } from "../config/db.js";

//
// CREATE JOB APPLICATION
//
export async function createJobApplication(req, res) {
  try {
    const { job_id, name, email, phone_number, cover_letter, dob } = req.body;

    console.log("FILE:", req.file);

    // Validation
    if (!job_id || !name || !email || !phone_number || !dob) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Check job exists
    const [jobs] = await db.execute(
      `
      SELECT id FROM jobs
      WHERE id = ?
      `,
      [job_id],
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // CREATE FILE URL
    const resumeUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    // Insert application
    const [result] = await db.execute(
      `
      INSERT INTO job_applications
      (
        job_id,
        name,
        email,
        phone_number,
        resume,
        cover_letter,
        dob
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [job_id, name, email, phone_number, resumeUrl, cover_letter || null, dob],
    );

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      applicationId: result.insertId,
      resume: resumeUrl,
    });
  } catch (error) {
    console.log("CREATE APPLICATION ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

//
// GET ALL APPLICATIONS
//
export async function getJobApplications(req, res) {
  try {
    const { status, designation, page = 1, limit = 10 } = req.query;

    let baseQuery = `
      SELECT ja.*, j.title AS job_title
      FROM job_applications ja
      JOIN jobs j ON j.id = ja.job_id
      WHERE 1=1
    `;

    const params = [];

    // FILTER: status
    if (status) {
      baseQuery += ` AND ja.status = ?`;
      params.push(status);
    }

    // FILTER: designation (coming from jobs table)
    if (designation) {
      baseQuery += ` AND j.designation = ?`;
      params.push(designation);
    }

    // ORDER
    baseQuery += ` ORDER BY ja.applied_at DESC`;

    // PAGINATION (safe)
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const safePage = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
    const safeLimit = Number.isFinite(limitNum) && limitNum > 0 ? limitNum : 10;

    const offset = (safePage - 1) * safeLimit;

    baseQuery += ` LIMIT ${safeLimit} OFFSET ${offset}`;
    params.push(limitNum, offset);

    const [rows] = await db.execute(baseQuery, params);

    // COUNT QUERY
    let countQuery = `
      SELECT COUNT(*) as total
      FROM job_applications ja
      JOIN jobs j ON j.id = ja.job_id
      WHERE 1=1
    `;

    const countParams = [];

    if (status) {
      countQuery += ` AND ja.status = ?`;
      countParams.push(status);
    }

    if (designation) {
      countQuery += ` AND j.designation = ?`;
      countParams.push(designation);
    }

    const [countResult] = await db.execute(countQuery, countParams);

    return res.json({
      success: true,
      data: rows,
      pagination: {
        total: countResult[0].total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(countResult[0].total / limitNum),
      },
    });
  } catch (error) {
    console.log("GET APPLICATIONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

//
// GET SINGLE APPLICATION
//
export async function getJobApplicationById(req, res) {
  try {
    const { id } = req.params;

    const [applications] = await db.execute(
      `
      SELECT
        job_applications.*,
        jobs.title,
        jobs.designation
      FROM job_applications

      JOIN jobs
      ON jobs.id = job_applications.job_id

      WHERE job_applications.id = ?
      `,
      [id],
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application: applications[0],
    });
  } catch (error) {
    console.log("GET APPLICATION ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

//
// UPDATE APPLICATION
//
export async function updateJobApplication(req, res) {
  try {
    const { id } = req.params;

    const allowedFields = [
      "name",
      "email",
      "phone_number",
      "resume",
      "cover_letter",
      "status",
    ];

    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided",
      });
    }

    // Check exists
    const [existing] = await db.execute(
      `
      SELECT id FROM job_applications
      WHERE id = ?
      `,
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    values.push(id);

    await db.execute(
      `
      UPDATE job_applications
      SET ${updates.join(", ")}
      WHERE id = ?
      `,
      values,
    );

    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
    });
  } catch (error) {
    console.log("UPDATE APPLICATION ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

//
// DELETE APPLICATION
//
export async function deleteJobApplication(req, res) {
  try {
    const { id } = req.params;

    // Check exists
    const [existing] = await db.execute(
      `
      SELECT id FROM job_applications
      WHERE id = ?
      `,
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await db.execute(
      `
      DELETE FROM job_applications
      WHERE id = ?
      `,
      [id],
    );

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.log("DELETE APPLICATION ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
