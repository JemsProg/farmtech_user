// src/pages/Userdash.jsx
import React, { useState, useEffect, useMemo } from "react";
import "../css/Userdash.css";
import weatherIcon from "../images/cloudy.png";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
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

const pieColors = ["#4c6824", "#88a453", "#c8d6af", "#f4e285", "#f7b05b"];

export default function UserDash() {
  const navigate = useNavigate();

  // State
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [cropsFromDB, setCropsFromDB] = useState([]);
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [harvestRecords, setHarvestRecords] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState("Daily");

  // Soil data
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

  // 1) Check auth & load user location
  useEffect(() => {
    const uid = localStorage.getItem("user_uid");
    if (!uid) {
      navigate("/", { replace: true });
      return;
    }
    (async () => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.location) setSelectedLocation(data.location);
      }
    })();
  }, [navigate]);

  // 2) Fetch weather + crops + forecast
  useEffect(() => {
    const lat = 14.5995,
      lon = 120.9842;
    const apiKey = "50474bb45c7fbb1a8406456faa2dab7a";

    // weather + forecast
    (async () => {
      try {
        const [fRes, cRes] = await Promise.all([
          fetch(
            `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=10&appid=${apiKey}&units=metric`
          ),
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
          ),
        ]);
        const fJson = await fRes.json();
        if (fJson.list) setForecastData(fJson.list);
        const cJson = await cRes.json();
        setCurrentWeather(cJson);
      } catch (e) {
        console.error("Weather error:", e);
      }
    })();

    // cavite_crops
    (async () => {
      try {
        const snap = await getDocs(collection(db, "cavite_crops"));
        setCropsFromDB(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Crops error:", e);
      }
    })();
  }, []);

  // 3) Recommendations
  useEffect(() => {
    if (!forecastData.length || !cropsFromDB.length || !selectedLocation)
      return;
    const soil = locationSoilData[selectedLocation];
    if (!soil) return;
    const today = forecastData[0];
    const temp = today.temp?.day ?? 30;
    const humidity = today.humidity ?? 70;
    const rainfall = today.rain ?? 1200;

    const inRange = (v, [min, max]) => {
      const n = parseFloat(v);
      if (isNaN(n)) return false;
      const w = max - min;
      return n >= min - w * 0.5 && n <= max + w * 0.5;
    };

    const recs = cropsFromDB.filter((crop) => {
      const d = {
        N: +crop.N,
        P: +crop.P,
        K: +crop.K,
        ph: +crop.ph,
        temperature: +crop.temperature,
        humidity: +crop.humidity,
        rainfall: +crop.rainfall,
      };
      return (
        inRange(d.N, soil.N) &&
        inRange(d.P, soil.P) &&
        inRange(d.K, soil.K) &&
        inRange(d.ph, soil.pH) &&
        inRange(d.temperature, [temp - 100, temp + 100]) &&
        inRange(d.humidity, [humidity - 100, humidity + 100]) &&
        inRange(d.rainfall, [rainfall - 600, rainfall + 600])
      );
    });
    setRecommendedCrops(recs);
  }, [forecastData, cropsFromDB, selectedLocation]);

  // 4) Fetch harvest records
  useEffect(() => {
    const uid = localStorage.getItem("user_uid");
    if (!uid) return;
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "harvested_crops"), where("userId", "==", uid))
        );
        setHarvestRecords(snap.docs.map((d) => d.data()));
      } catch (e) {
        console.error("Harvest error:", e);
      }
    })();
  }, []);

  // 5) Aggregate by filterPeriod
  const aggregatedHarvestData = useMemo(() => {
    const now = new Date();
    const agg = {};
    harvestRecords.forEach((r) => {
      const d = new Date(r.harvestedDate);
      if (
        (filterPeriod === "Daily" && d.toDateString() !== now.toDateString()) ||
        (filterPeriod === "Weekly" && (now - d) / (1000 * 60 * 60 * 24) > 7) ||
        (filterPeriod === "Monthly" &&
          (d.getMonth() !== now.getMonth() ||
            d.getFullYear() !== now.getFullYear())) ||
        (filterPeriod === "Yearly" && d.getFullYear() !== now.getFullYear())
      )
        return;
      agg[r.cropName] = (agg[r.cropName] || 0) + r.harvestedKilos;
    });
    return Object.entries(agg).map(([crop, kilos]) => ({ crop, kilos }));
  }, [harvestRecords, filterPeriod]);

  const totalKilos = useMemo(
    () => aggregatedHarvestData.reduce((sum, e) => sum + e.kilos, 0),
    [aggregatedHarvestData]
  );

  const top5HarvestData = useMemo(
    () =>
      [...aggregatedHarvestData].sort((a, b) => b.kilos - a.kilos).slice(0, 5),
    [aggregatedHarvestData]
  );

  return (
    <>
      <div className="userdash-layout">
        <Navbar />
        <div className="userdash-main-content">
          <h1 className="userdash-title">Dashboard</h1>

          {/* Location selector */}
          <div className="userdash-location">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Choose Location</option>
              {Object.keys(locationSoilData).map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Current Weather + Forecast */}
          <div className="userdash-weather-content">
            <div className="userdash-weather-left">
              <p>Current Weather</p>
              <div className="userdash-weather-info">
                <img src={weatherIcon} alt="Weather" />
                <div className="userdash-info-text">
                  <h2>
                    {currentWeather
                      ? Math.round(currentWeather.main.temp)
                      : "--"}
                    °C
                  </h2>
                  <p>
                    {currentWeather
                      ? currentWeather.weather[0].description
                      : "Loading…"}
                  </p>
                </div>
              </div>
              {currentWeather && (
                <div className="userdash-weather-footer">
                  <div className="userdash-weather-row">
                    <div className="userdash-weather-details">
                      <h5>Wind</h5>
                      <p>{currentWeather.wind.speed} m/s</p>
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
                      <p>{(currentWeather.visibility / 1000).toFixed(1)} km</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="userdash-weather-right">
              <h3>10-day Forecast</h3>
              <div className="userdash-row-right">
                {forecastData.map((day, i) => {
                  const date = new Date(day.dt * 1000).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" }
                  );
                  const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
                  return (
                    <div key={i} className="userdash-right-details">
                      <label>{date}</label>
                      <img src={iconUrl} alt="" />
                      <p>{Math.round(day.temp.day)}°C</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recommendations */}
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
                style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
              >
                {recommendedCrops.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#fff",
                      padding: "16px",
                      borderRadius: "10px",
                      width: "260px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    <h3 style={{ color: "#4c6824", marginBottom: "10px" }}>
                      {c.label}
                    </h3>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter selector */}
          <div
            className="userdash-charts"
            style={{ display: "flex", gap: "40px", padding: "20px 0" }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: "#fff",
                padding: "1rem",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ color: "#4c6824", marginBottom: "10px" }}>Filter</h3>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Charts */}
          <div
            className="userdash-charts"
            style={{ display: "flex", gap: "40px", padding: "0 0 20px" }}
          >
            {/* Total Harvested */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ color: "#4c6824", marginBottom: "10px" }}>
                Total Harvested ({filterPeriod})
              </h3>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                {totalKilos.toFixed(2)} kg
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aggregatedHarvestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="kilos" fill="#4c6824" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top 5 Harvest Crops */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ color: "#4c6824", marginBottom: "10px" }}>
                Top 5 Harvested Crops ({filterPeriod})
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={top5HarvestData}
                    dataKey="kilos"
                    nameKey="crop"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {top5HarvestData.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={pieColors[idx % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Styles for animations & layout */}
      <style>
        {`
          .userdash-layout { display: flex; min-height: 100vh; }
          .userdash-main-content {
            flex: 1;
            padding: 20px;
            background-color: #f7f7f7;
            overflow-y: auto;
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </>
  );
}
