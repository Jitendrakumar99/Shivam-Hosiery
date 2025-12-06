const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Add this line
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const nodemailer = require("nodemailer");
dotenv.config(); 
const route = require("./routes/MainRoutes");
app = express();

// Add body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(route);
app.get("/", (req, res) => {
  res.send("helloworld");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  
  const upload = multer({ storage: storage });
  
  app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ message: "File uploaded successfully", file: req.file });
  });


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});


app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL, 
            subject: `Portfolio Contact Form - Message from ${name}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Sender's Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

app.listen(PORT, (req, res) => {
  console.log(`server is runing ${PORT}`);
});
