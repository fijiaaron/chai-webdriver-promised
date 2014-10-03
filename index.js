var fs = require('fs');
var string = require('string');
var seleniumWebdriver = require('selenium-webdriver');
var sizzle = require('webdriver-sizzle-promised');
var Q = require('q');

//TODO add displayed method which just returns selenium's isDisplayed result
module.exports = function(driver, timeout) {
  var $ = sizzle(driver);

  timeout = timeout || 1000;

  return function(chai, utils) {
    //convert the weird  selenium promise to a Q promise
    var promise = function(selPromise) {
      var defer = Q.defer();

      selPromise.then(function() {
        defer.resolve.apply(defer, arguments);
      });
      selPromise.thenCatch(function() {
        defer.reject.apply(defer, arguments);
      });

      return defer.promise;
    };

    //select a bunch of DOM elements
    var selectAll = function(selector, eventually) {
      var defer = Q.defer();
      var retry = eventually;

      if (retry) {
        setTimeout(function() {
          retry = false;
        }, timeout);
      }

      var sel = function() {
        var selection = $.all(selector);
        selection.then(function(els) {
          if (els.length === 0 && retry) {
            //retry every 100 ms until success or timeout
            setTimeout(sel, 100);
          }
          else {
            defer.resolve(els);
          }
        });
        selection.fail(function() {
          defer.reject.apply(defer, arguments);
        });
      };

      sel();

      return defer.promise;
    };

    //select a single DOM element
    var select = function(selector, eventually) {
      var defer = Q.defer();
      var retry = eventually;

      if (retry) {
        setTimeout(function() {
          retry = false;
        }, timeout);
      }

      var sel = function() {
        var selection = $(selector);
        selection.then(function(el) {
          defer.resolve(el);
        });
        selection.fail(function() {
          if (retry) {
            setTimeout(sel, 100);
          }
          else {
            defer.reject.apply(defer, arguments);
          }
        });
      };

      sel();

      return defer.promise;
    };

    var assertElementExists = function(selector, eventually) {
      return select(selector, eventually).fail(function() {
        throw new Error('element does not exist');
      });
    };

    chai.Assertion.addProperty('dom', function() {
      utils.flag(this, 'dom', true);
    });
    chai.Assertion.addProperty('eventually', function() {
      utils.flag(this, 'eventually', true);
    });
    chai.Assertion.addProperty('larger', function() {
      utils.flag(this, 'parseNumber', true);
      utils.flag(this, 'larger', true);
    });
    chai.Assertion.addProperty('smaller', function() {
      utils.flag(this, 'parseNumber', true);
      utils.flag(this, 'smaller', true);
    });
    chai.Assertion.overwriteMethod('match', function(_super) {
      return function(matcher) {
        var self = this;

        if (utils.flag(this, 'dom')) {
          return assertElementExists(this._obj, utils.flag(this, 'eventually')).then(function(el) {
            return el.getText().then(function(text) {
              self.assert(matcher.test(text), 'Expected element <#{this}> to match regular expression "#{exp}", but it contains "#{act}".', 'Expected element <#{this}> not to match regular expression "#{exp}"; it contains "#{act}".', matcher, text);
            });
          });
        }
        else {
          return _super.call(this, matcher);
        }
      };
    });
    chai.Assertion.addMethod('visible', function() {
      var self = this;

      if (!utils.flag(this, 'dom')) {
        throw new Error('Can only test visibility of dom elements');
      }

      var assert = function(condition) {
        self.assert(condition, 'Expected #{this} to be visible but it is not', 'Expected #{this} to not be visible but it is');
      };

      return assertElementExists(self._obj, utils.flag(self, 'eventually')).then(function(el) {
        return el.isDisplayed().then(function(visible) {
          //selenium may say it's visible even though it's off-screen
          if (visible) {
            return promise(driver.manage().window().getSize()).then(function(winSize) {
              return el.getSize().then(function(size) {
                return el.getLocation().then(function(loc) {
                  return assert(loc.x > -size.width && loc.y > -size.height && loc.y < winSize.height && loc.x < winSize.width);
                });
              });
            });
          }
          else {
            return assert(visible);
          }
        });
      }, function(err) {
        if (utils.flag(self, 'negate')) {
          return assert(false);
        }
        throw err;
      });
    });
    chai.Assertion.addMethod('count', function(length) {
      var self = this;

      if (!utils.flag(this, 'dom')) {
        throw new Error('Can only test count of dom elements');
      }

      return selectAll(this._obj, utils.flag(this, 'eventually')).then(function(els) {
        if (utils.flag(self, 'larger')) {
          self.assert(els.length >= length, 'Expected #{this} to appear more than #{exp} times, but it appeared #{act} times.', 'Expected #{this} not to appear more than #{exp} times, but it appeared #{act} times.', length, els.length);
        }
        else if (utils.flag(self, 'smaller')) {
          self.assert(els.length <= length, 'Expected #{this} to appear less than #{exp} times, but it appeared #{act} times.', 'Expected #{this} not to appear less than #{exp} times, but it appeared #{act} times.', length, els.length);
        }
        else {
          self.assert(els.length === length, 'Expected #{this} to appear #{exp} times, but it appeared #{act} times.', 'Expected #{this} not to appear #{exp} times, but it did.', length, els.length);
        }
      });
    });
    chai.Assertion.addMethod('text', function(matcher) {
      var self = this;

      if (!utils.flag(this, 'dom')) {
        throw new Error('Can only test text of dom elements');
      }

      return assertElementExists(this._obj, utils.flag(this, 'eventually')).then(function(el) {
        return el.getText().then(function(text) {
          if (matcher instanceof RegExp) {
            self.assert(matcher.test(text), 'Expected element <#{this}> to match regular expression "#{exp}", but it contains "#{act}".', 'Expected element <#{this}> not to match regular expression "#{exp}"; it contains "#{act}".', matcher, text);
          }
          else if (utils.flag(self, 'contains')) {
            self.assert(~text.indexOf(matcher), 'Expected element <#{this}> to contain text "#{exp}", but it contains "#{act}" instead.', 'Expected element <#{this}> not to contain text "#{exp}", but it contains "#{act}".', matcher, text);
          }
          else if (utils.flag(self, 'parseNumber')) {
            text = text.length;

            if (utils.flag(self, 'larger')) {
              self.assert(text >= matcher, 'Expected length of text of element <#{this}> to be larger than #{exp}, but it was #{act}.', 'Expected length of text of element <#{this}> to not be larger than #{exp}, but it was #{act}.', matcher, text);
            }
            else if (utils.flag(self, 'smaller')) {
              self.assert(text <= matcher, 'Expected length of text of element <#{this}> to be smaller than #{exp}, but it was #{act}.', 'Expected length of text of element <#{this}> to not be smaller than #{exp}, but it was #{act}.', matcher, text);
            }
          }
          else {
            self.assert(text === matcher, 'Expected text of element <#{this}> to be "#{exp}", but it was "#{act}" instead.', 'Expected text of element <#{this}> not to be "#{exp}", but it was.', matcher, text);
          }
        });
      });
    });
    chai.Assertion.addMethod('style', function(property, value) {
      var self = this;

      if (!utils.flag(this, 'dom')) {
        throw new Error('Can only test style of dom elements');
      }

      return assertElementExists(this._obj, utils.flag(this, 'eventually')).then(function(el) {
        return el.getCssValue(property).then(function(style) {
          if (utils.flag(self, 'parseNumber')) {
            style = parseFloat(style);

            if (utils.flag(self, 'larger')) {
              self.assert(style >= value, 'Expected style ' + property + ' of element <#{this}> to be larger than #{exp}, but it was #{act}.', 'Expected style ' + property + ' of element <#{this}> not to be larger than #{exp}, but it was #{act}.', value, style);
            }
            else if (utils.flag(self, 'smaller')) {
              self.assert(style <= value, 'Expected style ' + property + ' of element <#{this}> to be smaller than #{exp}, but it was #{act}.', 'Expected style ' + property + ' of element <#{this}> not to be smaller than #{exp}, but it was #{act}.', value, style);
            }
          }
          else {
            self.assert(style === value.toString(), 'Expected style ' + property + ' of element <#{this}> to be #{exp}, but it was #{act}.', 'Expected ' + property + ' of element <#{this}> to not be #{exp}, but it was.');
          }
        });
      });
    });
    chai.Assertion.addMethod('value', function(value) {
      var self = this;

      if (!utils.flag(this, 'dom')) {
        throw new Error('Can only test value of dom elements');
      }

      return assertElementExists(this._obj, utils.flag(this, 'eventually')).then(function(el) {
        return el.getAttribute('value').then(function(actualValue) {
          if (utils.flag(self, 'parseNumber')) {
            actualValue = parseFloat(actualValue);

            if (utils.flag(self, 'larger')) {
              self.assert(actualValue >= value, 'Expected value of element <#{this}> to be larger than #{exp}, but it was #{act}.', 'Expected value of element <#{this}> not to be larger than #{exp}, but it was #{act}.', value, actualValue);
            }
            else if (utils.flag(self, 'smaller')) {
              self.assert(actualValue <= value, 'Expected value of element <#{this}> to be smaller than #{exp}, but it was #{act}.', 'Expected value of element <#{this}> not to be smaller than #{exp}, but it was #{act}.', value, actualValue);
            }
          }
          else {
            self.assert(value === actualValue, 'Expected value of element <#{this}> to be #{exp}, but it was #{act}.', 'Expected value of element <#{this}> to not be #{exp}, but it was.', value, actualValue);
          }
        });
      });
    });
    chai.Assertion.addMethod('disabled', function() {
      var self = this;

      if (!utils.flag(this, 'dom')) {
        throw new Error('Can only test value of dom elements');
      }

      return assertElementExists(this._obj, utils.flag(this, 'eventually')).then(function(el) {
        return el.getAttribute('disabled').then(function(disabled) {
          self.assert(disabled, 'Expected #{this} to be disabled but it is not', 'Expected #{this} to not be disabled but it is');
        });
      });
    });
    chai.Assertion.addMethod('htmlClass', function(value) {
      var self = this;

      if (!utils.flag(this, 'dom')) {
        throw new Error('Can only test value of dom elements');
      }

      return assertElementExists(this._obj, utils.flag(this, 'eventually')).then(function(el) {
        return el.getAttribute('class').then(function(classList) {
          self.assert(~classList.indexOf(value), "Expected " + classList + " to contain " + value + ", but it does not.");
        });
      });
    });
    return chai.Assertion.addMethod('attribute', function(attribute, value) {
      var self = this;

      if (!utils.flag(this, 'dom')) {
        throw new Error('Can only test style of dom elements');
      }

      return assertElementExists(this._obj, utils.flag(this, 'eventually')).then(function(el) {
        return el.getAttribute(attribute).then(function(actual) {
           if (utils.flag(self, 'parseNumber')) {
            actual = parseFloat(actual);

            if (utils.flag(self, 'larger')) {
              self.assert(actual >= value, 'Expected attribute ' + attribute + ' of element <#{this}> to be larger than #{exp}, but it was #{act}.', 'Expected attribute ' + attribute + ' of element <#{this}> not to be larger than #{exp}, but it was #{act}.', value, actual);
            }
            else if (utils.flag(self, 'smaller')) {
              self.assert(actual <= value, 'Expected attribute ' + attribute + ' of element <#{this}> to be smaller than #{exp}, but it was #{act}.', 'Expected attribute ' + attribute + ' of element <#{this}> not to be smaller than #{exp}, but it was #{act}.', value, actual);
            }
          }
          else {
            if (typeof value === 'undefined') {
              self.assert(typeof actual === 'string', 'Expected attribute ' + attribute + ' of element <#{this}> to exist.', 'Expected attribute ' + attribute + ' of element <#{this}> not to exist.', value, actual);
            }
            else {
              self.assert(actual === value, 'Expected attribute ' + attribute + ' of element <#{this}> to be #{exp}, but it was #{act}.', 'Expected attribute ' + attribute + ' of element <#{this}> not to be #{act}, but it was.', value, actual);
            }
          }
        });
      });
    });
  };
};
