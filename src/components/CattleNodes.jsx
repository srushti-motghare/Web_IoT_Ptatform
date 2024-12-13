import React from "react";
import { FaBatteryFull, FaCircle } from "react-icons/fa";
import marker from "../images/marker.jpg";

const CattleNodes = ({ nodeData, borderColor }) => {
  return (
    <div className="md:flex-row justify-center">
      {/* Node container */}
      <div
        className="relative w-48 h-48 mx-2 rounded-lg overflow-hidden"
        style={{ border: `6px solid ${borderColor}` }} // Apply dynamic border color
      >
        {/* Background Image */}
        <img
          src={marker}
          alt={`Node ${nodeData._id}`}
          className="w-full h-full object-cover"
        />

        {/* Battery Icon (Top-right corner) */}
        <div className="absolute top-2 right-1 p-1">
          <FaBatteryFull
            className="text-green-500 transform -rotate-90" // Rotate 90 degrees counterclockwise
            size={32} // Adjust size if needed
          />
        </div>

        {/* Connection Status (Bottom-left corner) */}
        <div className="absolute bottom-1 left-2 flex items-center">
          <FaCircle
            className={
              nodeData.connectedStatus ? "text-green-500" : "text-red-500"
            }
            size={12}
          />
          <span className="text-xs text-black px-2 py-1 rounded">
            {nodeData.connectedStatus ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Node ID */}
      <span className="block text-center mt-2 text-gray-800">
        {nodeData.nodeId}
      </span>
    </div>
  );
};

export default CattleNodes;
