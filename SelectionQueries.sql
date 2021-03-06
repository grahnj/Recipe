--Fetch name, measurement standard, yield, ingredient [name, amount, unit, value], filters
--Basic entity code may need slight reworking to couple nicely with the database tables

--Fetch the basic recipe information
SELECT

RECIPE.RECIPE_ID,
RECIPE.NAME,
RECIPE.YIELD,

FROM

RECIPE

--Fetch the recipe information requested

--This gets ALL ingredients and their measurements
SELECT

INGREDIENT_ID,
NAME,
AMOUNT,
MEASUREMENT_TYPE.NAME_VALUE
MEASUREMENT_VALUE.NAME_VALUE

FROM INGREDIENT, MEASUREMENT_TYPE, MEASUREMENT_VALUE
INNER JOIN RECIPE_INGREDIENT
ON INGREDIENT.INGREDIENT_ID=RECIPE_INGREDIENT.INGREDIENT_ID
INNER JOIN MEASUREMENT_TYPE
ON INGREDIENT.MEASUREMENT_TYPE=MEASUREMENT_TYPE.ID
INNER JOIN MEASUREMENT_TYPE_VALUE
ON MEASUREMENT_TYPE_VALUE.TYPE_ID=MEASUREMENT_TYPE.ID
INNER JOIN MEASUREMENT_VALUE
ON MEASUREMENT_VALUE.ID=MEASUREMENT_TYPE_VALUE.ID

WHERE RECIPE.RECIPE_ID = ?, --INSERT PARAM HERE

--This gets ALL filters

SELECT

FILTER_ID,
FILTER_NAME

FROM FILTER

INNER JOIN RECIPE_FILTER
ON RECIPE_FILTER.FILTER_ID=FILTER.FILTER_ID

WHERE RECIPE_FILTER.RECIPE_ID = ?, --INSERT PARAM HERE

--This gets ALL steps

SELECT

ID,
STEP_NUMBER
DETAILS

FROM STEP

INNER JOIN RECIPE_STEP
ON RECIPE_STEP.STEP_ID=STEP.ID

WHERE RECIPE_STEP.RECIPE_ID = ?, --INSERT PARAM HERE

--THE FOLLOWING STATEMENTS SHOULD BE WRAPPED IN A FUNCTION FOR EASE OF USE
INSERT INTO RECIPE (NAME, YIELD, IS_STANDARD) VALUES (?, ?, ?) --THESE PARAMS WILL GET PASSED VIA EXECUTE FUNCTION
SELECT RECIPE_ID FROM RECIPE WHERE NAME = ? --GET THE RECIPE ID THAT WE JUST CREATED -- PASS TO A VARIABLE
INSERT INTO INGREDIENT (RECIPE_ID, NAME, AMOUNT, MEASUREMENT_TYPE, MEASUREMENT_VALUE) VALUES (?,?,?,?,?) -- INSERT INGREDIENT
INSERT INTO RECIPE_FILTER (RECIPE_ID, FILTER_ID) VALUES (?, ?) --CALL FOR EACH FILTER TO BIND OUR RECIPE TO PREDEFINED FILTER
INSERT INTO STEP (RECIPE_ID, STEP_NUMBER, DETAILS) VALUES (?, ?, ?) 




