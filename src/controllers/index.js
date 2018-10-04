const express = require("express");
const router = express.Router();
const passport = require("passport");

// include middleware

const isAuth = (req, res, next) => {
    req.user ? next() : res.redirect("/auth/google");
};

// include routes

const home = require("./home");
const secret = require("./secret");

// declare routes

router.get("/", home.get);
router.get("/secret", isAuth, secret.get);
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect("/secret");
    }
);

// passport.authenticate middleware is used here to authenticate the request
router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile"] // Used to specify the required data
    })
);

// The middleware receives the data from Google and runs the function on Strategy config
router.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
        res.redirect("/secret");
    }
);

router.get("/secret", isAuth, (req, res) => {
    res.send("You have reached the secret route");
});

router.get("/logout", (req, res) => {
    res.clearCookie("session", { domain: "localhost", path: "/" }); // these need to be set before the redirect is sent
    res.clearCookie("session.sig", { domain: "localhost", path: "/" });
    req.session = null;
    req.logOut();
    res.redirect("/");
});

module.exports = router;
