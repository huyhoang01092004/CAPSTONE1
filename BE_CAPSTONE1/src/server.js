import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import departmentRoutes from "./routes/departmentRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/departments", departmentRoutes);
app.use("/api/doctors", doctorRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
