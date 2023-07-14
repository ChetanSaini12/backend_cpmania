const axios = require('axios');
const cheerio = require('cheerio');
const pretty = require('pretty');

const codeforcesUrl = 'https://codeforces.com/api/user.info?handles=';
// const codechefUrl = 'https://books.toscrape.com/catalogue/category/books_1/index.html';
const codechefUrl = 'https://www.codechef.com/users/';
const atcoderUrl = 'https://atcoder.jp/users/';
const leetcodeUrl = 'https://leetcode.com/';

const codeforcesRating = async (req, res) => {
    const users = req.params.users;
    const url = codeforcesUrl + users;

    try {
        const response = await axios.get(url);

        if (response.status === 200 && response.data.status === 'OK') {
            const data = response.data.result.map((user) => ({
                handle: user.handle,
                rating: user.rating,
                maxRating: user.maxRating,
                rank: user.rank,
                maxRank: user.maxRank
            }));

            res.status(200).json(data);
        } else {
            res.status(503).json({
                success: false,
                message: 'Oops! Some error occurred'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching data from Codeforces'
        });
    }
};


const codechefRating = async (req, res) => {
    const username = req.params.username
    try{
        const url = codechefUrl+username;
        const result = await axios.get(url);
        const $ = cheerio.load(result.data);
        // const ratingDiv = $(".rating-number")
        const ratingDiv = $("body > main > div > div > div > aside > div:nth-child(1) > div > div.rating-header.text-center > div.rating-number")
        // const stars = $(".user-profile-container .row .sidebar .content .rating-header .rating-star")
        const highest_ratingDiv=$("body > main > div > div > div > aside > div:nth-child(1) > div > div.rating-header.text-center > small")
        const rating = parseInt(pretty(ratingDiv.html()));
        const highest_rating = (pretty(highest_ratingDiv.text()));
        let star=1;
        if (rating >= 1400&&rating<1600)
        {
            star=2
        }
        else if (rating >= 1600&&rating<1800)
        {
            star=3
        }
        else if (rating >= 1800&&rating<2000)
        {
            star=4
        }
        else if (rating >= 2000&&rating<2200)
        {
            star=5
        }
        else if (rating >= 2200&&rating<2500)
        {
            star=6
        }
        else if (rating >= 2500)
        {
            star=7
        }
        res.status(200).json({
            status: "success",
            rating: rating,
            stars: star,
            highest_rating: highest_rating
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


const atcoderRating = async (req, res) => {
    const username = req.params.username
    try{
        const url = atcoderUrl + username;
        const result = await axios.get(url);
        const $ = cheerio.load(result.data);
        const ratingDiv = $(".dl-table tr:nth-child(2) td:nth-child(2)")
        const rating = parseInt(pretty(ratingDiv.html()));
        res.status(200).json({
            status: "success",
            rating: rating,
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

const leetcodeRating = async (req, res) => {
    const username = req.params.username
    try{
        const url = leetcodeUrl + username;
        const result = await axios.get(url);
        const $ = cheerio.load(result.data);
        const total=$("body div:nth-child(1) div:nth-child(2) div div:nth-child(1) div:nth-child(2) div div:nth-child(1) div:nth-child(1) div:nth-child(1)")
        const easy = $("body div:nth-child(1) div:nth-child(2) div div:nth-child(1) div div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(2) span:nth-child(1)")
        // const medium = $("body div:nth-child(1) div:nth-child(2) div div:nth-child(1) div div:nth-child(2) div:nth-child(2) div:nth-child(1) div:nth-child(2)")
        const hard = $("body div:nth-child(1) div:nth-child(2) div div:nth-child(1) div div:nth-child(2) div:nth-child(3) div:nth-child(1) div:nth-child(2) span:nth-child(1)")
        // console.log("Easy : ",pretty(easy.html()));
        // console.log("Medium : ",pretty(medium.html()));
        // console.log("Hard : ",pretty(hard.html()));
        const rating = $("#__next > div > div.mx-auto.w-full.grow.p-4.md\:mt-0.md\:max-w-\[888px\].md\:p-6.lg\:max-w-screen-xl.mt-\[50px\] > div > div.w-full.lc-lg\:max-w-\[calc\(100\%_-_316px\)\] > div:nth-child(2) > div.bg-layer-1.dark\:bg-dark-layer-1.rounded-lg.mt-4.flex.h-\[200px\].w-full.min-w-\[200px\].p-4.lc-lg\:mt-0.lc-xl\:hidden > div > div.relative.min-h-\[53px\].text-xs > div > div:nth-child(1) > div.text-label-1.dark\:text-dark-label-1.flex.items-center.text-2xl")
        const solved=pretty(total.html())
        rating=pretty(rating.html())
        res.status(200).json({
            status: "success",
            totalSolved: solved,
            rating: rating,
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
