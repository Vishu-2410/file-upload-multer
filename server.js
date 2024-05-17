const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('myImage');

// Check file type
function checkFileType(file, cb) {
  // Allowed file types
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Route to upload file
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      if (req.file == undefined) {
        return res.status(400).json({ msg: 'No file selected!' });
      } else {
        return res.status(200).json({
          msg: 'File uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));