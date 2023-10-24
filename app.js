require("dotenv").config();

const express = require("express")
const app = express();
const mongoose = require("mongoose");
// const PORT = 5000;


app.get("/",(req, res)=>{
    res.json({
        message : "serverup"
    })
})


const globalPORT = process.env.PORT
// console.log(process.env)

app.listen(globalPORT, ()=>{
    console.log(`server running on localhost:${globalPORT}`)
})