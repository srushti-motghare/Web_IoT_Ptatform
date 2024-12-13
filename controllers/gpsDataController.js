import GpsData from "../models/gpsData.js";

let lastSavedLocation = { latitude: null, longitude: null };
const DISTANCE_THRESHOLD = 0.0001; // Adjust threshold based on your requirements

// Helper to check if location update meets threshold
const hasSignificantChange = (newLat, newLng) => {
  const { latitude, longitude } = lastSavedLocation;
  return (
    !latitude ||
    !longitude ||
    Math.abs(newLat - latitude) > DISTANCE_THRESHOLD ||
    Math.abs(newLng - longitude) > DISTANCE_THRESHOLD
  );
};

// Save GPS data (only if significant change in location)
export const postGPSData = async (req, res) => {
  try {
    const { nodeId, latitude, longitude, connectedStatus } = req.body;

    if (!nodeId || !latitude || !longitude || connectedStatus === undefined) {
      return res.status(400).json({ message: "Invalid or missing data" });
    }

    const existingNode = await GpsData.findOne({ nodeId });

    if (existingNode) {
      // Update existing node
      existingNode.latitude = latitude;
      existingNode.longitude = longitude;
      existingNode.connectedStatus = connectedStatus;
      await existingNode.save();

      return res.json({ message: "GPS data updated", gpsData: existingNode });
    } else {
      // Create new node
      const gpsData = new GpsData({
        nodeId,
        latitude,
        longitude,
        connectedStatus,
      });
      await gpsData.save();

      return res.json({ message: "GPS data saved", gpsData });
    }
  } catch (error) {
    console.error("Error saving GPS data:", error);
    res.status(500).json({ message: "Error saving GPS data", error });
  }
};

// Fetch recent GPS data for display
export const getGPSData = async (req, res) => {
  try {
    const gpsData = await GpsData.find().sort({ timestamp: -1 }); // Fetch latest 10 points
    res.json(gpsData);
  } catch (error) {
    console.error("Error fetching GPS data:", error);
    res.status(500).json({ message: "Error fetching GPS data", error });
  }
};
export const getNodeById = async (req, res) => {
  try {
    const { nodeId } = req.params;

    if (!nodeId) {
      return res.status(400).json({ message: "nodeId is required." });
    }

    const node = await GpsData.findOne({ nodeId });

    if (!node) {
      return res.status(404).json({ message: "Node not found." });
    }

    return res.status(200).json(node);
  } catch (error) {
    console.error("Error fetching node by ID:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
