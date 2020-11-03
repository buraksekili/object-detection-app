import axios from "axios";
import { Box, Button, Grommet } from "grommet";
import { Upload } from "grommet-icons";
import React, { useState } from "react";
import Gallery from "./Gallery";
import Navbar from "./Navbar";
import "./style.css";

const theme = {
  global: {
    colors: {
      backgroundColor: "#00739D",
      buttonColor: "#00C781",
      nav: "#00C781",
    },
  },
};

const App = () => {
  const [inputImage, setInputImage] = useState(null);
  const [inputImageURL, setInputImageURL] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [detectionJSON, setDetectionJSON] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  function getDetectionJSON() {
    const fd = new FormData();
    fd.append("images", inputImage);
    axios
      .post("/send", fd)
      .then((res) => {
        setDetectionJSON(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err.message);
      });
  }

  const getDetectedImage = () => {
    const fd = new FormData();
    fd.append("images", inputImage);

    axios
      .post("/image", fd, { responseType: "stream" })
      .then((res) => {
        getDetectionJSON();
        setIsLoading(true);
        setOutputImage(res.data);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  return (
    <Grommet full={true} theme={theme} background="backgroundColor">
      <Navbar />
      <Box direction="column" pad="medium" justify="center" align="center">
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              setInputImage(e.target.files[0]);
              try {
                setInputImageURL(URL.createObjectURL(e.target.files[0]));
              } catch (error) {
                setInputImageURL(null);
                console.error(error);
              }
            }}
          ></input>
          <label htmlFor="file">
            <Upload /> Select Image{" "}
          </label>

          {inputImage && (
            <Button
              margin={{ left: "medium" }}
              label="UPLOAD"
              color="buttonColor"
              primary
              onClick={() => {
                setIsLoading(true);
                getDetectedImage();
              }}
            />
          )}
        </form>

        <Gallery inputImageURL={inputImageURL} outputImage={outputImage} />
        {detectionJSON && <pre>{JSON.stringify(detectionJSON, null, 2)}</pre>}
        {isLoading && <p>Loading ...</p>}
      </Box>
    </Grommet>
  );
};

export default App;
