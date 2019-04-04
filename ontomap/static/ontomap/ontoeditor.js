CMPAAS = {};


// MUDAR ISSO AQUI
// var customEditor = document.createElement("select");



CMPAAS.editor = function() {
  var public = {};

  public.init = function() { 
    
    myDiagram =
      $$(go.Diagram, "myDiagram",  // must name or refer to the DIV HTML element
        { 
          initialContentAlignment: go.Spot.Center,
          // have mouse wheel events zoom in and out instead of scroll up and down
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
          // enable Ctrl-Z to undo and Ctrl-Y to redo
          "undoManager.isEnabled": true,
          "clickCreatingTool.archetypeNodeData": { text: "New Class", layer:"classLayer", category: "classNode" }
        });

    var forelayer = myDiagram.findLayer("Foreground");
    myDiagram.addLayerBefore($$(go.Layer, { name: "classLayer" }), forelayer);
    myDiagram.addLayerBefore($$(go.Layer, { name: "individualLayer" }), forelayer);
    myDiagram.addLayerBefore($$(go.Layer, { name: "attributeLayer" }), forelayer);
  
    var nodemap = new go.Map("string", go.Node);
    nodemap.add("classNode", classNodeTemplate);
    nodemap.add("individualNode", individualNodeTemplate);
    nodemap.add("attributeNode", dataTypeNodeTemplate);
    nodemap.add("",classNodeTemplate);
    myDiagram.nodeTemplateMap = nodemap;
  
    var linkmap = new go.Map("string", go.Link);
    linkmap.add("objectProperty", objectPropertyLinkTemplate); 
    linkmap.add("objectPropertyAssertion", objectPropertyAssertionLinkTemplate); 
    linkmap.add("basicDirectedClass", basicDirectedClassLinkTempalte);
    linkmap.add("basicDirectedIndividual", basicDirectedIndividualLinkTemplate);
    linkmap.add("basicNonDirectedClass", basicNonDirectedClassLinkTemplate);
    linkmap.add("basicNonDirectedIndividual", basicNonDirectedIndividualLinkTemplate);
    linkmap.add("cannotBeLinkTemplate", cannotBeLinkTemplate);
    linkmap.add("exactOppositeOf", exactOppositeOfLinkTemplate);
    linkmap.add("datatypeProperty", datatypePropertyLinkTemplate);
    linkmap.add("",objectPropertyLinkTemplate);
    myDiagram.linkTemplateMap = linkmap;

    // ################## PRIVATE ##################

    // função que serializa o JSON: apenas retira a propriedade 'class' do objeto
    function serialize(){
      var obj = myDiagram.model.toJson();
      obj = obj.replace("\"class\": \"go.GraphLinksModel\",",""); //verificar se há necessidade de retirar essa parte
      return obj;
    }


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
      } else if (nodecategory == "attributeNode"){
        data.layer = "attributeLayer";
        data.text = "New Attribute";
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
        ),

        $$("ContextMenuButton",
          $$(go.TextBlock, "Add Attribute"),
          {click:function(e,obj){
                  addNode(e,obj,"attributeNode");
                }
          }
        )
      );

      myDiagram.addDiagramListener("Modified", modifiedListener);

      myDiagram.toolManager.textEditingTool.textValidation = function(textblock, velho, novo){
        return (novo != "");
      };

      myDiagram.model.addChangedListener(modelChangedListener);

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
  public.exportToOwl = exportToOwl;


  return public;
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