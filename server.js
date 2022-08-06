const express = require("express")

const app = express()
const port = 3000;

app.use(express.json({limit: "1mb"}))

const api = require('./routes/github')
// route
app.use("/api", api)

app.listen(port,  () => {
    console.log("Listening on port " + port + "...")
})