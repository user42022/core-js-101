/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.height * this.width;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like resObj:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  element(value) {
    const resObj = Object.create(cssSelectorBuilder);
    resObj.stringify = () => resObj.value;
    resObj.modificator = this.modificator;
    if (resObj.modificator) {
      if (resObj.modificator.slice(1).some((e) => e > 0)) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    resObj.modificator = [1, 0, 0, 0, 0, 0];
    resObj.value = this.value ? this.value + value : value;
    return resObj;
  },

  id(value) {
    const resObj = Object.create(cssSelectorBuilder);
    resObj.stringify = () => resObj.value;
    resObj.modificator = this.modificator;
    if (resObj.modificator) {
      if (resObj.modificator.slice(2).some((e) => e > 0)) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      if (resObj.modificator[1] > 0) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      resObj.modificator[1] += 1;
    }
    resObj.modificator = !resObj.modificator ? [0, 1, 0, 0, 0, 0] : resObj.modificator;
    resObj.value = this.value ? `${this.value}#${value}` : `#${value}`;
    return resObj;
  },

  class(value) {
    const resObj = Object.create(cssSelectorBuilder);
    resObj.stringify = () => resObj.value;
    resObj.modificator = this.modificator;
    if (resObj.modificator) {
      if (resObj.modificator.slice(3).some((e) => e > 0)) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      resObj.modificator[2] += 1;
    }
    resObj.modificator = !resObj.modificator ? [0, 0, 1, 0, 0, 0] : resObj.modificator;
    resObj.value = this.value ? `${this.value}.${value}` : `.${value}`;
    return resObj;
  },

  attr(value) {
    const resObj = Object.create(cssSelectorBuilder);
    resObj.stringify = () => resObj.value;
    resObj.modificator = this.modificator;
    if (resObj.modificator) {
      if (resObj.modificator.slice(4).some((e) => e > 0)) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      resObj.modificator[3] += 1;
    }
    resObj.modificator = !resObj.modificator ? [0, 0, 0, 1, 0, 0] : resObj.modificator;
    resObj.value = this.value ? `${this.value}[${value}]` : `[${value}]`;
    return resObj;
  },

  pseudoClass(value) {
    const resObj = Object.create(cssSelectorBuilder);
    resObj.stringify = () => resObj.value;
    resObj.modificator = this.modificator;
    if (resObj.modificator) {
      if (resObj.modificator.slice(-1).some((e) => e > 0)) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      resObj.modificator[4] += 1;
    }
    resObj.modificator = !resObj.modificator ? [0, 0, 0, 0, 1, 0] : resObj.modificator;
    resObj.value = this.value ? `${this.value}:${value}` : `:${value}`;
    return resObj;
  },

  pseudoElement(value) {
    const resObj = Object.create(cssSelectorBuilder);
    resObj.stringify = () => resObj.value;
    resObj.modificator = this.modificator;
    if (resObj.modificator) {
      if (resObj.modificator[5] > 0) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      resObj.modificator[1] += 1;
    }
    resObj.modificator = !resObj.modificator ? [0, 0, 0, 0, 0, 1] : resObj.modificator;
    resObj.value = this.value ? `${this.value}::${value}` : `::${value}`;
    return resObj;
  },

  combine(selector1, combinator, selector2) {
    const resObj = Object.create(cssSelectorBuilder);
    resObj.stringify = () => resObj.value;
    resObj.value = `${selector1.value} ${combinator} ${selector2.value}`;
    return resObj;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
