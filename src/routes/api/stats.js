var router = require('express').Router()
var { database, makeResponse } = require('../../services')


router.post("/", parameterValidator, async (req, res) => {
    try {
        let params = {
            $id: req.body.id,
            $branch: req.body.branch,
            $region: req.body.region,
            $school: req.body.school,
            $year: req.body.year
        }
        let data = await database.all(` SELECT
				(SELECT COUNT(c0)+1 from master_content WHERE c6= $year and c2 > s2.c2) as overAllRank,
				(SELECT COUNT(c0)+1 from master_content WHERE c6= $year and c3 = $branch and c2 > s2.c2) as branchRank,
				(SELECT COUNT(c0)+1 from master_content WHERE c6= $year and c5 = $school and c2 > s2.c2) as schoolRank,
				(SELECT COUNT(c0)+1 from master_content WHERE c6= $year and c4 = $region and c2 > s2.c2) as regionRank
			FROM master_content s2
            WHERE c6 = $year and c0 = $id;`, params)
        let result = data[0]
        makeResponse.ok(res, result)
    } catch (e) {
        console.log(e)
    }
})

function parameterValidator(req, res, next) {
    let { id, region, branch, year, school } = req.body
    let hasMissingParam = (!id || !region || !branch || !year || !school)
    if (hasMissingParam) {
        makeResponse.badRequest(res, 'invalid parameters count/order')
    } else {
        next()
    }
}

module.exports = router