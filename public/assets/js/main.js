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
    v.container = document.querySelector('#lips-drawing-container');
    v.upperControl = document.querySelector('#lips-drawing-upper-control');
    v.upperControlArrow = v.upperControl.querySelector('div.arrow');
    v.upperTrajectory = document.querySelector('#lips-drawing-upper-trajectory');
    v.lowerControl = document.querySelector('#lips-drawing-lower-control');
    v.lowerControlArrow = v.lowerControl.querySelector('div.arrow');
    v.lowerTrajectory = document.querySelector('#lips-drawing-lower-trajectory');
  };

  function calculateTrajectoryPoint(t, prev, upper) {
    var containerBox, availWidth, point, prevPoint;

    containerBox = v.container.getBoundingClientRect();
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

    containerBox = v.container.getBoundingClientRect();
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

    containerBox = v.container.getBoundingClientRect();
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

  module.initUpper = function(threshold, callback) {
    (function() {
      var point;

      point = calculateTrajectoryPoint(0, null, true);

      v.upperControlArrow.style.transform = 'rotate(' + (point.angle) + 'deg)';
    })();

    if (!threshold) {
      threshold = 1;
    }

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

      containerBox = v.container.getBoundingClientRect();
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

  module.initLower = function(threshold, callback) {
    (function() {
      var point;

      point = calculateTrajectoryPoint(0, null, false);

      v.lowerControlArrow.style.transform = 'rotate(' + (point.angle + 180) + 'deg)';
    })();

    if (!threshold) {
      threshold = 1;
    }

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

      containerBox = v.container.getBoundingClientRect();
      availWidth = containerBox.width - options.controlBoxSize;

      if (status.lower.movable) {
        lowerX = calculateLowerX(ev, status.lower.startX);

        status.lower.prevX = lowerX;
        status.lower.progress = lowerX / availWidth;

        point = calculateTrajectoryPoint(lowerX / availWidth, null, false);

        v.lowerControl.style.left = point.x + 'px';
        v.lowerControl.style.bottom = point.y + 'px';
        v.lowerControlArrow.style.transform = 'rotate(' + (point.angle + 180) + 'deg)';
      }
    }, false);
  };

  return module;
}();

var magicControls = function() {
  var module = {};

  var options = {};

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
                callback();
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

  module.initCurtain = function(curtain, context) {
    var wrappers, i;

    if (!context) {
      context = document;
    }

    wrappers = context.querySelectorAll('[data-magic-control="curtain"]');

    if (wrappers) {
      for (i = 0; i < wrappers.length; i++) {
        (function(wrapper, duration) {
          if (wrapper.hasAttribute('data-fold')) {
            wrapper.addEventListener('click', function() {
              if (duration) {
                curtain.overrideFoldDuration(duration);
              }

              curtain.fold();
            });
          }

          if (wrapper.hasAttribute('data-unfold')) {
            wrapper.addEventListener('click', function() {
              if (duration) {
                curtain.overrideUnfoldDuration(duration);
              }

              curtain.unfold();
            });
          }
        })(
          wrappers[i],
          +wrappers[i].getAttribute('data-duration')
        );
      }
    }
  };

  module.initCurtainCloseTrigger = function(curtain, close) {
    close.addEventListener('click', function() {
      curtain.unfold();
    });
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

  var initialised = false, timeline, shadows;

  this.overrideFoldDuration = function(duration) {
    options.durations.fold = duration;
  };

  this.overrideUnfoldDuration = function(duration) {
    options.durations.unfold = duration;
  };

  this.init = function() {
    var firstShadowName = null;

    shadows = curtain.querySelectorAll('[data-shadow]');

    timeline = new TimelineLite();

    if (shadows) {
      for (i = 0; i < shadows.length; i++) {
        (function(shadowName, sizeCoefficient) {
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
          shadows[i].getAttribute('data-shadow'),
          2 / 3 + 1 / 3 / (shadows.length - 1) * i
        );
      }
    }

    timeline.pause();

    initialised = true;
  };

  this.fold = function() {
    if (!initialised) {
      console.error('Timeline not initialised.');
      return;
    }

    if (timeline.reversed()) {
      timeline.reverse();
    }

    timeline.duration(options.durations.fold);
    timeline.play();
  };

  this.unfold = function() {
    if (!initialised) {
      console.error('Timeline not initialised.');
      return;
    }

    timeline.duration(options.durations.unfold);
    timeline.reverse();
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

FancyContent.initWrappers();

var commonCurtain = new MagicCurtain(document.querySelector('#common-curtain'));
commonCurtain.init();
magicControls.initCurtain(commonCurtain);
magicControls.initCurtainCloseTrigger(commonCurtain, document.querySelector('#common-curtain-close-trigger'));

var abhIntroLogo = new FancyContent(document.querySelector('#my-fancy-image'));
var introText = new FancyContent(document.querySelector('#intro-fancy-text'));
var introGetStartedContainer = document.querySelector('#intro-get-started-container');
var pageLeftControls = document.querySelector('#page-left-controls');
var pageRightControls = document.querySelector('#page-right-controls');

window.setTimeout(function() {
  abhIntroLogo.wrapper.parentNode.classList.add('visible');
  abhIntroLogo.fold();

  window.setTimeout(function() {
    abhIntroLogo.unfold();

    window.setTimeout(function() {
      introText.wrapper.parentNode.classList.add('visible');
      introText.fold();

      window.setTimeout(function() {
        introText.wrapper.parentNode.classList.add('up');
        introGetStartedContainer.classList.add('visible');
        pageLeftControls.classList.add('visible');
        pageRightControls.classList.add('visible');
      }, 500);
    }, 2000);
  }, 2000);
}, 1000);

var getStartedButton = document.querySelector('#get-started-button');
var intro = document.querySelector('#intro');
var mimicsBackground = document.querySelector('#mimics-background');
var lipstickChoice = document.querySelector('#lipstick-choice-container');
var lipsDrawingContainer = document.querySelector('#lips-drawing-super');
var lipsDrawingUpperContainer = document.querySelector('#lips-drawing-upper-container');
var lipsDrawingLowerContainer = document.querySelector('#lips-drawing-lower-container');

getStartedButton.addEventListener('click', function() {
  introText.wrapper.parentNode.classList.remove('up');
  introGetStartedContainer.classList.remove('visible');
  introText.unfold();

  window.setTimeout(function() {
    intro.classList.add('hidden');
    mimicsBackground.classList.add('visible');

    window.setTimeout(function() {
      mimicsBackground.classList.remove('visible');

      lipstickChoice.classList.add('visible');
      magicControls.initRadial(lipstickChoice, 0.5, function() {
        lipstickChoice.classList.remove('visible');
        lipsDrawingContainer.classList.add('visible');

        lipsDrawing.query();

        lipsDrawing.initLower(0.5, function() {
          lipsDrawing.initUpper(0.5, function() {
            lipsDrawingUpperContainer.classList.remove('visible');

            alert('What now?');
          });

          lipsDrawingLowerContainer.classList.remove('visible');
          lipsDrawingUpperContainer.classList.add('visible');
        });

        lipsDrawingLowerContainer.classList.add('visible');
      });
    }, 1000);
  }, 1000);
});
