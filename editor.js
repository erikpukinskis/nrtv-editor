if (typeof define !== 'function') {
  var define = require('amdefine')(
    module)}

define(
  ["nrtv-component", "nrtv-element", "nrtv-bridge-tie", "nrtv-server-tie", "nrtv-element-tie", "nrtv-database-tie"],
  function(component, element, BridgeTie, ServerTie, ElementTie, DatabaseTie) {

    console.log("db-tie", DatabaseTie)
    var Editor = component(BridgeTie, ServerTie, ElementTie, DatabaseTie)

    var server = Editor.server()

    var bridge = Editor.bridge(server)

    var narratives = Editor.database("narratives")

    var NarrativeLink = element.template(
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
        this.innerHTML = name
        this.attributes.href = "/"+name
      }
    )

    var BodyText = element.template(
      ".body-text",
      element.style({

        // Cuz max-width is in ems, we need both the textarea and the center column to have the same metrics

        "font-size": "14pt",
        "line-height": "1.5em",
        "@media (max-width: 600px)": {
          "font-size": "10.5pt"
        }
      }),
      element.containerGenerator
    )

    var Code = element.template(
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

    var CenterColumn = 
      element.template(
        BodyText,
        ".center-column",
        element.style({
          "width": "100%",
          "max-width": "600px",
          "margin": "0 auto"
        }),
        element.containerGenerator
      )

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
      function(source) {
        var el = CenterColumn(
          NarrativeLink("component"),
          Code(source)
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

    server.route(
      "get",
      "/:name",
      function(request, response) {
        var source = narratives.get(request.params.name,
          function(narrative) {
            var handler = bridge.sendPage(Page(source))
            handler(request, response)
          }
        )
      }
    )

    return Editor
  }
)
