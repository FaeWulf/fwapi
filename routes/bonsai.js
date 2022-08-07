const express = require("express")

const router = express.Router()

router.get("/bonsai", (req, res) => {

    let x = 49, y = 23

    /*
    let drawer = ""
    for(var i = 0; i < x; i++)
        for(var j = 0; j < y; j++)
            drawer += `<text x="${i * 9.61}" y="${j * 21}" class="text" >/</text>`
            */

    //sonokai
    const bonsai = require("../common/jbonsai")

    let init = new bonsai(x, y)


    //query apply
    if(!req.query.live || req.query.live == false)
        init._config.timeStep = 0
    if(req.query.seed)
        init._config.seed = req.query.seed
    if(req.query.time && !isNaN(req.query.time))
        init._config.timeStep = req.query.time

    if(!isNaN(req.query.life)) {
        if(req.query.life <= 200 && req.query.life >= 0)
            init._config.lifeStart = req.query.life
    }

    if(!isNaN(req.query.multiplier)) {
        if(req.query.multiplier <= 20 && req.query.multiplier >= 0)
            init._config.lifeStart = req.query.multiplier
    }

    init.growTree()

    let drawer = init.render()

    res.setHeader("Content-Type", "image/svg+xml")
    res.send(`
<svg
        width="500"
        height="500"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&amp;display=swap');
       .text {
            font: 16px;
            font-family: 'Roboto Mono', monospace;
            fill: #8aadf4;
            opacity: 0;
       }
        .bold {
            font-weight: 800
        }

        @keyframes show {
            0% {opacity: 0}
            100% {opacity: 1}
        }
        @keyframes hide {
            0% {opacity: 1}
            100% {opacity: 0}
        }
           
    </style>
    <rect xmlns="http://www.w3.org/2000/svg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="#b7bdf8" width="494" fill="#2c2e34" opacity="1" stroke-opacity="0.6"/>
    <g transform="translate(0, 0)">
        <!--rect xmlns="http://www.w3.org/2000/svg" x="0" y="0" height="400" width="400" fill="#ffffff" opacity="0.8"/-->
        <g transform="translate(10, 20)">
            ${drawer}
        </g>
    </g>
    </svg> 
    `)
    //<text x="0" y="0" class="text bold">∎</text>
})

module.exports = router