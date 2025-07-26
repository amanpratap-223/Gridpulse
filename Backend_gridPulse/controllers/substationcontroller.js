import { Substation } from "../models/powerData.js";

// ✅ Create a new substation
export const createSubstation = async (req, res) => {
  try {
    const { name, location, temperature } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required" });
    }

    const exists = await Substation.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Substation already exists" });
    }

    const substation = await Substation.create({
      name,
      location,
      temperature: temperature || 0,
      attendants: [] // Initially no attendants
    });

    res.status(201).json({ message: "Substation created", substation });
  } catch (error) {
    console.error("Error creating substation:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Fetch all substations
export const getAllSubstations = async (req, res) => {
  try {
    const substations = await Substation.find().select("name location");
    res.status(200).json(substations);
  } catch (error) {
    console.error("Error fetching substations:", error.message);
    res.status(500).json({ message: "Failed to fetch substations" });
  }
};
