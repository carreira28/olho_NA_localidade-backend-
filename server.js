import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(express.json());
