'use strict'

/**
 * Backbone.js helper functions, this has been copied and modified from the
 * backbone.js source code so it can be re-used in our application interface.
 *
 * @license MIT, http://backbonejs.org
 */

// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
module.exports = function(protoProps, staticProps) {
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied.
  extend(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) extend(child.prototype, protoProps);

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
};

/**
 * Underscore.js helper functions, these have been copied and modified from the
 * underscore.js source code so they can be re-used in our application interface.
 *
 * @license MIT, http://underscorejs.org
 */

// Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
var has = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

// Extend a given object with all the properties in passed-in object(s).
var extend = function(obj) {
  Array.prototype.slice.call(arguments, 1).forEach(function(source) {
    if (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};
