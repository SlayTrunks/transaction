const express = require("express");
const cors = require("cors");
const connectDb = require("./database/connect");
const userRoutes = require("./routes");
const accountRouter = require("./routes/accounts");

const app = express();


connectDb();


app.use(cors({
    origin: 'http://localhost:5173',  
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, 
}));


app.options("*", cors());


app.use(express.json());


app.use("/user", userRoutes);
app.use("/account", accountRouter);

app.get("/", (req, res) => {
    res.send("isaen");
});


app.listen(8000, () => {
    console.log("Server is listening on http://localhost:8000");
});