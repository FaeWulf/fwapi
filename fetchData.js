require('dotenv').config()
const fetch = require("node-fetch")
const fs = require("fs")

const headers = {
  "Content-Type": "application/json",
  "Authorization": `bearer ${process.env.token}`
}

const url = "https://api.github.com/graphql"

const body1 = {
  "query": `
{
  viewer {
    login
    repositories(
      isFork: false
      orderBy: {field: UPDATED_AT, direction: DESC}
      first: 100
    ) {
      edges {
        node {
          name
          languages(orderBy: {field: SIZE, direction: DESC}, first: 100) {
            edges {
              node {
                color
                name
              }
              size
            }
            totalSize
          }
          isFork
        }
      }
    }
    contributionsCollection {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
    }
  }
}
` }

let PreviousDateTime = new Date()
PreviousDateTime.setDate(PreviousDateTime.getDate() - 1)

PreviousDateTime.setHours(0, 0, 0)
let DateStringBegin = PreviousDateTime.toISOString()

PreviousDateTime.setHours(24, 0, 0)
let DateStringEnd = PreviousDateTime.toISOString()

const body2 = {
  "query": `
            {
              viewer {
                login
                contributionsCollection(
                  from: "${DateStringBegin}"
                  to: "${DateStringEnd}"
                ) {
                  totalCommitContributions
                  totalIssueContributions
                  totalPullRequestContributions
                }
                repositoriesContributedTo {
                  totalCount
                }
              }
            }
            `
}

const body3 = {
  "query": `
           {
  user(login: "FaeWulf") {
    repositories(orderBy: {field: UPDATED_AT, direction: DESC}, first: 2) {
      nodes {
        name
        defaultBranchRef {
          target {
            ... on Commit {
              committedDate
              message
              repository {
                languages(orderBy: {field: SIZE, direction: DESC}, first: 10) {
                  edges {
                    node {
                      name
                    }
                    size
                  }
                  totalCount
                  totalSize
                }
              }
            }
          }
        }
      }
    }
  }
} 
            `
}


async function wrapper() {

  let gitStatLastDay = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body2)
  }).then(res => {
    if (!res.ok)
      throw new Error("Fetching error: " + res.status)
    return res.json()
  })

  let lastDayContribution = gitStatLastDay.data.viewer.contributionsCollection
  let lastDayIssue = lastDayContribution.totalIssueContributions
  let lastDayCommit = lastDayContribution.totalCommitContributions
  let lastDayPr = lastDayContribution.totalPullRequestContributions

  let contriButedTo = gitStatLastDay.data.viewer.repositoriesContributedTo.totalCount

  // user stats
  let gitUserStats = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body1)
  }).then(res => {
    if (!res.ok)
      throw new Error("Fetching error: " + res.status)
    return res.json()
  })
  

  let totalSize = 0
  let langs = {}
  let langs_color = {}

  let stats = gitUserStats.data.viewer

  let commitsTotal = stats.contributionsCollection.totalCommitContributions
  let issuesTotal = stats.contributionsCollection.totalIssueContributions
  let prTotal = stats.contributionsCollection.totalPullRequestContributions

  stats.repositories.edges.forEach(element => {
    let el = element.node

    if (el.isFork == true)
      return

    totalSize += el.languages.totalSize

    el.languages.edges.forEach(lang => {
      if (!langs[lang.node.name])
        langs[lang.node.name] = 0
      langs[lang.node.name] += lang.size
      langs_color[lang.node.name] = lang.node.color
    })
  });


  let keys = Object.keys(langs)
  let totalPercent = 0

  let langUsed = []
  for (let i = 0; i < keys.length; i++) {
    let percent
    //last element will subtract from total percent, rounding to 100%
    if (i == keys.length - 1)
      percent = Math.round((100 - totalPercent) * 100) / 100
    else
      percent = Math.round(langs[keys[i]] * 10000 / totalSize) / 100
    totalPercent += percent
    langUsed.push({
      "key": keys[i],
      "value": percent,
      "color": langs_color[keys[i]]
    })
  }

  //latest commit stats
  let gitLatestCommit = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body3)
  }).then(res => {
    if (!res.ok)
      throw new Error("Fetching error: " + res.status)
    return res.json()
  })

  let latestCommit = gitLatestCommit.data.user

  latestCommit.repositories.nodes.forEach(E => {

    

  })
  

  fs.writeFile(
    'stats.json',
    JSON.stringify({
      "lastDayCommit": lastDayCommit,
      "lastDayIssue": lastDayIssue,
      "lastDayPr": lastDayPr,
      "commitsTotal": commitsTotal,
      "issuesTotal": issuesTotal,
      "contriButedTo": contriButedTo,
      "prTotal": prTotal,
      "langs": langUsed
    }),
    'utf8',
    (e) => {

    }
  );
}

wrapper().catch(E => console.log(E.message))

