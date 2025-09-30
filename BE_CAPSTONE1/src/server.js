import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import departmentRoutes from "./routes/departmentRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import doctorScheduleRoutes from "./routes/doctorScheduleRoutes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/departments", departmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorScheduleRoutes);
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
