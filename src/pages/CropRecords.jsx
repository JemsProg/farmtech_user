import React, { useState } from "react";
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
import "../css/CropRecords.css";

export default function CropRecords() {
  const [items, setItems] = useState([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [totalHarvested, setTotalHarvested] = useState("");
  const [totalPlanted, setTotalPlanted] = useState("");
  const [desiredMargin, setDesiredMargin] = useState("");

  const [srp, setSrp] = useState(0);
  const [roi, setRoi] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [profit, setProfit] = useState(0);
  const [cropLossQty, setCropLossQty] = useState(0);
  const [cropLossValue, setCropLossValue] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [chartData, setChartData] = useState([]);

  const totalSpent = items.reduce((acc, item) => acc + item.price, 0);

  const handleAddItem = () => {
    if (productName && price) {
      setItems([...items, { name: productName, price: parseFloat(price) }]);
      setProductName("");
      setPrice("");
    }
  };

  const calculateROI = () => {
    const planted = parseFloat(totalPlanted) || 0;
    const harvested = parseFloat(totalHarvested) || 0;
    const margin = parseFloat(desiredMargin) || 0;

    if (harvested === 0) return;

    const calculatedSrp = (totalSpent / harvested) * (1 + margin / 100);
    const earnings = calculatedSrp * harvested;
    const calculatedProfit = earnings - totalSpent;
    const calculatedRoi = ((earnings - totalSpent) / totalSpent) * 100;
    const cropLoss = planted - harvested;
    const lossValue = cropLoss * calculatedSrp;
    const eff = planted !== 0 ? (harvested / planted) * 100 : 0;

    setSrp(calculatedSrp);
    setTotalEarnings(earnings);
    setProfit(calculatedProfit);
    setRoi(calculatedRoi);
    setCropLossQty(cropLoss);
    setCropLossValue(lossValue);
    setEfficiency(eff);

    // generate chart points
    const points = [];
    const min = calculatedSrp * 0.8;
    const max = calculatedSrp * 1.2;
    const step = (max - min) / 10;
    for (let s = min; s <= max; s += step) {
      const pointEarnings = s * harvested;
      const pointRoi = ((pointEarnings - totalSpent) / totalSpent) * 100;
      points.push({
        sales: parseFloat(s.toFixed(2)),
        roi: parseFloat(pointRoi.toFixed(2)),
      });
    }
    setChartData(points);
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
            <div className="calc-inputs">
              <label>Product Name</label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />

              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <button className="add-btn" onClick={handleAddItem}>
                +
              </button>
            </div>

            <div className="calc-spent-box">
              <h4>Items</h4>
              <ul>
                {items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} - ₱ {item.price.toLocaleString()}
                  </li>
                ))}
              </ul>
              <p className="total-spent">
                Total Spent: ₱ {totalSpent.toLocaleString()}
              </p>
            </div>

            <div className="calc-other-inputs">
              <label>Total Crop Planted</label>
              <input
                type="number"
                value={totalPlanted}
                onChange={(e) => setTotalPlanted(e.target.value)}
              />
              <label>Total Crop Harvested</label>
              <input
                type="number"
                value={totalHarvested}
                onChange={(e) => setTotalHarvested(e.target.value)}
              />
              <label>Desired Profit Margin (%)</label>
              <input
                type="number"
                value={desiredMargin}
                onChange={(e) => setDesiredMargin(e.target.value)}
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
              <p>Total Spending: ₱{totalSpent.toFixed(2)}</p>
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
