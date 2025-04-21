require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/error");

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const connectDb = require("./configs/db");

// Connect to MongoDB
connectDb();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get('/redirect-reset/:token', (req, res) => {
    const {token} = req.params;
    const appLink = `exp://127.0.0.1:8081/(auth)/reset-password?token=${token}`;
    console.log('appLink', appLink)
    res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="0; url=${appLink}" />
      </head>
      <body>
        <p>Redirecting to the app...</p>
        <a href="${appLink}">Click here if you are not redirected</a>
      </body>
    </html>
  `);
});
// Error handler (should be last piece of middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
