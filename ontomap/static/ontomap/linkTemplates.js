var basicDirectedClassLinkTempalte = $$(go.Link,  // the whole link panel
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
              textEditor: classCustomEditor,
              segmentOffset: new go.Point(0, -10)
            },
            new go.Binding("text", "text").makeTwoWay()
          )
        ); 

var basicDirectedIndividualLinkTemplate = $$(go.Link,  // the whole link panel
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
              font: "10pt helvetica, arial, sans-serif",
              stroke: "black",
              margin: 4,
              segmentOffset: new go.Point(0, -10)
            },
            new go.Binding("text", "text").makeTwoWay()
          )
        ); 

var basicNonDirectedClassLinkTemplate = $$(go.Link,  // the whole link panel
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
        $$(go.TextBlock, "new relation",  // the label
            { 
              textAlign: "center",
              editable: true,
              font: "10pt helvetica, arial, sans-serif",
              stroke: "black",
              margin: 4,
              textEditor: classCustomEditor,
              segmentOffset: new go.Point(0, -10)
            },
            new go.Binding("text", "text").makeTwoWay()
          )
        ); 

var basicNonDirectedIndividualLinkTemplate = $$(go.Link,  // the whole link panel
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
        $$(go.TextBlock, "new relation",  // the label
            { 
              textAlign: "center",
              editable: true,
              font: "10pt helvetica, arial, sans-serif",
              stroke: "black",
              margin: 4,
              textEditor: individualCustomEditor,
              segmentOffset: new go.Point(0, -10)
            },
            new go.Binding("text", "text").makeTwoWay()
          )
        ); 


var cannotBeLinkTemplate = $$(go.Link,  // the whole link panel
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
            strokeDashArray:[10,10]
          }),
          $$(go.Panel, "Auto",
            $$(go.Shape, "Rectangle",
            {
              width: 75, height:35, margin:5, fill: "#acf", stroke:null
            }),
            $$(go.Panel,"Horizontal",
              $$(go.Shape,"Circle",{
                width: 25, height:25, margin:5, fill: "#39c"
              }),
              $$(go.Shape,"Circle",{
                width: 25, height:25, margin:5, fill: "#39c"
              })
            )
            
          ),
          $$(go.TextBlock, "new relation",  // the label
            { 
              textAlign: "center",
              editable: true,
              font: "10pt helvetica, arial, sans-serif",
              stroke: "black",
              margin: 4,
              textEditor: classCustomEditor,
              alignmentFocus: new go.Spot(0.5, 0.5, 0, -25)
            },
            new go.Binding("text", "text").makeTwoWay()
            )
          
        
        );

var exactOppositeOfLinkTemplate = $$(go.Link,  // the whole link panel
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
            strokeDashArray:[10,10]
          }),
       
          $$(go.Panel, "Auto",
            $$(go.Shape, "Circle",
            {
              width: 60, height:60, margin:5, fill: "#acf", 
              stroke:"black", strokeWidth: 1.5, strokeDashArray:[10,10]
            }),
       
            $$(go.Shape,"Circle",{
              width: 30, height:30, margin:5, fill: "#39c",
              stroke:"black", 
            }),
            
            $$(go.TextBlock, "¬",  // the label
            { 
              textAlign: "center",
              font: "20pt helvetica, arial, sans-serif",
              stroke: "black",
              margin: 4
            })
          ),
          $$(go.TextBlock, "new relation",  // the label
            { 
              textAlign: "center",
              editable: true,
              font: "10pt helvetica, arial, sans-serif",
              stroke: "black",
              margin: 4,
              textEditor: classCustomEditor,
              alignmentFocus: new go.Spot(0.5, 0.5, 0, -40)
            },
            new go.Binding("text", "text").makeTwoWay()
            )
          
        
        );

var datatypePropertyLinkTemplate = $$(go.Link,  // the whole link panel
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
            strokeWidth: 1.5
          }),
        $$(go.Shape,  // the arrowhead
          { 
            toArrow: "Triangle",
            stroke: null 
          }),
          
          $$(go.TextBlock, "new relation",  // the label
            { 
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "black",
              margin: 4,
              background: "#9c6"
            },
            new go.Binding("text", "text").makeTwoWay()
            )
          
        
        );
       
      var objectPropertyLinkTemplate = $$(go.Link,  // the whole link panel
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
              textEditor: classCustomEditor,
              background: "#acf"
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

      var objectPropertyAssertionLinkTemplate = $$(go.Link,  // the whole link panel
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
              textEditor: individualCustomEditor,
              background: "#acf"
            },
            new go.Binding("text", "text").makeTwoWay()
          )
          
        )
      );