var router = require('express').Router();

router.use('/search', require('./search'));
router.use('/stats', require('./stats'));
router.use('/getHints', require('./getHints'));

module.exports = router;