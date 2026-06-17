var express = require("express");
var router = express.Router();

const userModel = require("./users");
const postModel = require("./posts");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy(userModel.authenticate()));

router.get("/", function (req, res) {
  res.render("index",{
    error: req.flash('error')
  });
});
router.get("/login", function (req, res) {
  res.render("login",{error: req.flash('error')});
});
router.get("/feed", function (req, res) {
  res.render("feed");
});
router.get("/profile", isLoggedIn, async function (req, res) {
  const user =await userModel.findOne({
    username : req.session.passport.user
  })
  .populate("posts")

  res.render("profile",{user});
});

router.post("/register", function (req, res, next) {
  const { username, fullName, email } = req.body;

  const userData = new userModel({
    username,
    fullName,
    email,
  });

  userModel
    .register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    })
    .catch(next);
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash :true
  })
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/");
}
const upload = require('./multer');

router.post('/upload', isLoggedIn, upload.single('file'), async function(req, res) {
  if (!req.file) {
    return res.status(400).send('No Files were uploaded.');
  }

  const user = await userModel.findOne({
    username: req.session.passport.user
  });

  const postdata = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });

  user.posts.push(postdata._id);
  await user.save();

  res.send('done');
});
module.exports = router;