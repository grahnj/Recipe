function database(){
	
	var db = Ti.Database.open('recipe');
	
	db.execute("CREATE TABLE IF NOT EXISTS RECIPE (RECIPE_ID INTEGER (10) PRIMARY KEY UNIQUE, NAME VARCHAR (75) NOT NULL, YIELD INTEGER (5) NOT NULL, IS_STANDARD BOOLEAN NOT NULL);");
	db.execute("CREATE TABLE IF NOT EXISTS INGREDIENT (INGREDIENT_ID INTEGER (10) PRIMARY KEY UNIQUE, RECIPE_ID INTEGER (10) REFERENCES RECIPE (RECIPE_ID) NOT NULL, NAME VARCHAR (50) NOT NULL, AMOUNT DECIMAL (5) NOT NULL, MEASUREMENT_TYPE INTEGER (1) NOT NULL, MEASUREMENT_VALUE INTEGER (1) NOT NULL);");
	db.execute("CREATE TABLE IF NOT EXISTS RECIPE_FILTER (RECIPE_ID INTEGER (10) REFERENCES RECIPE (RECIPE_ID) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, FILTER_ID INTEGER (2) REFERENCES FILTER (FILTER_ID) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL);");
	db.execute("CREATE TABLE IF NOT EXISTS STEP (ID INTEGER (10) PRIMARY KEY UNIQUE, RECIPE_ID INTEGER (10) REFERENCES RECIPE (RECIPE_ID) NOT NULL, STEP_NUMBER INTEGER (2) NOT NULL, DETAILS STRING (400) NOT NULL);");
	db.execute("CREATE TABLE IF NOT EXISTS FILTER (FILTER_ID INTEGER (2) PRIMARY KEY UNIQUE, FILTER_NAME VARCHAR (50) NOT NULL UNIQUE);");
	
	try{
	db.execute("INSERT INTO FILTER (FILTER_NAME) VALUES ('Gluten Free'), ('Dairy Free'), ('Vegetarian');");
	} catch (e){
		console.log("The filters have already been inserted into the tables");
	}
	db.execute("INSERT INTO RECIPE (NAME, YIELD, IS_STANDARD) VALUES ('Apple Pie', 4, 1)");
	
	var test = db.execute("SELECT * FROM RECIPE");
	console.log(test);
	
	database.prototype.getRecipes = function(){
		return db.execute("SELECT * FROM RECIPE");	
	};
	
	database.prototype.getIngredients = function(recipeID){
		return db.execute("" +
			"SELECT " +
			
			"rowid, " +
			"NAME, " +
			"AMOUNT, " +
			"MEASUREMENT_TYPE " +
			"MEASUREMENT_VALUE " +
			
			"WHERE RECIPE_ID = ?", recipeID);	
	};
	
	database.prototype.getFilters = function(recipeID){
		return db.execute("SELECT " +

			"rowid, " +
			"FILTER_NAME " +
			
			"FROM FILTER " +
			
			"WHERE RECIPE_FILTER.RECIPE_ID = ?", recipeID);
	};
	
	database.prototype.getSteps = function(recipeID){
		return db.execute("SELECT " +
			"DETAILS " +
			
			"FROM STEP " +
			
			"WHERE RECIPE_ID = ?", recipeID);	
	};
	
	database.prototype.addIngredient = function(recipeID, name, amount, MeasureType, MeasureValue){
		db.execute("INSERT INTO INGREDIENT (RECIPE_ID, NAME, AMOUNT, MEASUREMENT_TYPE, MEASUREMENT_VALUE) VALUES (?,?,?,?,?)", recipeID, name, amount, MeasureType, MeasureValue);
	};
	
	database.prototype.close = function(){
		db.close();
	};
	
	database.prototype.execute = function(executionString){
		db.execute(executionString);
	};
	
	database.prototype.setStep = function(recipeId, stepNumber, details){
		db.execute("INSERT INTO STEP (RECIPE_ID, STEP_NUMBER, DETAILS) VALUES (?, ?, ?)", recipeId, stepNumber, details); 
	}
	
	database.prototype.getNewRecipeID = function(){
		var rows = db.execute("SELECT * FROM RECIPE");
		return rows.rowCount;
	};
	
	database.prototype.addRecipe = function(name, yieldAmt, isStandard){
		db.execute("INSERT INTO RECIPE (NAME, YIELD, IS_STANDARD) VALUES (?, ?, ?)", name, yieldAmt, isStandard);
	};
		
}
var database = new database();
module.exports = database;
