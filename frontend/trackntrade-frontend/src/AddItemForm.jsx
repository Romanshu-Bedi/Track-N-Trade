import React, { useState, useEffect } from 'react';

function AddItemForm() {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [supplier, setSupplier] = useState('');

  // Fetch categories when component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategory.trim() === '') return;
    
    try {
      const response = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });
      const data = await response.json();
      if (response.ok) {
        setCategories([...categories, data]); // Add new category to the list
        setSelectedCategory(data.category_id); // Select the newly created category
        setNewCategory(''); // Clear the input
      } else {
        alert(`Failed to add category: ${data.message || 'Error occurred'}`);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('An error occurred while adding the category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          sku,
          price,
          quantity,
          category_id: selectedCategory,
          supplier,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Item added successfully!');
        setName('');
        setSku('');
        setPrice('');
        setQuantity('');
        setSelectedCategory('');
        setSupplier('');
      } else {
        alert(`Failed to add item: ${data.message || 'Error occurred'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="text" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} required />
      <input type="number" placeholder="Price" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />

      {/* Dropdown for selecting category */}
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Input for adding a new category */}
      <div>
        <input
          type="text"
          placeholder="Add New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="button" onClick={handleAddCategory}>Add Category</button>
      </div>

      <input type="text" placeholder="Supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} required />
      <button type="submit">Add this Item</button>
    </form>
  );
}

export default AddItemForm;
