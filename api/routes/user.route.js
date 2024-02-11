import express from 'express';
import { validateToken } from '../helpers/jwt.js'
import { updateUser } from '../controllers/user.controller.js';

const router = express.Router();


router.put('/update/:id', validateToken, updateUser)



export default router