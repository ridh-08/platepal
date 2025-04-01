import { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import jsPDF from "jspdf";
import "jspdf-autotable"; 
import "../styles/MealPlanner.css";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa"; 

const categories = [
  { name: "Breakfast", apiCategory: "Breakfast" },
  { name: "Lunch", apiCategory: "Lunch" },
  { name: "Dinner", apiCategory: "Dinner" },
  { name: "Snacks & Beverages", apiCategory: "Side" }, 
  { name: "Dessert", apiCategory: "Dessert" }
];

const dietaryRestrictions = [
  { name: "Vegetarian", apiCategory: "Vegetarian" },
  { name: "Vegan", apiCategory: "Vegan" },
  { name: "Gluten-Free", apiCategory: "Gluten-Free" },
  { name: "Non-Vegetarian", apiCategory: "Non-Vegetarian" } 
];

const MealPlanner = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mealPlan, setMealPlan] = useState(Array(7).fill(null).map(() => ({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    "Snacks & Beverages": [],
    Dessert: [],
  })));
  const [groceryList, setGroceryList] = useState({});
  const [cuisineSearch, setCuisineSearch] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [recipeSearch, setRecipeSearch] = useState(""); 
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState("");
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cuisineSuggestions, setCuisineSuggestions] = useState([]);
  const [ingredientSuggestions, setIngredientSuggestions] = useState([]);
  const [recipeSuggestions, setRecipeSuggestions] = useState([]); 

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        if (response.data.meals) {
          setRecipes(response.data.meals);
          setFilteredRecipes(getRandomRecipes(response.data.meals, 5));
        } else {
          setMessage("No meals found.");
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setMessage("Error fetching recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCuisines = async () => {
      try {
        const response = await axios.get("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
        setCuisines(response.data.meals);
      } catch (error) {
        console.error("Error fetching cuisines:", error);
      }
    };

    fetchRecipes();
    fetchCuisines();
  }, []);

  const getRandomRecipes = (recipes, count) => {
    const shuffled = recipes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const filtered = recipes.filter((recipe) =>
      recipe.strMeal.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (cuisineSearch ? recipe.strArea.toLowerCase().includes(cuisineSearch.toLowerCase()) : true) &&
      (categoryFilter ? recipe.strCategory === categoryFilter : true) &&
      (dietaryFilter === "Vegetarian" ? recipe.strCategory === "Vegetarian" :
       dietaryFilter === "Vegan" ? recipe.strCategory === "Vegan" :
       dietaryFilter === "Gluten-Free" ? recipe.strCategory === "Gluten-Free" :
       dietaryFilter === "Non-Vegetarian" ? 
         !["Beef", "Vegetarian", "Vegan", "Gluten-Free"].includes(recipe.strCategory) : true) &&
      (ingredientSearch ? 
        Object.keys(recipe)
          .filter(key => key.startsWith('strIngredient') && recipe[key])
          .some(key => recipe[key].toLowerCase().includes(ingredientSearch.toLowerCase())) : true)
    );
    setFilteredRecipes(getRandomRecipes(filtered, 5));
  }, [searchTerm, cuisineSearch, categoryFilter, dietaryFilter, ingredientSearch, recipes]);

  // New useEffect for recipe suggestions
  useEffect(() => {
    if (recipeSearch) {
      const suggestions = recipes.filter(recipe =>
        recipe.strMeal.toLowerCase().includes(recipeSearch.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setRecipeSuggestions(suggestions);
    } else {
      setRecipeSuggestions([]);
    }
  }, [recipeSearch, recipes]);

  const handleDrop = (dayIndex, category, recipe) => {
    const newMealPlan = [...mealPlan];
    newMealPlan[dayIndex][category].push({ ...recipe, servings: 1 });
    setMealPlan(newMealPlan);
    setMessage(`${recipe.strMeal} added to ${category} for Day ${dayIndex + 1}`);
  };

  const generateGroceryList = () => {
    const newGroceryList = {};
    mealPlan.forEach((day) => {
      Object.keys(day).forEach((category) => {
        day[category].forEach((meal) => {
          const ingredients = Object.keys(meal)
            .filter(key => key.startsWith('strIngredient') && meal[key])
            .map(key => meal[key]);
          const quantities = Object.keys(meal)
            .filter(key => key.startsWith('strMeasure') && meal[key])
            .map(key => meal[key]);

          ingredients.forEach((ingredient, index) => {
            const quantity = quantities[index] || '';
            const item = `${quantity} ${ingredient}`;
            if (newGroceryList[item]) {
              newGroceryList[item].quantity += 1; // Count occurrences
            } else {
              newGroceryList[item] = { quantity: 1 };
            }
          });
        });
      });
    });
    setGroceryList(newGroceryList);
    setMessage("Grocery list generated!");
  };

  const adjustPortion = (dayIndex, category, mealIndex, increment) => {
    const newMealPlan = [...mealPlan];
    newMealPlan[dayIndex][category][mealIndex].servings = Math.max(
      1,
      newMealPlan[dayIndex][category][mealIndex].servings + increment
    );
    setMealPlan(newMealPlan);
    setMessage(`Portion adjusted for ${newMealPlan[dayIndex][category][mealIndex].strMeal}`);
  };

  const removeMeal = (dayIndex, category, mealIndex) => {
    const newMealPlan = [...mealPlan];
    const removedMeal = newMealPlan[dayIndex][category][mealIndex].strMeal;
    newMealPlan[dayIndex][category].splice(mealIndex, 1);
    setMealPlan(newMealPlan);
    setMessage(`${removedMeal} removed from ${category} for Day ${dayIndex + 1}`);
  };

  const removeIngredient = (item) => {
    const newGroceryList = { ...groceryList };
    delete newGroceryList[item];
    setGroceryList(newGroceryList);
    setMessage(`${item} removed from grocery list`);
  };

  const generateMealPlannerPDF = () => {
    const doc = new jsPDF();
    doc.text("Weekly Meal Planner", 14, 16);
    
    mealPlan.forEach((day, dayIndex) => {
      doc.text(`Day ${dayIndex + 1}`, 14, 30 + dayIndex * 40);
      Object.keys(day).forEach((category, categoryIndex) => {
        doc.text(category, 14, 36 + dayIndex * 40 + categoryIndex * 10);
        day[category].forEach((meal, mealIndex) => {
          doc.text(`${meal.strMeal} - ${meal.servings} servings`, 20, 42 + dayIndex * 40 + categoryIndex * 10 + mealIndex * 10);
        });
      });
    });
    
    doc.save("meal_planner.pdf");
  };

  const generateGroceryListPDF = () => {
    const doc = new jsPDF();
    doc.text("Grocery List", 14, 16);
    
    Object.entries(groceryList).forEach(([item, { quantity }], index) => {
      doc.text(`${quantity} ${item}`, 14, 22 + index * 10);
    });
    
    doc.save("grocery_list.pdf");
  };

  // Autocomplete for cuisines
  const handleCuisineSearchChange = (e) => {
    const value = e.target.value;
    setCuisineSearch(value);
    if (value) {
      const suggestions = cuisines.filter(cuisine => 
        cuisine.strArea.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setCuisineSuggestions(suggestions);
    } else {
      setCuisineSuggestions([]);
    }
  };

  // Autocomplete for ingredients
  const handleIngredientSearchChange = (e) => {
    const value = e.target.value;
    setIngredientSearch(value);
    if (value) {
      const suggestions = recipes.flatMap(recipe => 
        Object.keys(recipe)
          .filter(key => key.startsWith('strIngredient') && recipe[key])
          .map(key => recipe[key])
      ).filter(ingredient => 
        ingredient.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setIngredientSuggestions([...new Set(suggestions)]); // Unique ingredients
    } else {
      setIngredientSuggestions([]);
    }
  };

  // Function to handle selection of cuisine
  const selectCuisine = (cuisine) => {
    setCuisineSearch(cuisine.strArea);
    setCuisineSuggestions([]); // Hide suggestions
  };

  // Function to handle selection of ingredient
  const selectIngredient = (ingredient) => {
    setIngredientSearch(ingredient);
    setIngredientSuggestions([]); // Hide suggestions
  };

  // Function to handle selection of recipe
  const selectRecipe = (recipe) => {
    setRecipeSearch(recipe.strMeal);
    setRecipeSuggestions([]); // Hide suggestions
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <nav className="navbar">
        <img src='src/pages/platepal_logo.png' alt="PlatePal Logo" className="logo" width="133px" height="30px" /> {/* Logo added here */}
        <h3>   </h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/build-recipe">Build a Recipe</Link></li>
          <li><Link to="/meal-planner">Meal Planner</Link></li>
          <li><Link to="/dine-like-a-local">Dine Like a Local</Link></li>
        </ul>
      </nav>
        <h1 style={{ textAlign: "center", padding: "40px", marginBottom: "10px" }}>Weekly Meal Planner</h1>
        
        <div style={{ position: "relative", marginBottom: "10px" }}>
          <FaSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B4226" }} />
          <input
            type="text"
            placeholder="Search recipes..."
            value={recipeSearch}
            onChange={(e) => setRecipeSearch(e.target.value)}
            style={{ width: "100%", padding: "12px 40px", marginBottom: "10px" }}
          />
          {recipeSuggestions.length > 0 && (
            <ul className="suggestions">
              {recipeSuggestions.map(recipe => (
                <li key={recipe.idMeal} onClick={() => selectRecipe(recipe)}>{recipe.strMeal}</li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ position: "relative", marginBottom: "10px" }}>
          <FaSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B4226" }} />
          <input
            type="text"
            placeholder="Search cuisines..."
            value={cuisineSearch}
            onChange={handleCuisineSearchChange}
            style={{ width: "100%", padding: "12px 40px", marginBottom: "10px" }}
          />
          {cuisineSuggestions.length > 0 && (
            <ul className="suggestions">
              {cuisineSuggestions.map(cuisine => (
                <li key={cuisine.strArea} onClick={() => selectCuisine(cuisine)}>{cuisine.strArea}</li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ position: "relative", marginBottom: "10px" }}>
          <FaSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B4226" }} />
          <input
            type="text"
            placeholder="Search by ingredient..."
            value={ingredientSearch}
            onChange={handleIngredientSearchChange}
            style={{ width: "100%", padding: "12px 40px", marginBottom: "10px" }}
          />
          {ingredientSuggestions.length > 0 && (
            <ul className="suggestions">
              {ingredientSuggestions.map((ingredient, index) => (
                <li key={index} onClick={() => selectIngredient(ingredient)}>{ingredient}</li>
              ))}
            </ul>
          )}
        </div>

        <select onChange={(e) => setCategoryFilter(e.target.value)} style={{ marginRight: "10px" }}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.name} value={category.apiCategory}>{category.name}</option>
          ))}
        </select>

        <select onChange={(e) => setDietaryFilter(e.target.value)} style={{ marginRight: "10px" }}>
          <option value="">All Dietary Types</option>
          {dietaryRestrictions.map(diet => (
            <option key={diet.name} value={diet.apiCategory}>{diet.name}</option>
          ))}
        </select>

        {loading && <p>Loading recipes...</p>}
        {message && <p style={{ color: "red" }}>{message}</p>}

        <div className="cookbook" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => <DraggableRecipe key={recipe.idMeal} recipe={recipe} />)
          ) : (
            <p>No recipes found</p>
          )}
        </div>

        <div className="meal-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginTop: "18px" }}>
          {mealPlan.map((day, index) => (
            <DayMealPlan
              key={index}
              dayIndex={index}
              day={day}
              onDrop={handleDrop}
              adjustPortion={adjustPortion}
              removeMeal={removeMeal}
            />
          ))}
        </div>

        <button className="meal-button" onClick={generateMealPlannerPDF} style={{ marginTop: "20px", padding: "10px", fontFamily: "Playfair Display", fontSize: "16px" }}>
          Print Meal Planner as PDF
        </button>

        <button className="meal-button" onClick={generateGroceryList} style={{ marginTop: "20px", padding: "10px", fontFamily: "Playfair Display", fontSize: "16px" }}>
          Generate Grocery List
        </button>

        <div className="grocery-list" style={{ marginTop: "20px" }}>
          <h2>Grocery List</h2>
          {Object.keys(groceryList).length === 0 ? (
            <p>No ingredients yet</p>
          ) : (
            <ul>
              {Object.entries(groceryList).map(([item, { quantity }]) => (
                <li key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {item}
                  <button 
                    onClick={() => removeIngredient(item)}
                    style={{
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#ff4d4d",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#cc0000")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#ff4d4d")}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="meal-button" onClick={generateGroceryListPDF} style={{ marginTop: "20px", padding: "10px", fontFamily: "Playfair Display", fontSize: "16px" }}>
          Print Grocery List as PDF
        </button>
      </div>
    </DndProvider>
  );
};

const DraggableRecipe = ({ recipe }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "RECIPE",
    item: recipe,
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <div ref={drag} className="meal-card" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} style={{ width: "100%", borderRadius: "5px" }} />
      <h3 style={{ fontSize: "1.1em", margin: "10px 0" }}>{recipe.strMeal}</h3>
    </div>
  );
};

const DayMealPlan = ({ dayIndex, day, onDrop, adjustPortion, removeMeal }) => {
  return (
    <div className="day-meal-plan">
      <h4 style={{ textAlign: "center" }}>Day {dayIndex + 1}</h4>
      {Object.keys(day).map((category) => (
        <MealSlot
          key={category}
          dayIndex={dayIndex}
          category={category}
          meals={day[category]}
          onDrop={onDrop}
          adjustPortion={adjustPortion}
          removeMeal={removeMeal}
        />
      ))}
    </div>
  );
};

const MealSlot = ({ dayIndex, category, meals, onDrop, adjustPortion, removeMeal }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "RECIPE",
    drop: (item) => onDrop(dayIndex, category, item),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  return (
    <div ref={drop} className="meal-slot" style={{ backgroundColor: isOver ? "#e0f7fa" : "white", padding: "10px", borderRadius: "3px", marginBottom: "10px" }}>
      <h4 style={{ textAlign: "center" }}>{category}</h4>
      {meals.length > 0
        ? meals.map((meal, index) => (
            <div key={index} className="meal-item">
              <h3>
                <i className="fas fa-utensils" style={{ marginRight: "5px", color: "#69B645" }}></i>
                {meal.strMeal}
              </h3>
              <div className="servings" style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                <button onClick={() => adjustPortion(dayIndex, category, index, 1)}>+</button>
                <span style={{ margin: "4px" }}>{meal.servings} servings</span>
                <button onClick={() => adjustPortion(dayIndex, category, index, -1)}>-</button>
              </div>
              <button onClick={() => removeMeal(dayIndex, category, index)} className="remove-button" style={{ width: "100%", backgroundColor: "#69B645", color: "white" }}>
                <i className="fas fa-trash" style={{ marginRight: "5px" }}></i>
                Remove
              </button>
            </div>
          ))
        : <p style={{ textAlign: "center", color: "#888" }}>Drag a recipe here</p>}
    </div>
  );
};

export default MealPlanner;