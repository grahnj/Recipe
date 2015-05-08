//This is the ingredient object/**
function FoodEntities() {
	VolumeStandard = {
	    TSP : 1,
	    TBSP : 3,
	    OZ : 6,
	    CUP : 48,
	    PT : 96,
	    QT : 192,
	    GAL : 768
	};
	
	VolumeMetric = {
	    ML : 1,
	    L : 1000
	};
	
	WeightStandard = {
	    OZ : 1,
	    LB : 16
	};
	
	WeightMetric = {
	    G : 1,
	    KG : 1000
	};
	
	parcel = {
	    EACH : 1
	};
	
	measurementType ={
	    WEIGHT : 1,
	    VOLUME : 2,
	    PARCEL : 3
	};
	
	
	
	FoodEntities.prototype.Measurement = function(quantity, unit, measurementType, isStandard){
	    this.quantity = quantity;
	    this.unit = unit;
	    this.measurementType = measurementType;
	    this.isStandard = isStandard;
	
	    //These functions will convert our objects between metric and standard
	    this.toStandard = function(){
	
	        //This function will convert our Measurement to Standard
	        if (this.isStandard) return;
	        
	        switch (this.measurementType){
	            case measurementType.VOLUME:
	                this.quantity *= this.unit / VolumeMetric.L * .95;
	                this.unit = VolumeStandard.QT;
	                //Switch this back down to the lowest unit value
	                this.quantity *= this.unit;
	                this.unit = VolumeStandard.TSP;
	                break;
	            case measurementType.WEIGHT:
	                this.quantity *= this.unit / WeightMetric.G / 28;
	                this.unit = WeightStandard.OZ;
	                break;
	            case measurementType.PARCEL:
	                break;
	            default:
	                break;
	                
	            return;
	        }
	        
	        this.filterIngredientStandard();
	        this.isStandard = true;
	    };
	    this.toMetric = function(){
	      //This function will convert our Measurement toMetric
	        if (!this.isStandard) return;
	        
	        switch(this.measurementType){
	            case measurementType.VOLUME:
	                //Convert to quarts to throw it over to liters
	                this.quantity *= this.unit / VolumeStandard.QT * 1.05263;
	                this.unit = VolumeMetric.L;
	                this.quantity *= this.unit;
	                this.unit = VolumeMetric.ML;
	                break;
	            case measurementType.WEIGHT:
	                this.quantity *= this.unit / VolumeStandard.OZ * 28;
	                this.unit = WeightMetric.G;
	                break;
	            case measurementType.PARCEL:
	                break;
	            default:
	                break;
	        }
	
	        this.filterIngredientMetric();
	        this.isStandard = false;
	    };
	    
	    this.filter = function(){
	        //Wrapper for our two helper methods
	        if (this.isStandard) this.filterIngredientStandard();
	        else this.filterIngredientMetric();
	    };
	
	    //These functions will re-filter our ingredients should they be altered
	    this.filterIngredientStandard = function(){
	
	        var ratio = 1; //This will be used to determine the ratio for fall through
	        //i.e. Cup has an 8:1 ratio with OZ. If we have more than 8 OZ's, we need to convert to cups
	        
	        switch(this.measurementType){
	            case measurementType.VOLUME:
	            	//Convert all ingredients coming in to TSP for filtering of user misunderstandings
	        	this.quantity *= this.unit;
	                this.unit = VolumeStandard.TSP;
	                
	                switch (this.unit) {
	                case VolumeStandard.TSP:
	                    //If the measurement is a tsp but is more than 3 tsps it is a tbsp
	                    if (this.quantity >= VolumeStandard.TBSP) {
	                        this.quantity = this.quantity / VolumeStandard.TBSP;
	                        this.unit = VolumeStandard.TBSP;
	                        /* FALLTHROUGH */
	                    }
	                    else return;
	                case VolumeStandard.TBSP:
	                    ratio = VolumeStandard.OZ / VolumeStandard.TBSP;
	                    if (this.quantity >= ratio) {
	                        this.quantity = this.quantity / ratio;
	                        this.unit = VolumeStandard.OZ;
	                         /* FALLTHROUGH */
	                    }
	                    else return;
	                case VolumeStandard.OZ:
	                    ratio = VolumeStandard.CUP / VolumeStandard.OZ;
	                    if (this.quantity >= ratio) {
	                        this.quantity = this.quantity / ratio;
	                        this.unit = VolumeStandard.CUP;
	                         /* FALLTHROUGH */
	                    }
	                    else return;
	                case VolumeStandard.CUP:
	                    ratio = VolumeStandard.PT / VolumeStandard.CUP;
	                    if (this.quantity >= ratio) {
	                        this.quantity = this.quantity / ratio;
	                        this.unit = VolumeStandard.PT;
	                         /* FALLTHROUGH */
	                    }
	                    else return;
	                case VolumeStandard.PT:
	                    ratio = VolumeStandard.QT / VolumeStandard.PT;
	                    if (this.quantity >= ratio) {
	                        this.quantity = this.quantity / ratio;
	                        this.unit = VolumeStandard.QT;
	                         /* FALLTHROUGH */
	                    }
	                    else return;
	                case VolumeStandard.QT:
	                    ratio = VolumeStandard.GAL / VolumeStandard.QT;
	                    if (this.quantity >= ratio) {
	                        this.quantity = this.quantity / ratio;
	                        this.unit = VolumeStandard.GAL;
	                         /* FALLTHROUGH */
	                    }
	                    else return;
	                case VolumeStandard.GAL:
	                    break; //We don't need to upscale this any further
	                default:
	                    break;
	            }
	                break;
	            case measurementType.WEIGHT:
	            	//Convert everything to the lowest unit
	            	this.quantity *= this.unit;
	                this.unit = WeightStandard.OZ;
	            	
	                switch (this.unit){
	                case WeightStandard.OZ:
	                    ratio = WeightStandard.GAL / WeightStandard.OZ;
	                    if (this.quantity >= ratio) {
	                        this.quantity = this.quantity / ratio;
	                        this.unit = WeightStandard.GAL;
	                         /* FALLTHROUGH */
	                    }
	                    else return;
	                case WeightStandard.LB:
	                    return;
	                default:
	                    break;
	            }
	                break;
	            case measurementType.PARCEL:
	                break;
	            default:
	                break;
	
	        }
	    };
	    this.filterIngredientMetric = function(){
	        //Metric is much more straight forward for filtering
	        if (this.measurementType == measurementType.VOLUME){
	        	
        		this.quantity *= this.unit;
	                this.unit = VolumeMetric.ML;
	            switch (this.unit){
	                case VolumeMetric.ML:
	                    if (this.quantity >= 1000){
	                        this.quantity /= 1000; this.unit = VolumeMetric.L;
	                         /* FALLTHROUGH */
	                    }
	                    break;
	                case VolumeMetric.L:
	                    break;
	                default:
	                    break;
	            }
	        } else if (this.measurementType == measurementType.WEIGHT) {
	        	this.quantity *= this.unit;
	                this.unit = WeightMetric.G;
	            switch (this.unit){
	                case WeightMetric.G:
	                    if (this.quantity >= 1000){
	                        this.quantity /= 1000; this.unit = WeightMetric.KG;
	                         /* FALLTHROUGH */
	                    }
	                    break;
	                case WeightMetric.KG:
	                    break;
	                default:
	                    break;
	            }
	        }
	    };
	};
	
	FoodEntities.prototype.Ingredient = function(name, Measurement){
	    this.name = name;
	    this.measurement = Measurement;
	};
	
	//TODO test
	//This should yield 1 pt
	//var meas = new Measurement(16, VolumeStandard.OZ, true, true);
	//var something = new Ingredient("justin", meas);
	
	//console.log(something.measurement.quantity + " " + something.measurement.unit);
	
	FoodEntities.prototype.Recipe = function(id, name, yieldAmt, isStandard){
	    this.id = id;
	    this.ingredients = [];
	    this.name = name;
	    this.perPerson = yieldAmt;
	    this.isStandard = isStandard;
	
	    this.addIngredient = function(ingredient){
	        this.ingredients.push(ingredient);
	    };
	    
	    this.homogonize = function(){
	        if (this.isStandard) Standard.ConvertRecipe(this);
	        else Metric.ConvertRecipe(this);
	    };
	    
	    //This function should only be reachable by users, never owners during creation\
	    //This function will mutate any recipe that calls it and should never be stored permanently
	    this.scale = function(amount){
	        if (isNaN(amount)) return;
	        if (amount <= 0) return;
	        
	        var scale = amount / this.perPerson;
	        this.perPerson = amount;
	        
	        for (var i = 0; i < this.ingredients.length; i++){
	            this.ingredients[i].measurement.quantity *= scale;
	            this.ingredients[i].measurement.filter(); //This will refilter the contents of the measuremet to an appropriate measurement after scaling
	        }
	    };
	
	    //This function scales ingredients that are of the standard variety
	    
	    
	};
	
	FoodEntities.prototype.Metric = function(){
	    Metric.ConvertRecipe = new function(Recipe){
	        //We need to convert the recipe and all of its information to Metric
	
	        for (var i = 0; i < Recipe.ingredients.length; i++){
	            if (Recipe.ingredients[i].measurement.isStandard)
	                Recipe.ingredients[i].measurement.toMetric();
	        }
	    };
	};
	
	FoodEntities.prototype.Standard = function(){
	    Standard.ConvertRecipe = new function(Recipe){
	        //Convert all of the recipe back toStandard
	        Recipe.measurement.toStandard();
	
	        for (var i = 0; i < Recipe.ingredients.length; i++){
	            if (!Recipe.ingredients[i].measurement.isStandard)
	                Recipe.ingredients[i].measurement.toStandard();
	        }
	    };
	};
}
var FoodEntities = new FoodEntities();
module.exports = FoodEntities;
