import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

// REGISTER USER
export async function register(req, res) {
  try {
    const { username, email, password, name } = req.body;

    // Validate fields
    if (!username || !email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const [existingUsers] = await db.execute(
      `
      SELECT id FROM users
      WHERE email = ? OR username = ?
      `,
      [email, username],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email or username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.execute(
      `
      INSERT INTO users
      (username, email, password, name)
      VALUES (?, ?, ?, ?)
      `,
      [username, email, hashedPassword, name],
    );

    // Generate JWT
    const token = jwt.sign(
      {
        id: result.insertId,
        email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: result.insertId,
        username,
        email,
        name,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

//Login admin
export async function loginAdmin(req, res) {
  try {
    const { username, password } = req.body;
    // VALIDATE INPUT

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // FIND USER

    const [userResult] = await db.execute(
      `
      SELECT *
      FROM users
      WHERE username = ? 
      LIMIT 1
      `,
      [username],
    );

    if (userResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult[0];

    // VERIFY PASSWORD

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // CREATE TOKEN

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // SET COOKIE

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // REMOVE PASSWORD
    delete user.password;

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user,
    });
  } catch (error) {
    console.log("Login Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
// GET LOGGED IN SCHOOL ADMIN

export async function getMe(req, res) {
  console.log(req.user);

  try {
    const userId = req.user.id;

    const [admins] = await db.execute(
      `
      SELECT *
      FROM users
      LIMIT 1
      `,
      [userId],
    );

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      admin: admins[0],
    });
  } catch (error) {
    console.log("Get Logged In Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
