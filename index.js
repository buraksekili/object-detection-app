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

let fileName = "";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    fileName = file.originalname;
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
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.post("/send", upload.array("images"), (req, resp) => {
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
      fs.unlink("./uploads/" + fileName, (err) => {
        if (err) {
          return console.error("err");
        }
      });
      resp.send(response.data.response[0].detections);
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.post("/image", upload.array("images"), (req, res) => {
  var data = new FormData();
  data.append("images", fs.createReadStream(req.files[0].path));
  var config = {
    method: "post",
    url: process.env.ImageResponse,
    headers: {
      ...data.getHeaders(),
    },
    data: data,
    responseType: "arraybuffer",
  };

  axios(config)
    .then((response) => {
      fs.unlink("./uploads/" + fileName, (err) => {
        if (err) {
          return console.error("err");
        }
      });

      res.send(Buffer.from(response.data, "binary").toString("base64"));
    })
    .catch((e) => {
      console.error(e);
    });
});

app.listen(port, () => {
  console.log(`on :${port}`);
});
