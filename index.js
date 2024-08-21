import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./src/database/db.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

connectDatabase();

app.use(express.json());

app.use("/user", userRoute);

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
