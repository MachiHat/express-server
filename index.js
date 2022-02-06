const express = require('express');

const PORT = process.env.PORT || 8080;

const app = express();

app.get('/api', (req, res) => {
    res.json({message: "HELLO WORLD, THIS IS EXPRESS"})
})

const connectedServer = app.listen(PORT, () => {
    console.log(`SERVER IS LIVE ON PORT: ${[PORT]}`)
});

connectedServer.on('error', (error) => {
    console.log(error.message);
})