const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("uploads"));

function serverLog(callerFuncName, message) {
    console.log(`${callerFuncName} => ${message}`);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
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

    var data = new FormData();
    data.append("images", fs.createReadStream(req.files[0].path));

    var config = {
        method: "post",
        url: process.env.ApiUrl,
        headers: {
            ...data.getHeaders(),
        },
        data: data,
    };

    axios(config)
        .then(function (response) {
            fs.unlink("./uploads/" + file.originalname, (err) => {
                if (err) {
                    serverLog("fs.unlink", `fs.unlink error: ${err}`);
                    return console.error("err");
                }
            });
            serverLog("/send", "response send successfully");
            resp.send(response.data.response[0].detections);
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.listen(port, () => {
    console.log(`on :${port}`);
});
