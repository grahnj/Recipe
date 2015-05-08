//Be sure to include the FoodEntities
	var entities = require("FoodEntities");
	
//At the top of the file we can do something like this
	var localRecipe;
	
	if (editMode){
		localRecipe = new entities.Recipe(db.getNewRecipeID(), "", 1, true); //Assuming that Standard is the default on page load
	} else {
		localRecipe = recipe;
	}
//That recipe uses a not yet existing function
//Assuming that .rowCount is working for you we could add this to the db.js file
	database.prototype.getNewRecipeID = function(){
		var rows = db.execute("SELECT * FROM RECIPE");
		return rows.rowCount;
	};
	
//Later when we submit the recipe to the database, we would do this (assuming we don't need to validate that txtAmt is a number):
	localRecipe.name = txtName.getValue();
	localRecipe.amount = txtAmt.getValue();

//We would add a handler to the Standard/Metric switch and do this
	localRecipe.isStandard = !localRecipe.isStandard;

//We can use one function to build the ingredients from the database on !editMode
//This should only be called once
	function buildFromDB(id){
		table.setData([]); //Reset table
		txtIngredient.value = "";
		txtAmt.value = "";
		
		var ingredients = db.getIngredients(id);
		console.log("ingredients: " + ingredients);
		
		while (ingredients.isValidRow()){
			var name = ingredients.fieldByName("NAME");
			var amt = ingredients.fieldByName("AMOUNT");
			var mType = ingredients.fieldByName("MEASUREMENT_TYPE");
			var mVal = ingredients.fieldByName("MEASUREMENT_VALUE");
			
			//This will add an ingredient to our local recipe entity object
			var ingred = new entities.Ingredient(name, new entities.Measurement(amt, mVal, mType, localRecipe.isStandard));
			localRecipe.addIngredient(ingred); //I'm not sure about pass by reference in JS so I didn't add this to the parameter with id
			
			//MType 
			var row = Ti.UI.createTableViewRow({
				title: amt + " " + mVal + " " + name, 
				color: '#333355',
				data: ingred
			});
			table.appendRow(row);
			ingredients.next();
		}
	}
	
//We can use another function to buildFromObject
//This should be called every other time
	function buildFromObject(){
		table.setData([]); //Reset table
		
		//This scale function //should..// scale the ingredient objects if we aren't in edit mode
		if (txtServSize.getValue() != 0 && !editMode)
			recipe.scale(txtServSize.getValue());
			
		for (var i = 0; i < localRecipe.ingredients.length; i++){
			var amt = localRecipe.ingredients[i].measurement.amount;
			var mVal = localRecipe.ingredients[i].measurement.unit;
			var name = localRecipe.ingredients[i].name;
			
			var row = Ti.UI.createTableViewRow({
				title: amt + " " + mVal + " " + name,
				color: '#333355',
				data: ingred
			});
			
			table.appendRow(row);
		}
	}
	
//The only piece that I can't figure out is how to add a listener to the txtScaleAmount (I think maybe you write 'change' or 'changed' instead of click)
//Then when that happens we would call buildFromObject

//Finally, when we continue to steps, we first deconstruct our object for the database
//I can't tell if you are using two button handlers or the same button with different values, but this only gets done here
	btnSave.addEventListener('click', function(e){
		
		if (editMode){
			localRecipe.name = txtName.getValue();
			localRecipe.amount = txtAmt.getValue();
					
					//I will add this to the db.js file on GitHub
					//database.prototype.addRecipe = function(name, yieldAmt, isStandard){
						//db.execute("INSERT INTO RECIPE (NAME, YIELD, IS_STANDARD) VALUES (?, ?, ?)", name, yieldAmt, isStandard);
					//};
			db.addRecipe(localRecipe.name, localRecipe.perPerson, localRecipe.isStandard ? 1 : 0); //I think this shorthands the conversion of a boolean to int
			
			for (var i = 0; i < localRecipe.ingredients.length; i++){
				var current = localRecipe.ingredients[i];
				db.addIngredient(localRecipe.id, current.name, current.measurement.amount, current.measurement.measurementType, current.measurement.unit);
			}
		}
		
		var CreateSteps = require('ui/CreateSteps');
		//CreateSteps now takes four params
		//readWrite -- same as editMode, Recipe, stepNum, details
		//These will always be there parameters being passed
		new CreateSteps(editMode, localRecipe, 0, null).open();
	});
