import { userMethods } from '../services/user.services.js'
import bcrypt from "bcrypt";
import { errorHandler, responseHandler } from '../utils/response.js';
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';



export const signup = async (req, res, next) => {
    try {
        const { password } = req.body;

        const hash = bcrypt.hashSync(password, 10);
        req.body.password = hash;

        const user = await userMethods.create(req.body, next);
        delete user.password;

        responseHandler(res, 201, 'user created successfully', user)
    } catch (error) {
        next(error)
    };
};
export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userMethods.read({ email });
        if (!user) return next(errorHandler(404, 'User Not Found'));

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) return next(errorHandler(404, 'Invalid Credentials'));

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
        res.cookie('Mern_Blog', token, { maxAge: 18000000, httpOnly: true });

        delete user.password;

        responseHandler(res, 201, 'User LoggedIn Successfully', user);
    } catch (error) {
        next(error)
    };
};
export const google = async (req, res, next) => {
    try {
        const { email, name, googlePhotoUrl } = req.body;
        let user

        user = await userMethods.read({ email });

        if (!user) {
            const generatedPassword = uuidv4().replace(/-/g, '').substring(0, 16);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const userData = {
                username: name,
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            };
            user = await userMethods.create(userData, next);
        }
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
        res.cookie('Mern_Blog', token, { maxAge: 900000, httpOnly: true });

        delete user.password;
        responseHandler(res, 201, 'User LoggedIn Successfully', user);

    } catch (error) {
        next(error)
    }
};