const express = require("express")
const fs = require("fs")
const path = require('path')

const router = express.Router()

router.get("/github", (req, res) => {
    let datFile = fs.readFileSync(path.join(__dirname, "/../stats.json"), 'utf8')
    let data = JSON.parse(datFile) 

    data.langs.sort((a, b) => b.value - a.value)

    let max = data.langs[0].value

    let els = ""
    let y = 0
    let total = 0
    data.langs.forEach((E, index) => {
        if (index > 4) {
            total += E.value
            return
        }

        let bar = "|".repeat(Math.ceil(E.value * 35 / max))
        els += `
            <text x="0" y="${y}" class="text bold" style="fill:${E.color}">${E.key}</text>
            <text x="90" y="${y}" class="chart">${bar} ${E.value}%</text>
        `
        y += 25
    })

    if (total != 0) {
        let bar = "|".repeat(Math.ceil(total * 35 / max))
        els += `
            <text x="0" y="${y}" class="text bold">Other</text>
            <text x="90" y="${y}" class="chart">${bar} ${total}%</text>
        `
    }


    res.setHeader("Content-Type", "image/svg+xml")
    res.setHeader("Cache-Control", "no-cache, no-store, private, must-revalidate")
    //res.setHeader("Cache-Control", "public, max-age=3600")
    //res.setHeader("Expires", new Date(Date.now() + 3600000).toUTCString())
    res.send(`
   <svg
        width="500"
        height="350"
        viewBox="0 0 500 350"
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
      <text x="0" y="0" class="title bold">🌟Faewulf's Github Status</text>
    </g>    
    <g transform="translate(20, 70)">
        <g transform="translate(0, 0)">
            <text x="0" y="0" class="text bold">Total Commits:</text>
            <text x="175" y="0" class="text">${data.commitsTotal}</text>
            <text x="250" y="0" class="text green">${data.lastDayCommit == 0 ? "" : "(+" + data.lastDayCommit + " yesterday)"}</text>
        </g>
        <g transform="translate(0, 25)">
            <text x="0" y="0" class="text bold">Total Issues:</text>
            <text x="175" y="0" class="text">${data.issuesTotal}</text>
            <text x="250" y="0" class="text green">${data.lastDayIssue == 0 ? "" : "(+" + data.lastDayIssue + " yesterday)"}</text>
        </g>
        <g transform="translate(0, 50)">
            <text x="0" y="0" class="text bold">Total Pull Requests:</text>
            <text x="175" y="0" class="text">${data.prTotal}</text>
            <text x="250" y="0" class="text green">${data.lastDayPr == 0 ? "" : "(+" + data.lastDayPr + " yesterday)"}</text>
        </g>
        <g transform="translate(0, 75)">
            <text x="0" y="0" class="text bold">Contributed To:</text>
            <text x="175" y="0" class="text">${data.contriButedTo}</text>
        </g>
    </g>
    <g transform="translate(20, 200)">
       <g transform="translate(0, 0)">
            ${els}
       </g>
    </g>
    </svg> 
    `)
})

module.exports = router