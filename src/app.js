// project dependencies

const path = require("path");
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieSession = require("cookie-session");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const controllers = require("./controllers");
const compression = require("compression");
const helmet = require("helmet");

// spin up express

const app = express();

// declare middleware

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
    "hbs",
    exphbs({
        extname: "hbs",
        layoutsDir: path.join(__dirname, "views", "layouts"),
        partialsDir: path.join(__dirname, "views", "partials"),
        defaultLayout: "main"
    })
);

app.set("port", process.env.PORT || 8000);

app.use(compression());
app.use(helmet());
app.use(morgan("dev"));
app.use(
    cookieSession({
        maxAge: 5 * 60 * 1000, // Five minutes
        keys: [process.env.COOKIE_SECRET]
    })
);

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:8000/auth/google/callback"
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile); // passes the profile data to serializeUser
        }
    )
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// routes

app.use(controllers);

module.exports = app;
