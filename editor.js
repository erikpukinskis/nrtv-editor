if (typeof define !== 'function') {
  var define = require('amdefine')(
    module)}

define(
  ["nrtv-component", "nrtv-element", "nrtv-bridge-tie", "nrtv-server-tie", "nrtv-element-tie", "nrtv-database-tie"],
  function(component, element, BridgeTie, ServerTie, ElementTie, DatabaseTie) {

    var Editor = component(BridgeTie, ServerTie, ElementTie)

    var server = Editor.server()

    var bridge = Editor.bridge(server)

    var narrativeLink = element(
      "a",
      element.styles({
        "margin-left:" "16px",
        "font-family": "Helvetica",
        "padding": "10px 0",
        "display": "inline-block",
        "opacity": "0.4"
      })
    )

    var bodyText = element(
      element.style({

        // Cuz max-width is in ems:

        "font-size": "14pt",
        "line-height": "1.5em"
        "@media (max-width: 600px)": {
          "font-size": "10.5pt"
        }
      })
    )

    var textarea = bodyText(
      "textarea",
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
      })
    )

    var centerColumn = bodyText(
      ".center-column",
      [
        narrativeLink(
          {href: "/component"},
          "Component"
        ),
        textArea
      ],
      element.styles({
        "width:" "100%"
        "max-width:" "600px"
        "margin": "0 auto"
      })
    )

    var body = Editor.element("body",
      [
        element("meta", {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0, user-scalable=no"
        }),
        element.yield()
      ],
      editor.style({
        "margin": "0",
        "-webkit-font-smoothing":
          "antialiased"
      })
    )

    var page = body(centerColumn(sourceEl)).render()

    var db = bridge.database()

    server.route(
      "get",
      "/:name",
      function(request, response) {

        var source = get(
          request.params.name
        )
        var sourceEl = textarea(source)

        bridge.sendPage(page.html, page.styles)
      }
    )

    return Editor
  }
)
