import React, { useState, useEffect } from "react";
import "../css/Userdash.css";
import tomato from "../images/tomato.jpg";
import garlic from "../images/garlic.jpg";
import bitter from "../images/bitter.jpg";
import cabbage from "../images/cabbage.jpg";
import kalabasa from "../images/kalabasa.jpg";
import mustasa from "../images/mustasa.jpg";
import weather from "../images/cloudy.png";
import Navbar from "../components/Navbar";

// firebase config
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase.js";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const harvestData = [
  { crop: "Tomato", kilos: 120 },
  { crop: "Garlic", kilos: 85 },
  { crop: "Cabbage", kilos: 60 },
  { crop: "Pumpkin", kilos: 40 },
  { crop: "Onion", kilos: 30 },
];

const pieColors = ["#4c6824", "#88a453", "#c8d6af", "#f4e285", "#f7b05b"];

export default function UserDash() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [cropsFromDB, setCropsFromDB] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      const lat = 14.5995;
      const lon = 120.9842;
      const apiKey = "50474bb45c7fbb1a8406456faa2dab7a";
      const cnt = 10;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=${cnt}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        if (data && data.list) {
          setForecastData(data.list);
        } else {
          console.error("Invalid forecast response", data);
        }
      } catch (error) {
        console.error("Error fetching forecast:", error);
      }
    };

    fetchForecast();
    fetchCropsFromDatabase();
  }, []);

  const fetchCropsFromDatabase = async () => {
    try {
      const snapshot = await getDocs(collection(db, "cavite_crops"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCropsFromDB(data);
    } catch (error) {
      console.error("Failed to fetch crops:", error);
    }
  };

  const matchRecommendedCrops = () => {
    const todayWeather = forecastData[0] || {};
    const temperature = todayWeather?.temp?.day ?? 30;
    const humidity = todayWeather?.humidity ?? 70;
    const rainfall = 1200; // Replace with sensor or API if available
    const ph = 6.0; // Replace with real value or sensor
    const N = 90; // Simulated sensor value
    const P = 60;
    const K = 80;

    const matches = cropsFromDB.filter((crop) => {
      const withinRange = (val, target) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= target - 20 && num <= target + 100;
      };

      return (
        withinRange(crop.N, N) &&
        withinRange(crop.P, P) &&
        withinRange(crop.K, K) &&
        withinRange(crop.temperature, temperature) &&
        withinRange(crop.humidity, humidity) &&
        withinRange(crop.rainfall, rainfall) &&
        withinRange(crop.ph, ph)
      );
    });

    setRecommendedCrops(matches);
  };

  useEffect(() => {
    if (cropsFromDB.length > 0 && forecastData.length > 0) {
      matchRecommendedCrops();
    }
  }, [cropsFromDB, forecastData]);

  const totalKilos = harvestData.reduce((sum, crop) => sum + crop.kilos, 0);

  return (
    <>
      <div className="userdash-layout">
        <Navbar />
        <div className="userdash-main-content">
          <h1 className="userdash-title">Dashboard</h1>
          <div className="userdash-location">
            <select name="location" id="location">
              <option value="Alfonso">Alfonso</option>
              <option value="Amadeo">Amadeo</option>
              <option value="Bacoor">Bacoor</option>
              <option value="Carmona">Carmona</option>
              <option value="Cavite City">Cavite City</option>
              <option value="Dasmariñas">Dasmariñas</option>
              <option value="General Emilio Aguinaldo">
                General Emilio Aguinaldo
              </option>
              <option value="General Mariano Alvarez">
                General Mariano Alvarez
              </option>
              <option value="General Trias">General Trias</option>
              <option value="Imus">Imus</option>
              <option value="Indang">Indang</option>
              <option value="Kawit">Kawit</option>
              <option value="Magallanes">Magallanes</option>
              <option value="Maragondon">Maragondon</option>
              <option value="Mendez">Mendez</option>
              <option value="Naic">Naic</option>
              <option value="Noveleta">Noveleta</option>
              <option value="Rosario">Rosario</option>
              <option value="Silang">Silang</option>
              <option value="Tagaytay">Tagaytay</option>
              <option value="Tanza">Tanza</option>
              <option value="Ternate">Ternate</option>
              <option value="Trece Martires">Trece Martires</option>
            </select>
          </div>

          <div className="userdash-weather-content">
            <div className="userdash-weather-left">
              <p>Current Weather</p>
              <div className="userdash-weather-info">
                <img src={weather} alt="" />
                <div className="userdash-info-text">
                  <h2>
                    33 <span>°C</span>
                  </h2>
                  <p>Partly Sunny</p>
                </div>
              </div>
              <div className="userdash-weather-footer">
                <div className="userdash-weather-row">
                  <div className="userdash-weather-details">
                    <h5>Air Quality</h5>
                    <p>33</p>
                  </div>
                  <div className="userdash-weather-details">
                    <h5>Wind</h5>
                    <p>3 mph</p>
                  </div>
                  <div className="userdash-weather-details">
                    <h5>Humidity</h5>
                    <p>76%</p>
                  </div>
                  <div className="userdash-weather-details">
                    <h5>Feels like</h5>
                    <p>48°</p>
                  </div>
                </div>
                <div className="userdash-weather-row">
                  <div className="userdash-weather-details">
                    <h5>Visibility</h5>
                    <p>9.9 mi</p>
                  </div>
                  <div className="userdash-weather-details">
                    <h5>UV index</h5>
                    <p>0</p>
                  </div>
                  <div className="userdash-weather-details">
                    <h5>Pressure</h5>
                    <p>29.98 in</p>
                  </div>
                  <div className="userdash-weather-details">
                    <h5>Dew point</h5>
                    <p>43°</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="userdash-weather-right">
              <h3>10-day Weather Forecast</h3>
              <h4>Day</h4>
              <div className="userdash-row-right">
                {forecastData.map((day, index) => {
                  const date = new Date(day.dt * 1000).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  );
                  const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
                  return (
                    <div
                      className="userdash-right-details"
                      key={`day-${index}`}
                    >
                      <label>{date}</label>
                      <img src={iconUrl} alt={day.weather[0].description} />
                      <p>{Math.round(day.temp.day)}°C</p>
                    </div>
                  );
                })}
              </div>

              <h4>Night</h4>
              <div className="userdash-row-right">
                {forecastData.map((day, index) => {
                  const date = new Date(day.dt * 1000).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  );
                  const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
                  return (
                    <div
                      className="userdash-right-details"
                      key={`night-${index}`}
                    >
                      <label>{date}</label>
                      <img src={iconUrl} alt={day.weather[0].description} />
                      <p>{Math.round(day.temp.night)}°C</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="userdash-recommendation-content">
            <h2>Recommendation</h2>
            <p>
              Based on matching NPK, temperature, humidity, rainfall, and pH
            </p>

            {recommendedCrops.length === 0 ? (
              <p>No matching crops found.</p>
            ) : (
              <div
                className="userdash-crops-list"
                style={{ gap: "20px", flexWrap: "wrap", display: "flex" }}
              >
                {recommendedCrops.map((crop, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#fff",
                      padding: "16px",
                      borderRadius: "10px",
                      width: "260px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <h3 style={{ color: "#4c6824", marginBottom: "10px" }}>
                      {crop.label}
                    </h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="userdash-charts" style={{ display: "flex", gap: "40px" }}>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "10px", color: "#4c6824" }}>
            Total Harvested (kg)
          </h3>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#333",
            }}
          >
            {totalKilos} kg
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={harvestData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="kilos" fill="#4c6824" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "30px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "20px", color: "#4c6824" }}>
            Top 5 Harvest Crops
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={harvestData}
                dataKey="kilos"
                nameKey="crop"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {harvestData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showModal && selectedCrop && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "30px",
              width: "400px",
              maxWidth: "90%",
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
              textAlign: "center",
              animation: "scaleIn 0.3s ease",
            }}
          >
            <img
              src={selectedCrop.image}
              alt={selectedCrop.name}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            />
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
              <strong>{selectedCrop.name}</strong> ({selectedCrop.type})
            </h3>
            <p style={{ fontWeight: "bold" }}>Best Time/ Season to plant:</p>
            <p style={{ marginBottom: "20px" }}>{selectedCrop.season}</p>
            <button
              onClick={handleCloseModal}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4c6824",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          .userdash-layout {
            display: flex;
            min-height: 100vh;
          }

          .userdash-main-content {
            flex: 1;
            padding: 20px;
            background-color: #f7f7f7;
            overflow-y: auto;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </>
  );
}
