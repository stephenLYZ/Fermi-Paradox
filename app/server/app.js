var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var compress = require('compression')

var routes = require('./routes')

var app = express()

app.use(compress())

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(favicon(path.join(__dirname, '../public/favicon.ico')))

app.use(express.static(path.join(__dirname, '../public')))

app.use('/api/',routes)

module.exports = app
