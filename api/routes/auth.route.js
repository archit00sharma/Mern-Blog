import express from 'express';
import { ajvValidations } from '../../helpers/ajv.js'
import { signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', ajvValidations.signup, signup);

export default router