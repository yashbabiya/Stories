import express from "express";
import { autherization } from "../helpers/general";
import { ansToQuestion, putAnswer, vote } from "../controllers/answer";
import multer from "multer";
import path from "path";

const router = express();

router.post('/putAnswer',autherization,putAnswer.validator,putAnswer.controller)
router.get('/ansOfQuestion',ansToQuestion)
router.get('/upvote',autherization,vote.validator,vote.controller.upvote)
router.get('/downvote',autherization,vote.validator,vote.controller.downvote)

export default router;