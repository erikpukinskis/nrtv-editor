requirejs = require("requirejs")

requirejs(["editor"], function(Editor) {

  var editor = new Editor()
  // "I like 3118, that sounds very Connecticut to me"

  editor.start(3118)
})