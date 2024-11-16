const express = require('express');
const authMiddleware = require('../middlewares');
const { Account, User } = require('../schema/schema');
const { balanceCheck, transferController } = require('../controller/controller');
const { default: mongoose } = require('mongoose');
const zod = require("zod")
const router = express.Router();


router.get("/balance",authMiddleware,balanceCheck)

const transectionCheck = zod.object({
    amount:zod.number(),
    to:zod.string().email({message:"invalid email address"})
})
router.post("/transfer",authMiddleware, transferController )
module.exports = router;    