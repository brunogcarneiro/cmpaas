var $$ = go.GraphObject.make;  // for conciseness in defining templates
    var yellowgrad = $$(go.Brush, go.Brush.Linear, { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" });
    var radgrad = $$(go.Brush, go.Brush.Radial, { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" });


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