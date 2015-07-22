var library = require("nrtv-library")(require)

library.using(
  ["./editor", "nrtv-server"],
  function(Editor, Server) {
    new Editor()
    Server.collective().start(8004)
  }
)