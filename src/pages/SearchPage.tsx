import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchPage.css";

const SearchPage: React.FC = () => {
    const [query, setQuery] = useState("");
    const [recipes, setRecipes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchRecipes = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await response.json();

            if (data.meals) {
                setRecipes(data.meals);
            } else {
                setRecipes([]);
                setError("No recipes found.");
            }
        } catch (err) {
            setError("Failed to fetch recipes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
            <header className="search-header">
                <h1>PlatePal</h1>
                <input
                    type="text"
                    placeholder="Search for a recipe..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={fetchRecipes} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </header>

            {error && <p className="error-message">{error}</p>}

            <div className="recipe-list">
                {recipes.map((recipe) => (
                    <div key={recipe.idMeal} className="recipe-card" onClick={() => navigate(`/cook-recipe/${recipe.idMeal}`)}>
                        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                        <h3>{recipe.strMeal}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
