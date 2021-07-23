const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));


// CONNECTION TO DATABASE
mongoose.connect("mongodb+srv://admin:admin@123@cluster0.vd6vl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });


const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);


app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


// ROUTES FOR ARTICLE GET, POST, DELETE

app.route("/articles")

    .get(function (req, res) {
        Article.find({}, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        })
    })

    .post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article!");
            }
            else {
                res.send(err);
            }
        });
    })

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Deleted all the article");
            }
            else {
                res.send(err);
            }
        })

    });

// ROUTING ON SPECIFIC ARTICLE

app.route("/articles/:articleName")

    .get(function (req, res) {

        Article.findOne({ title: req.params.articleName }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No article found!")
            }
        });
    })
    .put(function (req, res) {
        Article.update(
            { title: req.params.articleName },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Updated successfully!")
                } else {
                    res.send(err);
                }
            });
    })
    .patch(function (req, res) {
        Article.update(
            { title: req.params.articleName },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("Updated successfully!")
                } else {
                    res.send(err);
                }
            });
    })
    .delete(function (req, res) {
        Article.deleteOne({ title: req.params.articleName }, function (err) {
            if (!err) {
                res.send("Deleted the selected item!");
            }
            else {
                res.send(err);
            }
        })
    });


const PORT = process.env.PORT || '5000';

app.listen(PORT, function () {
    console.log(`Listening to port: ${PORT}`);
});