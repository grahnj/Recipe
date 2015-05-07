function Recipe(){ //Constructor
	//Id is not needed here
	this.name = "MyRecipe";
	this.yieldAmt = 0;	
	this.ingredients = [];
}

//Name
Recipe.prototype.setName = function(name){
	this.name = name;
};

//Yield
Recipe.prototype.setYield = function(yieldAmt){
	this.yieldAmt = yieldAmt;
};

//Ingredient
Recipe.prototype.addIngredient = function(id, name, amt, mType, mVal){
	this.ingredients[id] = [name, amt, mType, mVal];
};

Recipe.prototype.getIngredients = function(){
	return this.ingredients;
};

var recipe = new Recipe();
module.exports = recipe;
