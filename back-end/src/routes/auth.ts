import express, { Request, Response } from "express";
import {signup,login} from "./../controllers/auth"
import {autherization} from "../helpers/general"

import { resolveModuleName } from "typescript";
const router = express();

router.post('/login',login.validator,login.controller)
router.post('/signup',signup.validator,signup.controller)

export default router;