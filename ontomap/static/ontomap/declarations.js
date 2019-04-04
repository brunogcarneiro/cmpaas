var $$ = go.GraphObject.make;  // for conciseness in defining templates
    var yellowgrad = $$(go.Brush, go.Brush.Linear, { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" });
    var radgrad = $$(go.Brush, go.Brush.Radial, { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" });

var label;

var predefinedOwl = [];
predefinedOwl["are"] = "subClassOf";
predefinedOwl["equivalent to"] = "equivalentClass";
predefinedOwl["cannot be"] = "disjointWith";
predefinedOwl["exact opposite of"] = "complementOf";
predefinedOwl["is composed of"] = "ComplexConstruction";
predefinedOwl["is a"] = "ClassAssertion";
predefinedOwl["same as"] = "sameAs";
predefinedOwl["different from"] = "differentFrom";
predefinedOwl["is an attribute of"] = "DatatypeProperty";

var predefinedCategories = [];
predefinedCategories["are"] = "basicDirectedClass";
predefinedCategories["equivalent to"] = "basicNonDirectedClass";
predefinedCategories["cannot be"] = "cannotBeLinkTemplate";
predefinedCategories["exact opposite of"] = "exactOppositeOf";
predefinedCategories["is composed of"] = "basicDirectedClass";
predefinedCategories["is a"] = "basicDirectedIndividual";
predefinedCategories["same as"] = "basicNonDirectedIndividual";
predefinedCategories["different from"] = "basicNonDirectedIndividual";
predefinedCategories["is an attribute of"] = "datatypeProperty";




var classXclassLinks           = ["are", "equivalent to", "cannot be", "exact opposite of", "is composed of"];
var individualXclassLinks      = ["is a"];
var individualXindividualLinks = ["same as", "different from"];
var classXdatatypeLinks        = ["is an attribute of"];
var list = classXclassLinks.concat(individualXclassLinks).concat(individualXindividualLinks).concat(classXdatatypeLinks);
var classCustomEditor = createClassCustomEditor();
var individualCustomEditor = createIndividualCustomEditor();

function createClassCustomEditor(){
    var cceDataList = document.createElement("datalist");
    cceDataList.id = "cceDataList";
    for (var i = 0; i < classXclassLinks.length; i++) {
      op = document.createElement("option");
      // op.text = list[i];
      op.value = classXclassLinks[i];
      op.setAttribute("category",predefinedCategories[list[i]]);
      op.setAttribute("owl" , predefinedOwl[classXclassLinks[i]]);
      cceDataList.appendChild(op);
    }


    var cceTextBox = document.createElement("input");
    cceTextBox.type = "text";
    cceTextBox.id = "cceTextBox";
    cceTextBox.name = "stereotype";

    cceTextBox.setAttribute("list","cceDataList");

    cce = document.createElement("div");
    cce.setAttribute("id","cce")
    cce.appendChild(cceTextBox);
    cce.appendChild(cceDataList);

    cce.value = function(){
      return cceTextBox.value;
    }

    cce.onActivate = function () {
      //console.log("entrou no evento de onActivate");
      cce.textBox = cce.textEditingTool.textBlock.text;
      var loc = cce.textEditingTool.textBlock.getDocumentPoint(go.Spot.TopLeft);
      var pos = cce.textEditingTool.diagram.transformDocToView(loc);
      cce.style.left = pos.x + "px";
      cce.style.top = pos.y + "px";
    };

    cce.onDeactivate = function() {
	    if (!containItemLista(cce.value(),cceDataList)){
	      addItemLista(cce.value(),cceDataList,"objectProperty","ObjectProperty");
	    }

	    ice = individualCustomEditor;
	    console.log(ice);
	    if (!containItemLista(ice.value(),ice.children["iceDataList"])){
	    	console.log('entrou');
	      addItemLista(cce.value(),ice.children["iceDataList"],"objectPropertyAssertion","ObjectPropertyAssertion");
	    }

	    console.log(individualCustomEditor);
    };

    return cce;
  }

  function createIndividualCustomEditor(){
    iceDataList = document.createElement("datalist");
    iceDataList.id = "iceDataList";
    list = individualXindividualLinks;
    for (var i = 0; i < list.length; i++) {
      op = document.createElement("option");
      // op.text = list[i];
      op.value = list[i];
      op.setAttribute("category",predefinedCategories[list[i]]);
      op.setAttribute("owl" , predefinedOwl[list[i]]);
      iceDataList.appendChild(op);
    }


    var iceTextBox = document.createElement("input");
    iceTextBox.type = "text";
    iceTextBox.id = "iceTextBox";
    iceTextBox.name = "stereotype";

    iceTextBox.setAttribute("list","iceDataList");

    ice = document.createElement("div");
    ice.setAttribute("id","ice")
    ice.appendChild(iceTextBox);
    ice.appendChild(iceDataList);

    ice.value = function(){
      return iceTextBox.value;
    }

    ice.onActivate = function () {
      //console.log("entrou no evento de onActivate");
      ice.textBox = ice.textEditingTool.textBlock.text;
      var loc = ice.textEditingTool.textBlock.getDocumentPoint(go.Spot.TopLeft);
      var pos = ice.textEditingTool.diagram.transformDocToView(loc);
      ice.style.left = pos.x + "px";
      ice.style.top = pos.y + "px";
    };

    return ice;
  }

  function containItemLista(item,datalist){
	contain = false;
	opts = datalist.options;
	for (var i = 0 ; i < opts.length ; i++){
		op = opts[i];
		if (op.value == item) {
			contain = true;
			break;
		}
	}
	return contain;
  }

  function addItemLista(item,datalist, category, owl){
  	tmplist = [];
    tmpobj = {};
    opts = datalist.options;
    l = opts.length-1;
    for ( i = l ; i >= 0  ; i-- ){
      tmpobj = {};
      tmpobj.value = opts[i].value;
      tmpobj.category = opts[i].getAttribute("category");
      tmpobj.owl = opts[i].getAttribute("owl");
      tmplist.push(tmpobj);
      datalist.removeChild(opts[i]);
    }

    tmpobj = {};
    tmpobj.value = item;
    tmpobj.category = category;
    tmpobj.owl = owl;
    tmplist.push(tmpobj);
    tmplist.sort(function (a,b){
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    });

    l=tmplist.length;
    for (i=0 ; i < l ; i++){
      op = document.createElement("option");
      op.setAttribute("value",tmplist[i].value);
      op.setAttribute("category",tmplist[i].category);
      op.setAttribute("owl",tmplist[i].owl);
      datalist.appendChild(op);
    }
  }

   function getInitialLink(name,from,to){
   		fcat = from.category;
   		tcat = to.category;

   		iLink = null;

   		console.log(fcat+" "+tcat);

   		if ( fcat == "individualNode" && tcat == "classNode" ){
   			iLink = {}
   			iLink.text = "is a";
   			iLink.owl = "ClassAssertion"
   			iLink.category = "basicDirectedIndividual";
   		}

   		if ( fcat == "attributeNode" && tcat == "classNode"){
   			iLink = {}
   			iLink.text = "is an attribute of";
   			iLink.owl = "DataTypeProperty"
   			iLink.category = "datatypeProperty";
   		}

   		if ( fcat == "individualNode" && tcat == "individualNode" ){
   			iLink = {}
   			iLink.text = "same as";
   			iLink.owl = "SameAs"
   			iLink.category = "basicNonDirectedIndividual";
   		}

   		if ( fcat == "classNode" && tcat == "classNode" ){
   			iLink = {}
   			iLink.text = "New Relation";
   			iLink.owl = "ObjectProperty"
   			iLink.category = "objectPropertyClass";
   		}

   		return iLink;
   }

  

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

function getNodeByKey(key){
  var m = myDiagram.model;
  var nodes = m.nodeDataArray;
  var lookup = {};
  for (var i = 0, len = nodes.length; i < len; i++) {
      lookup[nodes[i].key] = nodes[i];
  }
  return lookup[key];
}

function defineCustomEditor(from,to){
	fcat = getNodeByKey(from).category;
	tcat = getNodeByKey(to).category;


	if ( fcat == "individualNode" && tcat == "individualNode" ){
		return individualCustomEditor;
	}

	if ( fcat == "classNode" && tcat == "classNode" ){
		return classCustomEditor;
	}

	return null;
}

function checkLinksRule(link){
  
  var f = getNodeByKey(link.from);
  var t = getNodeByKey(link.to);

  var fcat = f.category;
  var tcat = t.category;
  var name = link.text;
  var index = -1;

  customEditor = defineCustomEditor(link.from,link.to);
  var category = getLinkPropertyByName(name,"category",customEditor);

  
  var isPredefined = false;
  for (var key in predefinedCategories){
  	if (category == predefinedCategories[key]) isPredefined = true;
  }
  if (!isPredefined) return true;

	var troca;
	if ( fcat === tcat && fcat === "classNode")
	{
		index = $.inArray(name, classXclassLinks);
		return (index != -1); 
	} 
	else if (fcat === "classNode" && tcat === "individualNode"){
		troca = link.to;
		myDiagram.model.setDataProperty(link, "to", link.from);
		myDiagram.model.setDataProperty(link, "from", troca);
		index = $.inArray(name, individualXclassLinks);
		return (index != -1); 
	}
	else if (fcat === "classNode"  && tcat === "attributeNode")
	{
		troca = link.to;
		myDiagram.model.setDataProperty(link, "to", link.from);
		myDiagram.model.setDataProperty(link, "from", troca);
		index = $.inArray(name, classXdatatypeLinks);
		return (index != -1); 
	}
	else if (fcat === "individualNode"  && tcat === "classNode")
	{
		index = $.inArray(name, individualXclassLinks);
		return (index != -1); 
	}
	else if ( fcat === tcat && fcat === "individualNode")
	{
		index = $.inArray(name, individualXindividualLinks);
		return (index != -1); 
	}
	else if (fcat === "individualNode"  && tcat === "attributeNode")
	{
		return false;
	}
	else if (fcat === "attributeNode"  && tcat === "classNode")
	{
		index = $.inArray(name, classXdatatypeLinks);
		return (index != -1); 
	}
	else if (fcat === "attributeNode"  && tcat === "individualNode")
	{
		return false;
	}
	else if ( fcat === tcat && fcat === "attributeNode")
	{
		return false;
	}

  
}

function getLinkPropertyByName(name,property,customEditor){
  
  if (customEditor == null){
  	if (name == "is a"){
  		return "basicDirectedIndividual";
  	} else if (name == "is an attribute of"){
  		return "datatypeProperty";
  	}
  	return "";
  }


  var options = customEditor.children[1].options;



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

  var exportToOwl = function(){
    var map = myDiagram.model.toJson();
    
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