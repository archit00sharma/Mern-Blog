import { errorHandler } from '../utils/response.js';
import jwt from 'jsonwebtoken'


export const validateToken = async (req, res, next) => {
    try {
        const token = req.cookies.Mern_Blog

        if (!token) {
            return next(errorHandler(404, 'Missing Token'));
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) return next(errorHandler(404, 'Invalid Token'));
            req.user = user;
        });

        next();
    } catch (err) {
        next(err)
    }
}