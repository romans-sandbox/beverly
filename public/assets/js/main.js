var vendor = {
  /** @see http://stackoverflow.com/a/21395720 */
  drawImageProp: function(ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
      x = y = 0;
      w = ctx.canvas.width;
      h = ctx.canvas.height;
    }

    /// default offset is center
    offsetX = offsetX ? offsetX : 0.5;
    offsetY = offsetY ? offsetY : 0.5;

    /// keep bounds [0.0, 1.0]
    if (offsetX < 0) {
      offsetX = 0;
    }
    if (offsetY < 0) {
      offsetY = 0;
    }
    if (offsetX > 1) {
      offsetX = 1;
    }
    if (offsetY > 1) {
      offsetY = 1;
    }

    var iw = img.width,
      ih = img.height,
      r = Math.min(w / iw, h / ih),
      nw = iw * r,   /// new prop. width
      nh = ih * r,   /// new prop. height
      cx, cy, cw, ch, ar = 1;

    /// decide which gap to fill
    if (nw < w) {
      ar = w / nw;
    }
    if (nh < h) {
      ar = h / nh;
    }
    nw *= ar;
    nh *= ar;

    /// calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    /// make sure source rectangle is valid
    if (cx < 0) {
      cx = 0;
    }
    if (cy < 0) {
      cy = 0;
    }
    if (cw > iw) {
      cw = iw;
    }
    if (ch > ih) {
      ch = ih;
    }

    /// fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  }
};

var common = function() {
  var module = {}, v = {};

  module.areaButton = function(area, button) {
    area.addEventListener('mouseover', function() {
      button.classList.add('forced-hover');
    });

    area.addEventListener('mouseout', function() {
      button.classList.remove('forced-hover');
    });

    area.addEventListener('click', function() {
      button.click();
    });
  };

  return module;
}();

var lipsDrawing = function() {
  var module = {}, v = {};

  var options = {
    controlBoxSize: 38,
    upperCurvatureOffset: 100,
    lowerCurvatureOffset: 70,
    threshold: 0.9,
    pointDiff: 0.005,
    durations: {
      controlReturn: 0.5
    }
  };

  var status = {
    upper: {
      movable: false,
      startX: 0,
      prevX: 0,
      progress: 0
    },
    lower: {
      movable: false,
      startX: 0,
      prevX: 0,
      progress: 0
    }
  };

  module.query = function() {
    v.upperContainer = document.querySelector('#lips-drawing-upper-container');
    v.lowerContainer = document.querySelector('#lips-drawing-lower-container');
    v.upperControl = document.querySelector('#lips-drawing-upper-control');
    v.upperControlArrow = v.upperControl.querySelector('div.arrow');
    v.upperTrajectory = document.querySelector('#lips-drawing-upper-trajectory');
    v.lowerControl = document.querySelector('#lips-drawing-lower-control');
    v.lowerControlArrow = v.lowerControl.querySelector('div.arrow');
    v.lowerTrajectory = document.querySelector('#lips-drawing-lower-trajectory');
  };

  function calculateTrajectoryPoint(t, prev, upper) {
    var containerBox, availWidth, point, prevPoint;

    containerBox = upper ? v.upperContainer.getBoundingClientRect() : v.lowerContainer.getBoundingClientRect();
    availWidth = containerBox.width - options.controlBoxSize;

    point = {
      x: t * availWidth,
      y: 2 * t * (1 - t) * (upper ? -options.upperCurvatureOffset : -options.lowerCurvatureOffset),
      angle: null
    };

    if (!prev) {
      if (t < options.pointDiff) {
        prevPoint = calculateTrajectoryPoint(t + options.pointDiff, true, upper);
        point.angle = Math.atan2(prevPoint.y - point.y, prevPoint.x - point.x);
      } else {
        prevPoint = calculateTrajectoryPoint(t - options.pointDiff, true, upper);
        point.angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
      }

      point.angle /= -2 * Math.PI / 360;
    }

    return point;
  }

  function calculateUpperX(ev, start) {
    var containerBox, availWidth, result;

    containerBox = v.upperContainer.getBoundingClientRect();
    availWidth = containerBox.width - options.controlBoxSize;
    result = availWidth - ev.pageX + containerBox.left + options.controlBoxSize / 2 - start;

    if (result < 0) {
      result = 0;
    }

    if (result > availWidth) {
      result = availWidth;
    }

    return result;
  }

  function calculateLowerX(ev, start) {
    var containerBox, availWidth, result;

    containerBox = v.lowerContainer.getBoundingClientRect();
    availWidth = containerBox.width - options.controlBoxSize;
    result = ev.pageX - containerBox.left - options.controlBoxSize / 2 - start;

    if (result < 0) {
      result = 0;
    }

    if (result > availWidth) {
      result = availWidth;
    }

    return result;
  }

  function setStyle(container, style) {
    container.classList.remove('style-1');
    container.classList.remove('style-2');
    container.classList.remove('style-3');
    container.classList.remove('style-4');
    container.classList.remove('style-5');
    container.classList.remove('style-6');
    container.classList.add(style);
  }

  module.initUpper = function(threshold, style, callback) {
    (function() {
      var point;

      point = calculateTrajectoryPoint(0, null, true);

      v.upperControlArrow.style.transform = 'rotate(' + (point.angle) + 'deg)';
    })();

    if (!threshold) {
      threshold = 1;
    }

    setStyle(v.upperContainer, style);

    v.upperControl.addEventListener('mousedown', function(ev) {
      ev.preventDefault();

      status.upper.movable = true;

      status.upper.startX = calculateUpperX(ev, 0) - status.upper.prevX;
    }, false);

    document.addEventListener('mouseup', function() {
      var o, point;

      if (status.upper.movable) {
        status.upper.movable = false;

        if (status.upper.progress === 1) {
          if (typeof callback === 'function') {
            callback();
          }
        } else if (status.upper.progress < threshold) {
          if (status.upper.progress > 0) {
            o = {x: status.upper.progress};

            TweenLite.to(o, options.durations.controlReturn, {
              x: 0,
              onUpdate: function() {
                point = calculateTrajectoryPoint(o.x, null, true);

                v.upperControl.style.right = point.x + 'px';
                v.upperControl.style.top = point.y + 'px';
                v.upperControlArrow.style.transform = 'rotate(' + (point.angle) + 'deg)';
              },
              onComplete: function() {
                status.upper.prevX = 0;
                status.upper.progress = 0;
              }
            });
          }
        } else {
          o = {x: status.upper.progress};

          TweenLite.to(o, options.durations.controlReturn, {
            x: 1,
            onUpdate: function() {
              point = calculateTrajectoryPoint(o.x, null, true);

              v.upperControl.style.right = point.x + 'px';
              v.upperControl.style.top = point.y + 'px';
              v.upperControlArrow.style.transform = 'rotate(' + (point.angle) + 'deg)';
            },
            onComplete: function() {
              status.upper.prevX = 1 - options.pointDiff;
              status.upper.progress = 1;

              if (typeof callback === 'function') {
                callback();
              }
            }
          });
        }
      }
    }, false);

    document.addEventListener('mousemove', function(ev) {
      var containerBox, availWidth, point, upperX;

      ev.preventDefault();

      containerBox = v.upperContainer.getBoundingClientRect();
      availWidth = containerBox.width - options.controlBoxSize;

      if (status.upper.movable) {
        upperX = calculateUpperX(ev, status.upper.startX);

        status.upper.prevX = upperX;
        status.upper.progress = upperX / availWidth;

        point = calculateTrajectoryPoint(upperX / availWidth, null, true);

        v.upperControl.style.right = point.x + 'px';
        v.upperControl.style.top = point.y + 'px';
        v.upperControlArrow.style.transform = 'rotate(' + (point.angle) + 'deg)';
      }
    }, false);
  };

  module.initLower = function(threshold, style, canvassedFramesWrapper, callback) {
    (function() {
      var point;

      point = calculateTrajectoryPoint(0, null, false);

      v.lowerControlArrow.style.transform = 'rotate(' + (point.angle + 180) + 'deg)';
    })();

    if (!threshold) {
      threshold = 1;
    }

    setStyle(v.lowerContainer, style);

    v.lowerControl.addEventListener('mousedown', function(ev) {
      ev.preventDefault();

      status.lower.movable = true;

      status.lower.startX = calculateLowerX(ev, 0) - status.lower.prevX;
    }, false);

    document.addEventListener('mouseup', function() {
      var o, point;

      if (status.lower.movable) {
        status.lower.movable = false;

        if (status.lower.progress === 1) {
          if (typeof callback === 'function') {
            callback();
          }
        } else if (status.lower.progress < threshold) {
          if (status.lower.progress > 0) {
            o = {x: status.lower.progress};

            TweenLite.to(o, options.durations.controlReturn, {
              x: 0,
              onUpdate: function() {
                point = calculateTrajectoryPoint(o.x, null, false);

                v.lowerControl.style.left = point.x + 'px';
                v.lowerControl.style.bottom = point.y + 'px';
                v.lowerControlArrow.style.transform = 'rotate(' + (point.angle + 180) + 'deg)';

                canvassedFramesWrapper.seek(o.x);
              },
              onComplete: function() {
                status.lower.prevX = 0;
                status.lower.progress = 0;
              }
            });
          }
        } else {
          o = {x: status.lower.progress};

          TweenLite.to(o, options.durations.controlReturn, {
            x: 1,
            onUpdate: function() {
              point = calculateTrajectoryPoint(o.x, null, false);

              v.lowerControl.style.left = point.x + 'px';
              v.lowerControl.style.bottom = point.y + 'px';
              v.lowerControlArrow.style.transform = 'rotate(' + (point.angle + 180) + 'deg)';

              canvassedFramesWrapper.seek(o.x);
            },
            onComplete: function() {
              status.lower.prevX = 1 - options.pointDiff;
              status.lower.progress = 1;

              if (typeof callback === 'function') {
                callback();
              }
            }
          });
        }
      }
    }, false);

    document.addEventListener('mousemove', function(ev) {
      var containerBox, availWidth, point, lowerX;

      ev.preventDefault();

      containerBox = v.lowerContainer.getBoundingClientRect();
      availWidth = containerBox.width - options.controlBoxSize;

      if (status.lower.movable) {
        lowerX = calculateLowerX(ev, status.lower.startX);

        status.lower.prevX = lowerX;
        status.lower.progress = lowerX / availWidth;

        point = calculateTrajectoryPoint(lowerX / availWidth, null, false);

        v.lowerControl.style.left = point.x + 'px';
        v.lowerControl.style.bottom = point.y + 'px';
        v.lowerControlArrow.style.transform = 'rotate(' + (point.angle + 180) + 'deg)';

        canvassedFramesWrapper.seek(status.lower.progress);
      }
    }, false);
  };

  return module;
}();

var magicControls = function() {
  var module = {};

  var options = {};

  var curtainClusters = {};

  module.initRadial = function(context, threshold, callback) {
    var wrappers, i;

    if (!context) {
      context = document;
    }

    if (!threshold) {
      threshold = 1;
    }

    wrappers = context.querySelectorAll('[data-magic-control="radial"]');

    if (wrappers) {
      for (i = 0; i < wrappers.length; i++) {
        (function(wrapper, control, shadows, duration) {
          var controlBox, targetRadius, timeline;
          var i, firstShadowName = null;

          controlBox = control.getBoundingClientRect();

          wrapper.addEventListener('mousedown', function() {
            targetRadius = Math.sqrt(
                Math.pow(
                  Math.max(
                    controlBox.left,
                    window.innerWidth - controlBox.left - controlBox.width
                  ),
                  2
                ) +
                Math.pow(
                  Math.max(
                    controlBox.top,
                    window.innerHeight - controlBox.top - controlBox.height
                  ),
                  2
                )
              ) + controlBox.width;

            wrapper.classList.add('state-0');

            timeline = new TimelineLite();

            if (shadows) {
              for (i = 0; i < shadows.length; i++) {
                (function(shadowName, radius) {
                  if (firstShadowName === null) {
                    firstShadowName = shadowName;
                  }

                  timeline.fromTo(shadows[i], i === 0 ? 0.05 : duration / shadows.length, {
                    left: controlBox.width / 2,
                    top: controlBox.height / 2,
                    width: 0,
                    height: 0
                  }, {
                    width: radius * 2,
                    height: radius * 2,
                    left: -radius + controlBox.width / 2,
                    top: -radius + controlBox.height / 2,
                    ease: Power4.easeOut,
                    onStart: function() {
                      wrapper.classList.add('state-' + shadowName);
                    },
                    onReverseComplete: function() {
                      wrapper.classList.remove('state-' + shadowName);

                      if (shadowName === firstShadowName) {
                        wrapper.classList.remove('state-0');
                      }
                    }
                  });
                })(
                  shadows[i].getAttribute('data-shadow'),
                  i === 0
                    ? controlBox.width / 2 * 1.25
                    : targetRadius / Math.pow(shadows.length, 2) * Math.pow(i + 1, 2)
                );
              }
            }

            timeline.eventCallback('onComplete', function() {
              if (typeof callback === 'function') {
                callback(wrapper);
              }
            });
          });

          wrapper.addEventListener('mouseup', function() {
            if (threshold >= 1 || timeline.progress() < threshold) {
              timeline.duration(duration / 3);
              timeline.reverse();
            }
          });
        })(
          wrappers[i],
          wrappers[i].querySelector('[data-control]'),
          wrappers[i].querySelectorAll('[data-shadow]'),
          +wrappers[i].getAttribute('data-duration')
        );
      }
    }
  };

  module.initCurtain = function(curtain, close, context) {
    var wrappers, i, foldedCluster;

    if (!context) {
      context = document;
    }

    wrappers = context.querySelectorAll('[data-magic-control="curtain"]');

    if (wrappers) {
      for (i = 0; i < wrappers.length; i++) {
        (function(wrapper, duration, curtainClusterTarget) {
          if (wrapper.hasAttribute('data-fold')) {
            wrapper.addEventListener('click', function() {
              if (duration) {
                curtain.overrideFoldDuration(duration);
              }

              curtain.fold(function() {
                if (wrapper.hasAttribute('data-curtain-cluster-target')) {
                  curtainClusterTarget = magicControls.findCurtainCluster(
                    wrapper.getAttribute('data-curtain-cluster-target')
                  );

                  if (curtainClusterTarget) {
                    curtainClusterTarget.fold();

                    foldedCluster = curtainClusterTarget;
                  }
                }
              });

              close.classList.add('visible');
            });
          }

          if (wrapper.hasAttribute('data-unfold')) {
            wrapper.addEventListener('click', function() {
              if (duration) {
                curtain.overrideUnfoldDuration(duration);
              }

              close.classList.remove('visible');
            });
          }
        })(
          wrappers[i],
          +wrappers[i].getAttribute('data-duration')
        );
      }
    }

    close.addEventListener('click', function() {
      curtain.unfold(function() {
        if (foldedCluster) {
          foldedCluster.unfold();
          foldedCluster = null;
        }
      });

      close.classList.remove('visible');
    });
  };

  module.initCurtainClusters = function(context) {
    var i, clusters;

    if (!context) {
      context = document;
    }

    clusters = context.querySelectorAll('[data-curtain-cluster]');

    if (clusters) {
      for (i = 0; i < clusters.length; i++) {
        (function(cluster, clusterName) {
          clusterName = cluster.getAttribute('data-curtain-cluster');

          curtainClusters[clusterName] = new MagicCurtainCluster(cluster);
        })(
          clusters[i]
        );
      }
    }
  };

  module.findCurtainCluster = function(clusterName) {
    if (clusterName in curtainClusters) {
      return curtainClusters[clusterName];
    }

    console.error('Unknown curtain cluster `' + clusterName + '`.');
  };

  return module;
}();

////

var MagicCurtain = function(curtain) {
  var options = {
    durations: {
      fold: 1, // default, in seconds
      unfold: 0.25 // default, in seconds
    }
  };

  var initialised = false, timeline, shadows, content;

  this.overrideFoldDuration = function(duration) {
    options.durations.fold = duration;
  };

  this.overrideUnfoldDuration = function(duration) {
    options.durations.unfold = duration;
  };

  this.init = function() {
    var firstShadowName = null;

    shadows = curtain.querySelectorAll('[data-shadow]');
    content = curtain.querySelector('[data-content]');

    timeline = new TimelineLite();

    if (shadows) {
      for (i = 0; i < shadows.length; i++) {
        (function(i, shadowName, sizeCoefficient) {
          if (firstShadowName === null) {
            firstShadowName = shadowName;
          }

          timeline.fromTo(shadows[i], options.durations.fold / shadows.length, {
            width: 0
          }, {
            width: sizeCoefficient * 100 + '%',
            ease: Power4.easeOut,
            onStart: function() {
              curtain.classList.add('state-' + shadowName);

              //noinspection JSReferencingMutableVariableFromClosure
              if (shadowName === firstShadowName) {
                curtain.classList.add('state-0');
              }

              if (content && i === shadows.length - 1) {
                // last
                TweenLite.fromTo(content, options.durations.fold / shadows.length, {
                  width: 0
                }, {
                  width: '100%',
                  ease: Power4.easeOut
                });
              }
            },
            onReverseComplete: function() {
              curtain.classList.remove('state-' + shadowName);

              //noinspection JSReferencingMutableVariableFromClosure
              if (shadowName === firstShadowName) {
                curtain.classList.remove('state-0');
              }
            }
          });
        })(
          i,
          shadows[i].getAttribute('data-shadow'),
          2 / 3 + 1 / 3 / (shadows.length - 1) * i
        );
      }
    }

    timeline.pause();

    initialised = true;
  };

  this.fold = function(asyncCallback) {
    if (!initialised) {
      console.error('Timeline not initialised.');
      return;
    }

    if (timeline.reversed()) {
      timeline.reverse();
    }

    timeline.duration(options.durations.fold);
    timeline.play();

    if (typeof asyncCallback === 'function') {
      window.setTimeout(asyncCallback, options.durations.fold * 1000);
    }
  };

  this.unfold = function(asyncCallback) {
    if (!initialised) {
      console.error('Timeline not initialised.');
      return;
    }

    timeline.duration(options.durations.unfold);
    timeline.reverse();

    if (typeof asyncCallback === 'function') {
      asyncCallback();
    }
  };

  this.foldAt = function(coefficient) {
    if (!initialised) {
      console.error('Timeline not initialised.');
      return;
    }

    timeline.seek(coefficient, false);
    timeline.pause();
  };
};

var FancyContent = function(wrapper) {
  var options = {
    durations: {
      folding: 0.5,
      unfolding: 0.5
    }
  };

  var wrapperBox, main, shadowA, shadowB, timeline;

  wrapperBox = wrapper.getBoundingClientRect();

  main = wrapper.querySelector('div.main');
  shadowA = wrapper.querySelector('div.shadow-a');
  shadowB = wrapper.querySelector('div.shadow-b');

  wrapper.style.height = wrapperBox.height + 'px';
  main.style.height = '0';
  shadowA.style.height = '0';
  shadowB.style.height = '0';

  wrapper.classList.add('ready');

  timeline = new TimelineLite();

  timeline.to(shadowA, options.durations.folding / 3, {
    height: wrapperBox.height
  });

  timeline.to(shadowB, options.durations.folding / 3, {
    height: wrapperBox.height
  });

  timeline.to(main, options.durations.folding / 3, {
    height: wrapperBox.height,
    onComplete: function() {
      wrapper.classList.remove('ready');
    }
  });

  timeline.pause();

  this.fold = function() {
    if (timeline.reversed()) {
      timeline.reverse();
      wrapper.classList.add('ready');
    }

    timeline.duration(options.durations.folding);
    timeline.play();
  };

  this.unfold = function() {
    wrapper.classList.add('ready');

    timeline.duration(options.durations.unfolding);
    timeline.reverse();
  };

  this.wrapper = wrapper;
};

var MagicCurtainCluster = function(cluster) {
  var initialised, title, text, fancyTitle, fancyText;

  title = cluster.querySelector('[data-title]');
  text = cluster.querySelector('[data-text]');

  this.fold = function() {
    cluster.classList.add('visible');

    if (!initialised) {
      fancyTitle = new FancyContent(title);
      fancyText = new FancyContent(text);

      initialised = true;
    }

    fancyTitle.fold();
    fancyText.fold();
  };

  this.unfold = function() {
    new Chain()
      .add(function() {
        fancyTitle.unfold();
        fancyText.unfold();
      })
      .wait(0.5)
      .add(function() {
        cluster.classList.remove('visible');
      })
      .run();
  };
};

FancyContent.initWrappers = function(context) {
  var i, wrappers;

  if (!context) {
    context = document;
  }

  wrappers = context.querySelectorAll('[data-fancy-content]');

  if (wrappers) {
    for (i = 0; i < wrappers.length; i++) {
      (function(wrapper, main, shadowA, shadowB) {
        shadowA = document.createElement('div');

        shadowA.innerHTML = main.innerHTML;
        shadowA.classList.add('shadow-a');

        wrapper.appendChild(shadowA);

        shadowB = document.createElement('div');

        shadowB.innerHTML = main.innerHTML;
        shadowB.classList.add('shadow-b');

        wrapper.appendChild(shadowB);
      })(
        wrappers[i],
        wrappers[i].querySelector('div.main')
      );
    }
  }
};

var CanvassedFramesWrapper = function(canvas, framesCount, framePathPattern) {
  var self = this;
  var frames = [], framesLoaded = 0, i, ctx;
  var lastProgress = null;

  this.init = function(callback) {
    ctx = canvas.getContext('2d');

    for (i = 0; i < framesCount; i++) {
      (function(i, image) {
        image = new Image();

        image.addEventListener('load', function() {
          framesLoaded++;

          if (framesLoaded === framesCount) {
            if (typeof callback === 'function') {
              callback.apply(this);
            }
          }
        });

        image.src = framePathPattern.replace('?', function() {
          var n;

          n = i + 1;

          if (n < 10) {
            n = '0' + n;
          }

          return n;
        });

        frames.push(
          image
        );
      })(
        i
      );
    }

    function canvasToFit() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (lastProgress !== null) {
        self.seek(lastProgress);
      }
    }

    canvasToFit();

    window.addEventListener('resize', canvasToFit);
    window.addEventListener('orientationchange', canvasToFit);
  };

  this.seek = function(progress) {
    var frameIndex;

    frameIndex = Math.floor((framesCount - 1) * progress);

    vendor.drawImageProp(ctx, frames[frameIndex], 0, 0, canvas.width, canvas.height);

    lastProgress = progress;
  };
};

///

// magicControls.initRadial();

// var commonCurtain = new MagicCurtain(document.querySelector('#common-curtain'));
// commonCurtain.init();
// magicControls.initCurtain(commonCurtain);
// magicControls.initCurtainCloseTrigger(commonCurtain, document.querySelector('#common-curtain-close-trigger'));

///

// FancyContent.initWrappers();
//
// var myFancyContent = new FancyContent(document.querySelector('#my-fancy-content'));
// myFancyContent.fold();
//
// window.setTimeout(function() {
//   myFancyContent.unfold();
//
//   window.setTimeout(function() {
//     myFancyContent.fold();
//
//     window.setTimeout(function() {
//       myFancyContent.unfold();
//     }, 2000);
//   }, 2000);
// }, 2000);

var Chain = function() {
  var raw = [];

  function step(i) {
    if (typeof raw[i] === 'function') {
      raw[i]();
      step(++i);
    } else {
      window.setTimeout(function() {
        step(++i);
      }, raw[i]);
    }
  }

  this.add = function(func) {
    if (typeof func === 'function') {
      raw.push(func);
    }

    return this;
  };

  this.wait = function(seconds) {
    raw.push(+seconds * 1000);

    return this;
  };

  this.run = function() {
    step(0);

    return this;
  };
};

var main = function() {
  var module = {}, v = {};

  var commonCurtain, fancyIntroAbhLogo, fancyIntroText;
  var introChain, getStartedChain;
  var drawingCanvasLower1;

  module.query = function() {
    v.commonCurtain = document.querySelector('#common-curtain');
    v.commonCurtainCloseTrigger = document.querySelector('#common-curtain-close-trigger');
    v.introCluster = document.querySelector('#intro-cluster');
    v.introAbhLogo = document.querySelector('#intro-abh-logo');
    v.introText = document.querySelector('#intro-text');
    v.introGetStartedContainer = document.querySelector('#intro-get-started-container');
    v.pageLeftControls = document.querySelector('#page-left-controls');
    v.pageRightControls = document.querySelector('#page-right-controls');
    v.introGetStartedButton = document.querySelector('#intro-get-started-button');
    v.mimicsCluster = document.querySelector('#mimics-cluster');
    v.lipstickChoiceCluster = document.querySelector('#lipstick-choice-cluster');
    v.lipsDrawingCluster = document.querySelector('#lips-drawing-cluster');
    v.lipsDrawingUpperContainer = document.querySelector('#lips-drawing-upper-container');
    v.lipsDrawingLowerContainer = document.querySelector('#lips-drawing-lower-container');
    v.productPreviewMidnight = document.querySelector('#product-preview-midnight');
    v.productPreviewMidnightButton = document.querySelector('#product-preview-midnight-button');
    v.drawingVideo1 = document.querySelector('#drawing-video-1');
    v.drawingCanvasLower1 = document.querySelector('#lips-drawing-canvas-lower-1');
  };

  module.init = function() {
    FancyContent.initWrappers();

    commonCurtain = new MagicCurtain(v.commonCurtain);
    commonCurtain.init();
    magicControls.initCurtain(commonCurtain, v.commonCurtainCloseTrigger);
    magicControls.initCurtainClusters();

    fancyIntroAbhLogo = new FancyContent(v.introAbhLogo);
    fancyIntroText = new FancyContent(v.introText);
    
    drawingCanvasLower1 = new CanvassedFramesWrapper(v.drawingCanvasLower1, 58, 'assets/img/ld1/lower?.jpg');

    drawingCanvasLower1.init(function() {
      drawingCanvasLower1.seek(0);
    });

    introChain = new Chain()
      .wait(1)
      .add(function() {
        fancyIntroAbhLogo.wrapper.parentNode.classList.add('visible');
        fancyIntroAbhLogo.fold();
      })
      .wait(2)
      .add(function() {
        fancyIntroAbhLogo.unfold();
      })
      .wait(2)
      .add(function() {
        fancyIntroText.wrapper.parentNode.classList.add('visible');
        fancyIntroText.fold();
      })
      .wait(0.5)
      .add(function() {
        fancyIntroText.wrapper.parentNode.classList.add('up');
        v.introGetStartedContainer.classList.add('visible');
        v.pageLeftControls.classList.add('visible');
        v.pageRightControls.classList.add('visible');
      });

    getStartedChain = new Chain()
      .add(function() {
        v.introText.parentNode.classList.remove('up');
        v.introGetStartedContainer.classList.remove('visible');
        fancyIntroText.unfold();
      })
      .wait(1)
      .add(function() {
        v.introCluster.classList.add('hidden');
        v.mimicsCluster.classList.add('visible');
      })
      .wait(1)
      .add(function() {
        v.mimicsCluster.classList.remove('visible');

        v.lipstickChoiceCluster.classList.add('visible');
        magicControls.initRadial(v.lipstickChoiceCluster, 0.5, function(wrapper) {
          var style;

          v.lipstickChoiceCluster.classList.remove('visible');
          v.lipsDrawingCluster.classList.add('visible');

          lipsDrawing.query();

          v.lipsDrawingLowerContainer.classList.add('visible');

          // is there a better way?
          style = wrapper.classList.contains('style-1')
            ? 'style-1'
            : wrapper.classList.contains('style-2')
            ? 'style-2'
            : wrapper.classList.contains('style-3')
            ? 'style-3'
            : wrapper.classList.contains('style-4')
            ? 'style-4'
            : wrapper.classList.contains('style-5')
            ? 'style-5'
            : wrapper.classList.contains('style-6')
            ? 'style-6'
            : null;

          v.productPreviewMidnight.classList.add('visible');

          v.drawingCanvasLower1.classList.add('visible');
          
          lipsDrawing.initLower(0.5, style, drawingCanvasLower1, function() {
            v.lipsDrawingLowerContainer.classList.remove('visible');
            v.lipsDrawingUpperContainer.classList.add('visible');

            lipsDrawing.initUpper(0.5, style, function() {
              v.lipsDrawingUpperContainer.classList.remove('visible');

              alert('What now?');
            });
          });
        });
      });

    common.areaButton(v.productPreviewMidnight, v.productPreviewMidnightButton);
  };

  module.run = function() {
    introChain.run();

    v.introGetStartedButton.addEventListener('click', function() {
      getStartedChain.run();
    });
  };

  return module;
}();

main.query();
main.init();
main.run();
