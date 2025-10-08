

// // controllers/attendantcontroller.js
// import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import User from "../models/attendant.js";

// // Helper to create JWT
// const generateToken = (user) =>
//   jwt.sign(
//     { id: user._id, email: user.email, role: user.role, substation: user.substation },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

// // ✅ SIGNUP
// export const signup = async (req, res) => {
//   try {
//     let { name, email, password, substation } = req.body;
//     email = (email || "").toLowerCase();

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Name, email and password are required" });
//     }

//     // If substation is not a valid ObjectId (e.g., "0", "", undefined), store null
//     if (!mongoose.isValidObjectId(substation)) {
//       substation = null;
//     }

//     const exists = await User.findOne({ email });
//     if (exists) {
//       return res.status(409).json({ message: "Email already exists" });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: "attendant",
//       substation, // valid ObjectId or null
//     });

//     const token = generateToken(user);

//     return res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         substation: user.substation,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Signup failed:", err);
//     // Duplicate key safety
//     if (err?.code === 11000) {
//       return res.status(409).json({ message: "Email already exists" });
//     }
//     return res.status(500).json({ message: "Signup failed", error: err.message });
//   }
// };

// // ✅ LOGIN
// export const login = async (req, res) => {
//   try {
//     let { email, password } = req.body;
//     email = (email || "").toLowerCase();

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = generateToken(user);

//     return res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         substation: user.substation,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Login failed:", err);
//     return res.status(500).json({ message: "Login failed", error: err.message });
//   }
// };

// // ✅ GET ALL ATTENDANTS (protected; typically for managers)
// export const getAllAttendants = async (req, res) => {
//   try {
//     const attendants = await User.find({ role: "attendant" })
//       .populate("substation", "name location")
//       .select("name email role substation");
//     return res.status(200).json(attendants);
//   } catch (err) {
//     console.error("❌ Error fetching attendants:", err);
//     return res.status(500).json({ error: "Failed to fetch attendants" });
//   }
// };


// controllers/attendantcontroller.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/attendant.js";
import Substation from "../models/substation.js"; // must be default export

// Helper to create JWT
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role, substation: user.substation },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

// ----------------- SIGNUP -----------------
export const signup = async (req, res) => {
  try {
    let { name, email, password, substation } = req.body;
    email = (email || "").toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // check existing email
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    // Resolve substation -> Substation._id
    let substationId = null;
    if (substation !== undefined && substation !== null && String(substation).trim() !== "") {
      const raw = String(substation).trim();

      // 1) if valid ObjectId, use it
      if (mongoose.isValidObjectId(raw)) {
        substationId = raw;
      } else {
        // 2) try numeric code
        const maybeNum = Number(raw);
        if (!Number.isNaN(maybeNum)) {
          const byCode = await Substation.findOne({ code: maybeNum }).select("_id");
          if (byCode) substationId = byCode._id;
        }

        // 3) try name
        if (!substationId) {
          const byName = await Substation.findOne({ name: raw }).select("_id");
          if (byName) substationId = byName._id;
        }

        // 4) if still not found, create a new substation document
        if (!substationId) {
          const newSub = await Substation.create({
            code: !Number.isNaN(Number(raw)) ? Number(raw) : undefined,
            name: raw,
            location: "Unknown",
            temperature: 0,
            attendants: [],
          });
          substationId = newSub._id;
        }
      }
    }

    // create user with resolved substationId
    const user = await User.create({
      name,
      email,
      password,
      role: "attendant",
      substation: substationId,
    });

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        substation: user.substation,
      },
    });
  } catch (err) {
    console.error("❌ Signup failed:", err);
    if (err?.code === 11000) return res.status(409).json({ message: "Email already exists" });
    return res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// ----------------- LOGIN -----------------
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = (email || "").toLowerCase();

    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        substation: user.substation,
      },
    });
  } catch (err) {
    console.error("❌ Login failed:", err);
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// ----------------- GET ALL ATTENDANTS -----------------
export const getAllAttendants = async (req, res) => {
  try {
    const attendants = await User.find({ role: "attendant" })
      .populate("substation", "name location code")
      .select("name email role substation");
    return res.status(200).json(attendants);
  } catch (err) {
    console.error("❌ Error fetching attendants:", err);
    return res.status(500).json({ error: "Failed to fetch attendants" });
  }
};
