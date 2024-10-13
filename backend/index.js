// Existing Imports and Config
const express = require('express');
const { Webhook } = require('svix');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const signingSecret = process.env.CLERK_SIGNING_SECRET;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

// Webhook Route (Existing)
app.post('/api/webhooks', express.raw({ type: 'application/json' }), (req, res) => {
  const svix = new Webhook(signingSecret);
  let payload;

  try {
    payload = svix.verify(req.body, req.headers);
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return res.status(400).send('Webhook verification failed');
  }

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
});

// New API Endpoints for Inventory, Categories, and Sales

// Get all categories
app.get('/api/categories', (req, res) => {
  pool.query('SELECT * FROM categories')
    .then(result => res.json(result.rows))
    .catch(error => {
      console.error('Error fetching categories:', error);
      res.status(500).send('Error fetching categories');
    });
});

// Add a new category
app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name])
    .then(result => res.json(result.rows[0]))
    .catch(error => {
      console.error('Error adding category:', error);
      res.status(500).send('Error adding category');
    });
});

// Get all inventory items
app.get('/api/inventory', (req, res) => {
  pool.query('SELECT * FROM inventory')
    .then(result => res.json(result.rows))
    .catch(error => {
      console.error('Error fetching inventory:', error);
      res.status(500).send('Error fetching inventory');
    });
});

// Add a new inventory item
app.post('/api/inventory', (req, res) => {
  const { name, sku, price, quantity, category_id, supplier } = req.body;
  pool.query(
    'INSERT INTO inventory (name, sku, price, quantity, category_id, supplier) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, sku, price, quantity, category_id, supplier]
  )
    .then(result => res.json(result.rows[0]))
    .catch(error => {
      console.error('Error adding inventory item:', error);
      res.status(500).send('Error adding inventory item');
    });
});

// Get all sales records
app.get('/api/sales', (req, res) => {
  pool.query('SELECT * FROM sales')
    .then(result => res.json(result.rows))
    .catch(error => {
      console.error('Error fetching sales:', error);
      res.status(500).send('Error fetching sales');
    });
});

// Add a new sales record
app.post('/api/sales', (req, res) => {
  const { item_id, quantity, sale_price, remarks } = req.body;
  pool.query(
    'INSERT INTO sales (item_id, quantity, sale_price, remarks) VALUES ($1, $2, $3, $4) RETURNING *',
    [item_id, quantity, sale_price, remarks]
  )
    .then(result => res.json(result.rows[0]))
    .catch(error => {
      console.error('Error adding sales record:', error);
      res.status(500).send('Error adding sales record');
    });
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
