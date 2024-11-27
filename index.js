const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())
app.use(cors())
const router = require('./src/router')





// console.log("Environment Variables Loaded:", process.env);
// console.log("AWS_ACCESS_KEY_IDjjjjj:", process.env.AWS_ACCESS_KEY_ID);
// console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY);
// console.log("AWS_REGION:", process.env.AWS_REGION);

app.use("/v1",router)

app.listen(6001, () => {
  console.log("Server Started")
})

