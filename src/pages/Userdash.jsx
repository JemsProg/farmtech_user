import React, { useState, useEffect } from "react";
import "../css/Userdash.css";
import weather from "../images/cloudy.png";
import Navbar from "../components/Navbar";

// firebase config
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

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
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);

  const locationSoilData = {
    Alfonso: {
      N: [44.6, 49.6],
      P: [19.2, 29.2],
      K: [91.3, 121.3],
      pH: [5.9, 6.5],
    },
    Amadeo: {
      N: [44.2, 49.2],
      P: [17.9, 27.9],
      K: [111.7, 141.7],
      pH: [5.5, 6.1],
    },
    Bacoor: {
      N: [51.1, 56.1],
      P: [15.9, 25.9],
      K: [76.0, 106.0],
      pH: [5.9, 6.5],
    },
    Carmona: {
      N: [46.3, 51.3],
      P: [17.2, 27.2],
      K: [102.5, 132.5],
      pH: [5.9, 6.5],
    },
    "Cavite City": {
      N: [44.4, 49.4],
      P: [22.6, 32.6],
      K: [110.8, 140.8],
      pH: [5.8, 6.4],
    },
    Dasmariñas: {
      N: [44.6, 49.6],
      P: [20.3, 30.3],
      K: [123.2, 153.2],
      pH: [5.7, 6.3],
    },
    "General Emilio Aguinaldo": {
      N: [43.0, 48.0],
      P: [22.1, 32.1],
      K: [124.6, 154.6],
      pH: [5.7, 6.3],
    },
    "General Mariano Alvarez": {
      N: [45.4, 50.4],
      P: [22.7, 32.7],
      K: [78.8, 108.8],
      pH: [6.4, 7.0],
    },
    "General Trias": {
      N: [51.1, 56.1],
      P: [26.9, 36.9],
      K: [95.0, 125.0],
      pH: [5.8, 6.4],
    },
    Imus: {
      N: [42.5, 47.5],
      P: [20.3, 30.3],
      K: [87.3, 117.3],
      pH: [5.3, 5.9],
    },
    Indang: {
      N: [44.7, 49.7],
      P: [24.1, 34.1],
      K: [109.4, 139.4],
      pH: [6.4, 7.0],
    },
    Kawit: {
      N: [43.3, 48.3],
      P: [19.1, 29.1],
      K: [119.5, 149.5],
      pH: [6.1, 6.7],
    },
    Magallanes: {
      N: [45.6, 50.6],
      P: [22.0, 32.0],
      K: [117.2, 147.2],
      pH: [5.3, 5.9],
    },
    Maragondon: {
      N: [51.2, 56.2],
      P: [29.6, 39.6],
      K: [96.5, 126.5],
      pH: [5.3, 5.9],
    },
    Mendez: {
      N: [45.5, 50.5],
      P: [29.9, 39.9],
      K: [110.2, 140.2],
      pH: [5.3, 5.9],
    },
    Naic: {
      N: [43.5, 48.5],
      P: [20.2, 30.2],
      K: [116.9, 146.9],
      pH: [6.1, 6.7],
    },
    Noveleta: {
      N: [46.2, 51.2],
      P: [19.0, 29.0],
      K: [83.6, 113.6],
      pH: [5.9, 6.5],
    },
    Rosario: {
      N: [43.5, 48.5],
      P: [22.7, 32.7],
      K: [110.1, 140.1],
      pH: [5.6, 6.2],
    },
    Silang: {
      N: [45.4, 50.4],
      P: [21.2, 31.2],
      K: [96.5, 126.5],
      pH: [6.2, 6.8],
    },
    Tagaytay: {
      N: [44.6, 49.6],
      P: [18.2, 28.2],
      K: [77.7, 107.7],
      pH: [6.5, 7.1],
    },
    Tanza: {
      N: [42.7, 47.7],
      P: [25.7, 35.7],
      K: [114.2, 144.2],
      pH: [5.6, 6.2],
    },
    Ternate: {
      N: [50.2, 55.2],
      P: [15.8, 25.8],
      K: [109.0, 139.0],
      pH: [5.4, 6.0],
    },
    "Trece Martires": {
      N: [47.8, 52.8],
      P: [18.6, 28.6],
      K: [120.0, 150.0],
      pH: [5.4, 6.0],
    },
    Owase: {
      N: [42.5, 47.5],
      P: [25.4, 35.4],
      K: [93.5, 123.5],
      pH: [5.4, 6.0],
    },
  };

  useEffect(() => {
    const uid = localStorage.getItem("user_uid");
    console.log(uid);
    if (!uid) return;

    const fetchUserLocation = async () => {
      try {
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const user = snap.data();
          if (user.location) {
            setSelectedLocation(user.location);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user location:", error);
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    const fetchForecast = async () => {
      const lat = 14.5995;
      const lon = 120.9842;
      const apiKey = "50474bb45c7fbb1a8406456faa2dab7a";

      try {
        // 1. Fetch 10-day forecast
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=10&appid=${apiKey}&units=metric`
        );
        const forecastData = await forecastRes.json();
        if (forecastData?.list) {
          setForecastData(forecastData.list);
        }

        // 2. Fetch current weather
        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const currentData = await currentRes.json();
        if (currentData) {
          setCurrentWeather(currentData);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
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

  const inRange = (value, [min, max]) => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;

    const rangeWidth = max - min;
    const softMin = min - rangeWidth * 0.3; // Allow 30% below
    const softMax = max + rangeWidth * 0.3; // Allow 30% above

    return num >= softMin && num <= softMax;
  };

  const matchRecommendedCrops = () => {
    const todayWeather = forecastData[0] || {};
    const temperature = todayWeather?.temp?.day ?? 30;
    const humidity = todayWeather?.humidity ?? 70;
    const rainfall = todayWeather?.rain ?? 1200;

    const soil = locationSoilData[selectedLocation]; // ← from previous instruction
    if (!soil) return;

    console.log(selectedLocation);

    const matches = cropsFromDB.filter((crop) => {
      console.log("Checking crop:", crop.label, {
        N: crop.N,
        matchN: inRange(crop.N, soil.N),
        P: crop.P,
        matchP: inRange(crop.P, soil.P),
        K: crop.K,
        matchK: inRange(crop.K, soil.K),
        pH: crop.ph,
        matchPH: inRange(crop.ph, soil.pH),
        temperature: crop.temperature,
        matchTemp: inRange(crop.temperature, [
          temperature - 10,
          temperature + 10,
        ]),
        humidity: crop.humidity,
        matchHumidity: inRange(crop.humidity, [humidity - 10, humidity + 10]),
        rainfall: crop.rainfall,
        matchRainfall: inRange(crop.rainfall, [rainfall - 200, rainfall + 200]),
      });

      const parsedCrop = {
        ...crop,
        N: parseFloat(crop.N),
        P: parseFloat(crop.P),
        K: parseFloat(crop.K),
        ph: parseFloat(crop.ph),
        temperature: parseFloat(crop.temperature),
        humidity: parseFloat(crop.humidity),
        rainfall: parseFloat(crop.rainfall),
      };

      return (
        inRange(crop.N, soil.N) &&
        inRange(crop.P, soil.P) &&
        inRange(crop.K, soil.K) &&
        inRange(crop.ph, soil.pH) &&
        inRange(parsedCrop.temperature, [temperature - 10, temperature + 10]) &&
        inRange(parsedCrop.humidity, [humidity - 10, humidity + 10]) &&
        inRange(parsedCrop.rainfall, [rainfall - 200, rainfall + 200])
      );
    });

    setRecommendedCrops(matches);
  };

  useEffect(() => {
    if (cropsFromDB.length > 0 && forecastData.length > 0 && selectedLocation) {
      matchRecommendedCrops();
    }
  }, [cropsFromDB, forecastData, selectedLocation]);

  const totalKilos = harvestData.reduce((sum, crop) => sum + crop.kilos, 0);

  return (
    <>
      <div className="userdash-layout">
        <Navbar />
        <div className="userdash-main-content">
          <h1 className="userdash-title">Dashboard</h1>
          <div className="userdash-location">
            <select
              name="location"
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
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
                  {currentWeather && currentWeather.main && (
                    <div className="userdash-weather-footer">
                      <div className="userdash-weather-row">
                        <div className="userdash-weather-details">
                          <h5>Wind</h5>
                          <p>{currentWeather.wind?.speed} m/s</p>
                        </div>
                        <div className="userdash-weather-details">
                          <h5>Humidity</h5>
                          <p>{currentWeather.main.humidity}%</p>
                        </div>
                        <div className="userdash-weather-details">
                          <h5>Feels like</h5>
                          <p>{Math.round(currentWeather.main.feels_like)}°C</p>
                        </div>
                        <div className="userdash-weather-details">
                          <h5>Pressure</h5>
                          <p>{currentWeather.main.pressure} hPa</p>
                        </div>
                        <div className="userdash-weather-details">
                          <h5>Visibility</h5>
                          <p>
                            {(currentWeather.visibility / 1000).toFixed(1)} km
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
