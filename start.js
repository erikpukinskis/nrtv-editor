var library = require("nrtv-library")(require)

library.using(
  ["./editor", "nrtv-server"],
  function(Editor, server) {
    new Editor()
    server.start(8004)
  }
)