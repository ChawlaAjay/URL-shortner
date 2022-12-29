const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require('./models/shortUrl')
const app = express();
const port = process.env.PORT || 5000;

const url ="mongodb+srv://reactproject:react123@cluster0.sbts2gb.mongodb.net/?retryWrites=true&w=majority";
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.set("strictQuery", false);
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    const shortUrls=await ShortUrl.find()
  res.render("index",{shortUrls: shortUrls});
});

app.post("/shortUrls", async (req, res) => { 
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => { 
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (!shortUrl) { 
        return res.sendStatus(404)
    }
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(port);
