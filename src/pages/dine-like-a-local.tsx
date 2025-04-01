import { useState, useEffect } from "react";
import "../styles/dine-like-a-local.css";
import { Link } from "react-router-dom";

const DineLikeALocal = () => {
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    // Load Flourish script only if it isn't already loaded
    if (!document.querySelector('script[src="https://public.flourish.studio/resources/embed.js"]')) {
      const script = document.createElement("script");
      script.src = "https://public.flourish.studio/resources/embed.js";
      script.async = true;
      script.onload = () => {
        if (window.Flourish) {
          window.Flourish.renderAll();
        }
      };
      document.body.appendChild(script);
    } else {
      // Re-initialize Flourish when the component mounts
      if (window.Flourish) {
        window.Flourish.renderAll();
      }
    }
  }, []);

  // Fetch meals from MealDB API
  const searchMeals = async () => {
    if (!query.trim()) return;
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      const data = await response.json();
      setMeals(data.meals || []);
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  return (
    <div className="dine-local-container">
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
      <h2>Dine Like a Local</h2>
      <p>Click on a country to explore its daily meal plan and dining etiquette.</p>

      {/* Flourish Map Embed */}
      <div className="flourish-container">
        <div
          className="flourish-embed flourish-map"
          data-src="visualisation/22386609"
          ></div>
      </div>

      {/* Search Section */}
      <div className="search-container">
        <h3>Found one of these interesting? Search here!</h3>
        <input
          type="text"
          placeholder="Search for a dish..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchMeals}>Search</button>
      </div>

      {/* Meal Results */}
      <div className="meal-results">
        {meals.map((meal) => (
          <div key={meal.idMeal} className="meal-card">
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <h4>{meal.strMeal}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DineLikeALocal;
