const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5001;
const connectDB = require("./config/db");

connectDB();



//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //means that the req.body object will contain key-value pairs, where the values are strings or arrays(traditional encoding)

//cors middleware
app.use(
  cors({
    origin: ["http://localhost:5001", "http://localhost:3000"],
    credentials: true,
  })
);

//Static folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the RandomIdeas App" });
});

const ideasRouter = require("./routes/ideas");
app.use("/api/ideas", ideasRouter);

//Start the server 
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
});
