const express = require("express");
const mongoose = require("mongoose");
const shortUrls = require("./model/shortUrl");

mongoose.connect(
    "mongodb+srv://p5341500:5341500@cluster0.n2jal.mongodb.net/project0?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.get("/", async(req, res) => {
    const sUrls = await shortUrls.find();

    res.render("index", { sUrls: sUrls });
});
app.post("/shortUrls", async(req, res) => {
    const result = await shortUrls.create({
        full: req.body.fullurl,
    });

    res.redirect("/");
});
app.get("/:shortUrl", async(req, res) => {
    const result = await shortUrls.findOne({ short: req.params.shortUrl });
    if (!result) {
        return res.statusCode(404);
    }
    result.clicks++;
    result.save();
    res.redirect(result.full);
});

app.listen(process.env.PORT || 5000);