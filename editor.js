var library = require("nrtv-library")(require)

library.define(
  "body-text",
  ["nrtv-element"],
  function(element) {

    return element.template.container(
      ".body-text",
      element.style({

        // Cuz max-width is in ems, we need both the textarea and the center column to have the same metrics

        "font-size": "14pt",
        "line-height": "1.5em",
        "@media (max-width: 600px)": {
          "font-size": "10.5pt"
        }
      })
    )

  }
)



library.define(
  "narrative-link",
  ["nrtv-element"],
  function(element) {

    return element.template(
      "a.link-to-narrative",
      element.style({
        "margin-left:": "16px",
        "font-family": "Helvetica",
        "padding": "10px 0",
        "display": "inline-block",
        "opacity": "0.4",
        "text-transform": "capitalize"
      }),
      function(name) {
        this.children.push(name)
        this.attributes.href = "/edit/"+name
      }
    )

  }
)



library.define(
  "center-column",
  ["nrtv-element", "body-text"],
  function(element, BodyText) {

    return element.template.container(
      BodyText,
      ".center-column",
      element.style({
        "width": "100%",
        "max-width": "600px",
        "margin": "0 auto"
      })
    )

  }
)

library.define(
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



library.define(
  "code",
  ["nrtv-element", "body-text"],
  function(element, BodyText) {

    return element.template(
      BodyText,
      "textarea.source",
      {rows: "600"},
      element.style({
        "background": "none",
        "overflow": "hidden",
        "width": "100%",
        "border": "0",
        "padding": "16px",
        "padding-right": "10px",
        "padding-top": "100px",
        "box-sizing": "border-box",
        "font-family": "Courier",
        "color": "#2D3F6E"
      }),
      function(source) {
        this.children.push(element.raw(source))
      }
    )

  }
)





library.define(
  "editor-page",
  ["nrtv-element", "center-column", "code", "narrative-link", "body-text", "save-button"],
  function(element, CenterColumn, Code, NarrativeLink, BodyText, SaveButton) {

    var code = Code("doogie howser")

    var Page = element.template(
      "body.page",
      element("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, user-scalable=no"
      }),
      element.style({
        "margin": "0",
        "-webkit-font-smoothing":
          "antialiased"
      }),
      function(name, source) {

        var el = CenterColumn(
          new SaveButton(name).element(),
          NarrativeLink("component"),
          code
        )

        var style = element.stylesheet(
          Page,
          CenterColumn,
          Code,
          BodyText,
          NarrativeLink
        )

        this.children.push(style)
        this.children.push(el)
      }
    )

    return Page

  }
)


module.exports = library.export(
  "nrtv-editor",
  ["nrtv-bridge-route"],
  function(BridgeRoute) {

    function Editor() {
      new BridgeRoute(
        "get",
        "/edit/:name",
        getNarrative
      )
    }

    function getNarrative(request, response) {

      // This is just a fake database until we hook a real one up:

      var narratives = {
        get: function(name, callback) {
          callback(null, {source: "wolves are cool!"})
        }
      }

      narratives.get(
        request.params.name,
        function(err, narrative) {
          if (err) {
            narrative = {source: ""}
          }

          sendPage(
            request.params.name,
            narrative.source,
            response
          )
        }
      )
    }

    function sendPage(name, code, response) {

      library.using(
        [
          library.reset(
            "nrtv-browser-bridge"
          ),
          "editor-page"
        ],

        function(BrowserBridge, EditorPage) {

          page = new EditorPage(name, code)

          var bridge = BrowserBridge.collective()

          bridge.sendPage(page)(null, response)
        }
      )
    }

    return Editor
  }
)
