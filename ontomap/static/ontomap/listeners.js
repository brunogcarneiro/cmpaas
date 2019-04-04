var modifiedListener = function(e) {

      var button = document.getElementById("saveButton");
      if (button) button.disabled = !myDiagram.isModified;
      var idx = document.title.indexOf("*");
      if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx); 
      }


      
    };

    var modelChangedListener = function(e){

      if (e.change === go.ChangedEvent.Insert
      		&& e.modelChange == "linkDataArray"){
      	
      	newLink = e.newValue;
      	name = newLink.text;
      	from = getNodeByKey(newLink.from);
      	to = getNodeByKey(newLink.to);
      	
      	iLink = getInitialLink(name,from,to);

      		

      	if (iLink == null){
      		myDiagram.rollbackTransaction();
      	} else {
      	
      		myDiagram.model.setDataProperty(newLink,"text",iLink.text);
      		myDiagram.model.setDataProperty(newLink,"owl",iLink.owl);
      		myDiagram.model.setDataProperty(newLink,"category",iLink.category);
      	}
      	
      	return;
      } 
      

      if (e.change == go.ChangedEvent.Property 
        && e.propertyName == "text" 
        && e.object.from != null) {
          
          
          //if (!checkLinksRule(e.object)){
            //myDiagram.rollbackTransaction();
            //return;
          //}

          customEditor = defineCustomEditor(e.object.from,e.object.to);

          var new_category = getLinkPropertyByName(e.newValue,"category",customEditor);
          var old_category = getLinkPropertyByName(e.oldValue,"category",customEditor);
          if (new_category != old_category){
            myDiagram.model.setDataProperty(e.object, "category", new_category);
          }

          var new_owl = getLinkPropertyByName(e.newValue,"owl",customEditor);
          var old_owl = getLinkPropertyByName(e.oldValue,"owl",customEditor);
          if (new_owl != old_owl){
            if(new_owl === "") {
              new_owl = "ObjectProperty";
            } 
            myDiagram.model.setDataProperty(e.object, "owl", new_owl);
          }
      }
    };

