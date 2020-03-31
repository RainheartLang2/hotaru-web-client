const express = require('express')
const path = require('path')

const app = express()

app.use('/webpack.bundle.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/webpack.bundle.js'))
})

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
})

app.listen(3000, () => {
    console.log('App listening on port 3000!')
})
