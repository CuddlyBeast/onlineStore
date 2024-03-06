const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
// authRoutes = require("./routes/authRoutes"); Example

const app = express();

app.use(express.json());
app.use(cors());

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'" , "https://unpkg.com/"],
        connectSrc: ["'self'" , "https://unpkg.com/"],
    }
})
);

const store = session.MemoryStore();

app.use(session({
    secret: 'ssfdsfhccrthghafdethgv',
    cookie: {maxAge: 7280000, httpOnly: true, sameSite: 'none', secure: true},
    resave: false,
    saveUninitialized: false,
    store,
}));

app.get('/', (req, res, next) => {
    res.sendFile(path.file(__dirname, "public", "index.html"));
});
app.get('/shop', (req, res, next) => {
    res.sendFile(path.file(__dirname, "public", "shop.html"));
});
app.get('/product', (req, res, next) => {
    res.sendFile(path.file(__dirname, "public", "sproduct.html"));
});
app.get('/blog', (req, res, next) => {
    res.sendFile(path.file(__dirname, "public", "blog.html"));
});
app.get('/about', (req, res, next) => {
    res.sendFile(path.file(__dirname, "public", "about.html"));
});
app.get('/contact', (req, res, next) => {
    res.sendFile(path.file(__dirname, "public", "contact.html"));
});
app.get('/cart', (req, res, next) => {
    res.sendFile(path.file(__dirname, "public", "cart.html"));
});


app.use('/cuddy', authRoutes);


app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something went Wrong!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});