import mongoose from "mongoose";

const gpsDataSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    required: true,
    unique: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  connectedStatus: {
    type: Boolean,
    default: true,
  },

  lastUpdated: {
    type: Date,
    default: Date.now,
    //expires: "1d", // Set TTL for 1 day (adjust as needed)
  },
});

// Create the TTL index for automatic deletion of older data
gpsDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

// Export the model using ES6 syntax
const GpsData = mongoose.model("GpsData", gpsDataSchema);
export default GpsData;
