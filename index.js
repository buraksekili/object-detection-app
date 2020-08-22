const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const cors = require("cors");
const fs = require("fs");
const { Curl } = require("node-libcurl");
const path = require("path");
const curl = new Curl();

const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

app.use(cors());
app.use(express.static("uploads"));

var storedFilename = "";

function serverLog(callerFuncName, message) {
    console.log(`${callerFuncName} => ${message}`);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        storedFilename = file.originalname;

        cb(null, storedFilename);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
    ) {
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
        res.sendFile(
            path.resolve(__dirname, "frontend", "build", "index.html")
        );
    });
}

app.post("/send", upload.array("images"), (req, resp) => {
    serverLog("/send", "started");

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
            if (err) {
                serverLog("fs.unlink", `fs.unlink error: ${err}`);
                return console.error("err");
            }
        });
        resp.status(statusCode).send(newBody.response[0].detections);
    });
    curl.on("error", function (error) {
        this.close();
        serverLog("curl.on", `curl.on error: ${error}`);
        resp.send(error);
    });
    curl.perform();
});

app.listen(port, () => {
    console.log(`on :${port}`);
});
