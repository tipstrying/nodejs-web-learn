var express = require('express')
var router = express.Router()
var fs = require('fs')


var config = require('./config')

router.get('/drive-files', (req, res) => {

    fs.readdir('../file', (err, file) => {
        if (err) {
            res.status(404).json({ message: "no file find" })
        } else {
            res.json(file)
        }
    })
})
router.post('/drive-uplod', (req, res) => {
    if (req.files) {
        try {
            var file = req.files.upfile
            fs.access("../file/" + file.name, fs.constants.F_OK, (err) => {
                if (err) {
                    file.mv("../file/" + file.name)
                    res.json({ message: "ok" })
                    res.end()
                } else {
                    res.status(403).json({ message: "file exists" })
                    res.end()
                }
            })
        } catch (err) {
            console.log(err)
        }


    } else {
        res.status(404)
    }
})

router.get('/drive-view/:name', (req, res) => {
    var options = {
        root: "../file",
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }

    var fileName = req.params.name
    res.sendFile(fileName, options, function (err) { })
})

router.get('/drive-download/:name', (req, res) => {
    var fileName = req.params.name

    var options = {
        root: "../file",
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }


    res.sendFile(fileName, options, function (err) { })
})

module.exports = router
