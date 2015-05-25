if (typeof define !== 'function') {
  var define = require('amdefine')(
    module)}

define(
  ["nrtv-component", "nrtv-element", "nrtv-bridge-tie", "nrtv-server-tie"],
  function(component, element, BridgeTie, ServerTie, ElementTie, DatabaseTie) {

    var Editor = component(BridgeTie, ServerTie, ElementTie)

    var server = Editor.server()

    var bridge = Editor.bridge(server)

<<<<<<< HEAD
    var narrativeLink = element.template(
      "a.link-to-narrative",
      element.styles({
        "margin-left": "16px",
=======
    var narrativeLink = element(
      "a",
      element.style({
        "margin-left:" "16px",
>>>>>>> Fix template calling style
        "font-family": "Helvetica",
        "padding": "10px 0",
        "display": "inline-block",
        "opacity": "0.4"
      })
    )

    var bodyText = element.template(
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

    var textarea = element.template(
      bodyText,
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
      })
    )

    var centerColumn = element.template(
      bodyText,
      ".center-column",
      [
        narrativeLink(
          {href: "/component"},
          "Component"
        ),
<<<<<<< HEAD
        textArea("turtle!")
      ],
      element.styles({
        "width": "100%",
        "max-width": "600px",
=======
        element.yield
      ],
      element.style({
        "width:" "100%"
        "max-width:" "600px"
>>>>>>> Fix template calling style
        "margin": "0 auto"
      })
    )

    var body = element.template("body",
      element.style({
        "margin": "0",
        "-webkit-font-smoothing":
          "antialiased"
      }),
      [
        element("meta", {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0, user-scalable=no"
        }),
<<<<<<< HEAD
        element.container()
      ]
    )

=======
        element.yield
      ],
      element.style({
        "margin": "0",
        "-webkit-font-smoothing":
          "antialiased"
      })
    )

    // var db = bridge.database()

>>>>>>> Fix template calling style
    server.route(
      "get",
      "/:name",
      function(request, response) {

<<<<<<< HEAD
        var source = "turtle!"
        var page = body([
          narrativeLink({
            href: "/component"
          }),
          textarea(source)
        ])

        bridge.sendPage(page.html(), page.stylesheet)
=======
        // var source = get(
        //   request.params.name
        // )

        var sourceEl = textarea(source)

        var page = body(centerColumn(sourceEl)).render()

        bridge.sendPage(page.html, page.styles)
>>>>>>> Fix template calling style
      }
    )

    return Editor
  }
)
