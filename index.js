const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/user/:id', function (req, res) {
    // const q = req.params
    // console.log(q.id)
    const q = req.query
    console.log(q)

    res.send('멍멍')
})

app.get('/cat', function (req, res) {
    res.send('냐옹')
})

app.listen(3000)