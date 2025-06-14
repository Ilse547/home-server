import express, { response } from "express"
import {logger} from './middleware/logger.js'
import multer from "multer";
import path, { resolve } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import os from "os"


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get('/', (request, response) => {
  const uploadDir = path.join(__dirname, "uploads")
  fs.readdir(uploadDir, (error, files) => {
    if(error){
      console.error("error reading the directory: ", error)
      return response.status(500).send("unanle to load diles.");
    }
      response.render('index', {files })
  })
})

app.get('/upload', (request, response) =>{
  response.render('upload')
})
app.post("/up", upload.single("myFile"), (request, response) => {

  const file = request.file
  const newFileName = request.body.newFileName

  if(!file){
    return response.status(400).send("no file uploaded :(");
  }

  const uploadDir = path.join(__dirname, "uploads")
  const newFilePath = newFileName
    ? path.join(uploadDir, `${newFileName}${path.extname(file.originalname)}`) // Use the new name with the original extension
    : file.path; // Keep the original name if no new name is provided
  if(newFileName){
    fs.rename(file.path, newFilePath, (error) =>{
      if(error){
        console.error("error renaming file: ", error)
        return response.status(500).send("error renamign file.")
      }
      response.redirect("/")
    })
  } else{
    response.redirect("/")
  }


})

app.get("/download:filename", (request, response) => {
  const filename = request-URLSearchParams.filename
  const filePath = path.join(__dirname, "uploads", filename)

  if(!fs.existsSync(filePath)){
    return response.status(404).send("file not found :(")
  }

  response.download(filePath, filename, (error) => {
    if(error){
      console.error("there was an error trying to download the file: ", error)
      response.status(500).send("error downloading the file")
    }
  })
})

// Route to handle file deletion
app.post("/delete/:filename", (request, response) => {
  const filename = request.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return response.status(404).send("File not found");
  }

  // Delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return response.status(500).send("Error deleting file");
    }

    console.log(`File deleted: ${filename}`);
    response.redirect("/"); // Redirect back to the home page
  });
});


function getLocalIPAdress(){
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for(const iface of interfaces[interfaceName] || []){
      if (iface.family == "IPv4" && !iface.internal){
        return iface.address
      }
    }
  }
  return "localhost"
}

app.listen(PORT, () => {
  const localIP = getLocalIPAdress()
console.log(` server on http://localhost:${3000}`)
console.log(` Network: http://${localIP}:${PORT}`)

})