const express = require("express")

const router = express.Router()

router.get("/daily", (req, res) => {
    let data = require("../stats.json")

    data.recentlangs.sort((a, b) => b.value - a.value)

    let els = ""
    let y = 0
    let height = 70
    data.recentlangs.forEach((E, index) => {
        els += `
            <text x="0" y="${y}" class="text bold" style="fill:${E.color}">${E.key} (${E.value}%)</text>
        `
        y += 25
        height += 33
    })

    res.setHeader("Content-Type", "image/svg+xml")
    res.send(`
   <svg
        width="500"
        height="${height}"
        viewBox="0 0 500 ${height}"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
    <style>

       .title {
            font: 18px Consolas, monaco, monospace;
            fill: #cad3f5;
       }

        .text {
            font: 14px Consolas, monaco, monospace;
            fill: #cad3f5;
       }
        .chart {
            font: 12px Consolas, monaco, monospace;
            fill: #cad3f5;
       }
       .bold {
            font-weight: 800
       }
       .green {
            fill: #a6da95;
       }
           
    </style>
    <rect xmlns="http://www.w3.org/2000/svg" x="0" y="0" rx="4.5" height="100%" stroke="#b7bdf8" width="100%" fill="#2c2e34" opacity="1" stroke-opacity="0.6"/>
    <g transform="translate(20, 35)">
      <text x="0" y="0" class="title bold">✨Recently Used Languages</text>
    </g>    
    <g transform="translate(20, 80)">
       <g transform="translate(0, 0)">
            ${els}
       </g>
    </g>
    </svg> 
    `)
})

module.exports = router