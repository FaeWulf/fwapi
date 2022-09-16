const express = require("express")
const ratelimit = require("express-rate-limit")
const fs = require("fs")

const app = express()
const port = 3000;
const routePath = "./routes/"

const limiter = ratelimit({
    windowMs: 1000,
    max: 5, 
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(express.json({limit: "1mb"}))
app.use(limiter)

// route
fs.readdirSync(routePath).forEach(E => {

    try {
        let route = require(routePath + E) 
        app.use("/", route)
        console.log("loaded " + E)
    } catch (error) {
        console.log(error)
    }
})

app.listen(port,  () => {
    console.log("Listening on port " + port + "...")
})