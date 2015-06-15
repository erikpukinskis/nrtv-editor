if (typeof define !== 'function') {
  var define = require('amdefine')(
    module)}



define(
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
  "save-button",
  ["nrtv-component", "nrtv-element", "nrtv-server-tie", "nrtv-bridge-tie", "nrtv-database-tie", "nrtv-element-tie"],
  function(component, element, ServerTie, BridgeTie, DatabaseTie, ElementTie) {

    var SaveButton = component(ServerTie, BridgeTie, DatabaseTie, ElementTie, function(getCode) {
        // this func won't really be available until way late, when we are instantiated.
      }
    )

    var server = SaveButton.server()
    var bridge = SaveButton.bridge()

    var successMessage = SaveButton.element(".success.hidden", "Saved!")

    var showSuccess = successMessage.showOnClient(bridge)
    console.log()
    var saveRoute = server.route(
      "post", 
      "/:name",
      function(request, response) {
        console.log("this is where we save")
        response.json(showSuccess)
      }
    )

    function getCode() {
      return $("textarea").html()
    }

    var Actuator = element.template(
      'button',
      {
        onclick: saveRoute.makeRequest(bridge)




        //   save.across(bridge).withArgs()
        //   save.makeRequest(bridge, WE NEED A REF HERE TO THE DATAS)
      },
      "Save"
    )

    return SaveButton
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
        this.client = {
          save: function(bridge) {
            bridge.bindOnClient
            return ""
          }
        }
      }
    )

  }
)





define(
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
      function(source) {
        var saveButton = SaveButton({
          onclick: code.client.save()
        })

        var el = CenterColumn(
          saveButon,
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


// Template has a bridge concern, which is that in order to bridge routes with elements, we need to batch styles and client bindings into a request.

// So maybe there are just a lot of bridges, and a bridge is a square, like

//    Some                Another
//  Template   Another    Template
//     T • • • • T • • • • • T
//     •         •           •
//     -----------------------
//     - Thing being bridged -
//     ---- HTTP Request -----
//     -----------------------
//     •      •       •      •
//     El • • El • • El • • El
//          (some set of 
//          dom elements)

// Maybe that's why bridge feels like it keeps wanting to grow, because if there are N modules, there are actually a space of N! bridges that we could build. Not all of them will seem immediately useful to us. I suspect given the platform is accessible to enouch people, there will be an application for a bridge between every single module pair.

// Maybe bridges are components. Like components talk to bridges the same way they talk to other components.


// (And this is a super interesting point for the history talk. This will port super cleanly: ties can just become components one at a time. And the reason the port is clean is because we already spent a lot of time deciding what the boundaries around those things should be. So we're just shifting the container slightly, we're not slicing a million things in half all at once, which is what platforms do. They force you to do that because they limit themselves to 4 or 8 or 12 components.)





