import express from "express"
import {logger} from './middleware/logger.js'


const app =express()
const PORT = 3000


app.use(logger)

app.get('/', (request, response) => {
  response.send('hi')
})

app.listen(PORT, () => {
console.log(` server on http://localhost:${3000}`);

})