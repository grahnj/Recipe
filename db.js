

function db(){
	var db = Ti.Database.open('recipe');
	
	db.execute("-- Table: INGREDIENT" +
		"CREATE TABLE IF NOT EXISTS INGREDIENT (INGREDIENT_ID INTEGER (10) PRIMARY KEY UNIQUE NOT NULL, NAME VARCHAR (50) NOT NULL, AMOUNT DECIMAL (5) NOT NULL, MEASUREMENT_TYPE INTEGER (1) NOT NULL, MEASUREMENT_VALUE INTEGER (1) NOT NULL);" + 

		"-- Table: RECIPE_INGREDIENT" +
		"CREATE TABLE IF NOT EXISTS RECIPE_INGREDIENT (RECIPE_ID INTEGER (10) REFERENCES RECIPE (RECIPE_ID) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, INGREDIENT_ID INTEGER (10) REFERENCES INGREDIENT (INGREDIENT_ID) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL);" +
		
		"-- Table: RECIPE_FILTER" +
		"CREATE TABLE IF NOT EXISTS RECIPE_FILTER (RECIPE_ID INTEGER (10) REFERENCES RECIPE (RECIPE_ID) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, FILTER_ID INTEGER (2) REFERENCES FILTER (FILTER_ID) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL);" +
		
		"-- Table: STEP" +
		"CREATE TABLE IF NOT EXISTS STEP (ID INTEGER (10) PRIMARY KEY UNIQUE NOT NULL, STEP_NUMBER INTEGER (2) NOT NULL, DETAILS STRING (400) NOT NULL);" +
		
		"-- Table: RECIPE_STEP" +
		"CREATE TABLE IF NOT EXISTS RECIPE_STEP (RECIPE_ID INTEGER (2) REFERENCES RECIPE (RECIPE_ID) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, STEP_ID INTEGER (2) REFERENCES STEP (ID) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL);" +
		
		"-- Table: MEASUREMENT_TYPE" +
		"CREATE TABLE IF NOT EXISTS MEASUREMENT_TYPE (ID INTEGER (1) PRIMARY KEY UNIQUE NOT NULL, NAME VARCHAR (20) NOT NULL, NAME_VALUE INTEGER(5) NOT NULL);" +
		
		"-- Table: FILTER" +
		"CREATE TABLE IF NOT EXISTS FILTER (FILTER_ID INTEGER (2) PRIMARY KEY UNIQUE NOT NULL, FILTER_NAME VARCHAR (50) NOT NULL UNIQUE);" +
		
		"-- Table: MEASUREMENT_TYPE_VALUE" +
		"CREATE TABLE IF NOT EXISTS MEASUREMENT_TYPE_VALUE (TYPE_ID INTEGER (2) REFERENCES MEASUREMENT_TYPE (ID) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, VALUE_ID INTEGER (2) REFERENCES MEASUREMENT_VALUE (ID) ON DELETE CASCADE ON UPDATE CASCADE);
		
		"-- Table: RECIPE" +
		"CREATE TABLE IF NOT EXISTS RECIPE (RECIPE_ID INTEGER (10) PRIMARY KEY UNIQUE NOT NULL, NAME VARCHAR (75) NOT NULL, YIELD INTEGER (5) NOT NULL);" +
		
		"-- Table: MEASUREMENT_VALUE" +
		"CREATE TABLE IF NOT EXISTS MEASUREMENT_VALUE (ID INTEGER (2) PRIMARY KEY UNIQUE NOT NULL, NAME VARCHAR (10) NOT NULL, NAME_VALUE INTEGER(5) NOT NULL);" +
		
		"COMMIT TRANSACTION;");

	function getRecipes(){
		var recipes = db.execute("SELECT RECIPE.RECIPE_ID, RECIPE.NAME, RECIPE.YIELD FROM RECIPE");	
	}

module.exports = db;
