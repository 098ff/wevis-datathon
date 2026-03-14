import express from 'express';
import type { Request, Response } from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json());

// ######## Testing API Route ########
app.get("/", (req, res) => {
  res.send("Backend running")
})
// ###################################

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(200).json({});
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});