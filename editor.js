var library = require("nrtv-library")(require)

// The editor shows a narrative and lets you edit it.


// So this is the boilerplate I guess. That should be extracted up to the UI level?
//
// var library = require("nrtv-library")
//
// library.using(
//   [""],
//   function() {
//
//   }
// )

// Like
// 

// Module Title
//
// with browser-bridge as browser
// nrtv-server as server
// 
// i.e...
//
module.exports = library.export(
  "nrtv-editor",
  ["nrtv-bridge-route", "nrtv-couch"],
  function(Route, couch) {
//
    var narratives = new couch.KeyStore("narratives", "name")

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
          console.log("got a narrative from the db: "+JSON.stringify(narrative, null, 2))

          sendPage(
            name,
            narrative || {source: ""},
            response
          )
        }
      )
    }

    function sendPage(name, narrative, response) {

      library.using(
        [
          library.reset(
            "browser-bridge"
          ),
          "editor-page"
        ],

        function(bridge, EditorPage) {

          page = new EditorPage(name, narrative.source)

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
  ["web-element", "code", "center-column", "narrative-link", "body-text", "./save-button"],
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

        var body = element.style(
          "body, input, button, p",
          {
            "font-family": "Helvetica",
            "font-size": "18px",
            "color": "#555",
            "-webkit-font-smoothing": "antialiased"
          }
        )

        var styles = element.stylesheet(
          body,
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
  ["web-element", "body-text"],
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
  ["web-element", "body-text"],
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
  ["web-element"],
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
  ["web-element"],
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
