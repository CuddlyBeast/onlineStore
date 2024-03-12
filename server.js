const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderDetailRoutes = require("./routes/orderDetailRoutes");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://unpkg.com/", "https://kit.fontawesome.com/", "https://www.google.com/maps/"],
      connectSrc: ["'self'", "https://unpkg.com/", "https://kit.fontawesome.com/", "https://www.google.com/maps/", "https://ka-f.fontawesome.com/"],
      fontSrc: ["'self'", "https://unpkg.com/", "https://fonts.gstatic.com/", "https://ka-f.fontawesome.com"],
      styleSrc: ["'self'", "https://ka-f.fontawesome.com", "https://fonts.googleapis.com", "https://unpkg.com"],
      imgSrc: ["'self'", "data:"],
      frameSrc: ["'self'", "https://www.google.com"], 
    }
}));


const store = session.MemoryStore();

app.use(session({
    secret: 'ssfdsfhccrthghafdethgv',
    cookie: {maxAge: 7280000, httpOnly: true, sameSite: 'none', secure: false},
    resave: false,
    saveUninitialized: false,
    store,
}));

app.use(express.static(path.join(__dirname, "public"))); 

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get('/shop', (req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "shop.html"));
});
app.get('/product', (req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "sproduct.html"));
});
app.get('/blog', (req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "blog.html"));
});
app.get('/about', (req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "about.html"));
});
app.get('/contact', (req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "contact.html"));
});
app.get('/cart', (req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "cart.html"));
});
app.get('/authenticate', (req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "authenticate.html"));
});



app.use('/cuddy', authRoutes);
app.use('/cuddy', productRoutes);
app.use('/cuddy', orderRoutes);
app.use('/cuddy', orderDetailRoutes);


app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something went Wrong!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});