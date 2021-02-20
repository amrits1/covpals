const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const Users = require('./models/schema');
const bodyParser = require("body-parser");
const path = require('path');
const cors = require("cors");
require('dotenv').config();
const URI = process.env.MONGO_URI;

app.use(cors());

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("Connected to MongoDB database successfully");
});

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const endpoints = require('./routes/api/endpoints');

app.use('/api/endpoints', endpoints);

app.get('/undefined', (req, res) => {
  res.send("from server");
})

app.get('/:redirect', (req, res) => {
  const shortreq = req.params.redirect;
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));
  app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  })
}

app.listen(port, function() {
  console.log("Server is running on Port: " + port);
});