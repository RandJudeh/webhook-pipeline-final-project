import express from "express";
import cors from "cors";
import pipelineRoutes from "./routes/pipeline.routes";
import subscriberRoutes from "./routes/subscriber.routes";
import webhookRoutes from "./routes/webhook.routes";
import jobRoutes from "./routes/job.routes";

const app = express();

app.use(cors());
app.use(express.json());
/////////////////////
app.get("/health", (_req, res) => {
  res.status(200).json({ message: "OK" });
});


app.use("/pipelines", pipelineRoutes);
app.use("/subscribers", subscriberRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/jobs", jobRoutes);

export default app;