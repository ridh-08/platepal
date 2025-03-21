import { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import jsPDF from "jspdf";
import "jspdf-autotable"; 
import "../styles/MealPlanner.css";
import { Link } from "react-router-dom";

const categories = ["Breakfast", "Lunch", "Dinner", "Snacks & Beverages", "Dessert"];
const cuisines = [
  "American", "Italian", "Mexican", "Indian", "Thai", 
  "Middle Eastern", "Japanese", "Korean", "Chinese", 
  "French", "Greek", "Mediterranean", "Spanish", 
  "Brazilian", "Vietnamese", "Fusion"
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
  const [dietaryFilter, setDietaryFilter] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/recipes")
      .then((response) => {
        setRecipes(response.data);
        setFilteredRecipes(getRandomRecipes(response.data, 5));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setMessage("Error fetching recipes. Please try again.");
        setLoading(false);
      });
  }, []);

  const getRandomRecipes = (recipes, count) => {
    const shuffled = recipes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const filtered = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (dietaryFilter ? recipe.dietary?.includes(dietaryFilter) : true) &&
      (cuisineFilter ? recipe.cuisine?.toLowerCase() === cuisineFilter.toLowerCase() : true) &&
      (categoryFilter ? recipe.category === categoryFilter : true)
    );
    setFilteredRecipes(getRandomRecipes(filtered, 5));
  }, [searchTerm, dietaryFilter, cuisineFilter, categoryFilter, recipes]);

  const handleDrop = (dayIndex, category, recipe) => {
    if (!recipe.ingredients) return;

    if (category === "Snacks & Beverages" && !["Appetizer", "Beverage"].includes(recipe.category)) {
      return;
    }

    const newMealPlan = [...mealPlan];
    newMealPlan[dayIndex][category].push({ ...recipe, servings: 1 });
    setMealPlan(newMealPlan);
    setMessage(`${recipe.name} added to ${category} for Day ${dayIndex + 1}`);
  };

  const generateGroceryList = () => {
    const newGroceryList = {};
    mealPlan.forEach((day) => {
      categories.forEach((category) => {
        day[category].forEach((meal) => {
          meal.ingredients?.forEach(({ name, quantity, unit }) => {
            const totalQuantity = parseFloat(quantity) * meal.servings;
            if (newGroceryList[name]) {
              newGroceryList[name].quantity += totalQuantity;
            } else {
              newGroceryList[name] = { quantity: totalQuantity, unit };
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
    setMessage(`Portion adjusted for ${newMealPlan[dayIndex][category][mealIndex].name}`);
  };

  const removeMeal = (dayIndex, category, mealIndex) => {
    const newMealPlan = [...mealPlan];
    const removedMeal = newMealPlan[dayIndex][category][mealIndex].name;
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
      categories.forEach((category, categoryIndex) => {
        doc.text(category, 14, 36 + dayIndex * 40 + categoryIndex * 10);
        day[category].forEach((meal, mealIndex) => {
          doc.text(`${meal.name} - ${meal.servings} servings`, 20, 42 + dayIndex * 40 + categoryIndex * 10 + mealIndex * 10);
        });
      });
    });
    
    doc.save("meal_planner.pdf");
  };

  const generateGroceryListPDF = () => {
    const doc = new jsPDF();
    doc.text("Grocery List", 14, 16);
    
    Object.entries(groceryList).forEach(([item, { quantity, unit }], index) => {
      doc.text(`${quantity} ${unit} ${item}`, 14, 22 + index * 10);
    });
    
    doc.save("grocery_list.pdf");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <header className="recipe-page-navbar">
        <Link to="/" className="nav-home">← Return To Home</Link>
        <h1 className="nav-title">PlatePal</h1>
        <button className="user-button">User</button>
    </header>
        <h1 style={{ textAlign: "center", padding: "20px" }}>Weekly Meal Planner</h1>
        <input
          type="text"
          placeholder="Search recipes..."
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        
        <select onChange={(e) => setDietaryFilter(e.target.value)} style={{ marginRight: "10px" }}>
          <option value="">All Diets</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Gluten-Free">Gluten-Free</option>
        </select>

        <select onChange={(e) => setCuisineFilter(e.target.value)} style={{ marginRight: "10px" }}>
          <option value="">All Cuisines</option>
          {cuisines.map(cuisine => (
            <option key={cuisine} value={cuisine}>{cuisine}</option>
          ))}
        </select>

        <select onChange={(e) => setCategoryFilter(e.target.value)} style={{ marginRight: "10px" }}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {loading && <p>Loading recipes...</p>}
        {message && <p style={{ color: "cornsilk" }}>{message}</p>}

        <div className="cookbook" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => <DraggableRecipe key={recipe.id} recipe={recipe} />)
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

        <button className="meal-button" onClick={generateMealPlannerPDF} style={{ marginTop: "20px", padding: "10px",fontFamily:"Playfair Display", fontSize: "16px" }}>
          Print Meal Planner as PDF
        </button>

        <button className="meal-button" onClick={generateGroceryList} style={{ marginTop: "20px", padding: "10px", fontFamily:"Playfair Display", fontSize: "16px" }}>
          Generate Grocery List
        </button>

        

        

        <div className="grocery-list" style={{ marginTop: "20px" }}>
          <h2>Grocery List</h2>
          {Object.keys(groceryList).length === 0 ? (
            <p>No ingredients yet</p>
          ) : (
            <ul>
              {Object.entries(groceryList).map(([item, { quantity, unit }]) => (
                <li key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {quantity} {unit} {item}
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
        <button className="meal-button" onClick={generateGroceryListPDF} style={{ marginTop: "20px", padding: "10px",fontFamily:"Playfair Display", fontSize: "16px" }}>
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
      <img src={recipe.image} alt={recipe.name} style={{ width: "100%", borderRadius: "5px" }} />
      <h3 style={{ fontSize: "1.1em", margin: "10px 0" }}>{recipe.name}</h3>
    </div>
  );
};

const DayMealPlan = ({ dayIndex, day, onDrop, adjustPortion, removeMeal }) => {
  return (
    <div className="day-meal-plan">
      <h4 style={{ textAlign: "center" }}>Day {dayIndex + 1}</h4>
      {categories.map((category) => (
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
                {meal.name}
              </h3>
              <div className="servings" style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                <button onClick={() => adjustPortion(dayIndex, category, index, 1)}>+</button>
                <span style={{ margin: "0 10px" }}>{meal.servings} servings</span>
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