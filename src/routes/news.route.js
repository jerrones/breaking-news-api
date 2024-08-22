import { Router } from "express";
import {
    create,
    findAll,
    topNews,
    findById,
    searchByTitle,
    byUser,
} from "../controllers/news.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", findAll);
router.get("/top", topNews);
router.get("/search", searchByTitle);
router.get("/byUser", authMiddleware, byUser);
router.get("/:id", authMiddleware, findById);

export default router;
