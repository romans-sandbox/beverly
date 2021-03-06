<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>beverly</title>
  <link rel="stylesheet" href="assets/css/main.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">
</head>
<body>
  <div id="common-curtain" class="magic-curtain style-0">
    <div class="shadow-a" data-shadow="a"></div>;
    <div class="shadow-b" data-shadow="b"></div>
    <div class="shadow-c" data-shadow="c"></div>
    <div class="shadow-d" data-shadow="d"></div>
  </div>
  <div class="magic-curtain-close" id="common-curtain-close-trigger">&times;</div>
  <div class="magic-curtain-cluster" data-curtain-cluster="credits-legal">
    <div class="title">
      <div class="fancy-text style-b" data-title data-fancy-content>
        <div class="main">
          Credits & Legal
        </div>
      </div>
    </div>
    <div class="text">
      <div class="fancy-text style-b" data-text data-fancy-content>
        <div class="main">
          <p>
            Digital experience & interactions &mdash; <strong>nullmighty</strong>
          </p>
          <p>
            Protagonist &mdash; <strong>easyneon</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="magic-curtain-cluster" data-curtain-cluster="share">
    <div class="title">
      <div class="fancy-text style-b" data-title data-fancy-content>
        <div class="main">
          Share Experience
        </div>
      </div>
    </div>
    <div class="text">
      <div class="fancy-text style-b" data-text data-fancy-content>
        <div class="main">
          <p>
            Share please!!!!
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="product-preview" id="product-preview-midnight">
    <div class="image">
      <img src="assets/img/liquid-lipstick-midnight.png" alt="Midnight Lipstick">
    </div>
    <div class="action">
      <div class="simple-button small style-1" id="product-preview-midnight-button"
           data-magic-control="curtain" data-fold data-style="0"
           data-curtain-cluster-target="product-midnight">
        <button class="control">view product details</button>
      </div>
    </div>
  </div>
  <div class="magic-curtain-cluster" data-curtain-cluster="product-midnight">
    <div class="title">
      <div class="fancy-text style-b" data-title data-fancy-content>
        <div class="main">
          Product Midnight
        </div>
      </div>
    </div>
    <div class="text">
      <div class="fancy-text style-b" data-text data-fancy-content>
        <div class="main">
          <p>
            All the content goes here!!!
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="magic-curtain right style-1" id="look-curtain">
    <div class="shadow-a" data-shadow="a"></div>
    <div class="shadow-b" data-shadow="b"></div>
    <div class="shadow-c" data-shadow="c"></div>
    <div class="shadow-d" data-shadow="d"></div>
  </div>
  <div class="page-controls left" id="page-left-controls">
    <div class="simple-button small" data-magic-control="curtain" data-fold data-style="1"
         data-curtain-cluster-target="credits-legal">
      <button class="control">credits & legal</button>
    </div><!--
    --><div class="simple-button small" title="Share this experience on social media."
            data-magic-control="curtain" data-fold data-style="1"
            data-curtain-cluster-target="share">
      <button class="control"><i class="fa fa-share-alt" aria-hidden="true"></i>&nbsp;&nbsp;share</button>
    </div><!--
    --><div class="simple-button small" title="Go or exit full screen mode." id="full-screen-button">
      <button class="control"><i class="fa fa-arrows-alt" aria-hidden="true"></i></button>
    </div>
  </div>
  <div class="page-controls right" id="page-right-controls">
    <a href="http://www.anastasiabeverlyhills.com/" target="_blank"><div class="abh-logo-horizontal-small"></div></a>
    <a href="https://nullmighty.com" target="_blank"><div class="nullmighty-symbol-small"></div></a>
  </div>
  <div class="cluster visible" id="intro-cluster">
    <div class="intro-video">
      <video preload autoplay muted>
        <source src="assets/video/intro-orig.mp4" type="video/mp4">
      </video>
    </div>
    <div class="intro-abh">
      <div class="fancy-image" data-fancy-content id="intro-abh-logo">
        <div class="main">
          <div class="abh-logo-large"></div>
        </div>
      </div>
    </div>
    <div class="intro-text">
      <div class="fancy-text style-0" data-fancy-content id="intro-text">
        <div class="main">
          choose the perfect shade
        </div>
      </div>
    </div>
    <div class="intro-get-started-container" id="intro-get-started-container">
      <div class="simple-button large style-1" id="intro-get-started-button">
        <button class="control">get started</button>
      </div>
    </div>
    <!--<div style="width: 400px; padding: 100px; font-size: 1.5em;">
      <div class="fancy-text style-1" data-fancy-content id="my-fancy-text">
        <div class="main">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam laborum molestiae perferendis quibusdam
          ratione! Atque blanditiis consequuntur delectus dolores doloribus harum, illo ipsum itaque laudantium neque
          nesciunt perferendis ullam velit?
        </div>
      </div>
    </div>-->
  </div>
  <div class="cluster" id="mimics-cluster">
    <div class="mimics-video" id="mimics-video-container">
      <video id="mimics-video" width="100%" height="100%" preload>
        <source src="assets/video/mimics.mp4" type="video/mp4">
      </video>
    </div>
  </div>
  <div class="cluster" id="lipstick-choice-cluster">
    <div class="lipstick-video" id="lipstick-video-container">
      <video id="lipstick-video" width="100%" height="100%" preload loop>
        <source src="assets/video/no-lipstick.mp4" type="video/mp4">
      </video>
    </div>
    <div class="lipstick-colors-container">
      <div class="magic-disk style-1" data-magic-control="radial" data-duration="1.5">
        <div class="disk" data-control></div>
        <div class="shadow-a" data-shadow="a"></div>
        <div class="shadow-b" data-shadow="b"></div>
        <div class="shadow-c" data-shadow="c"></div>
        <div class="shadow-d" data-shadow="d"></div>
      </div><!--
      --><div class="magic-disk style-2" data-magic-control="radial" data-duration="1.5">
        <div class="disk" data-control></div>
        <div class="shadow-a" data-shadow="a"></div>
        <div class="shadow-b" data-shadow="b"></div>
        <div class="shadow-c" data-shadow="c"></div>
        <div class="shadow-d" data-shadow="d"></div>
      </div><!--
      --><div class="magic-disk style-3" data-magic-control="radial" data-duration="1.5">
        <div class="disk" data-control></div>
        <div class="shadow-a" data-shadow="a"></div>
        <div class="shadow-b" data-shadow="b"></div>
        <div class="shadow-c" data-shadow="c"></div>
        <div class="shadow-d" data-shadow="d"></div>
      </div><!--
      --><div class="magic-disk style-4" data-magic-control="radial" data-duration="1.5">
        <div class="disk" data-control></div>
        <div class="shadow-a" data-shadow="a"></div>
        <div class="shadow-b" data-shadow="b"></div>
        <div class="shadow-c" data-shadow="c"></div>
        <div class="shadow-d" data-shadow="d"></div>
      </div><!--
      --><div class="magic-disk style-5" data-magic-control="radial" data-duration="1.5">
        <div class="disk" data-control></div>
        <div class="shadow-a" data-shadow="a"></div>
        <div class="shadow-b" data-shadow="b"></div>
        <div class="shadow-c" data-shadow="c"></div>
        <div class="shadow-d" data-shadow="d"></div>
      </div><!--
      --><div class="magic-disk style-6" data-magic-control="radial" data-duration="1.5">
        <div class="disk" data-control></div>
        <div class="shadow-a" data-shadow="a"></div>
        <div class="shadow-b" data-shadow="b"></div>
        <div class="shadow-c" data-shadow="c"></div>
        <div class="shadow-d" data-shadow="d"></div>
      </div>
    </div>
  </div>
  <div class="cluster" id="lips-drawing-cluster">
    <div class="lips-drawing-video" id="drawing-video-container-1">
      <video id="drawing-video-1" width="100%" height="100%" preload>
        <source src="assets/video/drawing-1.mp4" type="video/mp4">
      </video>
    </div>
    <canvas class="lips-drawing" id="lips-drawing-canvas-lower-1"></canvas>
    <canvas class="lips-drawing" id="lips-drawing-canvas-upper-1"></canvas>
    <div class="lips-drawing-video" id="drawing-video-container-2">
      <video id="drawing-video-2" width="100%" height="100%" preload>
        <source src="assets/video/drawing-2.mp4" type="video/mp4">
      </video>
    </div>
    <canvas class="lips-drawing" id="lips-drawing-canvas-lower-2"></canvas>
    <canvas class="lips-drawing" id="lips-drawing-canvas-upper-2"></canvas>
    <div class="lips-drawing-video" id="drawing-video-container-3">
      <video id="drawing-video-3" width="100%" height="100%" preload>
        <source src="assets/video/drawing-3.mp4" type="video/mp4">
      </video>
    </div>
    <canvas class="lips-drawing" id="lips-drawing-canvas-lower-3"></canvas>
    <canvas class="lips-drawing" id="lips-drawing-canvas-upper-3"></canvas>
    <div class="lips-drawing-video" id="drawing-video-container-4">
      <video id="drawing-video-4" width="100%" height="100%" preload>
        <source src="assets/video/drawing-4.mp4" type="video/mp4">
      </video>
    </div>
    <canvas class="lips-drawing" id="lips-drawing-canvas-lower-4"></canvas>
    <canvas class="lips-drawing" id="lips-drawing-canvas-upper-4"></canvas>
    <div class="lips-drawing-video" id="drawing-video-container-5">
      <video id="drawing-video-5" width="100%" height="100%" preload>
        <source src="assets/video/drawing-5.mp4" type="video/mp4">
      </video>
    </div>
    <canvas class="lips-drawing" id="lips-drawing-canvas-lower-5"></canvas>
    <canvas class="lips-drawing" id="lips-drawing-canvas-upper-5"></canvas>
    <div class="lips-drawing-video" id="drawing-video-container-6">
      <video id="drawing-video-6" width="100%" height="100%" preload>
        <source src="assets/video/drawing-6.mp4" type="video/mp4">
      </video>
    </div>
    <canvas class="lips-drawing" id="lips-drawing-canvas-lower-6"></canvas>
    <canvas class="lips-drawing" id="lips-drawing-canvas-upper-6"></canvas>
    <div class="lips-drawing-container upper" id="lips-drawing-upper-container">
      <div class="control upper" id="lips-drawing-upper-control">
        <div class="main"><div class="arrow"></div></div>
        <div class="shadow"></div>
      </div>
      <div class="trajectory upper" id="lips-drawing-upper-trajectory">
        <svg xmlns="http://www.w3.org/2000/svg" width="264" height="100">
          <g transform="translate(3, 2)">
            <path d="M0,50 C0,50 126,-60 258,50"></path>
          </g>
        </svg>
      </div>
    </div>
    <div class="lips-drawing-container lower" id="lips-drawing-lower-container">
      <div class="control lower" id="lips-drawing-lower-control">
        <div class="main"><div class="arrow"></div></div>
        <div class="shadow"></div>
      </div>
      <div class="trajectory lower" id="lips-drawing-lower-trajectory">
        <svg xmlns="http://www.w3.org/2000/svg" width="264" height="100">
          <g transform="translate(3, 4)">
            <path d="M0,0 C0,0 126,76 258,0"></path>
          </g>
        </svg>
      </div>
    </div>
  </div>
  <div class="cluster" id="look-cluster-1">
    <div class="look-video" id="look-video-container-1">
      <video id="look-video-1" width="100%" height="100%" preload>
        <source src="assets/video/final-1.mp4" type="video/mp4">
      </video>
    </div>
  </div>
  <div class="cluster" id="look-cluster-2">
    <div class="look-video" id="look-video-container-2">
      <video id="look-video-2" width="100%" height="100%" preload>
        <source src="assets/video/final-2.mp4" type="video/mp4">
      </video>
    </div>
  </div>
  <div class="cluster" id="look-cluster-3">
    <div class="look-video" id="look-video-container-3">
      <video id="look-video-3" width="100%" height="100%" preload>
        <source src="assets/video/final-3.mp4" type="video/mp4">
      </video>
    </div>
  </div>
  <div class="cluster" id="look-cluster-4">
    <div class="look-video" id="look-video-container-4">
      <video id="look-video-4" width="100%" height="100%" preload>
        <source src="assets/video/final-4.mp4" type="video/mp4">
      </video>
    </div>
  </div>
  <div class="cluster" id="look-cluster-5">
    <div class="look-video" id="look-video-container-5">
      <video id="look-video-5" width="100%" height="100%" preload>
        <source src="assets/video/final-5.mp4" type="video/mp4">
      </video>
    </div>
  </div>
  <div class="cluster" id="look-cluster-6">
    <div class="look-video" id="look-video-container-6">
      <video id="look-video-6" width="100%" height="100%" preload>
        <source src="assets/video/final-6.mp4" type="video/mp4">
      </video>
    </div>
  </div>
  <script src="assets/js/vendor/tweenmax.min.js"></script>
  <script src="assets/js/main.js"></script>
</body>
</html>
