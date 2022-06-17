PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");

const app = express();

const newspapers = [
  {
    name: "nyt",
    address: "https://www.nytimes.com/international/section/climate",
    baseUrl: "",
  },
  {
    name: "latimes",
    address: "https://www.latimes.com/environment",
    baseUrl: "",
  },
  {
    name: "cityam",
    address:
      "https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/",
    baseUrl: "",
  },
  {
    name: "nyt",
    address: "https://www.nytimes.com/international/section/climate",
    baseUrl: "",
  },

  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    baseUrl: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    baseUrl: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change",
    baseUrl: "https://www.telegraph.co.uk",
  },
  {
    name: "dm",
    address:
      "https://www.dailymail.co.uk/news/climate_change_global_warming/index.html",
    baseUrl: "",
  },
  {
    name: "nyp",
    address: "https://nypost.com/tag/climate-change/",
    baseUrl: "",
  },
  {
    name: "es",
    address: "https://www.standard.co.uk/topic/climate-change",
    baseUrl: "https://www.standard.co.uk",
  },
  {
    name: "sun",
    address: "https://www.thesun.co.uk/topic/climate-change-environment/",
    baseUrl: "",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");
      articles.push({
        title,
        url: newspaper.baseUrl + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Express is Live");
});

app.get("/news", (req, res) => {
  res.json(articles);
  /*  axios
    .get("https://www.theguardian.com")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        articles.push({
          title,
          url,
        });
      });
      res.json(articles);
    })
    .catch((err) => console.log(err)); */
});
app.get("/news/:newspaperId", async (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaperId == newspaper.name
  )[0].address;
  const newspaperBaseUrl = newspapers.filter(
    (newspaper) => newspaperId == newspaper.name
  )[0].baseUrl;
  axios
    .get(newspaperAddress)
    .then((response) => {
      html = response.data;
      $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBaseUrl + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
