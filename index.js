const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const apiRoutes = require('./routers/index');

// MIDDLEWARES

app.use(express.static('public'));

// ROUTES

app.use('/api', apiRoutes);

const connectedServer = app.listen(PORT, () => {
  console.log(`SERVER IS LIVE ON PORT: ${[PORT]}`);
});

connectedServer.on("error", (error) => {
  console.log(error.message);
});
