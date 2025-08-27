import express from "express";
import fileRoutes from "./files.js";

const app = express();
app.use(express.json());

// Dosya yönetimi endpointleri
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
