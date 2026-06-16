import { db } from "../config/db.js";

//
// CREATE LOCATION
//
export async function createLocation(req, res) {
  try {
    const { city, state, country } = req.body;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    const [result] = await db.execute(
      `
      INSERT INTO locations (city, state, country)
      VALUES (?, ?, ?)
      `,
      [city, state || null, country || null],
    );

    return res.status(201).json({
      success: true,
      message: "Location created successfully",
      locationId: result.insertId,
    });
  } catch (error) {
    console.log("CREATE LOCATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

//
// GET ALL LOCATIONS
//
export async function getLocations(req, res) {
  try {
    const [locations] = await db.execute(`
      SELECT * FROM locations
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (error) {
    console.log("GET LOCATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

//
// GET SINGLE LOCATION
//
export async function getLocationById(req, res) {
  try {
    const { id } = req.params;

    const [locations] = await db.execute(
      `
      SELECT * FROM locations
      WHERE id = ?
      `,
      [id],
    );

    if (locations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      success: true,
      location: locations[0],
    });
  } catch (error) {
    console.log("GET LOCATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

//
// UPDATE LOCATION
//
export async function updateLocation(req, res) {
  try {
    const { id } = req.params;
    const { city, state, country } = req.body;

    const [existing] = await db.execute(
      `
      SELECT id FROM locations
      WHERE id = ?
      `,
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    await db.execute(
      `
      UPDATE locations
      SET city = ?, state = ?, country = ?
      WHERE id = ?
      `,
      [city, state, country, id],
    );

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
    });
  } catch (error) {
    console.log("UPDATE LOCATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

//
// DELETE LOCATION
//
export async function deleteLocation(req, res) {
  try {
    const { id } = req.params;

    const [existing] = await db.execute(
      `
      SELECT id FROM locations
      WHERE id = ?
      `,
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    await db.execute(
      `
      DELETE FROM locations
      WHERE id = ?
      `,
      [id],
    );

    return res.status(200).json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    console.log("DELETE LOCATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
