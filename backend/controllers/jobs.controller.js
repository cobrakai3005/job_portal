// controllers/job.controller.js

import { db } from "../config/db.js";

// CREATE JOB
export async function createJob(req, res) {
  try {
    const { title, designation, short_description, location, jd_file } =
      req.body;

    if (!title || !designation) {
      return res.status(400).json({
        success: false,
        message: "Title and designation are required",
      });
    }
    // CREATE FILE URL
    const resumeUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;
    const [result] = await db.execute(
      `
      INSERT INTO jobs
      (
        title,
        designation,
        short_description,
        location,
        jd_file,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [title, designation, short_description, location, resumeUrl, req.user.id],
    );

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      jobId: result.insertId,
    });
  } catch (error) {
    console.log("CREATE JOB ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

// GET ALL JOBS
// export async function getAllJobs(req, res) {
//   try {
//     const { search, location } = req.query;

//     let query = `
//       SELECT
//         jobs.*,
//         users.name AS created_by_name,
//         locations.city,
//         locations.state,
//         locations.country
//       FROM jobs

//       JOIN users
//       ON users.id = jobs.created_by

//       LEFT JOIN locations
//       ON locations.id = jobs.location
//     `;

//     const conditions = [];
//     const values = [];

//     //
//     // SEARCH
//     //
//     if (search) {
//       conditions.push(`
//         (
//           jobs.title LIKE ?
//           OR jobs.designation LIKE ?
//           OR jobs.short_description LIKE ?
//         )
//       `);

//       values.push(`%${search}%`, `%${search}%`, `%${search}%`);
//     }

//     //
//     // LOCATION FILTER
//     //
//     if (location) {
//       conditions.push(`
//         locations.city LIKE ?
//       `);

//       values.push(`%${location}%`);
//     }

//     //
//     // WHERE
//     //
//     if (conditions.length > 0) {
//       query += ` WHERE ${conditions.join(" AND ")}`;
//     }

//     //
//     // ORDER
//     //
//     query += ` ORDER BY jobs.created_at DESC`;

//     const [jobs] = await db.execute(query, values);

//     return res.status(200).json({
//       success: true,
//       count: jobs.length,
//       jobs,
//     });
//   } catch (error) {
//     console.log("GET JOBS ERROR", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// }

// export async function getAllJobs(req, res) {
//   try {
//     const { search, location, page = 1, limit = 5 } = req.query;

//     const parsedPage = parseInt(page, 10) || 1;
//     const parsedLimit = parseInt(limit, 10) || 5;

//     const offset = (parsedPage - 1) * parsedLimit;

//     //
//     // BASE QUERY
//     //
//     let query = `
//       SELECT
//         jobs.*,
//         users.name AS created_by_name,
//         locations.city,
//         locations.state,
//         locations.country
//       FROM jobs

//       JOIN users
//       ON users.id = jobs.created_by

//       LEFT JOIN locations
//       ON locations.id = jobs.location
//     `;

//     //
//     // COUNT QUERY
//     //
//     let countQuery = `
//       SELECT COUNT(*) AS total
//       FROM jobs

//       LEFT JOIN locations
//       ON locations.id = jobs.location
//     `;

//     const conditions = [];
//     const values = [];
//     const countValues = [];

//     //
//     // SEARCH
//     //
//     if (search) {
//       conditions.push(`
//         (
//           jobs.title LIKE ?
//           OR jobs.designation LIKE ?
//           OR jobs.short_description LIKE ?
//         )
//       `);

//       values.push(`%${search}%`, `%${search}%`, `%${search}%`);

//       countValues.push(`%${search}%`, `%${search}%`, `%${search}%`);
//     }

//     //
//     // LOCATION
//     //
//     if (location) {
//       conditions.push(`
//         locations.city LIKE ?
//       `);

//       values.push(`%${location}%`);
//       countValues.push(`%${location}%`);
//     }

//     //
//     // WHERE
//     //
//     if (conditions.length > 0) {
//       const whereClause = ` WHERE ${conditions.join(" AND ")}`;

//       query += whereClause;
//       countQuery += whereClause;
//     }

//     //
//     // ORDER + PAGINATION
//     //
//     query += `
//       ORDER BY jobs.created_at DESC
//       LIMIT ${parsedLimit}
//       OFFSET ${offset}
//     `;

//     //
//     // GET JOBS
//     //
//     const [jobs] = await db.execute(query, values);

//     //
//     // GET TOTAL COUNT
//     //
//     const [countResult] = await db.execute(countQuery, countValues);

//     const totalJobs = countResult[0].total;

//     //
//     // TOTAL PAGES
//     //
//     const totalPages = Math.ceil(totalJobs / parsedLimit);

//     return res.status(200).json({
//       success: true,

//       jobs,

//       pagination: {
//         total: totalJobs,
//         totalPages,
//         currentPage: parsedPage,
//         limit: parsedLimit,
//         hasNextPage: parsedPage < totalPages,
//         hasPrevPage: parsedPage > 1,
//       },
//     });
//   } catch (error) {
//     console.log("GET JOBS ERROR", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// }

export async function getAllJobs(req, res) {
  try {
    const { search = "", location = "", page = 1, limit = 5 } = req.query;

    //
    // PAGINATION
    //
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 5;

    const offset = (parsedPage - 1) * parsedLimit;

    //
    // MAIN QUERY
    //
    let query = `
      SELECT
        jobs.*,
        users.name AS created_by_name,
        locations.city,
        locations.state,
        locations.country

      FROM jobs

      JOIN users
      ON users.id = jobs.created_by

      LEFT JOIN locations
      ON locations.id = jobs.location
    `;

    //
    // COUNT QUERY
    //
    let countQuery = `
      SELECT COUNT(*) AS total

      FROM jobs

      LEFT JOIN locations
      ON locations.id = jobs.location
    `;

    //
    // FILTERS
    //
    const conditions = [];
    const values = [];
    const countValues = [];

    //
    // SEARCH FILTER
    //
    if (search.trim()) {
      conditions.push(`
        (
          jobs.title LIKE ?
          OR jobs.designation LIKE ?
          OR jobs.short_description LIKE ?
        )
      `);

      const searchValue = `%${search}%`;

      values.push(searchValue, searchValue, searchValue);
      countValues.push(searchValue, searchValue, searchValue);
    }

    //
    // LOCATION FILTER
    //
    if (location.trim()) {
      conditions.push(`
        locations.city LIKE ?
      `);

      const locationValue = `%${location}%`;

      values.push(locationValue);
      countValues.push(locationValue);
    }

    //
    // WHERE CLAUSE
    //
    if (conditions.length > 0) {
      const whereClause = `
        WHERE ${conditions.join(" AND ")}
      `;

      query += whereClause;
      countQuery += whereClause;
    }

    //
    // ORDER + LIMIT + OFFSET
    //
    query += `
      ORDER BY jobs.created_at DESC
      LIMIT ${parsedLimit}
      OFFSET ${offset}
    `;

    //
    // GET JOBS
    //
    const [jobs] = await db.execute(query, values);

    //
    // GET TOTAL COUNT
    //
    const [countResult] = await db.execute(countQuery, countValues);

    const totalJobs = countResult[0]?.total || 0;

    //
    // TOTAL PAGES
    //
    const totalPages = Math.ceil(totalJobs / parsedLimit);

    //
    // RESPONSE
    //
    return res.status(200).json({
      success: true,

      jobs,

      pagination: {
        total: totalJobs,
        totalPages,
        currentPage: parsedPage,
        limit: parsedLimit,

        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1,
      },
    });
  } catch (error) {
    console.log("GET JOBS ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

// GET SINGLE JOB
export async function getJobById(req, res) {
  try {
    const { id } = req.params;

    const [jobs] = await db.execute(
      `
      SELECT
        jobs.*,
        users.name AS created_by_name
      FROM jobs
      JOIN users
      ON users.id = jobs.created_by
      WHERE jobs.id = ?
      `,
      [id],
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job: jobs[0],
    });
  } catch (error) {
    console.log("GET JOB ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

// UPDATE JOB
export async function updateJob(req, res) {
  try {
    const { id } = req.params;

    // Check existing job
    const [existingJob] = await db.execute(
      `
      SELECT * FROM jobs
      WHERE id = ?
      `,
      [id],
    );

    if (existingJob.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Allowed fields
    const allowedFields = [
      "title",
      "designation",
      "short_description",
      "location",
      "jd_file",
    ];

    // Dynamic update fields
    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }

    // No fields sent
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    // Add id at end
    values.push(id);

    // Final query
    const query = `
      UPDATE jobs
      SET ${updates.join(", ")}
      WHERE id = ?
    `;

    await db.execute(query, values);
    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
    });
  } catch (error) {
    console.log("UPDATE JOB ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

// DELETE JOB
export async function deleteJob(req, res) {
  try {
    const { id } = req.params;

    const [existingJob] = await db.execute(
      `
      SELECT * FROM jobs
      WHERE id = ?
      `,
      [id],
    );

    if (existingJob.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await db.execute(
      `
      DELETE FROM jobs
      WHERE id = ?
      `,
      [id],
    );

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.log("DELETE JOB ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
