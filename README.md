# [Uzuki](https://panepo.github.io/Mochizuki/)

[![Build Status][travis-image]][travis-url] [![Style Status][prettier-image]][prettier-url] [![Coverage Status][codecov-image]][codecov-url]

[travis-image]: https://travis-ci.org/Panepo/Mochizuki.svg
[travis-url]: https://travis-ci.org/Panepo/Mochizuki.svg?branch=master

[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg
[prettier-url]: https://github.com/prettier/prettier

[codecov-image]: https://codecov.io/gh/Panepo/Mochizuki/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/Panepo/Mochizuki

React implementation of drowsiness detection.

![Screenshot](https://github.com/Panepo/Mochizuki/blob/master/documents/sceeenshot.png)

## FAQ

### What is this?

This is an implementation of drowsiness detection algorithm running purely on the browser using the Tensorflow.js and face.api library.

### How the drowsiness detection works?

The program scan images from webcam frame by frame. Finding if there is a face on the image and extract the landmark of the face. Then calculating the eye aspect ration(EAR) by the vertical eye landmarks and the distances between the horizontal eye landmarks

The value of the eye aspect ratio will be approximately constant when the eye is open. The value will then rapid decrease towards zero during a blink. If the eye is closed, the eye aspect ratio will again remain approximately constant, but will be much smaller than the ratio when the eye is open. Detailed information can be found [here](http://vision.fe.uni-lj.si/cvww2016/proceedings/papers/05.pdf)

### Is my data safe?

Your data and pictures here never leave your computer! In fact, this is one of the main advantages of running neural networks in your browser. Instead of sending us your data, we send you both the model and the code to run the model. You don't need to install Python, Tensorflow or something, these are then run by your browser.

### How big are the models I'm downloading?

Your browser will download a model around ~271KB in size.

## Requirements

* Webcam
* Browser (Chrome is perfered)

## Install

Nothing. Only a webcam and a tensorflow.js supported browser are needed.

## Reference

* [Eye Blink Detection](http://vision.fe.uni-lj.si/cvww2016/proceedings/papers/05.pdf)
* [face-api.js](https://github.com/justadudewhohacks/face-api.js)
* [Tensorflow.js](https://js.tensorflow.org/)
* [React](https://facebook.github.io/react/)
* [Redux](http://redux.js.org/)
* [Create React App ](https://github.com/facebook/create-react-app)
* [Material Design Lite](https://getmdl.io/)
* [Material-UI](https://material-ui.com/)
* [react-webcam](https://github.com/mozmorris/react-webcam)

## Develop

### Development Requirements
* node `^8.11.0`
* yarn `^1.13.0`

### Getting Start

1. Clone source code
```
$ git clone https://github.com/Panepo/Uzuki.git
```
2. Install dependencies
```
$ cd Uzuki
$ yarn
```
3. Start development server and visit [http://localhost:3000/](http://localhost:3000/)
```
$ yarn start
```
### Scripts

|`yarn <script>`       |Description|
|-------------------|-----------|
|`start`            |Serves your app at `localhost:3000`|
|`test`             |Run test code in ./src|
|`lint`             |Lint code in ./src|
|`prettier`         |Prettier code in ./src|
|`build`            |Builds the production application to ./build|
|`deploy`           |Deploy the production application to github pages|

### Production

Build code before deployment by running `yarn build`.

## Author

[Panepo](https://github.com/Panepo)
