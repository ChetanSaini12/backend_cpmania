const axios = require('axios');
const cheerio = require('cheerio');
const pretty = require('pretty');

const codeforcesUrl = 'https://codeforces.com/api/user.info?handles=';
const codeforcesContestUrl = 'https://codeforces.com/api/user.rating?handle=';
const codeforcesProblemsUrl = 'https://codeforces.com/api/user.status?handle=';
const codechefUrl = 'https://www.codechef.com/users/';
const atcoderUrl = 'https://atcoder.jp/users/';
const leetcodeUrl = 'https://leetcode.com/';

const codeforcesRating = async (req, res) => {
    const users = req.params.users;
    const url = codeforcesUrl + users;
    const data = {
        
            handle: 'tourist',
            rating: 3739,
            maxRating: 3739,
            rank: 'legendary grandmaster',
            maxRank: 'legendary grandmaster',
            problemsSolved: 0,
            problemsTried: 0,
            contestCount: 0,
            bestRank: 0,
            worstRank: 0,
            MaxUp: 0,
            MaxDown: 0
        
    };

    try {
        const response = await axios.get(url);


        if (response.status === 200 && response.data.status === 'OK') {
            const result = response.data.result[0];
            data.handle = result.handle;
            data.rating = result.rating;
            data.maxRating = result.maxRating;
            data.rank = result.rank;
            data.maxRank = result.maxRank;

        } else {
            res.status(503).json({
                success: false,
                message: 'Oops! Some error occurred'
            });
        }


        const contestUrl = codeforcesContestUrl + users;
        const contestResponse = await axios.get(contestUrl);

        if (contestResponse.status === 200 && contestResponse.data.status === 'OK') {
            const result = contestResponse.data.result;
            result.sort((a, b) => {
                return a.rank - b.rank;
            });
            data.contestCount = result.length;
            data.bestRank = result[0].rank;
            data.worstRank = result[result.length - 1].rank;
            data.MaxUp = result[0].newRating - result[0].oldRating;
            data.MaxDown = result[result.length - 1].newRating - result[result.length - 1].oldRating;
        }
        else {
            res.status(503).json({
                success: false,
                message: 'Oops! Some error occurred'
            });
        }


        const problemsUrl = codeforcesProblemsUrl + users;
        const problemsResponse = await axios.get(problemsUrl);

        if (problemsResponse.status === 200 && problemsResponse.data.status === 'OK') {
            const result = problemsResponse.data.result;
            const solved = new Set();
            const tried = new Set();
            result.forEach((submission) => {
                if (submission.verdict === 'OK') {
                    solved.add(submission.problem.contestId + submission.problem.index);
                }
                tried.add(submission.problem.contestId + submission.problem.index);
            });
            data.problemsSolved = solved.size;
            data.problemsTried = tried.size;
        }
        else {
            res.status(503).json({
                success: false,
                message: 'Oops! Some error occurred'
            });
        }

        res.status(200).json({
            success: true,
            data: data
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching data from Codeforces'
        });
    }


};

/*<---- CodeChef Rating --->*/

const codechefRating = async (req, res) => {

    const username = req.params.username
    const data = {
        rating: 0,
        stars: 1,
        highest_rating: 0,
        contest: 0,
        problemsSolved: 0,
        globalRank: 0,
        countryRank: 0
    }

    try{
        const url = codechefUrl+username;
        const result = await axios.get(url);
        const $ = cheerio.load(result.data);

        const ratingDiv = $("body > main > div > div > div > aside > div:nth-child(1) > div > div.rating-header.text-center > div.rating-number")
        const highest_ratingDiv = $("body > main > div > div > div > aside > div:nth-child(1) > div > div.rating-header.text-center > small")
        const countryRank = $("body > main > div > div > div > aside > div:nth-child(1) > div > div.rating-ranks > ul > li:nth-child(2) > a > strong")
        const globalRank = $("body > main > div > div > div > aside > div:nth-child(1) > div > div.rating-ranks > ul > li:nth-child(1) > a > strong")
        const problemsSolved = $("body > main > div > div > div > div > div > section:nth-child(7) > div > h5:nth-child(1)")
        const contests = $("body > main > div > div > div > div > div > section.rating-graphs.rating-data-section > div.rating-title-container > div > b")

        const rating = parseInt(pretty(ratingDiv.html()));
        const highest_rating = parseInt(pretty(highest_ratingDiv.html()).split(" ")[2].split(")")[0]);
        const country_rank = parseInt(pretty(countryRank.text()));
        const global_rank = parseInt(pretty(globalRank.text()));
        const problems_solved = parseInt(pretty(problemsSolved.html()).split("(")[1].split(")")[0]);
        const contest = parseInt(pretty(contests.text()));
        
        let star = 1;
        if (rating >= 1400 && rating<1600)
        {
            star = 2
        }
        else if (rating >= 1600 && rating<1800)
        {
            star = 3
        }
        else if (rating >= 1800 && rating<2000)
        {
            star = 4
        }
        else if (rating >= 2000 && rating<2200)
        {
            star = 5
        }
        else if (rating >= 2200 && rating<2500)
        {
            star = 6
        }
        else if (rating >= 2500)
        {
            star = 7
        }

        data.rating = rating;
        data.stars = star;
        data.highest_rating = highest_rating;
        data.countryRank = country_rank;
        data.globalRank = global_rank;
        data.problemsSolved = problems_solved;
        data.contest = contest;
        res.status(200).json({
            status: "success",
            data: data,
        })
    }
    catch (err)
    {
        res.status(503).json({
            success: false,
            message:"Opps! Some error occurred"
        })
    }
}


/*<---- Atcoder Rating --->*/

const atcoderRating = async (req, res) => {

    const username = req.params.username
    const data = {
        rank : 0,
        rating : 0,
        highest_rating : 0,
        matches : 0
    }
    try{
        const url = atcoderUrl + username;
        const result = await axios.get(url);
        const $ = cheerio.load(result.data);

        const rankDiv = $("#main-container > div.row > div.col-md-9.col-sm-12 > table > tbody > tr:nth-child(1) > td")
        const ratingDiv = $("#main-container > div.row > div.col-md-9.col-sm-12 > table > tbody > tr:nth-child(2) > td > span")
        const highestRatDiv = $("#main-container > div.row > div.col-md-9.col-sm-12 > table > tbody > tr:nth-child(3) > td > span")
        const matchesDiv = $("#main-container > div.row > div.col-md-9.col-sm-12 > table > tbody > tr:nth-child(4) > td")

        const rank = parseInt(pretty(rankDiv.text()));
        const rating = parseInt(pretty(ratingDiv.text()));
        const highest_rating = parseInt(pretty(highestRatDiv.text()));
        const matches = parseInt(pretty(matchesDiv.text()));

        data.rank = rank
        data.rating = rating
        data.highest_rating = highest_rating
        data.matches = matches        

        res.status(200).json({
            status: "success",
            data : data
        })
    }
    catch (err)
    {
        res.status(503).json({
            success: false,
            message:"Opps! Some error occurred"
        })
    }
}

/*<---- LeetCode Rating --->*/

const leetcodeRating = async (req, res) => {

    const username = req.params.username
    const data = {
        rating: 0,
        problemsSolved: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        level: "",
        globalRank: 0,
        maxStreak: "",
        contests: 0,
        submissions: 0
    }

    try{
        const url = leetcodeUrl + username;
        const result = await axios.get(url);
        const $ = cheerio.load(result.data);

        const easy = $("#__next > div > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\] > div > div.w-full.lc-lg\\:max-w-\\[calc\\(100\\%_-_316px\\)\\] > div.flex.w-full.flex-col.space-x-0.space-y-4.lc-xl\\:flex-row.lc-xl\\:space-y-0.lc-xl\\:space-x-4 > div.min-w-max.max-w-full.w-full.flex-1 > div > div.mx-3.flex.items-center.lc-xl\\:mx-8 > div.flex.w-full.flex-col.space-y-4.lc-xl\\:max-w-\\[228px\\] > div:nth-child(1) > div.flex.w-full.items-end.text-xs > div.flex.flex-1.items-center > span.mr-\\[5px\\].text-base.font-medium.leading-\\[20px\\].text-label-1.dark\\:text-dark-label-1")
        const medium = $("#__next > div > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\] > div > div.w-full.lc-lg\\:max-w-\\[calc\\(100\\%_-_316px\\)\\] > div.flex.w-full.flex-col.space-x-0.space-y-4.lc-xl\\:flex-row.lc-xl\\:space-y-0.lc-xl\\:space-x-4 > div.min-w-max.max-w-full.w-full.flex-1 > div > div.mx-3.flex.items-center.lc-xl\\:mx-8 > div.flex.w-full.flex-col.space-y-4.lc-xl\\:max-w-\\[228px\\] > div:nth-child(2) > div.flex.w-full.items-end.text-xs > div.flex.flex-1.items-center > span.mr-\\[5px\\].text-base.font-medium.leading-\\[20px\\].text-label-1.dark\\:text-dark-label-1")
        const hard = $("#__next > div > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\] > div > div.w-full.lc-lg\\:max-w-\\[calc\\(100\\%_-_316px\\)\\] > div.flex.w-full.flex-col.space-x-0.space-y-4.lc-xl\\:flex-row.lc-xl\\:space-y-0.lc-xl\\:space-x-4 > div.min-w-max.max-w-full.w-full.flex-1 > div > div.mx-3.flex.items-center.lc-xl\\:mx-8 > div.flex.w-full.flex-col.space-y-4.lc-xl\\:max-w-\\[228px\\] > div:nth-child(3) > div.flex.w-full.items-end.text-xs > div.flex.flex-1.items-center > span.mr-\\[5px\\].text-base.font-medium.leading-\\[20px\\].text-label-1.dark\\:text-dark-label-1")
        const rating = $("#__next > div > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\] > div > div.w-full.lc-lg\\:max-w-\\[calc\\(100\\%_-_316px\\)\\] > div.bg-layer-1.dark\\:bg-dark-layer-1.rounded-lg.my-4.hidden.h-\\[200px\\].w-full.p-4.lc-lg\\:mt-0.lc-xl\\:flex > div.lc-md\\:min-w-none.h-full.w-full.min-w-\\[200px\\].flex-1 > div > div.relative.min-h-\\[53px\\].text-xs > div > div:nth-child(1) > div.text-label-1.dark\\:text-dark-label-1.flex.items-center.text-2xl")
        const level = $("#__next > div > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\] > div > div.w-full.lc-lg\\:max-w-\\[calc\\(100\\%_-_316px\\)\\] > div.bg-layer-1.dark\\:bg-dark-layer-1.rounded-lg.my-4.hidden.h-\\[200px\\].w-full.p-4.lc-lg\\:mt-0.lc-xl\\:flex > div.lc-md\\:min-w-none.h-full.w-full.min-w-\\[200px\\].flex-1 > div > div.relative.min-h-\\[53px\\].text-xs > div > div:nth-child(3) > div.text-sm.leading-\\[22px\\].text-blue-s.dark\\:text-dark-blue-s")
        const contest = $("#__next > div > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\] > div > div.w-full.lc-lg\\:max-w-\\[calc\\(100\\%_-_316px\\)\\] > div.bg-layer-1.dark\\:bg-dark-layer-1.rounded-lg.my-4.hidden.h-\\[200px\\].w-full.p-4.lc-lg\\:mt-0.lc-xl\\:flex > div.lc-md\\:min-w-none.h-full.w-full.min-w-\\[200px\\].flex-1 > div > div.relative.min-h-\\[53px\\].text-xs > div > div.hidden.md\\:block > div.text-label-1.dark\\:text-dark-label-1.font-medium.leading-\\[22px\\]")
        const maxStreak = $("#__next > div > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\] > div > div.w-full.lc-lg\\:max-w-\\[calc\\(100\\%_-_316px\\)\\] > div:nth-child(4) > div > div.lc-md\\:flex-row.lc-md\\:items-center.lc-md\\:space-y-0.flex.flex-col.flex-wrap.space-y-2 > div.flex.items-center.text-xs > div:nth-child(2) > span.font-medium.text-label-2.dark\\:text-dark-label-2")
        const submissions = $("#__next > div > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\] > div > div.w-full.lc-lg\\:max-w-\\[calc\\(100\\%_-_316px\\)\\] > div:nth-child(4) > div > div.lc-md\\:flex-row.lc-md\\:items-center.lc-md\\:space-y-0.flex.flex-col.flex-wrap.space-y-2 > div.flex.flex-1.items-center > span.lc-md\\:text-xl.mr-\\[5px\\].text-base.font-medium")
        const globalRank = $("#__next > div > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\] > div > div.w-full.lc-lg\\:max-w-\\[calc\\(100\\%_-_316px\\)\\] > div.bg-layer-1.dark\\:bg-dark-layer-1.rounded-lg.my-4.hidden.h-\\[200px\\].w-full.p-4.lc-lg\\:mt-0.lc-xl\\:flex > div.lc-md\\:min-w-none.h-full.w-full.min-w-\\[200px\\].flex-1 > div > div.relative.min-h-\\[53px\\].text-xs > div > div:nth-child(4) > div.text-label-1.dark\\:text-dark-label-1.font-medium.leading-\\[22px\\]")


        const easyCount = parseInt(pretty(easy.html()));
        const mediumCount = parseInt(pretty(medium.html()));
        const hardCount = parseInt(pretty(hard.html()));
        const totalProblems = easyCount + mediumCount + hardCount;
        const ratingValue = (pretty(rating.html()));
        const levelValue = (pretty(level.html()));
        const contestValue = (pretty(contest.html()));
        const maxStreakValue = (pretty(maxStreak.html()));
        const submissionsValue = (pretty(submissions.html()));
        const globalRankValue = (pretty(globalRank.html())).split()[0].split("<")[0];

        data.problemsSolved = totalProblems;
        data.easy = easyCount;
        data.medium = mediumCount;
        data.hard = hardCount;
        data.rating = ratingValue;
        data.level = levelValue;
        data.contests = contestValue;
        data.maxStreak = maxStreakValue;
        data.submissions = submissionsValue;
        data.globalRank = globalRankValue;


        res.status(200).json({
            status: "success",
            data : data
        })
    }
    catch (err)
    {
        res.status(503).json({
            success: false,
            message:"Opps! Some error occurred"
        })
    }
}

module.exports = { codechefRating, codeforcesRating, atcoderRating, leetcodeRating }



/*
Atcoder - http://localhost:7000/rating/at_coder/chetan_saini12
{
    "status": "success",
    "data": {
        "rank": 64033,
        "rating": 40,
        "highest_rating": 40,
        "matches": 5
    }
}

Leetcode - http://localhost:7000/rating/leet_code/chetan_saini21
{
    "status": "success",
    "data": {
        "rating": "2,194",
        "problemsSolved": 272,
        "easy": 91,
        "medium": 144,
        "hard": 37,
        "level": "Guardian",
        "globalRank": "4,575",
        "maxStreak": "16",
        "contests": "35",
        "submissions": "504"
    }
}

codechef - http://localhost:7000/rating/code_chef/chetan_saini21
{
    "status": "success",
    "data": {
        "rating": 2043,
        "stars": 5,
        "highest_rating": 2062,
        "contest": 56,
        "problemsSolved": 202,
        "globalRank": 1101,
        "countryRank": 557
    }
}

codeforces - http://localhost:7000/rating/codeforces/chetan_saini
{
    "success": true,
    "data": {
        "handle": "chetan_saini",
        "rating": 1645,
        "maxRating": 1773,
        "rank": "expert",
        "maxRank": "expert",
        "problemsSolved": 1056,
        "problemsTried": 1108,
        "contestCount": 124,
        "bestRank": 184,
        "worstRank": 15448,
        "MaxUp": 116,
        "MaxDown": 352
    }
}




*/