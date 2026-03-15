import express from "express";
import cors from "cors";
import { initDataStore } from "./utils/dataStore.js";
import { partiesRouter } from "./router/partiesRouter.js";
import { commentsRouter } from "./router/commentsRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize data from CSVs
initDataStore();

// Mount routers
app.use("/api/parties", partiesRouter);
app.use("/api/comments", commentsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
