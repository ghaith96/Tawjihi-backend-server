var router = require('express').Router();
var { database, makeResponse } = require('../../services')

router.get("/", async (req, res) => {
    try {
        var years = await getYears(database)
        var schools = await getSchools(database)
        var branches = await getBranches(database)
        var regions = await getRegions(database)
        makeResponse.ok(res, { years, schools, branches, regions })
    } catch (e) {
        console.log(e)
    }
})

const getSchools = async (db) => await db.all('SELECT DISTINCT school FROM master;')

const getRegions = async (db) => await db.all('SELECT DISTINCT region FROM master;')

const getYears = async (db) => await db.all('SELECT DISTINCT year FROM master;')

const getBranches = async (db) => await db.all('SELECT DISTINCT branch FROM master;')

module.exports = router