import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import "../styles/RecipePage.css";
import { FaWhatsapp } from "react-icons/fa";

interface Recipe {
    idMeal: string;
    strMeal: string;
    strInstructions: string;
    strMealThumb: string;
    strIngredient1?: string;
    strIngredient2?: string;
    strIngredient3?: string;
    strIngredient4?: string;
    strIngredient5?: string;
    strMeasure1?: string;
    strMeasure2?: string;
    strMeasure3?: string;
    strMeasure4?: string;
    strMeasure5?: string;
}

const RecipePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(
                    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
                );
                const data = await response.json();
                if (data.meals) {
                    setRecipe(data.meals[0]);
                }
            } catch (error) {
                console.error("Error fetching recipe:", error);
            }
        };

        fetchRecipe();
    }, [id]);

    const handlePrintPDF = () => {
        if (!recipe) return;

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(recipe.strMeal, 10, 10);
        doc.setFontSize(12);
        doc.text(`Instructions: ${recipe.strInstructions}`, 10, 20);

        // Add ingredients
        doc.text("Ingredients:", 10, 40);
        Array.from({ length: 5 }, (_, i) => i + 1).forEach(i => {
            if (recipe[`strIngredient${i}`] && recipe[`strMeasure${i}`]) {
                doc.text(`${recipe[`strMeasure${i}`]} ${recipe[`strIngredient${i}`]}`, 10, 40 + (i * 10));
            }
        });

        doc.save(`${recipe.strMeal}.pdf`);
    };

    if (!recipe) return <p>Loading...</p>;

    return (
        <div className="recipe-page-container">
            {/* Navbar */}
            <nav className="navbar">
            <img src='src/pages/platepal_logo.png' alt="PlatePal Logo" className="logo" width="133px" height="30px" /> 
        <h3>   </h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/build-recipe">Build a Recipe</Link></li>
          <li><Link to="/search-page">Cook a Recipe</Link></li>
          <li><Link to="/meal-planner">Meal Planner</Link></li>
          <li><Link to="/dine-like-a-local">Dine Like a Local</Link></li>
        </ul>
        <span className="user-icon">👤</span>
      </nav>

            {/* Main Recipe Info */}
            <div className="recipe-main-info">
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-image" />
                <div className="recipe-details">
                    <h2 className="recipe-title">{recipe.strMeal}</h2>
                    <p className="recipe-author">by Sanjeev Kapoor</p>
                    <div className="recipe-rating">⭐ ⭐ ⭐ ⭐ ⭐ (151)</div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="recipe-content">
                {/* Left Column: Ingredients & Share */}
                <div className="recipe-sidebar">
                    <section className="ingredients-section">
                        <h3>Ingredients List</h3>
                        <p>Serves: <strong>1 Person</strong></p>
                        <ul className="ingredients-list">
                            {Array.from({ length: 5 }, (_, i) => i + 1)
                                .map(i =>
                                    recipe[`strIngredient${i}`] && recipe[`strMeasure${i}`] ? (
                                        <li key={i}>
                                            {recipe[`strMeasure${i}`]} {recipe[`strIngredient${i}`]}
                                        </li>
                                    ) : null
                                )}
                        </ul>
                    </section>

                    {/* Share Recipe */}
                    <section className="share-recipe">
                        <h3>Share this recipe:</h3>
                        <div className="share-options">
                            <p>📲 WhatsApp</p>
                            <p>🔗 Copy Link</p>
                            <p onClick={handlePrintPDF} style={{ cursor: 'pointer' }}>🖨️ Print as PDF</p>
                        </div>
                    </section>
                </div>

                {/* Right Column: Instructions & FAQs */}
                <div className="recipe-main-content">
                    <section className="instructions-section">
                        <h3>Instructions</h3>
                        <ol>
                            {recipe.strInstructions.split('\n').map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ol>
                    </section>

                    {/* FAQ Section */}
                    <section className="faq-section">
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>1. Why did my cookies turn out flat?</strong> Butter too soft, overmixing, or hot baking sheet.</p>
                        <p><strong>2. Can I freeze cookie dough?</strong> Yes! Freeze in a tray, then transfer to a bag.</p>
                        <p><strong>3. How do I make my cookies chewy?</strong> Use more brown sugar & underbake slightly.</p>
                    </section>
                </div>
            </div>

            {/* Footer */}
            <footer className="recipe-page-footer">
                <p>© 2025 PlatePal. All Rights Reserved.</p>
            </footer>
            <div className="green-block"></div>
        </div>
    );
};

export default RecipePage;