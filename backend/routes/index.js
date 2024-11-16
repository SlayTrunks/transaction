const express = require("express")
const app = express()
const router = express.Router()
const authMiddleware = require("../middlewares")
const {signupController,signinController, updateController, filterController, profileController} = require("../controller/controller")

app.use(express.json())



router.post("/signup", signupController)
router.post("/signin",signinController)
router.patch("/",authMiddleware ,updateController)
router.get("/bulk",filterController)
router.get("/profile",authMiddleware,profileController)


module.exports = router;

