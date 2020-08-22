const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
// const curl = new (require("curl-request"))();
const cors = require("cors");
const fs = require("fs");
// const ApiUrl = require("./apiUrl");
const { Curl } = require("node-libcurl");

const curl = new Curl();
const close = curl.close.bind(curl);

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

if (process.env.NODE_ENV === "production") {
    app.use(express.static("frontend/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
    });
}

app.post("/send", upload.array("images"), (req, resp) => {
    var formData = new FormData();
    var fdata = formData.append("images", req.files[0].path);
    // curl.setOpt(Curl.option.URL, ApiUrl);
    curl.setOpt(Curl.option.URL, process.env.ApiUrl);
    curl.setOpt(Curl.option.HTTPPOST, [
        {
            name: "images",
            file: req.files[0].path,
            type: req.files[0].mimetype,
        },
    ]);
    curl.on("end", function (statusCode, body, headers) {
        const newBody = JSON.parse(body);
        fs.unlink("./uploads/" + storedFilename, (err) => {
            if (err) return console.error("err");
        });
        resp.status(statusCode).send(newBody.response[0].detections);
    });
    curl.on("error", function (error) {
        this.close();
        resp.send(error);
    });
    curl.perform();
    // curl.setMultipartBody([
    //     {
    //         name: "images",
    //         file: req.files[0].path,
    //         type: req.files[0].mimetype,
    //     },
    // ])
    //     .post(url)
    //     .then(({ statusCode, body, headers }) => {
    //         resp.send(JSON.stringify(body.response[0].detections));
    //         fs.unlink("./uploads/" + storedFilename, (err) => {
    //             if (err) return console.error("err");
    //         });
    //     })
    //     .catch((e) => {
    //         console.log(e);
    //     });
});

app.listen(port, () => {
    console.log(`on :${port}`);
});
