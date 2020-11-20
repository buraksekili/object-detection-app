# object-detection-app
[![DeepScan grade](https://deepscan.io/api/teams/10736/projects/13607/branches/232729/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=10736&pid=13607&bid=232729)


![](https://media.giphy.com/media/Ih0IoHInv0x3vm4Nnr/giphy.gif)


This app detects objects in an image and returns detections as JSON by using REST api which uses [yolov3](https://pjreddie.com/darknet/yolo/) with [COCO dataset.](https://cocodataset.org/#home)


## Demo
https://bs-detection.herokuapp.com/

## Project Structure
The app uses React in client-side and Node.js (Express framework) in server-side.
![](https://raw.githubusercontent.com/buraksekili/object-detection-app/master/screenshots/flow.jpg)

## API

The object detection api is Flask API and running on DigitalOcean droplet. It reads images and runs YoloV3 detection model over an image. Then, server returns class and accuracy of the detected objects as JSON response.

![flow](https://user-images.githubusercontent.com/32663655/99792702-85547600-2b38-11eb-833c-e2a8569a227e.jpg)
