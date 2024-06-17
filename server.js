/**const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

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
    if (err) {
      console.error(err);
      res.status(500).send('Error adding car.');
    } else {
      console.log('Car added successfully.');
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

// Nodemailer transporter setup
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'tamilarasip.22cse@kongu.edu', // Your Gmail email address
    pass: 'andx xznk qhsn aagi' // Your Gmail password
  }
});

// Function to send email
/**function sendEmail(toEmail) {
  let mailOptions = {
    from: 'your_email@gmail.com',
    to: toEmail,
    subject: 'Thank you for your submission',
    text: 'Your information has been successfully submitted. Thank you for your interest!'
  };
   const mailOptions = {
    from: email, // Sender email address (from the appointment form)
    to: recipientEmail, // Recipient email address based on the specified hospital name
    subject: 'Thank you for your submission',
    text: 'Your information has been successfully submitted. Thank you for your interest!'
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Buyer information submission route
app.post('/submitbuyerinfo', (req, res) => {
  const { name, email, mobile, location, carId } = req.body;

  // Validate input data
  if (!name || !email || !mobile || !location) {
    res.status(400).send('All fields are required.');
    return;
  }

  // Insert buyer information into the database
  const sql = 'INSERT INTO users (name, email, mobile, location, car_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, mobile, location, carId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error submitting buyer information.');
    } else {
      console.log('Your information submitted successfully!');
      sendEmail(email); // Send email to the buyer
      res.status(200).send('Your information submitted successfully!');
    }
  });
});

// Start the server
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
}**/
const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'online_automobile'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
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
  console.log('Serving add car form');
  res.sendFile(path.join(__dirname, 'addform.html'));
});
// Add car route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'homepage.html'));
});

app.post('/addcar', upload.single('image'), (req, res) => {
  const { brand, model, year, price, mileage, fuelType, location } = req.body;
  const image = req.file ? req.file.buffer : null;
  console.log('Received new car data:', { brand, model, year, price, mileage, fuelType, location });

  const sql = 'INSERT INTO car (brand, model, year, price, mileage, fuel_type, location, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [brand, model, year, price, mileage, fuelType, location, image], (err, result) => {
    if (err) {
      console.error('Error adding car:', err);
      res.status(500).send('Error adding car.');
    } else {
      console.log('Car added successfully:', result);
      res.status(200).send('Car added successfully.');
    }
  });
});

// Cars route with filters
app.get('/cars', (req, res) => {
  const { model, minPrice, maxPrice, location } = req.query;
  console.log('Received filter query:', { model, minPrice, maxPrice, location });
  
  let sql = 'SELECT * FROM car WHERE 1=1';

  if (model) {
    sql += ` AND model LIKE '%${model}%'`;
    console.log('Filtering by model:', model);
  }

  if (minPrice) {
    sql += ` AND price >= ${minPrice}`;
    console.log('Filtering by minimum price:', minPrice);
  }

  if (maxPrice) {
    sql += ` AND price <= ${maxPrice}`;
    console.log('Filtering by maximum price:', maxPrice);
  }

  if (location) {
    sql += ` AND location LIKE '%${location}%'`;
    console.log('Filtering by location:', location);
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching cars:', err);
      res.send('Error fetching cars.');
    } else {
      console.log('Fetched cars:', results);
      res.render('cars', { cars: results });
    }
  });
});

// Serve buyer form
app.get('/buyer_form', (req, res) => {
  const carId = req.query.carId;
  console.log('Serving buyer form for car ID:', carId);
  res.render('buyer_form', { carId });
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tamilarasip.22cse@kongu.edu',
    pass: 'vucv maos hzom bmkq' // Your Gmail app-specific password
  },
  port: 587, // Use 587 instead of 465
  secure: false, // false for port 587
  tls: {
    rejectUnauthorized: false
  }
});

// Function to send email
function sendEmail(toEmail) {
  
  const mailOptions = {
    from: 'tamilarasip.22cse@kongu.edu',
    to: toEmail,
    subject: 'Thank you for your submission',
    text: 'Your information has been successfully submitted. Thank you for your interest!'
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred while sending email:', error);
    } else {
      console.log('Email sent successfully:', info.response);
    }
  });
}


  
  


// Buyer information submission route
app.post('/submitbuyerinfo', (req, res) => {
  const { name, email, mobile, location, carId } = req.body;
  console.log('Received buyer information:', { name, email, mobile, location, carId });

  // Validate input data
  if (!name || !email || !mobile || !location) {
    console.error('Validation error: All fields are required.');
    res.status(400).send('All fields are required.');
    return;
  }
// Example of route for deleting a car
app.delete('/deletecar/:id', (req, res) => {
  const carId = req.params.id;
  const sql = 'DELETE FROM car WHERE id = ?';
  db.query(sql, [carId], (err, result) => {
    if (err) {
      console.error('Error deleting car:', err);
      res.status(500).send('Error deleting car.');
    } else {
      console.log('Car deleted successfully:', result);
      res.status(200).send('Car deleted successfully.');
    }
  });
});

// Example of route for updating car details
app.put('/updatecar/:id', (req, res) => {
  const carId = req.params.id;
  const { brand, model, year, price, mileage, fuelType, location } = req.body;
  const sql = 'UPDATE car SET brand=?, model=?, year=?, price=?, mileage=?, fuel_type=?, location=? WHERE id=?';
  db.query(sql, [brand, model, year, price, mileage, fuelType, location, carId], (err, result) => {
    if (err) {
      console.error('Error updating car:', err);
      res.status(500).send('Error updating car.');
    } else {
      console.log('Car updated successfully:', result);
      res.status(200).send('Car updated successfully.');
    }
  });
});

  // Insert buyer information into the database
  const sql = 'INSERT INTO users (name, email, mobile, location, car_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, mobile, location, carId], (err, result) => {
    if (err) {
      console.error('Error submitting buyer information:', err);
      res.status(500).send('Error submitting buyer information.');
    } else {
      console.log('Buyer information submitted successfully:', result);
      sendEmail(email); // Send email to the buyer
      res.status(200).send('Your information submitted successfully!');
    }
  });
});



// Manager login route
app.get('/manager', (req, res) => {
  res.render('manager_login');
});

// Manager authentication (basic example)
app.post('/manager/login', (req, res) => {
  const { username, password } = req.body;
  // Basic authentication check (replace with secure method)
  if (username === 'manager' && password === 'password') {
    res.redirect('/manager/cars');
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Fetch car details for manager
app.get('/manager/cars', (req, res) => {
  const sql = 'SELECT * FROM car';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching cars:', err);
      res.status(500).send('Error fetching cars.');
    } else {
      res.render('manager_cars', { cars: results });
    }
  });
});

// Start the server
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
}

