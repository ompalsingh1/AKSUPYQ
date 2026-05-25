const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const branchRoutes = require("./routes/branchRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const paperRoutes = require("./routes/paperRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const queryRoutes = require("./routes/queryRoutes");
const userRoutes =require("./routes/userRoutes");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("AKSUPYQ Backend Running");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

})
.catch((err) => {
    console.log(err);
});