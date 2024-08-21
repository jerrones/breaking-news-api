import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { findByIdService } from "../services/user.service.js";

dotenv.config();

const authMiddleware = (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.send(401);
        }

        const parts = authorization.split(" ");

        if (parts.length !== 2) {
            return res.send(401);
        }

        const [schema, token] = parts;

        if (schema != "Bearer") {
            return res.send(401);
        }

        jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
            if (error) {
                return res.status(401).send({ message: "Invalid token" });
            }
            const user = await findByIdService(decoded.id);

            if (!user || !user.id) {
                return res.status(401).send({ message: "Invalid token" });
            }

            req.userId = user.id;
            return next();
        });
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export default authMiddleware;
