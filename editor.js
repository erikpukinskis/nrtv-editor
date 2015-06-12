if (typeof define !== 'function') {
  var define = require('amdefine')(
    module)}



define(
  "body-text",
  ["nrtv-element"],
  function(element) {
    console.log("element.template", element.template)
    console.log("element.template.container", element.template.container)
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



define(
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
        this.innerHTML = name
        this.attributes.href = "/"+name
      }
    )

  }
)

define(
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



define(
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



define(
  "editor-page",
  ["nrtv-element", "center-column", "code", "narrative-link", "body-text"],
  function(element, CenterColumn, Code, NarrativeLink, BodyText) {

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

    return Page

  }
)



define(
  ["nrtv-component", "nrtv-element", "nrtv-bridge-tie", "nrtv-server-tie", "nrtv-element-tie", "nrtv-database-tie", "editor-page"],
  function(component, element, BridgeTie, ServerTie, ElementTie, DatabaseTie, Page) {

    var Editor = component(BridgeTie, ServerTie, ElementTie, DatabaseTie)

    var server = Editor.server()

    var bridge = Editor.bridge(server)

    var narratives = Editor.database("narratives")

    server.route(
      "get",
      "/:name",
      function(request, response) {
        var source = narratives.get(request.params.name,
          function(err, narrative) {
            if (err) {
              narrative = {source: ""}
            }
            var handler = bridge.sendPage(Page(narrative.source))
            handler(request, response)
          }
        )
      }
    )

    return Editor
  }
)
