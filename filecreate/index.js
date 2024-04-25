const express = require('express');
const router = express.Router();
const fileuserrootRoutes = require('./fileuserroot');

router.use('/fileCreate',fileuserrootRoutes);

module.exports = router;