function RecipeModifyForm(/*Boolean*/editMode, recipe)	{
	var db = require("db");
	var id = 0;
	
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
	
	var unitData = [];
	setUnit(measurementSwitch.value, unitSwitch.value);
	
	function setUnit(measurement, unit){
		pkrUnit.clear();
		unitData = [];
		if(measurement){ //Standard
			unitData.push(Titanium.UI.createPickerRow({title: 'tsp', value: 'tsp'}));
			unitData.push(Titanium.UI.createPickerRow({title: 'Tbs', value: 'Tbs'}));
			unitData.push(Titanium.UI.createPickerRow({title: 'Cup', value: 'Cup'}));
			
			if(!unit){ //Standard Volume
				unitData.push(Titanium.UI.createPickerRow({title: 'Oz', value: 'Oz'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'Pt', value: 'Pt'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'Qt', value: 'Qt'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'Gal', value: 'Gal'}));
			} else { //Standard Weight
				unitData.push(Titanium.UI.createPickerRow({title: 'Lbs', value: 'Lbs'}));
			}
		} else { //Metric
			if(!unit){ //Metric Volume
				unitData.push(Titanium.UI.createPickerRow({title: 'ML', value: 'ML'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'L', value: 'L'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'KL', value: 'KL'}));
			} else { //Metric Weight
				unitData.push(Titanium.UI.createPickerRow({title: 'MG', value: 'MG'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'G', value: 'G'}));
				unitData.push(Titanium.UI.createPickerRow({title: 'KG', value: 'KG'}));
			}
		}
		pkrUnit.add(unitData);
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
	
	if(!editMode){
		//Get id
		id = (recipe.id);
		refresh();
	}
	
	if(editMode){
		//Find new recipe id
		db.execute("INSERT INTO RECIPE (NAME, YIELD, IS_STANDARD) VALUES('MyRecipe', 0, 1);");
			recipe = db.getRecipes();
			id  = (recipe.rowCount);

			refresh();
	}

	function refresh(){
		table.setData([]); //Reset table
		txtIngredient.value = "";
		txtAmt.value = "";
		
		var ingredients = db.getIngredients(id);
		console.log("ingredients: " + ingredients);
		for(var i = 0; i < ingredients.rowCount; i++){
			if(ingredients.isValidRow){
				var name = ingredients.fieldByName("NAME");
				var amt = ingredients.fieldByName("AMOUNT");
				var mType = ingredients.fieldByName("MEASURE_TYPE");
				var row = Ti.UI.createTableViewRow({
					title: amt + " " + mType + " " + name,
					color: '#333355',
				});
				table.appendRow(row);
				ingredients.next();
			}
		}
	}
	
	//Buttons
	var btnAdd = Ti.UI.createButton({
		title: 'ADD',
		right: 5,
		image: '/images/add_button.png',
		height: Ti.UI.FILL
	});
	btnAdd.addEventListener('click', function(e){
		db.addIngredient(id, txtIngredient.value, txtAmt.value, pkrUnit.getSelectedRow(0).title, 1);
		refresh();
	});
	
	var btnSave = Ti.UI.createButton({
		title: "Continue to steps",
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
	});
	
	btnSave.addEventListener('click', function(e){
		var CreateSteps = require('ui/CreateSteps');
		
		new CreateSteps().open();
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
