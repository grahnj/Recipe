function MyRecipes(){
	
	var db = require("db");
	var entities = require("FoodEntities");
	
	var self = Ti.UI.createWindow({
		backgroundColor: '#9999AA',
		layout: 'vertical'
	});
	
	//Views
	var topView = Ti.UI.createView({
		top: 0,
		width: '100%',
		height: '10%',
		backgroundColor: '#9999AA'
	});
	
	var botView = Ti.UI.createView({
		bottom: 0,
		width: '100%',
		height: '10%',
		layout: 'horizontal',
		backgroundColor: '#9999AA'
	});
	
	
	var lblTop = Ti.UI.createLabel({
		color: '#404040',
		text: 'MY RECIPES',
		height: Ti.UI.SIZE,
		textAlign: 'center',
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
		font:{
			fontSize: '25sp',
			fontWeight: 'bold'
		}
	});
	
	//Load in the recipes 
	function getRecipes(){
		var recipes = db.getRecipes();
		console.log("We have obtained the recipes");
		var recipeObjects = [];
		
		if (recipes.isValidRow()){
			var id = recipes.fieldByName('ROWID');
			var name = recipes.fieldByName('NAME');
			var yieldAmt = recipes.fieldByName('YIELD');
			var isStandard = recipes.fieldByName('IS_STANDARD');
			console.log("We have added a recipe");
			recipeObjects.push(new entities.Recipe(id, name, yieldAmt, isStandard));
		}
		console.log("We have pushed the recipes");
		return recipeObjects;
	};
	
	var ourRecipes = getRecipes();
	
	var ourRecipeRows = [];
	for (var i = 0; i < ourRecipes.length; i++){
		ourRecipeRows.push({
			title: ourRecipes[i].name,
			color: 'black',
			myid: ourRecipes[i].id,
			data: ourRecipes[i]
		});
		
		
		// var row = Ti.UI.createTableViewRow();
	// 	
		// var rowData = Ti.UI.createView({
			// width: Ti.UI.FILL,
			// backgroundColor: '#cc66cc',
			// myid: ourRecipes[i].id
		// });
	// 	
		// rowData.add(Ti.UI.createLabel({
			// text: ourRecipes[i].name,
		// }));
	// 	
		// ourRecipeRows.push(rowData);
	}
	
	//Table to hold our recipe information
	var table = Ti.UI.createTableView({
		width:'98%',
		height: '80%',
		color: '#000000',
		backgroundColor: '#CFCFCF',
		separatorColor: '555588',
		allowsSelection: true,
		data: ourRecipeRows
	});
	
		table.addEventListener('click', function(e){
			//FUTURE: If the form isn't opening correctly, it's happening because of this rowData.data
			var RecipeModifyForm = require('ui/RecipeModifyForm');
		
			new RecipeModifyForm(false, e.rowData.data).open();
		});
	
	//Buttons
	var btnEdit = Ti.UI.createButton({
		title: 'EDIT',
		width: '50%',
		height: Ti.UI.FILL
	});
	// btnEdit.addEventListener('click', function(e){
	// //RecipeModifyView with info
	// });
	
	var btnAdd = Ti.UI.createButton({
		title: 'ADD NEW',
		width: '50%',
		height: Ti.UI.FILL
	});
	
	btnAdd.addEventListener('click', function(e){
		var RecipeModifyForm = require('ui/RecipeModifyForm');
		
		new RecipeModifyForm(true, null).open();
	});
	
	//Build
	topView.add(lblTop);
	
	botView.add(btnEdit);
	botView.add(btnAdd);
	
	self.add(topView);
	self.add(table);
	self.add(botView);
	
	//self.open();
	return self;
}
module.exports = MyRecipes;
