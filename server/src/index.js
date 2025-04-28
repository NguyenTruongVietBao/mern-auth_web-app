require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDb = require("./configs/db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const {corsOptions} = require("./configs/corsOptions");

const app = express();

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions))
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Connect to MongoDB
connectDb();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
