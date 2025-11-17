const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

require("./workers/notifier.worker");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

const authRoutes = require("./routers/auth");
const adminRoutes = require("./routers/admin");
const userRoutes = require("./routers/user");
const serviceRoutes = require("./routers/service");
const appointmentRouter = require('./routers/appointment');
const notificationsRouter = require("./routers/notifications");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use('/api/appointments', appointmentRouter);
app.use("/api/notifications", notificationsRouter);

app.listen(5000, () => console.log("Server running on port 5000"));
