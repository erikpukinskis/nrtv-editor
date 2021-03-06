var library = require("nrtv-library")(require)

module.exports = library.export(
  "save-button",
  ["nrtv-element", "nrtv-bridge-element", "nrtv-bridge-route", "nrtv-browser-bridge", "nrtv-couch"],
  function(element, BridgeElement, BridgeRoute, bridge, couch) {

    var narratives = new couch.KeyStore("narratives", "name")

    // Set up an endpoint on the server that will actually write to the database eventually:

    var saveEndpoint = new BridgeRoute(
      "post",
      "/narratives",
      function(request, response) {
        var document = request.body

        narratives.set(
          document.name,
          {source: document.source},
          function() {
            response.json({ok: true})
          }
        )
      }
    )

    var getCode = bridge.defineFunction(
      function getCode() {
        return document.querySelector("textarea").value  
      }
    )

    // And then our button element, which calls the client function on click and shows a success message.

    var SaveButton = element.template(
      generateButton
    )

    function generateButton(name) {

      var success = new BridgeElement(
        ".success.hidden",
        "Saved!"
      )

      var save = bridge.defineFunction(
        [
          getCode,
          saveEndpoint.defineInBrowser(),
          success.defineShowInBrowser()
        ],
        function save(getCode, sendToServer, showSuccess, name) {

          sendToServer({
            name: name,
            source: getCode()
          }, showSuccess)
        }
      )

      var button = element(
        "button",
        {onclick: save.withArgs(name).evalable()},
        "Save"
      )

      this.children.push(button)
      this.children.push(
        success.element()
      )
    }

    return SaveButton
  }
)
