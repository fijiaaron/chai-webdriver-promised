// Generated by CoffeeScript 1.7.1
var path = require('path');
var webdriver = require('selenium-webdriver');
var chai = require('chai');
var chaiWebdriver = require('..');

webdriver.logging = {
  LevelName: 'DEBUG'
};

var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.phantomjs()).build();

chai.use(chaiWebdriver(driver, 100));

var expect = chai.expect;

var url = function(page) {
  return "file://" + (path.join(__dirname, page));
};

before(function(done) {
  return driver.manage().window().setSize(1024, 768).then(function() {
    return done();
  });
});

after(function(done) {
  return driver.quit().then(function() {
    return done();
  });
});

describe('the basics', function() {
  before(function(done) {
    this.timeout(0);
    return driver.get(url('finnegan.html')).then(function() {
      return done();
    });
  });
  describe('#text', function() {
    it('verifies that an element has exact text', function() {
      return expect('#finnegan-header').dom.to.have.text("The following text is an excerpt from Finnegan's Wake by James Joyce");
    });
    it('verifies that an element does not have exact text', function() {
      return expect('#finnegan-header').dom.not.to.have.text("Wake");
    });
    it('verifies that an element has text longer than 10 characters', function() {
      return expect('#finnegan-header').dom.to.have.larger.text(10);
    });
    it('verifies that an element has text smaller than 10000 characters', function() {
      return expect('#finnegan-header').dom.to.have.smaller.text(10000);
    });
    it('verifies that an element does not have text longer than 10000 characters', function() {
      return expect('#finnegan-header').dom.not.to.have.larger.text(10000);
    });
    it('verifies that an element does not have text smaller than 10 characters', function() {
      return expect('#finnegan-header').dom.not.to.have.smaller.text(10);
    });
  });
  describe('#text (regexp version)', function() {
    it('verifies that an element has a regexp match', function() {
      return expect('#finnegan-header').dom.to.have.text(/following.*excerpt/);
    });
    it('verifies that an element does not match the regexp', function() {
      return expect('#finnegan-header').dom.not.to.have.text(/following.*food/);
    });
  });
  describe('#contain', function() {
    describe('on a dom element', function() {
      it('verifies that an element contains text', function() {
        return expect('#finnegan-header').dom.to.contain.text("Finnegan");
      });
      return it('verifies that an element does not contain text', function() {
        return expect('#finnegan-header').dom.not.to.contain.text("Bibimbap");
      });
    });
    describe('not on a dom element', function() {
      it('verifies that a string contains text', function() {
        return expect('John Finnegan').to.contain("Finnegan");
      });
      it('verifies that a string does not contain text', function() {
        return expect('John Finnegan').dom.not.to.contain("Bibimbap");
      });
    });
  });
  describe('#match', function() {
    it('verifies that an element has a regexp match', function() {
      return expect('#finnegan-header').dom.to.match(/following.*excerpt/);
    });
    it('verifies that an element does not match the regexp', function() {
      return expect('#finnegan-header').dom.not.to.match(/following.*food/);
    });
    describe('not on a dom element', function() {
      it('verifies that a string does match the regexp', function() {
        return expect('some test text').to.match(/test/);
      });
      it('verifies that a string does not match the regexp', function() {
        return expect('some test text').not.to.match(/taste/);
      });
    });
  });
  describe('#displayed', function() {
    it('verifies that an element is displayed', function() {
      return expect('.does-exist:text').dom.to.be.displayed();
    });
    it('verifies that a non-existing element is not displayed', function() {
      return expect('.does-not-exist').dom.not.to.be.displayed();
    });
    it('verifies that a hidden element is not displayed', function() {
      return expect('.exists-but-hidden').dom.not.to.be.displayed();
    });
    it('verifies that an off-screen element is displayed', function() {
      return expect('.exists-but-off-screen').dom.to.be.displayed();
    });
  });
  describe('#visible', function() {
    it('verifies that an element is visible', function() {
      return expect('.does-exist:text').dom.to.be.visible();
    });
    it('verifies that a non-existing element is not visible', function() {
      return expect('.does-not-exist').dom.not.to.be.visible();
    });
    it('verifies that a hidden element is not visible', function() {
      return expect('.exists-but-hidden').dom.not.to.be.visible();
    });
    it('verifies that an off-screen element is not visible', function() {
      return expect('.exists-but-off-screen').dom.not.to.be.visible();
    });
  });
  describe('#count', function() {
    it('verifies that an element appears thrice', function() {
      return expect('input').dom.to.have.count(4);
    });
    it('verifies that a non-existing element has a count of 0', function() {
      return expect('.does-not-exist').dom.to.have.count(0);
    });
    it('verifies that an element appears more than twice', function() {
      return expect('input').dom.to.have.larger.count(2);
    });
    it('verifies that an element appears less than five times', function() {
      return expect('input').dom.to.have.smaller.count(5);
    });
    it('verifies that an element does not appear more than five times', function() {
      return expect('input').dom.not.to.have.larger.count(5);
    });
    it('verifies that an element does not appear less than twice', function() {
      return expect('input').dom.not.to.have.smaller.count(2);
    });
  });
  describe('#style', function() {
    it('verifies that an element has a red background', function() {
      return expect('.red-bg').dom.to.have.style('background-color', 'rgba(255, 0, 0, 1)');
    });
    it('verifies that an element does not have a red background', function() {
      return expect('.green-text').dom.to.have.style('background-color', 'rgba(0, 0, 0, 0)');
    });
    it('verifies that an element has a width larger than 10', function() {
      return expect('#finnegan-header').dom.to.have.larger.style('width', 10);
    });
    it('verifies that an element has a width smaller than 10000', function() {
      return expect('#finnegan-header').dom.to.have.smaller.style('width', 10000);
    });
    it('verifies that an element does not have a width larger than 10000', function() {
      return expect('#finnegan-header').dom.not.to.have.larger.style('width', 10000);
    });
    it('verifies that an element does not have a width smaller than 10', function() {
      return expect('#finnegan-header').dom.not.to.have.smaller.style('width', 10);
    });
  });
  describe('#value', function() {
    it('verifies that a text field has a specific value', function() {
      return expect('.does-exist').dom.to.have.value('People put stuff here');
    });
    it('verifies that a text field does not have a specific value', function() {
      return expect('.does-exist').dom.not.to.have.value('Beep boop');
    });
    it('verifies that a number field has a value larger than 12', function() {
      return expect('.numeric-input').dom.to.have.larger.value(12);
    });
    it('verifies that a number field has a value smaller than 53', function() {
      return expect('.numeric-input').dom.to.have.smaller.value(53);
    });
    it('verifies that a number field does not have a value larger than 53', function() {
      return expect('.numeric-input').dom.not.to.have.larger.value(53);
    });
    it('verifies that a number field does not have a value smaller than 12', function() {
      return expect('.numeric-input').dom.not.to.have.smaller.value(12);
    });
  });
  describe('#disabled', function() {
    it('verifies that an input is disabled', function() {
      return expect('.i-am-disabled').dom.to.be.disabled();
    });
    it('verifies that an input is not disabled', function() {
      return expect('.does-exist').dom.not.to.be.disabled();
    });
  });
  describe('htmlClass', function() {
    it('verifies that an element has a given class', function() {
      return expect('.does-exist').dom.to.have.htmlClass('second-class');
    });
    it('verifies than an element does not have a given class', function() {
      return expect('.green-text').dom.not.to.have.htmlClass('second-class');
    });
  });
  describe('attribute', function() {
    it('verifies that an element attribute has a given value', function() {
      return expect('input.does-exist').dom.to.have.attribute('value', 'People put stuff here');
    });
    it('verifies that an element attribute does not have a given value', function() {
      return expect('input.does-exist').dom.not.to.have.attribute('input', 'radio');
    });
    it('verifies that an attribute does not exist', function() {
      return expect('input.does-exist').dom.not.to.have.attribute('href');
    });
    it('verifies that an attribute exists', function() {
      return expect('input.does-exist').dom.to.have.attribute('type');
    });
    it('verifies that an empty attribute exists', function() {
      return expect('input.does-exist').dom.to.have.attribute('empty');
    });
    it('verifies that an element has a numeric attribute larger than 12', function() {
      return expect('.numeric-attribute').dom.to.have.larger.attribute('data-number', 12);
    });
    it('verifies that an element has a numeric attribute smaller than 53', function() {
      return expect('.numeric-attribute').dom.to.have.smaller.attribute('data-number', 53);
    });
    it('verifies that an element does not have a numeric attribute larger than 53', function() {
      return expect('.numeric-attribute').dom.not.to.have.larger.attribute('data-number', 53);
    });
    it('verifies that an element does not have a numeric attribute smaller than 12', function() {
      return expect('.numeric-attribute').dom.not.to.have.smaller.attribute('data-number', 12);
    });
  });
});

describe('the basics with eventually', function() {
  before(function(done) {
    this.timeout(0);
    return driver.get(url('finnegan.html')).then(function() {
      return done();
    });
  });
  describe('#text', function() {
    it('verifies that an element has exact text', function() {
      return expect('#finnegan-header').dom.to.eventually.have.text("The following text is an excerpt from Finnegan's Wake by James Joyce");
    });
    it('verifies that an element does not have exact text', function() {
      return expect('#finnegan-header').dom.not.to.eventually.have.text("Wake");
    });
    it('verifies that an element has text longer than 10 characters', function() {
      return expect('#finnegan-header').dom.to.eventually.have.larger.text(10);
    });
    it('verifies that an element has text smaller than 10000 characters', function() {
      return expect('#finnegan-header').dom.to.eventually.have.smaller.text(10000);
    });
    it('verifies that an element does not have text longer than 10000 characters', function() {
      return expect('#finnegan-header').dom.not.to.eventually.have.larger.text(10000);
    });
    it('verifies that an element does not have text smaller than 10 characters', function() {
      return expect('#finnegan-header').dom.not.to.eventually.have.smaller.text(10);
    });
  });
  describe('#text (regexp version)', function() {
    it('verifies that an element has a regexp match', function() {
      return expect('#finnegan-header').dom.to.eventually.have.text(/following.*excerpt/);
    });
    it('verifies that an element does not match the regexp', function() {
      return expect('#finnegan-header').dom.not.to.eventually.have.text(/following.*food/);
    });
  });
  describe('#contain', function() {
    describe('on a dom element', function() {
      it('verifies that an element contains text', function() {
        return expect('#finnegan-header').dom.to.eventually.contain.text("Finnegan");
      });
      it('verifies that an element does not contain text', function() {
        return expect('#finnegan-header').dom.not.to.eventually.contain.text("Bibimbap");
      });
    });
    describe('not on a dom element', function() {
      it('verifies that a string contains text', function() {
        return expect('John Finnegan').to.eventually.contain("Finnegan");
      });
      it('verifies that a string does not contain text', function() {
        return expect('John Finnegan').dom.not.to.eventually.contain("Bibimbap");
      });
    });
  });
  describe('#match', function() {
    it('verifies that an element has a regexp match', function() {
      return expect('#finnegan-header').dom.to.eventually.match(/following.*excerpt/);
    });
    it('verifies that an element does not match the regexp', function() {
      return expect('#finnegan-header').dom.not.to.eventually.match(/following.*food/);
    });
    describe('not on a dom element', function() {
      it('verifies that a string does match the regexp', function() {
        return expect('some test text').to.eventually.match(/test/);
      });
      it('verifies that a string does not match the regexp', function() {
        return expect('some test text').not.to.eventually.match(/taste/);
      });
    });
  });
  describe('#displayed', function() {
    it('verifies that an element is displayed', function() {
      return expect('.does-exist:text').dom.to.eventually.be.displayed();
    });
    it('verifies that a non-existing element is not displayed', function() {
      return expect('.does-not-exist').dom.not.to.eventually.be.displayed();
    });
    it('verifies that a hidden element is not displayed', function() {
      return expect('.exists-but-hidden').dom.not.to.eventually.be.displayed();
    });
    it('verifies that an off-screen element is displayed', function() {
      return expect('.exists-but-off-screen').dom.to.eventually.be.displayed();
    });
  });
  describe('#visible', function() {
    it('verifies that an element is visible', function() {
      return expect('.does-exist:text').dom.to.eventually.be.visible();
    });
    it('verifies that a non-existing element is not visible', function() {
      return expect('.does-not-exist').dom.not.to.eventually.be.visible();
    });
    it('verifies that a hidden element is not visible', function() {
      return expect('.exists-but-hidden').dom.not.to.eventually.be.visible();
    });
    it('verifies that an off-screen element is not visible', function() {
      return expect('.exists-but-off-screen').dom.not.to.eventually.be.visible();
    });
  });
  describe('#count', function() {
    it('verifies that an element appears thrice', function() {
      return expect('input').dom.to.eventually.have.count(4);
    });
    it('verifies that a non-existing element has a count of 0', function() {
      return expect('.does-not-exist').dom.to.eventually.have.count(0);
    });
    it('verifies that an element appears more than twice', function() {
      return expect('input').dom.to.eventually.have.larger.count(2);
    });
    it('verifies that an element appears less than five times', function() {
      return expect('input').dom.to.eventually.have.smaller.count(5);
    });
    it('verifies that an element does not appear more than five times', function() {
      return expect('input').dom.not.to.eventually.have.larger.count(5);
    });
    it('verifies that an element does not appear less than twice', function() {
      return expect('input').dom.not.to.eventually.have.smaller.count(2);
    });
  });
  describe('#style', function() {
    it('verifies that an element has a red background', function() {
      return expect('.red-bg').dom.to.eventually.have.style('background-color', 'rgba(255, 0, 0, 1)');
    });
    it('verifies that an element does not have a red background', function() {
      return expect('.green-text').dom.to.eventually.have.style('background-color', 'rgba(0, 0, 0, 0)');
    });
    it('verifies that an element has a width larger than 10', function() {
      return expect('#finnegan-header').dom.to.eventually.have.larger.style('width', 10);
    });
    it('verifies that an element has a width smaller than 10000', function() {
      return expect('#finnegan-header').dom.to.eventually.have.smaller.style('width', 10000);
    });
    it('verifies that an element does not have a width larger than 10000', function() {
      return expect('#finnegan-header').dom.not.to.eventually.have.larger.style('width', 10000);
    });
    it('verifies that an element does not have a width smaller than 10', function() {
      return expect('#finnegan-header').dom.not.to.eventually.have.smaller.style('width', 10);
    });
  });
  describe('#value', function() {
    it('verifies that a text field has a specific value', function() {
      return expect('.does-exist').dom.to.eventually.have.value('People put stuff here');
    });
    it('verifies that a text field does not have a specific value', function() {
      return expect('.does-exist').dom.not.to.eventually.have.value('Beep boop');
    });
    it('verifies that a number field has a value larger than 12', function() {
      return expect('.numeric-input').dom.to.eventually.have.larger.value(12);
    });
    it('verifies that a number field has a value smaller than 53', function() {
      return expect('.numeric-input').dom.to.eventually.have.smaller.value(53);
    });
    it('verifies that a number field does not have a value larger than 53', function() {
      return expect('.numeric-input').dom.not.to.eventually.have.larger.value(53);
    });
    it('verifies that a number field does not have a value smaller than 12', function() {
      return expect('.numeric-input').dom.not.to.eventually.have.smaller.value(12);
    });
  });
  describe('#disabled', function() {
    it('verifies that an input is disabled', function() {
      return expect('.i-am-disabled').dom.to.eventually.be.disabled();
    });
    it('verifies that an input is not disabled', function() {
      return expect('.does-exist').dom.not.to.eventually.be.disabled();
    });
  });
  describe('htmlClass', function() {
    it('verifies that an element has a given class', function() {
      return expect('.does-exist').dom.to.eventually.have.htmlClass('second-class');
    });
    it('verifies than an element does not have a given class', function() {
      return expect('.green-text').dom.not.to.eventually.have.htmlClass('second-class');
    });
  });
  describe('attribute', function() {
    it('verifies that an element attribute has a given value', function() {
      return expect('input.does-exist').dom.to.eventually.have.attribute('value', 'People put stuff here');
    });
    it('verifies that an element attribute does not have a given value', function() {
      return expect('input.does-exist').dom.not.to.eventually.have.attribute('input', 'radio');
    });
    it('verifies that an attribute does not exist', function() {
      return expect('input.does-exist').dom.not.to.eventually.have.attribute('href');
    });
    it('verifies that an attribute exists', function() {
      return expect('input.does-exist').dom.to.eventually.have.attribute('type');
    });
    it('verifies that an empty attribute exists', function() {
      return expect('input.does-exist').dom.to.eventually.have.attribute('empty');
    });
    it('verifies that an element has a numeric attribute larger than 12', function() {
      return expect('.numeric-attribute').dom.to.eventually.have.larger.attribute('data-number', 12);
    });
    it('verifies that an element has a numeric attribute smaller than 53', function() {
      return expect('.numeric-attribute').dom.to.eventually.have.smaller.attribute('data-number', 53);
    });
    it('verifies that an element does not have a numeric attribute larger than 53', function() {
      return expect('.numeric-attribute').dom.not.to.eventually.have.larger.attribute('data-number', 53);
    });
    it('verifies that an element does not have a numeric attribute smaller than 12', function() {
      return expect('.numeric-attribute').dom.not.to.eventually.have.smaller.attribute('data-number', 12);
    });
  });
});

describe('failure cases + error messages', function() {
  describe('non-existant elements', function() {
    var errHandler = function(err) {
      return expect(err.toString()).to.contain('element does not exist');
    };

    it('verifies that a non-existant element should not have text', function() {
      return expect('.does-not-exist').dom.to.have.text('beans').then(function(text) {
        throw new Error('element does not exist, but it was found to have text ' + text);
      }, errHandler);
    });
    it('verifies that a non-existant element should not contain text', function() {
      return expect('.does-not-exist').dom.to.contain.text('beans').then(function(text) {
        throw new Error('element does not exist, but it was found to have text ' + text);
      }, errHandler);
    });
    it('verifies that a non-existant element should not be visible', function() {
      return expect('.does-not-exist').dom.to.be.visible().then(function() {
        throw new Error('element does not exist, but it was found to be visible');
      }, errHandler);
    });
    it('verifies that a non-existant element should not match text', function() {
      return expect('.does-not-exist').dom.to.match(/beans/).then(function() {
        throw new Error('element does not exist, but it was found to match text');
      }, errHandler);
    });
    it('verifies that a non-existant element should not be disabled', function() {
      return expect('.does-not-exist').dom.to.be.disabled().then(function() {
        throw new Error('element does not exist, but it was found to be disabled');
      }, errHandler);
    });
    it('verifies that a non-existant element should not have count 1', function() {
      return expect('.does-not-exist').dom.to.have.count(1).then(function() {
        throw new Error('element does not exist, but it was found to have count 1');
      }, function(err) {
        return expect(err.toString()).to.contain("Expected '.does-not-exist' to appear 1 times, but it appeared 0 times.");
      });
    });
    it('verifies that a non-existant element should not have styles', function() {
      return expect('.does-not-exist').dom.to.have.style('padding', '10px').then(function() {
        throw new Error('element does not exist, but it was found to have padding: 10px');
      }, errHandler);
    });
    it('verifies that a non-existant element should not have a value', function() {
      return expect('.does-not-exist').dom.to.have.value('beans').then(function() {
        throw new Error('element does not exist, but it was found to have value beans');
      }, errHandler);
    });
    it('verifies that a non-existant element should not have a htmlClass', function() {
      return expect('.does-not-exist').dom.to.have.htmlClass('beans').then(function() {
        throw new Error('element does not exist, but it was found to have htmlClass beans');
      }, errHandler);
    });
    it('verifies that a non-existant element should not have attributes', function() {
      return expect('.does-not-exist').dom.to.have.attribute('className').then(function() {
        throw new Error('element does not exist, but it was found to have attribute className');
      }, errHandler);
    });
    it('verifies that a non-existant element should not have attribute values', function() {
      return expect('.does-not-exist').dom.to.have.attribute('className', 'beans').then(function() {
        throw new Error('element does not exist, but it was found to have attribute className="beans"');
      }, errHandler);
    });
  });
});

describe('going to a different page', function() {
  before(function(done) {
    this.timeout(0);
    driver.get(url('link.html'));
    return driver.findElement(webdriver.By.name('link')).click().then(function() {
      return done();
    });
  });
  it('still allows you to make assertions', function() {
    return expect('.does-exist:text').dom.to.to.be.visible();
  });
});
