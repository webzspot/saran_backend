const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())
app.use(cors())
const router = require('./src/router')

app.use("/v1",router)

app.listen(6001, () => {
  console.log("Server Started")
})