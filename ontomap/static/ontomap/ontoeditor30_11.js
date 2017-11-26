CMPAAS = {};


// MUDAR ISSO AQUI
// var customEditor = document.createElement("select");

var elemento;
var label;

var predefinedOwl = [];
predefinedOwl["are"] = "subClassOf";
predefinedOwl["equivalent to"] = "equivalentClass";
predefinedOwl["cannot be"] = "disjointWith";
predefinedOwl["exact the opposite of"] = "complementOf";
predefinedOwl["is composed of"] = "ComplexConstruction";
predefinedOwl["is a"] = "ClassAssertion";
predefinedOwl["same as"] = "sameAs";
predefinedOwl["different from"] = "differentFrom";
predefinedOwl["is an attribute of"] = "DatatypeProperty ";


var classXclassLinks           = ["are", "equivalent to", "cannot be", "exact opposite of", "is composed of","is an attribute of"];
var individualXclassLinks      = ["is a"];
var individualXindividualLinks = ["same as", "different from"];
var list = classXclassLinks.concat(individualXclassLinks).concat(individualXindividualLinks);
var customEditor = createLinkCustomEditor();

CMPAAS.editor = function() {
  var public = {};

  public.init = function() { 
    var $$ = go.GraphObject.make;  // for conciseness in defining templates
    var yellowgrad = $$(go.Brush, go.Brush.Linear, { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" });
    var radgrad = $$(go.Brush, go.Brush.Radial, { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" });

    myDiagram =
      $$(go.Diagram, "myDiagram",  // must name or refer to the DIV HTML element
        { 
          initialContentAlignment: go.Spot.Center,
          // have mouse wheel events zoom in and out instead of scroll up and down
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
          // enable Ctrl-Z to undo and Ctrl-Y to redo
          "undoManager.isEnabled": true//,
          //"clickCreatingTool.archetypeNodeData": { text: "new node" }
        });

      var forelayer = myDiagram.findLayer("Foreground");
      myDiagram.addLayerBefore($$(go.Layer, { name: "classLayer" }), forelayer);
      myDiagram.addLayerBefore($$(go.Layer, { name: "individualLayer" }), forelayer);
    
    var classNodeTemplate = $$(go.Node, "Auto",
        new go.Binding("layerName", "layer"),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // define the node's outer shape, which will surround the TextBlock
        $$(go.Shape, "Circle",
          // { fill: yellowgrad, stroke: "black",
          { fill: "#acf", stroke: "black", strokeWidth: 2,
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" }),
        $$(go.TextBlock,
          { font: "10pt helvetica, bold arial, sans-serif",
            margin: 4,
            editable: true },
          new go.Binding("text", "text").makeTwoWay())
      );

    var individualNodeTemplate = $$(go.Node, "Vertical",
        new go.Binding("layerName", "layer"),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // define the node's outer shape, which will surround the TextBlock
        $$(go.Shape, "BpmnTaskUser",
          // { fill: yellowgrad, stroke: "black",
          { fill: "#fc3", stroke: "black", strokeWidth: 2,
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer", width: 60, height: 60}),
        $$(go.TextBlock,
          { font: "10pt helvetica, bold arial, sans-serif",
            margin: 4,
            editable: true },
          new go.Binding("text", "text").makeTwoWay())
      );

    var dataTypeNodeTemplate = $$(go.Node, "Auto",
        new go.Binding("layerName", "layer"),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // define the node's outer shape, which will surround the TextBlock
        $$(go.Shape, "Rectangle",
          // { fill: yellowgrad, stroke: "black",
          { fill: "#fc3", stroke: "black", strokeWidth: 2,
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" }),
        $$(go.TextBlock,
          { font: "10pt helvetica, bold arial, sans-serif",
            margin: 4,
            editable: true },
          new go.Binding("text", "text").makeTwoWay())
      );

    classNodeTemplate.selectionAdornmentTemplate =
      $$(go.Adornment, "Spot",
        $$(go.Panel, "Auto",
          $$(go.Shape, { fill: null, stroke: "blue", strokeWidth: 2 }),
          $$(go.Placeholder)
        ),
        // the button to create a "next" node, at the top-right corner
        $$("Button",
          { alignment: go.Spot.TopRight,
            click: addNodeAndLink },  // this function is defined below
          $$(go.Shape, "PlusLine", { desiredSize: new go.Size(6, 6) })
        ) // end button
      ); // end Adornment


      var nodemap = new go.Map("string", go.Node);
      nodemap.add("classNode", classNodeTemplate);
      nodemap.add("individualNode", individualNodeTemplate);
      nodemap.add("",classNodeTemplate);
      myDiagram.nodeTemplateMap = nodemap;

   

    var preDefinedLinkTempalte = $$(go.Link,  // the whole link panel
        { 
          adjusting: go.Link.Stretch,
          reshapable: true
            
        },
        //new go.Binding("points").makeTwoWay(),
        new go.Binding("curviness", "curviness"),
        $$(go.Shape,  // the link shape
          { 
            isPanelMain: true,
            stroke: "black", 
            strokeWidth: 1.5,
            strokeDashArray:[5,5]
          }),
        $$(go.Shape,  // the arrowhead
          { 
            toArrow: "Triangle",
            stroke: "black",
            fill: "white"
          }),
          
        $$(go.TextBlock, "new relation",  // the label
            { 
              textAlign: "center",
              editable: true,
              font: "10pt helvetica, arial, sans-serif",
              stroke: "black",
              margin: 4,
              textEditor: elemento,
              background: "#acf"
            },
            new go.Binding("text", "text").makeTwoWay()
          )
        );
       
      var userDefinedLinkTemplate = $$(go.Link,  // the whole link panel
        { 
          adjusting: go.Link.Stretch,
          reshapable: true, 
          //, routing: go.Link.AvoidsNodes
          //, corner: 1
          toolTip:  $$(go.Adornment, "Auto",
                  $$(go.Shape, { fill: "#FFFFCC" }),
                  $$(go.TextBlock, { margin: 4 },
                    new go.Binding("text", "owl"))
                )
        },
        //new go.Binding("points").makeTwoWay(),
        new go.Binding("curviness", "curviness"),
        $$(go.Shape,  // the link shape
          { 
            isPanelMain: true,
            stroke: "black", 
            strokeWidth: 1.5
          }),
        $$(go.Shape,  // the arrowhead
          { 
            toArrow: "Triangle",
            stroke: null 
          }),
        
        $$(go.Panel, "Vertical",
          
          $$(go.TextBlock, "new relation",  // the label
            { 
              textAlign: "center",
              editable: true,
              font: "10pt helvetica, arial, sans-serif",
              stroke: "black",
              margin: 4,
              textEditor: elemento,
              background: "#9c6"
            },
            new go.Binding("text", "text").makeTwoWay()
          ),
          $$(go.Panel,"Horizontal",
            $$("CheckBox", "functional",
              { "ButtonIcon.stroke": "green" },
              $$(go.TextBlock, "f")
            ),
            $$("CheckBox", "reflexive",
              { "ButtonIcon.stroke": "green" },
              $$(go.TextBlock, "r")
            ),
            $$("CheckBox", "symmetric",
              { "ButtonIcon.stroke": "green" },
              $$(go.TextBlock, "s")
            ),
            $$("CheckBox", "transitive",
              { "ButtonIcon.stroke": "green" },
              $$(go.TextBlock, "t")
            )
          )
        )
      ); 

  var linkmap = new go.Map("string", go.Link);
  linkmap.add("userdefined", userDefinedLinkTemplate);
  linkmap.add("predefined", preDefinedLinkTempalte);
  linkmap.add("",userDefinedLinkTemplate);
  myDiagram.linkTemplateMap = linkmap;


  function addNode(e,obj,nodecategory){
    var diagram = e.diagram;
    diagram.startTransaction('new node');
    
    var data = {category: nodecategory};
    if (nodecategory == "classNode"){
      data.layer = "classLayer";
      data.text = "New Class";
    } else if (nodecategory == "individualNode") {
      data.layer = "individualLayer";
      data.text = "New Individual";
    }
    diagram.model.addNodeData(data);

    part = diagram.findPartForData(data);
    part.location = diagram.toolManager.contextMenuTool.mouseDownPoint;

    diagram.commitTransaction('new node');
  }

  myDiagram.contextMenu = 

    $$(go.Adornment, "Vertical",
      $$("ContextMenuButton",
        $$(go.TextBlock, "Add Class"),
        {click:function(e,obj){
                addNode(e,obj,"classNode");
              }
        }
      ),

      $$("ContextMenuButton",
        $$(go.TextBlock, "Add Individual"),
        {click:function(e,obj){
                addNode(e,obj,"individualNode");
              }
        }
      )

    );

    myDiagram.addDiagramListener("Modified", function(e) {

      var button = document.getElementById("saveButton");
      if (button) button.disabled = !myDiagram.isModified;
      var idx = document.title.indexOf("*");
      if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx); 
      }


      //retornar com o textblock que foi alterado no evento de click
      myDiagram.toolManager.textEditingTool.textValidation = function(textblock, velho, novo){
        return (novo != "");
      };
    });

    myDiagram.model.addChangedListener(function(e){



      if (e.change == go.ChangedEvent.Property 
        && e.propertyName == "text" 
        && e.object.from != null) {
          console.log("entrou");
          
          if (!checkLinksRule(e.object)){
            myDiagram.rollbackTransaction();
          }

          var new_category = getLinkPropertyByName(e.newValue,"category");
          var old_category = getLinkPropertyByName(e.oldValue,"category");
          if (new_category != old_category){
            myDiagram.model.setDataProperty(e.object, "category", new_category);
          }

          var new_owl = getLinkPropertyByName(e.newValue,"owl");
          var old_owl = getLinkPropertyByName(e.oldValue,"owl");
          if (new_owl != old_owl){
            if(new_owl === "") {
              new_owl = "ObjectProperty";
            } 
            myDiagram.model.setDataProperty(e.object, "owl", new_owl);
          }
      }
    });
  };


  //salva o mapa 
  public.save = function(){
    var map = serialize();
    console.log(map);
    $.post('/editor/save/', map, function(dados){
      console.log(dados);
    });
  };

  //carrega o mapa 
  public.load = function(){
    $.get('/editor/load/', function(dados){
      myDiagram.model = go.Model.fromJson(dados);
    });
  };

  //exporta o mapa para OWL
  public.exportToOwl = function(){
    var map = myDiagram.model.toJson();
    console.log(map);
    $.ajax({
      type: "POST",
      url: "http://localhost:8080/ontomap/ontomap/service",
      // dataType:"JSON",
      data: map,
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      headers: {
        // Set any custom headers here.
        // If you set any non-simple headers, your server must include these
        // headers in the 'Access-Control-Allow-Headers' response header.
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
        "Accept" : "*",
        "Content-Type": "application/json; charset=utf-8"
      },

      success: 
        function(data) {
          console.log(data);
          // var titleMap = $("#title").text();
          saveTextAsFile(data, $("#title").text());
        },
      error: 
        function(jqXHR, textStatus, errorMessage) {
          console.log(errorMessage + " - " + textStatus); // Optional
        }
    });
    return false;
  };


  

  // ################## PRIVATE ##################

  // função que serializa o JSON: apenas retira a propriedade 'class' do objeto
  function serialize(){
    var obj = myDiagram.model.toJson();
    obj = obj.replace("\"class\": \"go.GraphLinksModel\",",""); //verificar se há necessidade de retirar essa parte
    return obj;
  }



  function addNodeAndLink(e, obj) {
    var adorn = obj.part;
    if (adorn === null) return;
    e.handled = true;
    var diagram = adorn.diagram;
    diagram.startTransaction("Add State");
    // get the node data for which the user clicked the button
    var fromNode = adorn.adornedPart;
    var fromData = fromNode.data;
    // create a new "State" data object, positioned off to the right of the adorned Node
    var toData = {};
    toData.layer = "classLayer";
    toData.text = "New Class";
    toData.category = "classNode";
    var p = fromNode.location;
    toData.loc = p.x + 200 + " " + p.y;  // the "loc" property is a string, not a Point object
    // add the new node data to the model
    var model = diagram.model;
    model.addNodeData(toData);
    // create a link data from the old node data to the new node data
    var linkdata = {};
    linkdata[model.linkFromKeyProperty] = model.getKeyForNodeData(fromData);
    linkdata[model.linkToKeyProperty] = model.getKeyForNodeData(toData);
    linkdata.category = "userdefined";
    linkdata.owl = "ObjectProperty";
    // and add the link data to the model
    model.addLinkData(linkdata);
    // select the new Node
    var newnode = diagram.findNodeForData(toData);
    diagram.select(newnode);
    diagram.commitTransaction("Add State");
  }

  return public;
};

  function saveTextAsFile(data, title) {
    // var textFileAsBlob = new Blob([data], {type:'text/xml'}); 

    // var xmlDoc = new DOMParser().parseFromString(data, "application/xml");
    var parserXML = new XMLSerializer().serializeToString(data);
    // var results = new XMLSerializer().serializeToString(xmlDoc);
    console.log(parserXML);

    var textFileAsBlob = new Blob([parserXML]); 

    var downloadLink = document.createElement("a");
    downloadLink.download = title + ".owl";
    // downloadLink.innerHTML = "Download File";
    if (window.URL != null)
    {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    }
    else
    {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  }

function createLinkCustomEditor(){
    var customEditor = document.createElement("datalist");
    customEditor.id = "lista";
    for (var i = 0; i < list.length; i++) {
      op = document.createElement("option");
      // op.text = list[i];
      op.value = list[i];
      op.setAttribute("category","predefined");
      op.setAttribute("owl" , predefinedOwl[list[i]] );
      customEditor.appendChild(op);
    }


    var textBox = document.createElement("input");
    textBox.type = "text";
    textBox.id = "entrada";
    textBox.name = "stereotype";

    textBox.setAttribute("list","lista");

    elemento = document.createElement("div");
    elemento.setAttribute("id","teste")
    elemento.appendChild(textBox);
    elemento.appendChild(customEditor);

    elemento.value = function(){
      return textBox.value;
    }


    /*elemento.oninput = function () {
      //console.log("entrou no evento de oninput do elemento");
      elemento.value = elemento.textEditingTool.textBlock.text;
    }*/

    elemento.onActivate = function () {
      //console.log("entrou no evento de onActivate");
      elemento.textBox = elemento.textEditingTool.textBlock.text;
      var loc = elemento.textEditingTool.textBlock.getDocumentPoint(go.Spot.TopLeft);
      var pos = elemento.textEditingTool.diagram.transformDocToView(loc);
      elemento.style.left = pos.x + "px";
      elemento.style.top = pos.y + "px";
    };

    elemento.onDeactivate = function() {
      this.addNewRelation(elemento.value());
    };

    elemento.addNewRelation = function(name){
      contain = false;
      
      for (var i = 0 ; i < customEditor.options.length ; i++){
        op = customEditor.options[i];
        if (op.value == name) {
          contain = true;
          break;
        }
      }

      if (!contain) {
        tmplist = [];
        tmpobj = {};
        opts = customEditor.options;
        l = opts.length-1;
        for ( i = l ; i >= 0  ; i-- ){
          tmpobj = {};
          tmpobj.value = opts[i].value;
          tmpobj.category = opts[i].getAttribute("category");
          tmpobj.owl = opts[i].getAttribute("owl");
          tmplist.push(tmpobj);
          customEditor.removeChild(opts[i]);
        }

        tmpobj = {};
        tmpobj.value = name;
        tmpobj.category = "userdefined";
        tmpobj.owl = "ObjectProperty"
        tmplist.push(tmpobj);
        tmplist.sort(function (a,b){
          if (a.value < b.value) return -1;
          if (a.value > b.value) return 1;
          return 0;
        });

        l=tmplist.length;
        for (i=0 ; i < l ; i++){
          op = document.createElement("option");
          op.value = tmplist[i].value;
          op.setAttribute("category",tmplist[i].category);
          op.setAttribute("owl",tmplist[i].owl);
          customEditor.appendChild(op);
        }
      }
    };

    return elemento;
    /*textBox.oninput = function () {
      elemento.textEditingTool.textBlock.text = textBox.value;
    };*/
  }

function checkLinks   (link){
  
  var m = myDiagram.model;
  var nodes = m.nodeDataArray;
  var lookup = {};
  for (var i = 0, len = nodes.length; i < len; i++) {
      lookup[nodes[i].key] = nodes[i];
  }
  var f = lookup[link.from];
  var t = lookup[link.to];

  var fcat = f.category;
  var tcat = t.category;
  var name = link.text;
  var index = -1;
  var category = getLinkPropertyByName(name,"category");

  if (category != "predefined") return true;

  if ( fcat === tcat && fcat === "classNode")
  {
      index = $.inArray(name, classXclassLinks);
      return (index != -1); 
  } 
  else if ( fcat === "individualNode")
  {
    if (tcat === "individualNode") 
    {
      index = $.inArray(name, individualXindividualLinks);
      return (index != -1); 
    } 
    else (tcat === "classNode") 
    {
      index = $.inArray(name, individualXclassLinks);
      return (index != -1); 
    }
  }

  
}

function getLinkPropertyByName(name,property){
  var options = elemento.children.namedItem("lista").options;

  for (var i = 0 ; i < options.length ; i++){
    op = options[i];
    if (op.value == name) {
      return options[i].getAttribute(property);
    }
  }
  return "";
}


// define this function so that the checkbox event handlers can call it
  function toggleVisible(layername, e) {
    myDiagram.startTransaction('toggle ' + layername);
    var layer = myDiagram.findLayer(layername);
    if (layer !== null) layer.visible = e.currentTarget.checked;
    myDiagram.commitTransaction('toggle ' + layername);
  };

(function() {
  var editor = CMPAAS.editor();
  editor.init();


  $('#saveButton').click(function(){
    editor.save();
  });

  $('#loadButton').click(function(){
    editor.load();
  });

  $('#exportButton').click(function(){
    editor.exportToOwl();
  });
    
})();