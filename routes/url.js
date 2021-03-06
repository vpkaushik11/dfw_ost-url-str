const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const path = require('path');
const bodyParser = require('body-parser');

/*
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));*/
const Url = require('../models/Url');

router.get('/shorten',(req,res) => {
    res.sendFile('/Users/vpkaushik11/Desktop/Programming/Web-Dev/Delta Tasks/On-Site /URL Shortener/public/home.html');
});

// @route     POST /api/url/shorten
// @desc      Create short URL
router.post('/shorten', async (req, res) => {
        console.log(req.body);


  const { longUrl } = req.body;
  const baseUrl = config.get('baseUrl');

  // Check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base url');
  }

  // Create url code
  const urlCode = shortid.generate();

  // Check long url
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });

      if (url) {
        res.json(url);
      } else {
        const shortUrl = baseUrl + '/' + urlCode;

        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date()
        });

        await url.save();

        res.json(url);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error2');
    }
  } else {
    res.status(401).json('Invalid long url');
  }
});

module.exports = router;