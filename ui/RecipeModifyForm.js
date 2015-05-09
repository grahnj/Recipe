function RecipeModifyForm(/*Boolean*/editMode, localRecipe)	{
	var db = require("db");
	var entities = require("FoodEntities");
	// var id = 0;
	 var mType = 1;
	
	var self = Ti.UI.createWindow({
		backgroundColor: '#9999AA',
		//layout: 'vertical'
	});
	
	//Views
	var topView = Ti.UI.createView({
		top: 5,
		backgroundColor: '#9999AA',
		width: '100%',
		height: '50dp',
	});
	
	var inputR1 = Ti.UI.createView({
		top: '52dp',
		height: '20dp',
		width: Ti.UI.FILL,
		//layout: 'horizontal'
	});
	
	var inputR2 = Ti.UI.createView({
		top: '74dp',
		height: '40dp',
		width: Ti.UI.FILL,
		//layout: 'horizontal'
	});
	
	var inputR3 = Ti.UI.createView({
		top: '118dp',
		height: '20dp',
		width: Ti.UI.FILL,
		visible: editMode
		//layout: 'horizontal',	
	});
	
	var inputR4 = Ti.UI.createView({
		top: '140dp',
		height: '40',
		width: Ti.UI.FILL,
		visible: editMode
		//Layout: 'horizontal',
	});
	
	//Checklist
	var checklistView = Ti.UI.createView({
		top: '185dp',
		width: Ti.UI.Fill,
		height: '40',
		backgroundColor: '#557777',
		layout: 'horizontal',
	});
	
	var chkGluten = Ti.UI.createSwitch({
		style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
		title: 'Gluten Free |',
		enabled: editMode
		//color: '#000000'
	});
	checklistView.add(chkGluten);
	
	var chkPeanut = Ti.UI.createSwitch({
		style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
		title: 'Peanut Free |',
		enabled: editMode
		//color: '#000000'
	});
	checklistView.add(chkPeanut);
	
	var chkLactose = Ti.UI.createSwitch({
		style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
		title: 'Lactose Free |',
		enabled: editMode
		//color: '#000000'
	});
	checklistView.add(chkLactose);
	
	//Ingredient
	var ingredientView = Ti.UI.createView({
		top: '226dp',
		width: '100%'
	});
	
	var botView = Ti.UI.createView({
		bottom: 0,
		backgroundColor: '#9999AA',
		width: '100%',
		height: '50dp'
	});
	
	//Goods
	var txtName = Ti.UI.createTextField({
		left: 5,
		height: '98%',
		width: '70%',
		color: '#000000',
		backgroundColor: '#FFFFFF',
		editable: editMode
	});
	
	var measurementSwitch = Ti.UI.createSwitch({
		right: 5,
		height: '98%',
		width: '28%',
		value: true,
		titleOn: 'Standard',
		titleOff: 'Metric',		
	});
	measurementSwitch.addEventListener('change',function(e){
		setUnit(measurementSwitch.value, unitSwitch.value);
		if(e.value){
			e.value = false;
		} else {
			e.value = true;
		}
	});
	
	var txtServSize = Ti.UI.createTextField({
		right: 5,
		width: '10%',
		height: Ti.UI.FILL,
		backgroundColor: '#FFFFFF',
		borderColor: '#9999AA',
		color: '#000000',
		keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
	});
	
	var txtIngredient = Ti.UI.createTextField({
		right: 370,
		width: '30%',
		height: Ti.UI.FILL,
		backgroundColor: '#FFFFFF',
		color: '#000000',
		//borderColor: '#9999AA'
	});
	
	var txtAmt = Ti.UI.createTextField({
		right: 285,
		width: '10%',
		height: Ti.UI.FILL,
		backgroundColor: '#FFFFFF',
		color: '#000000',
		keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
	});
	
	var unitSwitch = Ti.UI.createSwitch({
		right: 200,
		width: '13%',
		height: '98%',
		value: true,
		titleOn: 'Weight',
		titleOff: 'Volume'
	});
	unitSwitch.addEventListener('change', function(e){
		setUnit(measurementSwitch.value, unitSwitch.value);
		if(e.value){
			e.value = false;
			mType = 2;
		} else {
			e.value = true;
			mType = 1;
		}
		console.log("mType: " + mType);
	});
	
	var pkrUnit = Ti.UI.createPicker({
		right: 110,
		width: '13%',
		height: '70dp',
		backgroundColor: "#555588"
	});
	pkrUnit.clear = function(){
	    if(pkrUnit.columns[0]) {
	        var col = pkrUnit.columns[0];
	        var len = col.rowCount;
	            for(var x = len-1; x >= 0; x-- ){
	                    var row = col.rows[x];
	                    col.removeRow(row);
	            }
	    }
	};
	
	function metricUnits(){
		pkrUnit.clear();
		unitData = [];

		pkrUnit.add(unitData);
	}
	
	var table = Ti.UI.createTableView({
		width:Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: '#CFCFCF',
		separatorColor: '#555588'
	});
	
	//Buttons
	var btnAdd = Ti.UI.createButton({
		title: 'ADD',
		right: 5,
		image: '/images/add_button.png',
		height: Ti.UI.FILL
	});
	
	var btnSave = Ti.UI.createButton({
		title: "Continue to steps",
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
	});
	
	//TODO Teleport
	if(editMode){
		localRecipe = new entities.Recipe(db.getNewRecipeID(), "New Recipe", 1, true);
		txtName.value = localRecipe.name;
		txtServSize.value = localRecipe.yieldAmt;

	} else {
		buildFromDB(localRecipe.id-1);
	}
	
	var unitData = [];
	setUnit(measurementSwitch.value, unitSwitch.value);
	
	function setUnit(measurement, unit){
		pkrUnit.clear();
		unitData = [];
		if(measurement){ //Standard
			if(!unit){ //Standard Volume
				console.log("Standard Volume - T/F");
				unitData.push(Titanium.UI.createPickerRow({title: 'tsp', id: '1'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'Tbs', id: '3'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'Oz', id: '6'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'Cup', id: '48'}));			
				unitData.push(Titanium.UI.createPickerRow({title: 'Pt', id: '96'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'Qt', id: '192'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'Gal', id: '768'}));
			} else { //Standard Weight
				console.log("Standard Weight - T/T");
				unitData.push(Titanium.UI.createPickerRow({title: 'Oz', id: '1'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'Lbs', id: '16'}));
			}
		} else { //Metric
			if(!unit){ //Metric Volume
				console.log("Metric Volume - F/F");
				unitData.push(Titanium.UI.createPickerRow({title: 'ML', id: '1'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'L', id: '1000'}));
				//unitData.push(Titanium.UI.createPickerRow({title: 'KL', id: 'KL'}));
			} else { //Metric Weight
				console.log("Metric Weight - F/T");
				unitData.push(Titanium.UI.createPickerRow({title: 'G', id: '1'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'KG', id: '1000'}));
			}
		}
		pkrUnit.add(unitData);
	};
	
	function getUnit(isStandard, unit, unitId){
		console.log("unit: " + unit);
		if(unit > 1){
			unit = false;
		} else
			unit = true;

		console.log("isStandard: " + isStandard + " - " + "unit: " + unit);
		setUnit(isStandard, unit); //(isStandard, Vol/Weight)
		//var size = pkrUnit.columns[0].rowCount;
		var col = pkrUnit.columns[0];
	        var len = col.rowCount;
	            for(var x = len-1; x >= 0; x-- ){
	                    var row = col.rows[x];
	                    if(row.id == unitId)
							return row.title;
	            }
		// console.log("size: " + size);
		// for(var i = 0; i < size; i++){
			// pkrUnit.setSelectedRow(1,i,false);
			// console.log(pkrUnit.getSelectedRow(0).title);
			// if(pkrUnit.getSelectedRow.id == unitId){
				// return pkrUnit.getSelectedRow(0).title;
			// }
// 				
		// }
		//pkrUnit.setSelectedRow(0,unitId,false);
		return "ERROR";
	}
	
	function buildFromDB(id){
		table.setData([]); //Reset table
		txtIngredient.value = "";
		txtAmt.value = "";
		
		var ingredients = db.getIngredients(id);		
		
		for(var i = 0; i < ingredients.rowCount; i++){
			if(ingredients.isValidRow){
				var name = ingredients.fieldByName("NAME");
				var amt = ingredients.fieldByName("AMOUNT");
				var mType = ingredients.fieldByName("MEASUREMENT_TYPE");
				var mVal = ingredients.fieldByName("MEASUREMENT_VALUE");

				var ingred = new entities.Ingredient(name, new entities.Measurement(amt, mVal, mType, measurementSwitch.value));

				var row = Ti.UI.createTableViewRow({
					title: amt + " " + getUnit(ingred.measurement.isStandard, ingred.measurement.measurementType, ingred.measurement.unit) + " " + name,
					color: '#333355',
					//data: ingred
				});
				table.appendRow(row);
				ingredients.next();
			}
		}
	}
	
	function buildFromObject(){
		table.setData([]); //Reset table
		if(txtServSize.getValue() != 0 && !editMode)
			localRecipe.scale(txtServSize.getValue());
			
		for(var i = 0; i < localRecipe.ingredients.length; i++){
			var ingred = localRecipe.ingredients[i];
			var amt = ingred.measurement.quantity;
			var mVal = ingred.measurement.measurementType;
			var name = ingred.name;
			
			var row = Ti.UI.createTableViewRow({
				title: amt + " " + getUnit(ingred.measurement.isStandard, ingred.measurement.measurementType, ingred.measurement.unit) + " " + name,
				color: '#333355',
				//data: ingred
			});
			
			table.appendRow(row);
		}
	}
	
	txtServSize.addEventListener("change", function(e){
		if(!isNaN(e.value)){
			localRecipe.scale(txtServSize.value);
			buildFromObject();
		}
			
	});
	
	btnAdd.addEventListener('click', function(e){
		var name = txtIngredient.value;
		var mVal = pkrUnit.getSelectedRow(0).id;

		var isStandard = measurementSwitch.value;
		var amt = txtAmt.value;
		
		var measure = new entities.Measurement(amt, mVal, mType, isStandard);
		var ingred = new entities.Ingredient(txtIngredient.value, measure);
		localRecipe.addIngredient(ingred);

		// for (var i = 0; i < localRecipe.ingredients.length; i++){
			 // console.log(localRecipe.ingredients[i].name);
			 // console.log(localRecipe.ingredients[i].measurement);
		 // }
		buildFromObject();
		
		// var recipe = new entities.Recipe(1, "some recipe", 4, true);
// 		
		// console.log(recipe);
// 		
		// var measure = new entities.Measurement(4, 3, 2, recipe.isStandard);
		// var ingredient = new entities.Ingredient("Some ingredient", measure);
		// recipe.addIngredient(ingredient);
// 		
		// recipe.scale(20);
		// //Expecting to see 1.25 cups (48) -- NOTE: Indeed this is what my console is logging
// 		
		// for (var i = 0; i < recipe.ingredients.length; i++){
			// console.log(recipe.ingredients[i].name);
			// console.log(recipe.ingredients[i].measurement);
		// }
	});
	
	btnSave.addEventListener('click', function(e){
		if(editMode){
			localRecipe.name = txtName.getValue();
			localRecipe.amount = txtAmt.getValue();
			
			db.addRecipe(localRecipe.name, localRecipe.perPerson, localRecipe.isStandard ? 1: 0);

			for(var i = 0; i < localRecipe.ingredients.length; i++){
				var current = localRecipe.ingredients[i];
				db.addIngredient(localRecipe.id, current.name, current.measurement.quantity, current.measurement.measurementType, current.measurement.isStandard);
			}
		}
		
		var CreateSteps = require('ui/CreateSteps');
		
		new CreateSteps(editMode, localRecipe, 0, null).open();
	});
	
	//Build
	topView.add(txtName);
	topView.add(measurementSwitch);
	
	botView.add(btnSave);
	
	inputR1.add(Ti.UI.createLabel({left: 7, text: 'Name', width: '10%', height: Ti.UI.FILL, color: '#000000'}));
	inputR1.add(Ti.UI.createLabel({right: 25, text: 'Conversion Format', height: Ti.UI.FILL, color: '#000000'}));
	inputR2.add(Ti.UI.createLabel({right: 55, text: 'Serves:', width:'10%', height: Ti.UI.FILL, color: '#000000'}));
	inputR2.add(txtServSize);
	inputR3.add(Ti.UI.createLabel({right: 370, text: 'Ingredient', width:'30%', height: Ti.UI.FILL, color: '#000000'}));
	inputR3.add(Ti.UI.createLabel({right: 285, text: 'Amt', width:'10%', height: Ti.UI.FILL, color: '#000000'}));
	inputR3.add(Ti.UI.createLabel({right: 210, text: 'Unit', width:'10%', height: Ti.UI.FILL, color: '#000000'}));
	inputR3.add(Ti.UI.createLabel({right: 115, text: 'Unit Value', width:'10%', height: Ti.UI.FILL, color: '#000000'}));
	inputR4.add(txtIngredient);
	inputR4.add(txtAmt);
	inputR4.add(unitSwitch);
	inputR4.add(pkrUnit);
	inputR4.add(btnAdd);
	
	ingredientView.add(table);
	
	self.add(topView);
	
	self.add(inputR1);
	self.add(inputR2);
	self.add(inputR3);
	self.add(inputR4);
	self.add(checklistView);
	
	self.add(ingredientView);
	self.add(botView);
	
	return(self);
}
module.exports = RecipeModifyForm;
