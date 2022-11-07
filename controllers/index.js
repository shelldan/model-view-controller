const router = require('express').Router()

//need api routers

const homeRoutes = require('./homeRoutes');

router.use('/', homeRoutes);
// need api routes

module.exports = router;