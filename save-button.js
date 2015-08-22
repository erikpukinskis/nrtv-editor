var library = require("nrtv-library")(require)

module.exports = library.export(
  "save-button",
  ["nrtv-element", "nrtv-bridge-element", "nrtv-bridge-route", "nrtv-browser-bridge"],
  function(element, BridgeElement, BridgeRoute, BrowserBridge) {

    function SaveButton(name) {

      var successMessage = new BridgeElement(".success.hidden", "Saved!")

      var showSuccess = successMessage.showOnClient()

      var saveRoute = new BridgeRoute(
        "post",
        "/narratives",
        function(request, response) {
          console.log("this is where we save:", request.body)
          response.json(showSuccess)
        }
      )

      var bridge = BrowserBridge.collective()

      function getCode() {
        return $("textarea").val()
      }

      var boundCodeGetter = bridge.defineOnClient(getCode)

      var save = bridge.defineOnClient(
        [
          boundCodeGetter,
          saveRoute.bindOnClient()
        ],
        function save(getCode, makeRequest, name) {

          var code = getCode()
          makeRequest({
            query: {name: name},
            data: code
          })
        }
      )

      var button = element('button', {
        onclick: save.withArgs(name).evalable()
      }, "Save")

      this.element = function() {
        return button
      }

    }

    return SaveButton
  }
)
