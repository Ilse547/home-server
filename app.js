import express, { response } from "express"
import {logger} from './middleware/logger.js'
import multer from "multer";
import path from "path";

const app = express()
const PORT = 3000
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
});

const upload = multer({storage: storage});


app.use(express.static('public'))
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(logger)

app.get('/', (request, response) => {
  response.render('index')
})

app.get('/upload', (request, response) =>{
  response.render('upload')
})
app.post("/up", upload.single("myFile"), (request, response) => {
  if(!request.file){
    return response.status(400).send("no file uploaded :(");
  }
    response.redirect("/")
})

app.listen(PORT, () => {
console.log(` server on http://localhost:${3000}`);

})