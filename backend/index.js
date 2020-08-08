const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const curl = new (require("curl-request"))();
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("uploads"));

var storedFilename = "";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        storedFilename = new Date().toISOString() + "-" + file.originalname;
        cb(null, storedFilename);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 6,
    },
    fileFilter,
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const url = "http://161.35.204.135:8080/detections";
app.post("/send", upload.array("images"), (req, resp) => {
    var formData = new FormData();

    var fdata = formData.append("images", req.files[0].path);
    curl.setMultipartBody([
        {
            name: "images",
            file: req.files[0].path,
            type: req.files[0].mimetype,
        },
    ])
        .post(url)
        .then(({ statusCode, body, headers }) => {
            resp.send(JSON.stringify(body.response[0].detections));
            fs.unlink("./uploads/" + storedFilename, (err) => {
                if (err) return console.error("err");
            });
        })
        .catch((e) => {
            console.log(e);
        });
});

app.listen(port, () => {});
