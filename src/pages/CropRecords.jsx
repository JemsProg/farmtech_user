import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";
import LotsNavbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../css/CropRecords.css";

export default function CropRecords() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("user_uid");
    if (!uid) {
      navigate("/", { replace: true });
      return;
    }

    setUserId(uid);
  }, [navigate]);

  const [totalPlanted, setTotalPlanted] = useState("");
  const [totalHarvested, setTotalHarvested] = useState("");
  const [totalSpending, setTotalSpending] = useState("");
  const [desiredMargin, setDesiredMargin] = useState("");

  const [srp, setSrp] = useState(0);
  const [roi, setRoi] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [profit, setProfit] = useState(0);
  const [cropLossQty, setCropLossQty] = useState(0);
  const [cropLossValue, setCropLossValue] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [chartData, setChartData] = useState([]);

  const calculateROI = () => {
    const planted = parseFloat(totalPlanted) || 0;
    const harvested = parseFloat(totalHarvested) || 0;
    const margin = parseFloat(desiredMargin) || 0;
    const spent = parseFloat(totalSpending) || 0;

    if (harvested === 0 || spent === 0) {
      alert("Please enter non-zero values for harvested and spending.");
      return;
    }

    // 1. SRP = total spending × (1 + margin/100) ÷ total harvested
    const calculatedSrp = (spent * (1 + margin / 100)) / harvested;
    // 2. Total Earning = SRP × total harvested
    const earnings = calculatedSrp * harvested;
    // 3. Profit = Total Earning − Total Spending
    const calculatedProfit = earnings - spent;
    // 4. ROI = (Profit ÷ Total Spending) × 100
    const calculatedRoi = (calculatedProfit / spent) * 100;
    // 5. Crop Loss = Total Planted − Total Harvested
    const lossQty = planted - harvested;
    // 6. Loss Value = Crop Loss × SRP
    const lossValue = lossQty * calculatedSrp;
    // 7. Harvest Efficiency = (Total Harvested ÷ Total Planted) × 100
    const eff = planted > 0 ? (harvested / planted) * 100 : 0;

    setSrp(calculatedSrp);
    setTotalEarnings(earnings);
    setProfit(calculatedProfit);
    setRoi(calculatedRoi);
    setCropLossQty(lossQty);
    setCropLossValue(lossValue);
    setEfficiency(eff);

    // generate chart points around SRP ±20%
    const pts = [];
    const min = calculatedSrp * 0.8;
    const max = calculatedSrp * 1.2;
    const step = (max - min) / 10;
    for (let s = min; s <= max; s += step) {
      const ptEarnings = s * harvested;
      const ptRoi = ((ptEarnings - spent) / spent) * 100;
      pts.push({
        sales: parseFloat(s.toFixed(2)),
        roi: parseFloat(ptRoi.toFixed(2)),
      });
    }
    setChartData(pts);
  };

  return (
    <div className="crop-records-container">
      <LotsNavbar />
      <div className="crop-records-content">
        <h2>Crop Records</h2>
        <div className="crop-records-sections">
          {/* Chart Section */}
          <div className="chart-section">
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey="sales" name="SRP (₱)" unit="₱" />
                <YAxis type="number" dataKey="roi" name="ROI (%)" unit="%" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="ROI" data={chartData} fill="#3366cc" />
                <Line
                  type="monotone"
                  dataKey="roi"
                  data={chartData}
                  stroke="#dd6666"
                  dot={false}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Calculator Section */}
          <div className="calc-section">
            <div className="calc-other-inputs">
              <label>Total Crop Planted</label>
              <input
                type="number"
                value={totalPlanted}
                onChange={(e) => setTotalPlanted(e.target.value)}
                placeholder="e.g. 1000"
              />

              <label>Total Crop Harvested</label>
              <input
                type="number"
                value={totalHarvested}
                onChange={(e) => setTotalHarvested(e.target.value)}
                placeholder="e.g. 850"
              />

              <label>Total Spending (₱)</label>
              <input
                type="number"
                value={totalSpending}
                onChange={(e) => setTotalSpending(e.target.value)}
                placeholder="e.g. 50000"
              />

              <label>Desired Profit Margin (%)</label>
              <input
                type="number"
                value={desiredMargin}
                onChange={(e) => setDesiredMargin(e.target.value)}
                placeholder="e.g. 20"
              />
            </div>

            <button className="calc-btn" onClick={calculateROI}>
              Calculate
            </button>

            {/* Summary Section */}
            <div className="summary-box">
              <h4>Summary</h4>
              <p>Suggested Retail Price (SRP): ₱{srp.toFixed(2)}</p>
              <p>Total Earnings: ₱{totalEarnings.toFixed(2)}</p>
              <p>
                Total Spending: ₱{parseFloat(totalSpending || 0).toFixed(2)}
              </p>
              <p>Profit: ₱{profit.toFixed(2)}</p>
              <p>ROI: {roi.toFixed(2)}%</p>
              <p>Crop Loss: {cropLossQty.toFixed(2)} units</p>
              <p>Loss Value: ₱{cropLossValue.toFixed(2)}</p>
              <p>Harvest Efficiency: {efficiency.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
