# object-detection-app

https://bs-detection.herokuapp.com/

![](https://media.giphy.com/media/Ih0IoHInv0x3vm4Nnr/giphy.gif)

This app detects objects in an image and returns detections as JSON by using REST api which uses [yolov3](https://pjreddie.com/darknet/yolo/) with [COCO dataset.](https://cocodataset.org/#home)


## Project Structure
The app uses React in client-side and Node.js (Express framework) in server-side.
![](https://raw.githubusercontent.com/buraksekili/object-detection-app/master/screenshots/flow.jpg)

## API

The api is Flask API and running on DigitalOcean droplet. It reads images and runs YoloV3 detection model over image. Then, server returns class and accuracy of the detected objects as JSON response.

## Screenshots
<p >
  <img src="screenshots/1.PNG" alt="home" width=48% />
  <img src="screenshots/2.PNG" alt="input box" width=48%/>
  <br />
  <img src="screenshots/3.PNG" alt="sending input" width=48%/>
  <img src="screenshots/4.PNG" alt="result" width=48%/>
</p>
