import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [timeRange, setTimeRange] = useState('30days');
  const [dueDate, setDueDate] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const categoryResponse = await fetch('http://localhost:3001/api/categories');
      const categories = await categoryResponse.json();
      
      const inventoryResponse = await fetch('http://localhost:3001/api/inventory');
      const inventory = await inventoryResponse.json();
      setInventoryData(inventory);

      const salesResponse = await fetch('http://localhost:3001/api/sales');
      const sales = await salesResponse.json();

      // Calculate total sales per category
      const categorySales = categories.map(category => {
        const itemsInCategory = inventory.filter(item => item.category_id === category.category_id);
        const totalSales = itemsInCategory.reduce((sum, item) => {
          const itemSales = sales.filter(sale => sale.item_id === item.item_id);
          const itemTotal = itemSales.reduce((itemSum, sale) => itemSum + (sale.quantity || 0) * (sale.sale_price || 0), 0);
          return sum + itemTotal;
        }, 0);
        return { category: category.name, sales: totalSales };
      });

      setTotalRevenue(categorySales.reduce((sum, category) => sum + category.sales, 0));
      setSalesData(categorySales);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please check your server.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const data = {
    labels: salesData.map(entry => entry.category),
    datasets: [
      {
        label: 'Sales by Category',
        data: salesData.map(entry => entry.sales),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">TrackNTrade</div>
        <div className="dashboard-title">DashBoard</div>
        <div className="user-profile">
          <span>Name</span>
          <div className="profile-picture"></div>
        </div>
      </header>

      <div className="inventory-order">
        <span>Next Inventory Order Due: </span>
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          dateFormat="MM/dd/yyyy"
          placeholderText="Select Due Date"
          className="date-picker"
        />
      </div>

      <div className="dashboard-content">
        <div className="inventory-section">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Total Inventory</th>
                <th>Items Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{inventoryData.length} items</td>
                <td>{salesData.reduce((total, sale) => total + sale.sales, 0).toFixed(2)} units</td>
                <td>${totalRevenue.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="sales-trends">
          <div className="chart-controls">
            <h3>Sale Trends</h3>
            <select value={timeRange} onChange={handleTimeRangeChange} className="time-range-dropdown">
              <option value="30days">Last 30 Days</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last 1 Year</option>
            </select>
          </div>
          <Pie data={data} />
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="action-button"onClick={() => navigate('/add-item')}>Add Inventory</button>
        <button className="action-button">Add Sales</button>
      </div>
    </div>
  );
}

export default Dashboard;
