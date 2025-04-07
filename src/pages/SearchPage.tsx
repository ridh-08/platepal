import React, { useState, useEffect } from "react";
import "../styles/SearchPage.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  difficulty?: string;
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedDietaryPreference, setSelectedDietaryPreference] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const navigate = useNavigate();

  const mapCategoryToMealType = (category: string) => {
    switch (category) {
      case "Breakfast":
        return "Breakfast";
      case "Dessert":
        return "Dessert";
      case "Side":
      case "Starter":
        return "Snacks & Beverages";
      case "Beef":
      case "Chicken":
      case "Pork":
      case "Lamb":
      case "Seafood":
        return "Dinner";
      default:
        return "Lunch";
    }
  };

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
        const data = await response.json();
        if (data.meals) {
          const allowedCuisines = ["Indian", "Italian", "American", "French", "Mexican", "Chinese"];
          const filteredCuisines = data.meals
            .map((meal: { strArea: string }) => meal.strArea)
            .filter((area) => allowedCuisines.includes(area));
          setCuisines(filteredCuisines);
        }
      } catch (error) {
        console.error("Error fetching cuisines:", error);
      }
    };

    fetchCuisines();
  }, []);

  useEffect(() => {
    const fetchMealTypes = async () => {
      try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
        const data = await response.json();
        if (data.meals) {
          const mappedTypes = data.meals.map((meal: { strCategory: string }) =>
            mapCategoryToMealType(meal.strCategory)
          );
          setMealTypes([...new Set(mappedTypes)]);
        }
      } catch (error) {
        console.error("Error fetching meal types:", error);
      }
    };

    fetchMealTypes();
  }, []);

  const fetchRandomMeals = async () => {
    try {
      const mealPromises = Array.from({ length: 6 }, async () => {
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const data = await res.json();
        const meal = data.meals[0];
        const ingredientCount = Object.keys(meal)
          .filter((key) => key.startsWith("strIngredient") && meal[key])
          .length;
        return {
          ...meal,
          difficulty: ingredientCount < 5 ? "Easy" : ingredientCount < 10 ? "Intermediate" : "Advanced",
        };
      });

      const meals = await Promise.all(mealPromises);
      setMeals(meals);
      setFilteredMeals(meals);
    } catch (error) {
      console.error("Error fetching random meals:", error);
    }
  };

  const fetchFilteredMeals = async () => {
    try {
      let recipeList: Meal[] = [];

      if (selectedCuisines.length > 0) {
        for (const cuisine of selectedCuisines) {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`);
          const data = await response.json();
          if (data.meals) {
            recipeList = [...recipeList, ...data.meals];
          }
        }
      } else {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        const data = await response.json();
        if (data.meals) recipeList = data.meals;
      }

      const detailedMeals = await Promise.all(
        recipeList.map(async (meal) => {
          const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
          const data = await res.json();
          const fullMeal = data.meals[0];
          const ingredientCount = Object.keys(fullMeal)
            .filter((key) => key.startsWith("strIngredient") && fullMeal[key])
            .length;
          return {
            ...meal,
            difficulty: ingredientCount < 5 ? "Easy" : ingredientCount < 10 ? "Intermediate" : "Advanced",
          };
        })
      );
      recipeList = detailedMeals;

      if (selectedMealTypes.length > 0) {
        recipeList = recipeList.filter((meal) =>
          selectedMealTypes.includes(mapCategoryToMealType(meal.strCategory))
        );
      }

      if (selectedDietaryPreference) {
        recipeList = recipeList.filter((meal) => {
          switch (selectedDietaryPreference) {
            case "Vegetarian":
              return meal.strCategory === "Vegetarian";
            case "Vegan":
              return meal.strCategory === "Vegan";
            case "Non-Vegetarian":
              return ["Beef", "Chicken", "Pork", "Lamb", "Seafood"].includes(meal.strCategory);
            default:
              return true;
          }
        });
      }

      if (selectedDifficulty) {
        recipeList = recipeList.filter((meal) => meal.difficulty === selectedDifficulty);
      }

      if (searchQuery) {
        recipeList = recipeList.filter((meal) =>
          meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredMeals(recipeList);
    } catch (error) {
      console.error("Error fetching filtered meals:", error);
    }
  };

  useEffect(() => {
    fetchRandomMeals();
  }, []);

  useEffect(() => {
    fetchFilteredMeals();
  }, [selectedCuisines, selectedMealTypes, selectedDietaryPreference, selectedDifficulty, searchQuery]);

  return (
    <div className="search-container">
      <nav className="navbar">
        <div className="logo-container">
          <img src="src\pages\platepal_logo.png" alt="Logo" className="logo" />
          <h3></h3>
        </div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/build-recipe">Build a Recipe</Link></li>
          <li><Link to="/search-page">Cook a Recipe</Link></li>
          <li><Link to="/meal-planner">Meal Planner</Link></li>
          <li><Link to="/dine-like-a-local">Dine Like a Local</Link></li>
          <li><Link to="/">👤</Link></li> {/* Last item, no underline */}
        </ul>
      </nav>

      <div className="hero">
        <h1>Browse Recipes</h1>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <FaSearch className="search-icon" />
      </div>

      <div className="main-content">
        <aside className="filters">
          <h2 className="filter-heading">Filters</h2>

          <div className="filter-group">
            <h3 className="filter-title">Cuisine</h3>
            {cuisines.map((cuisine) => (
              <label key={cuisine} className="filter-option">
                <input
                  type="checkbox"
                  value={cuisine}
                  checked={selectedCuisines.includes(cuisine)}
                  onChange={() =>
                    setSelectedCuisines((prev) =>
                      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
                    )
                  }
                />
                {cuisine}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3 className="filter-title">Meal Type</h3>
            {mealTypes.map((type) => (
              <label key={type} className="filter-option">
                <input
                  type="checkbox"
                  value={type}
                  checked={selectedMealTypes.includes(type)}
                  onChange={() =>
                    setSelectedMealTypes((prev) =>
                      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                    )
                  }
                />
                {type}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3 className="filter-title">Dietary Preferences</h3>
            {["Vegetarian", "Vegan", "Non-Vegetarian"].map((diet) => (
              <label key={diet} className="filter-option">
                <input
                  type="radio"
                  value={diet}
                  checked={selectedDietaryPreference === diet}
                  onChange={() => setSelectedDietaryPreference(diet)}
                />
                {diet}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3 className="filter-title">Difficulty Level</h3>
            {["Easy", "Intermediate", "Advanced"].map((difficulty) => (
              <label key={difficulty} className="filter-option">
                <input
                  type="radio"
                  value={difficulty}
                  checked={selectedDifficulty === difficulty}
                  onChange={() => setSelectedDifficulty(difficulty)}
                />
                {difficulty}
              </label>
            ))}
          </div>
        </aside>

        <section className="recipe-list">
          {filteredMeals.length === 0 && (
            <p className="no-recipes">No recipes found for selected filters.</p>
          )}
          {filteredMeals.length > 0 && filteredMeals.map((meal) => (
            <div
              key={meal.idMeal}
              className="recipe-card"
              onClick={() => navigate(`/cook-recipe/${meal.idMeal}`)}
            >
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <div className="recipe-info">
                <h3>{meal.strMeal}</h3>
                <p>by Random Chef</p>
                <p>⭐⭐⭐⭐☆ (150)</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default SearchPage;