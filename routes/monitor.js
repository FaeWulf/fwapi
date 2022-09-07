const express = require("express")
const sysInfo = require("systeminformation")
const router = express.Router()

module.exports = router.get("/monitor", async (req, res) => { 

    let respond = { }

    //respond.osInfo = await sysInfo.osInfo()
    //respond.cpuCurrentSpeed = await sysInfo.cpuCurrentSpeed()
    //respond.memory = await sysInfo.mem()
    //respond.network = await sysInfo.networkStats()
    respond.processes = await sysInfo.processes()


    console.log(respond)

    res.json(respond)
})