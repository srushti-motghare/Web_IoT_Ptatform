import React, { useEffect, useState } from "react";
import axios from "axios";
import CattleNodes from "../components/CattleNodes";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Function to generate a random color
const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random HEX color
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

function Dashboard() {
  const [locations, setLocations] = useState([]);
  const [nodeColors, setNodeColors] = useState({}); // Store nodeId-color pairs
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default center
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchGpsData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/getgps`
        );
        const data = response.data;
        console.log("FetchGPSData", response.data);

        // Assign random colors to nodes if not already set
        setNodeColors((prevColors) => {
          const newColors = { ...prevColors };
          data.forEach((node) => {
            if (!newColors[node.nodeId]) {
              newColors[node.nodeId] = generateRandomColor();
            }
          });
          return newColors;
        });

        // Update locations
        setLocations(data);

        // Calculate the center dynamically as the average latitude and longitude
        if (data.length > 0) {
          const avgLat =
            data.reduce((sum, loc) => sum + loc.latitude, 0) / data.length;
          const avgLng =
            data.reduce((sum, loc) => sum + loc.longitude, 0) / data.length;
          setMapCenter({ lat: avgLat, lng: avgLng });
        }
      } catch (err) {
        console.error("Error fetching GPS data:", err.message);
      }
    };

    fetchGpsData();
    const interval = setInterval(fetchGpsData, 10000); // Fetch every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    console.log("Logged out");
    setDropdownOpen(false); // Close the dropdown
  };

  return (
    <div>
      {/* User Icon Container */}
      <div className="absolute top-8 right-5 flex items-center">
        <div
          className="flex items-center space-x-2 mr-8 p-2 rounded-2xl w-24 cursor-pointer bg-gray-400"
          onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
        >
          <div className="w-6 h-6 bg-white rounded-full flex justify-center items-center text-xs ">
            👤 {/* User icon */}
          </div>
        </div>
        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-2  bg-white shadow-lg rounded-md z-10">
            <div className="px-1 py-1 text-gray-700 flex items-center space-x-1">
              <div>👤</div>
              <span>Profile</span>
            </div>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div>
        <div className="mt-12 flex p-5 md:flex-row flex-wrap md:justify-start md:mx-12 justify-center">
          {locations.map((node) => (
            <CattleNodes
              key={node.nodeId}
              nodeData={node}
              borderColor={nodeColors[node.nodeId]} // Pass the color to CattleNodes
            />
          ))}
        </div>
      </div>
      <div className="mx-12 p-5">
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        >
          <div
            className="shadow-lg rounded-xl overflow-hidden"
            style={{ width: "100%", height: "400px" }} // Ensures the wrapper matches map dimensions
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter} // Use dynamic center
              zoom={19}
            >
              {/* Render markers for all cattle nodes */}
              {locations.map((node) => (
                <Marker
                  key={node.nodeId}
                  position={{ lat: node.latitude, lng: node.longitude }}
                  label={{
                    color: nodeColors[node.nodeId], // Marker label color
                  }}
                  icon={{
                    path: "M 0,0 C 0,-15 12,-25 0,-40 C -12,-25 0,-15 0,0 Z", // Inverted water drop shape
                    fillColor: nodeColors[node.nodeId], // Use random color
                    fillOpacity: 1,
                    scale: 1, // Scale of the marker
                    strokeWeight: 1,
                    strokeColor: "#000", // Black stroke for the outline
                  }}
                />
              ))}
            </GoogleMap>
          </div>
        </LoadScript>
      </div>
    </div>
  );
}

export default Dashboard;
