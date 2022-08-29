const express = require("express")
const ratelimit = require("express-rate-limit")

const app = express()
const port = 3000;

const limiter = ratelimit({
    windowMs: 1000,
    max: 1, 
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(express.json({limit: "1mb"}))

const apiGithub = require('./routes/github')
const apiBonsai = require('./routes/bonsai')
const apiMonitor = require('./routes/monitor')
// route

app.use(limiter)
app.use("/api", apiGithub)
app.use("/api", apiBonsai)
app.use("/api", apiMonitor)

app.listen(port,  () => {
    console.log("Listening on port " + port + "...")
})