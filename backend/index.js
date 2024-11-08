// Imports and Config
const express = require('express');
const { Webhook } = require('svix');
const dotenv = require('dotenv');
const cors = require('cors');
const { Pool } = require('pg');
const e = require('express');

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const signingSecret = process.env.CLERK_SIGNING_SECRET;

// Middleware
app.use(cors());
// app.use(express.json());

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper Functions
const fetchCategoryId = async (categoryName) => {
  try {
    const categoryResult = await pool.query('SELECT category_id FROM categories WHERE name = $1', [categoryName]);
    if (categoryResult.rows.length > 0) {
      return categoryResult.rows[0].category_id;
    } else {
      const newCategoryResult = await pool.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING category_id',
        [categoryName]
      );
      return newCategoryResult.rows[0].category_id;
    }
  } catch (error) {
    throw new Error('Error fetching or creating category');
  }
};

// Webhook Route with Debugging
app.post('/api/webhooks', express.raw({ type: 'application/json' }), (req, res) => {
  const svix = new Webhook(signingSecret);

  // Debugging logs for headers and body
  // console.log("Signing Secret:", signingSecret);
  // console.log("Headers:", req.headers);
  // console.log("Request Body (Type):", typeof req.body);
  // console.log("Request Body (Raw):", req.body);

  try {
    // Verify the webhook payload
    const payload = svix.verify(req.body, req.headers);
    console.log("Verified Payload:", payload);

    const { type, data } = payload;

    if (type === 'user.created' || type === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = data;
      const email = email_addresses[0]?.email_address || 'No email';

      pool.query(
        `INSERT INTO users (clerk_id, email, first_name, last_name) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (clerk_id) DO UPDATE 
         SET email = $2, first_name = COALESCE($3, users.first_name), last_name = COALESCE($4, users.last_name)`,
        [id, email, first_name || 'N/A', last_name || 'N/A']
      )
      .then(() => res.status(200).send('User saved to database'))
      .catch((error) => {
        console.error('Database error:', error);
        res.status(500).send('Database error');
      });
    } else {
      res.status(400).send('Unhandled event type');
    }
  } catch (error) {
    console.error('Webhook verification failed:', error);
    res.status(400).send('Webhook verification failed');
  }
});
app.use(express.json());
app.get('/api/user-id', async (req, res) => {
  const { clerk_id } = req.query;
  try {
    const result = await pool.query('SELECT user_id FROM users WHERE clerk_id = $1', [clerk_id]);
    if (result.rows.length > 0) {
      res.json({ user_id: result.rows[0].user_id });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user_id:', error);
    res.status(500).json({ error: 'Database error' });
  }
});  

// Categories Endpoints
app.get('/api/categories', (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  pool.query('SELECT * FROM categories WHERE user_id = $1', [user_id])
    .then(result => res.json(result.rows))
    .catch(error => {
      console.error('Error fetching categories:', error);
      res.status(500).send('Error fetching categories');
    });
});


app.post('/api/categories', (req, res) => {
  const { name, user_id } = req.body;
  console.log(req.body);
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  pool.query(
    'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *',
    [name, user_id]
  )
    .then(result => res.json(result.rows[0]))
    .catch(error => {
      console.error('Error adding category:', error);
      res.status(500).send('Error adding category');
    });
});
// Inventory Endpoints
app.get('/api/inventory', (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  pool.query('SELECT * FROM inventory WHERE user_id = $1', [user_id])
    .then(result => res.json(result.rows))
    .catch(error => {
      console.error('Error fetching inventory:', error);
      res.status(500).send('Error fetching inventory');
    });
});


app.post('/api/inventory', (req, res) => {
  const { name, sku, price, quantity, category_id, supplier, user_id } = req.body;

  if (!name || !sku || !price || !quantity || !category_id || !supplier || !user_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Insert the inventory item and return the inserted row (including auto-generated item_id)
  pool.query(
    'INSERT INTO inventory (name, sku, price, quantity, category_id, supplier, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [name, sku, price, quantity, category_id, supplier, user_id]
  )
    .then(result => res.json(result.rows[0])) // returns the full row, including item_id
    .catch(error => {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Database error' });
    });
});


// Sales Endpoints
app.get('/api/sales', (req, res) => {
  const { user_id } = req.query;
  console.log(user_id);
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  pool.query('SELECT * FROM sales WHERE user_id = $1', [user_id])
    .then(result => res.json(result.rows))
    .catch(error => {
      console.error('Error fetching sales:', error);
      res.status(500).send('Error fetching sales');
    });
});


// Add the route in your backend server file (e.g., index.js)
app.post('/api/sales', (req, res) => {
  const { item_id, quantity, sale_price, user_id, remarks } = req.body;

  // Ensure all required fields are provided
  if (!item_id || !quantity || !sale_price || !user_id) {
    return res.status(400).json({ message: 'All fields except remarks are required' });
  }

  // Insert into sales and return the full row, including sale_date
  pool.query(
    'INSERT INTO sales (item_id, quantity, sale_price, user_id, remarks) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [item_id, quantity, sale_price, user_id, remarks || null]
  )
    .then(result => res.json(result.rows[0])) // Returns the full row, including sale_date
    .catch(error => {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Database error' });
    });
});


// Start the Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
