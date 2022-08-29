const express = require("express")
const sysInfo = require("systeminformation")
const router = express.Router()

module.exports = router.get("/monitor", async (req, res) => { 

    let temp = await sysInfo.osInfo()

    console.log(temp)

})