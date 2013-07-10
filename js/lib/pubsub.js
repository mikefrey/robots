var d = module.exports = {}

// the topic/subscription hash
var cache = d.c_ || {} //check for "c_" cache for unit testing

d.trigger = function(/* String */ topic, /* Array? */ args) {
  // summary:
  //    Publish some data on a named topic.
  // topic: String
  //    The channel to publish on
  // args: Array?
  //    The data to publish. Each array item is converted into an ordered
  //    arguments on the subscribed functions.
  //
  // example:
  //    Publish stuff on '/some/topic'. Anything subscribed will be called
  //    with a function signature like: function(a,b,c) { ... }
  //
  //    trigger("/some/topic", ["a","b","c"])

  var subs = cache[topic],
    len = subs ? subs.length : 0

  //can change loop or reverse array if the order matters
  while (len--) {
    subs[len].apply(d, args || [])
  }
}

d.on = function(/* String */ topic, /* Function */ callback) {
  // summary:
  //    Register a callback on a named topic.
  // topic: String
  //    The channel to subscribe to
  // callback: Function
  //    The handler event. Anytime something is trigger'ed on a
  //    subscribed channel, the callback will be called with the
  //    published array as ordered arguments.
  //
  // returns: Array
  //    A handle which can be used to unsubscribe this particular subscription.
  //
  // example:
  //    on("/some/topic", function(a, b, c) { /* handle data */ })

  if (!cache[topic]) {
    cache[topic] = []
  }
  cache[topic].push(callback)
  return [topic, callback] // Array
}

d.off = function(/* Array or String */ handle) {
  // summary:
  //    Disconnect a subscribed function for a topic.
  // handle: Array or String
  //    The return value from an `on` call.
  // example:
  //    var handle = on("/some/topic", function() {})
  //    off(handle)

  var subs = cache[typeof handle === 'string' ? handle : handle[0]]
  var callback = typeof handle === 'string' ? handle[1] : false
  var len = subs ? subs.length : 0

  while (len--) {
    if (subs[len] === callback || !callback) {
      subs.splice(len, 1)
    }
  }
}
