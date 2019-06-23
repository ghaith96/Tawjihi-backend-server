const compression = require("compression")
const express = require("express")
const app = express()
var sqlite3 = require("sqlite3").verbose()
var bodyParser = require("body-parser")

app.use(compression())

app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true
	})
)

const DB_PATH = "../db/final.db"
app.set("json spaces", 40)

var construct_list = (page_size, page, rows) => {
	if (isNaN(page_size) || isNaN(page)) return -1
	if (!page || page == 0) page = 1
	if (!page_size || page_size == 0) page_size = 10
	if (!rows) return -1
	end_index = page * page_size
	if (end_index >= rows.length) end_index = rows.length
	start_index = end_index - page_size
	return rows.slice(start_index, end_index)
}

function extractInfo(tag, array) {
	query = `AND (${tag} : `
	for (i = 0; i < array.length; i++) {
		query += `${array[i]} OR `
		if (i + 1 == array.length) {
			//to remove the excess 'OR ' from last token
			query = query.slice(0, query.length - 4)
			query += `) `
		}
	}
	return query
}

function construct_query(body) {
	var query = ""
	if (body.name && body.name != "") {
		if (body.name instanceof Array) {
			query += extractInfo("name", body.name)
		} else {
			query += `AND (name: ${body.name}) `
		}
	}
	if (body.school && body.school != "") {
		if (body.school instanceof Array) {
			query += extractInfo("school", body.school)
		} else {
			query += `AND (school: ${body.school}) `
		}
	}

	if (body.year && body.year != "") {
		if (body.year instanceof Array) {
			query += extractInfo("year", body.year)
		} else {
			query += `AND (year: ${body.year}) `
		}
	}

	if (body.region && body.region != "") {
		if (body.region instanceof Array) {
			query += extractInfo("region", body.region)
		} else {
			query += `AND (region: ${body.region})`
		}
	}

	if (body.branch && body.branch != "") {
		if (body.branch instanceof Array) {
			query += extractInfo("branch", body.branch)
		} else {
			query += `AND (branch: ${body.branch})`
		}
	}
	//to remove first AND
	query = query.replace("AND", "")
	console.log("Requested query final form : " + query)
	return query
}

app.post("/search", (req, res) => {
	console.time("big_request")
	console.log(req.body)
	const query = construct_query(req.body)
	var db = new sqlite3.Database(DB_PATH)

	try {
		stmt = db.prepare("select * from master where master MATCH ?;")
		stmt.all(query, (err, rows) => {
			res.setHeader("Content-Type", "application/json")
			res.status(200).json(rows)
		})
	} catch (e) {
		console.log(e)
	} finally {
		stmt.finalize()
		db.close()
		console.timeEnd("big_request")
	}
})

app.post("/stats", validator, calculateRank, sendStats)

function validator(req, res, next) {
	if (
		!req.body.id ||
		!req.body.region ||
		!req.body.branch ||
		!req.body.year ||
		!req.body.school
	) {
		res.status(400).send("invalid parameters count/order")
	} else {
		console.time("statsRequest")
		console.log(req.body)
		next()
	}
}

// rank of the student over his/her region
function calculateRank(req, res, next) {
	var db = new sqlite3.Database(DB_PATH)
	try {
		console.time("DBQUERY")
		// "overAllRank": 56836,
		// "branchRank": 10862,
		// "schoolRank": 1,
		// "regionRank": 2692
		db.all(
			`
			SELECT
				(SELECT COUNT(c0)+1 from master_content WHERE c6= $year and c2 > s2.c2) as overAllRank,
				(SELECT COUNT(c0)+1 from master_content WHERE c6= $year and c3 = $branch and c2 > s2.c2) as branchRank,
				(SELECT COUNT(c0)+1 from master_content WHERE c6= $year and c5 = $school and c2 > s2.c2) as schoolRank,
				(SELECT COUNT(c0)+1 from master_content WHERE c6= $year and c4 = $region and c2 > s2.c2) as regionRank
			FROM master_content s2
			WHERE c6 = $year and c0 = $id;
			`,
			{
				$id: req.body.id,
				$region: req.body.region,
				$year: req.body.year,
				$branch: req.body.branch,
				$school: req.body.school
			},
			(err, rows) => {
				req.response = rows[0]
				next()
			}
		)
	} catch (e) {
		console.log(e)
	} finally {
		db.close()
		console.timeEnd("DBQUERY")
	}
}

function sendStats(req, res) {
	res.setHeader("Content-Type", "application/json")
	res.status(200).json(req.response)
	console.timeEnd("statsRequest")
}

app.get("/getHints", getSchools, getRegions, getYears, getBranches)

function getSchools(req, res, next) {
	var db = new sqlite3.Database(DB_PATH)
	try {
		db.all(`select distinct school from master;`, (err, rows) => {
			temp = []
			rows.forEach(row => temp.push(row.school))
			req.school = temp
		})
	} catch (e) {
		console.log(e)
	} finally {
		db.close()
		next()
	}
}

function getRegions(req, res, next) {
	console.time("hints_time")
	var db = new sqlite3.Database(DB_PATH)
	try {
		db.all(`select distinct region from master;`, (err, rows) => {
			temp = []
			rows.forEach(row => temp.push(row.region))
			req.region = temp
			next()
		})
	} catch (e) {
		console.log(e)
	} finally {
		db.close()
	}
}

function getYears(req, res, next) {
	var db = new sqlite3.Database(DB_PATH)
	try {
		db.all(`select distinct year from master;`, (err, rows) => {
			temp = []
			rows.forEach(row => temp.push(row.year))
			req.year = temp
			next()
		})
	} catch (e) {
		console.log(e)
	} finally {
		db.close()
	}
}

function getBranches(req, res) {
	var db = new sqlite3.Database(DB_PATH)
	try {
		db.all(`select distinct branch from master;`, (err, rows) => {
			temp = []
			rows.forEach(row => temp.push(row.branch))
			req.branch = temp
			res.setHeader("Content-Type", "application/json")
			res.status(200).json({
				year: req.year,
				school: req.school,
				branch: req.branch,
				region: req.region
			})
		})
	} catch (e) {
		console.log(e)
	} finally {
		db.close()
		console.timeEnd("hints_time")
	}
}

app.use((req, res) => {
	res.send("its working!")
})

app.get("/", (req, res) => {
	var db = new sqlite3.Database(DB_PATH)
	try {
		stmt = db.prepare("select * from branch")
		stmt.all((err, rows) => {
			res.json(rows)
		})
	} catch (e) {
		console.log(e)
	} finally {
		stmt.finalize()
		db.close()
	}
})

app.get("/:id/page/:page/size/:size", (req, res) => {
	var db = new sqlite3.Database(DB_PATH)
	try {
		stmt = db.prepare("select * from master where master MATCH ?;")
		stmt.all(req.params.id, (err, rows) => {
			row = construct_list(req.params.size, req.params.page, rows)
			if (row === -1) {
				res.redirect("/" + req.params.id)
			} else {
				res.setHeader("Content-Type", "application/json")
				res.status(200).json(row)
			}
		})
	} catch (e) {
		console.log(e)
	} finally {
		stmt.finalize()
		db.close()
	}
})

app.listen(3000, () => console.log("express server started at port 3000"))
