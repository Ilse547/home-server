import express from "express"
import {logger} from './middleware/logger.js'


const app =express()
const PORT = 3000
app.use(express.static('public'))
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(logger)

app.get('/', (request, response) => {
  response.render('index')
})

app.listen(PORT, () => {
console.log(` server on http://localhost:${3000}`);

})