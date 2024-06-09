const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'online_automobile'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected');
});

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add car route
app.get('/addcar', (req, res) => {
  res.sendFile(path.join(__dirname, 'addform.html'));
});

app.post('/addcar', upload.single('image'), (req, res) => {
  const { brand, model, year, price, mileage, fuelType, location } = req.body;
  const image = req.file ? req.file.buffer : null;

  const sql = 'INSERT INTO car (brand, model, year, price, mileage, fuel_type, location, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [brand, model, year, price, mileage, fuelType, location, image], (err, result) => {
    if (err) 
      {
      console.error(err);
      res.status(500).send('Error adding car.');
    res.send('Error adding car.');
    } else {
      console.log('Car added successfully.');
     // res.send('Car added successfully.');
     res.status(200).send('Car added successfully.');
    }

  });
});

// Cars route with filters
app.get('/cars', (req, res) => {
  const { model, minPrice, maxPrice, location } = req.query;
  let sql = 'SELECT * FROM car WHERE 1=1';

  if (model) {
    sql += ` AND model LIKE '%${model}%'`;
  }

  if (minPrice) {
    sql += ` AND price >= ${minPrice}`;
  }

  if (maxPrice) {
    sql += ` AND price <= ${maxPrice}`;
  }

  if (location) {
    sql += ` AND location LIKE '%${location}%'`;
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Error fetching cars.');
    } else {
      res.render('cars', { cars: results });
    }
  });
});

// Serve buyer form
app.get('/buyer_form', (req, res) => {
  const carId = req.query.carId;
  res.render('buyer_form', { carId });
});

// Buyer information submission route
app.post('/submitbuyerinfo', (req, res) => {
  const { name,email, mobile, location, carId } = req.body;

  // Validate input data
  if (!name || !email || !mobile || !location) {
    res.status(400).send('All fields are required.');
    return;
  }

  // Insert buyer information into the database
  const sql = 'INSERT INTO users (name,email, mobile, location, car_id) VALUES (?, ?,?, ?, ?)';
  db.query(sql, [name,email, mobile, location, carId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error submitting buyer information.');
    } else {
      console.log('Your information submitted successfully!');
      res.status(200).send('Your information submitted successfully!');
    }
  });
});

// Start the server
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server started on port 3000 server is running');
  });
}
