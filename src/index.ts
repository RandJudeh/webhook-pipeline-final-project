import express from "express";
import pipelineRoutes from "./routes/pipelineRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/pipelines", pipelineRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/jobs", jobRoutes);
app.use("/delivery-attempts", deliveryRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});