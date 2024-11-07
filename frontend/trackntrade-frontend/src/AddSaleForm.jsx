import React, { useState, useEffect } from 'react';

function AddSaleForm({ userId }) {
  const [item_id, setItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sale_price, setSalePrice] = useState('');
  const [remarks, setRemarks] = useState('');
  const [items, setItems] = useState([]);

  // Fetch items when the component loads
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/inventory?user_id=${userId}`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id,
          quantity,
          sale_price,
          user_id: userId,
          remarks,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Sale added successfully!');
        setItemId('');
        setQuantity('');
        setSalePrice('');
        setRemarks('');
      } else {
        alert(`Failed to add sale: ${data.message || 'Error occurred'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={item_id} onChange={(e) => setItemId(e.target.value)} required>
        <option value="">Select Item</option>
        {items.map((item) => (
          <option key={item.item_id} value={item.item_id}>
            {item.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Sale Price"
        step="0.01"
        value={sale_price}
        onChange={(e) => setSalePrice(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Remarks (optional)"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />

      <button type="submit">Add Sale</button>
    </form>
  );
}

export default AddSaleForm;
