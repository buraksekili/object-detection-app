import React, { useState } from "react";
import axios from "axios";
import Loading from "./components/Loading";
import "./styles/style.css";

const url = "http://127.0.0.1:3000/send";
const App = () => {
    const [resJSON, setResJSON] = useState(null);
    const [rawJSON, setRawJSON] = useState(null);
    const [inpImg, setInpImg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imagePrev, setImagePrev] = useState(null);

    const downloadFile = async () => {
        var finalData = JSON.parse(JSON.stringify(rawJSON));
        var dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(finalData));
        var dlAnchorElem = document.getElementById("download-link");
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "results.json");
    };

    const makeBlurBackground = (reset) => {
        var elem = document.getElementById("input-prev-img");

        if (reset) {
            elem.style.removeProperty("filter");
            return;
        }
        elem.style.filter = "blur(4px)";
    };

    function makePostReq() {
        const fd = new FormData();
        fd.append("images", inpImg);
        axios
            .post("/send", fd)
            .then((res) => {
                setIsLoading(false);
                setResJSON(JSON.stringify(res.data, null, 4));
                setRawJSON(res.data);
                makeBlurBackground(true);
            })
            .catch((err) => {
                setIsLoading(false);
                makeBlurBackground(true);
                console.log(err);
                console.log("error:", err.message);
            });
    }

    return (
        <div className="app-container" id="app-container">
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
                        setInpImg(e.target.files[0]);
                        try {
                            setImagePrev(
                                URL.createObjectURL(e.target.files[0])
                            );
                        } catch (error) {
                            setImagePrev(null);
                            console.error(error);
                        }
                    }}
                ></input>
                <label for="file" id="selector">
                    Select Image
                </label>
                {inpImg && (
                    <button
                        onClick={() => {
                            makeBlurBackground(false);
                            setIsLoading(true);
                            makePostReq();
                        }}
                    >
                        UPLOAD
                    </button>
                )}
            </form>
            <div className="input-prev-div">
                <img
                    alt={imagePrev && "inp"}
                    src={imagePrev}
                    className="input-prev-img"
                    id="input-prev-img"
                ></img>
            </div>
            {isLoading ? (
                <Loading />
            ) : (
                resJSON && (
                    <div class="result">
                        <a
                            id="download-link"
                            href="/"
                            onClick={() => downloadFile()}
                        >
                            Download as JSON
                        </a>
                        <pre>{resJSON}</pre>
                    </div>
                )
            )}
        </div>
    );
};

export default App;
