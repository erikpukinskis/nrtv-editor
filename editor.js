var library = require("nrtv-library")(require)

// The editor shows a narrative and lets you edit it.

module.exports = library.export(
  "nrtv-editor",
  ["nrtv-bridge-route", "nrtv-couch"],
  function(Route, couch) {

    var narratives = couch.connect("narratives")

    function Editor() {
      new Route(
        "get",
        "/edit/:name",
        getNarrative
      )
    }

    function getNarrative(request, response) {

      var name = request.params.name

      narratives.get(
        name,
        function(narrative) {
          console.log("\n=======================\n"+JSON.stringify(narrative, null, 2)+"\n=======================")

          sendPage(
            name,
            narrative,
            response
          )
        }
      )
    }

    function sendPage(name, narrative, response) {

      library.using(
        [
          library.reset(
            "nrtv-browser-bridge"
          ),
          "editor-page"
        ],

        function(bridge, EditorPage) {

          page = new EditorPage(name, code)

          bridge.sendPage(page)(null, response)
        }
      )
    }

    return Editor
  }
)


// An HTML page with the editor on it

library.define(
  "editor-page",
  ["nrtv-element", "code", "center-column", "narrative-link", "body-text", "./save-button"],
  function(element, Code, CenterColumn, NarrativeLink, BodyText, SaveButton) {

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

        var elements = CenterColumn(
          SaveButton(name),
          NarrativeLink("component"),
          Code(source)
        )

        var styles = element.stylesheet(
          Page,
          CenterColumn,
          Code,
          BodyText,
          NarrativeLink
        )

        this.children.push(styles)
        this.children.push(elements)
      }
    )

    return Page

  }
)


// Textarea that is styled for editing code on a phone

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


// Column of content that uses as much width as it can, up to 600px

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


// An inline link to another narrative

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


// Cuz max-width is in ems, we need both the textarea and the center column to have the same metrics:

library.define(
  "body-text",
  ["nrtv-element"],
  function(element) {

    return element.template.container(
      ".body-text",
      element.style({

        "font-size": "14pt",
        "line-height": "1.5em",
        "@media (max-width: 600px)": {
          "font-size": "10.5pt"
        }
      })
    )

  }
)
