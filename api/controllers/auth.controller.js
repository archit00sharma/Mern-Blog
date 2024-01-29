import { userMethods } from '../services/user.services.js'
import bcrypt from "bcrypt";



export const signup = async (req, res) => {
    try {
        const { password } = req.body;

        const hash = bcrypt.hashSync(password, 10);
        req.body.password = hash;

        const user = await userMethods.create(req.body);
        delete user.password;

        res.status(201).json({ message: "user created successfully", data: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
};