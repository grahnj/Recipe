function CreateSteps(readWrite, Recipe, stepNum, details) {
	var recipe = Recipe;
	var readWrite = readWrite;
	var ui = Ti.UI;
	var num = Number(stepNum);
	var steps = [];
	
	if (details != null)
		steps = details;
		
	var db = require("db");
	var recipe = require("Ingredient");
	var detail = "";
	var moreSteps = true;
	var REMOVE_ME = 1;
	
	(function(){
		if (num + 1 == steps.length) {
			moreSteps = false;
		}
		console.log(num);
		if(readWrite == false) {
			if(details == null) {
				var rows = db.getSteps(REMOVE_ME);
				while(rows.isValidRow()) {
					var step = {
						rowid: rows.fieldByName("rowid"),
						step: rows.fieldByName("STEP_NUMBER"),
						details: rows.fieldByName("DETAILS"),
					};
					console.log("Step: " + step.rowid + " " + step.step + " " + step.details);
					steps.push(step.details);
					rows.next();
				}
			}
			detail = steps[num];
		}
	})();
	
	
	//Create the window
	var window = ui.createWindow({
		backgroundColor: "#cccccc",
		layout: "vertical",
		orientation: "vertical"
	});
	
	//Create a panel - mainView
	var mainView = ui.createView({
		top: 0,
		width: "100%",
		height: "100%",
		backgroundColor: "#cccccc",
		layout: "vertical"
	});
	
		//Create a label -- Create Steps
		var headerLabel = ui.createLabel({
			color: "#000000",
			text: "Create Steps",
			height: '10%',
			width: '100%',
			textAlign: "left",
			top: "5%", left: 10,
			font:{
				fontSize: '55sp',
				fontWeight: 'bold'
			}
		});
		
		mainView.add(headerLabel);
		var startNum = num + 1;
		var stepNumberText = "Step #" + startNum;
		console.log(num);
		//Create a panel -- StepsView
		var stepsView = ui.createView({
			top: 0,
			width: "100%",
			height: "50%",
			backgroundColor: "#cccccc",
			layout: 'vertical'
		});
			//Create a Label -- Step #
			var headerLabel = ui.createLabel({
				color: "#000000",
				text: stepNumberText, //TODO maybe change to show id of current step
				height: ui.SIZE,
				textAlign: "center",
				top: "5%",
				font:{
					fontSize: '25sp',
					fontWeight: 'bold'
				}
			});
			
			stepsView.add(headerLabel);
			
			//Create a textField -- stepsArea
			var stepsArea = Ti.UI.createTextArea({
			  borderWidth: 2,
			  borderColor: '#000000',
			  borderRadius: 5,
			  color: '#000000',
			  editable: readWrite,
			  font: {fontSize:20, fontWeight:'bold'},
			  //keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
			  returnKeyType: Ti.UI.RETURNKEY_GO,
			  textAlign: 'left',
			  hintText: 'Enter step information here...',
			  top: 5,
			  width: '100%', height : '80%',	
			  value: detail	  
			});
			
			stepsView.add(stepsArea);
			
		mainView.add(stepsView);
			
		//Create a panel -- buttonView
		var buttonView = ui.createView({
			top: 0,
			width: "50%",
			height: "15%",
			backgroundColor: "#cccccc",
			layout: 'horizontal'
		});
		
			//Create a button -- nextButton
			var nextButton = Titanium.UI.createButton({
			   title: 'Next Step',
			   top: 5,
			   width: ui.SIZE,
			   enabled: moreSteps
			});
			
				nextButton.addEventListener('click', function(e) {
					var CreateSteps = require('ui/CreateSteps');
					if(readWrite) {
						console.log(Recipe.id);
						//TODO This still isn't getting the proper value
						db.setStep(REMOVE_ME, num+1, stepsArea.value);
						new CreateSteps(true, recipe, ++num, null).open();
					
					}
					else {
						if(moreSteps) {
						new CreateSteps(false, recipe, ++num, steps).open();
						}
					}
				});
			
			buttonView.add(nextButton);
			//Create a button -- finishButton
			var finishButton = Titanium.UI.createButton({
			   title: 'Finish',
			   top: 5,
			   width: ui.SIZE,
			});
				finishButton.addEventListener('click', function(e) {
					if (readWrite)
						db.setStep(REMOVE_ME, num+1, detail);
						
					var Window = require('ui/MyRecipes');
					new Window().open();
				});
			buttonView.add(finishButton);
		
		mainView.add(buttonView);
		
	window.add(mainView);
		
	
	//window.open();
	return window;
}
module.exports = CreateSteps;
