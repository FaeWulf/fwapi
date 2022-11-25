const express = require("express")

const router = express.Router()

router.get("/bonsai", (req, res) => {

  let x = 50, y = 23
  let width = 500
  let height = 500

  let offsetX = 10, offsetY = 25

  // char dimension size = 9.61 x 21
  const charX = 9.61, charY = 21

  if (!isNaN(req.query.width)) {
    x = Math.floor(req.query.width / charX)
    offsetX = Math.round(((req.query.width - (x * charX)) / 2) * 100) / 100
    width = req.query.width
  }

  if (!isNaN(req.query.height)) {
    y = Math.floor(req.query.height / charY)
    offsetY = Math.round(((req.query.height - (y * charY)) / 2 + 16) * 100) / 100
    height = req.query.height
  }

  //sonokai
  const bonsai = require("../common/jbonsai")

  let init = new bonsai(x, y)


  //query apply
  if (!req.query.live || req.query.live == false)
    init._config.timeStep = 0
  if (req.query.seed)
    init._config.seed = req.query.seed
  if (req.query.time && !isNaN(req.query.time))
    init._config.timeStep = req.query.time

  if (!isNaN(req.query.life)) {
    if (req.query.life <= 100 && req.query.life >= 0)
      init._config.lifeStart = req.query.life
  }

  if (!isNaN(req.query.multiplier)) {
    if (req.query.multiplier <= 10 && req.query.multiplier >= 0)
      init._config.lifeStart = req.query.multiplier
  }

  let background = 1

  if (req.query.background && req.query.background == 'false') {
    background = 0
  }

  init.growTree()

  let drawer = init.render()

  /*
  //check screen
  drawer = ""
  for(var i = 0; i < x; i++)
      for(var j = 0; j < y; j++)
          drawer += `<text x="${i * 9.61}" y="${j * 21}" class="text" style="opacity:1">/</text>`
          */

  res.setHeader("Content-Type", "image/svg+xml")
  res.setHeader("Cache-Control", "no-cache")
  res.send(`
<svg
        width="${width}"
        height="${height}"
        viewBox="0 0 ${width} ${height}"
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
    <rect xmlns="http://www.w3.org/2000/svg" x="0" y="0" rx="4.5" height="100%" stroke="#b7bdf8" width="100%" fill="#2c2e34" opacity="${background}" stroke-opacity="0.6"/>
    <g>
        <!--rect xmlns="http://www.w3.org/2000/svg" x="0" y="0" height="400" width="400" fill="#ffffff" opacity="0.8"/-->
        <g transform="translate(${offsetX}, ${offsetY})">
            ${drawer}
        </g>
    </g>
    </svg> 
    `)
  //<text x="0" y="0" class="text bold">∎</text>
})

module.exports = router
