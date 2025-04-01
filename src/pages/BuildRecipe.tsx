import React, { useState } from "react";
import Dropzone from "react-dropzone";
import jsPDF from "jspdf";
import "../styles/BuildRecipe.css";
import { Link } from "react-router-dom";

const BuildRecipe: React.FC = () => {
  const [recipe, setRecipe] = useState({
    name: "",
    category: "",
    cuisine: "",
    ingredients: [{ name: "", quantity: "", unit: "" }],
    steps: [""],
    images: [] as File[],
  });

  const [errors, setErrors] = useState({
    quantity: "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [publishedRecipe, setPublishedRecipe] = useState(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleServingSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipe({ ...recipe, servingSize: Math.max(1, Number(e.target.value)) });
  };

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index][field] = value;
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const handleQuantityChange = (index: number, value: string) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index].quantity = value;

    // Validate quantity
    if (!/^\d*\.?\d*$/.test(value)) {
      setErrors({ ...errors, quantity: "Quantity must be a number." });
    } else {
      setErrors({ ...errors, quantity: "" });
    }

    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, { name: "", quantity: "", unit: "" }] });
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const addStep = () => {
    setRecipe({ ...recipe, steps: [...recipe.steps, ""] });
  };

  const removeStep = (index: number) => {
    const updatedSteps = recipe.steps.filter((_, i) => i !== index);
    setRecipe({ ...recipe, steps: updatedSteps });
  };

  const handleStepChange = (index: number, value: string) => {
    const updatedSteps = [...recipe.steps];
    updatedSteps[index] = value;
    setRecipe({ ...recipe, steps: updatedSteps });
  };

  const handleImageUpload = (acceptedFiles: File[]) => {
    setRecipe({ ...recipe, images: [...recipe.images, ...acceptedFiles] });
  };

  const previewRecipe = () => {
    setShowPreview(true);
  };

  const printRecipeToPDF = () => {
    const doc = new jsPDF();

    doc.setFont("Playfair", "bold");
    doc.text(recipe.name, 105, 20, { align: "center" });

    doc.setFont("Sans Pro", "normal");
    doc.text(`Cuisine: ${recipe.cuisine}`, 105, 30, { align: "center" });
    doc.text(`Category: ${recipe.category}`, 105, 40, { align: "center" });

    doc.text("Ingredients:", 20, 60);
    recipe.ingredients.forEach((ing, index) => {
      doc.text(`${ing.quantity} ${ing.unit} ${ing.name}`, 20, 70 + (10 * index));
    });

    doc.text("Steps:", 20, 100);
    recipe.steps.forEach((step, index) => {
      doc.text(`${index + 1}. ${step}`, 20, 110 + (10 * index));
    });

    doc.save(`${recipe.name}.pdf`);
  };

  const saveRecipe = async () => {
    // Basic validation
    if (!recipe.name || !recipe.category || !recipe.cuisine || recipe.ingredients.some(ing => !ing.name || !ing.quantity || !ing.unit) || recipe.steps.some(step => !step)) {
      alert("Please fill in all fields correctly.");
      return;
    }

    // Send recipe to local server
    try {
      const response = await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });

      if (response.ok) {
        const savedRecipe = await response.json();
        setPublishedRecipe(savedRecipe);
        alert("Recipe saved successfully!");
      } else {
        alert("Failed to save recipe.");
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("An error occurred while saving the recipe.");
    }

    // Reset the form after saving
    setRecipe({
      name: "",
      category: "",
      cuisine: "",
      ingredients: [{ name: "", quantity: "", unit: "" }],
      steps: [""],
      images: [],
    });
  };

  return (
    <div className="build-recipe">
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
      <h1 style={{ textAlign: "center", padding: "20px" }}>Create a New Recipe</h1>
      <input
        type="text"
        name="name"
        placeholder="Recipe Name"
        value={recipe.name}
        onChange={handleInputChange}
        required
      />

      <label>Category:</label>
      <select name="category" value={recipe.category} onChange={handleInputChange} required>
        <option value="">Select...</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Snacks">Snacks</option>
        <option value="Beverages">Beverages</option>
        <option value="Dessert">Dessert</option>
      </select>

      <label>Cuisine:</label>
      <input
        type="text"
        name="cuisine"
        placeholder="Cuisine Type"
        value={recipe.cuisine}
        onChange={handleInputChange}
        required
      />

      <label>Serving Size:</label>
      <input
        type="number"
        name="servingSize"
        placeholder="Number of servings"
        value={recipe.servingSize}
        min="1"
        onChange={handleServingSizeChange}
      />

      <h2>Ingredients</h2>
      {recipe.ingredients.map((ingredient, index) => (
        <div key={index} className="ingredient">
          <input
            type="text"
            placeholder="Ingredient Name"
            value={ingredient.name}
            onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
            required
          />
          <input
            type="number"
            min="1"
            placeholder="Quantity"
            value={ingredient.quantity}
            onChange={(e) => handleQuantityChange(index, e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Unit"
            value={ingredient.unit}
            onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
            required
          />
          <button type="button" className="remove-ingredient-button" onClick={() => removeIngredient(index)}>Remove</button>
        </div>
      ))}
      <button type="button" className="add-ingredient-button" onClick={addIngredient}>Add Ingredient</button>

      <h2>Steps</h2>
      {recipe.steps.map((step, index) => (
        <div key={index} className="step">
          <textarea
            placeholder="Step Description"
            value={step}
            onChange={(e) => handleStepChange(index, e.target.value)}
            required
          />
          <button type="button" className="remove-step-button" onClick={() => removeStep(index)}>Remove</button>
        </div>
      ))}
      <button type="button" className="add-step-button" onClick={addStep}>Add Step</button>

      <Dropzone onDrop={handleImageUpload}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag 'n' drop some images here, or click to select images</p>
          </div>
        )}
      </Dropzone>

      <button type="button" className="preview-recipe-button" onClick={previewRecipe}>Preview Recipe</button>
      <button type="button" className="print-recipe-button" onClick={printRecipeToPDF}>Print Recipe to PDF</button>

      {showPreview && (
        <div className="recipe-preview">
          <h2>{recipe.name}</h2>
          <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
          <p><strong>Category:</strong> {recipe.category}</p>
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ing, index) => (
              <li key={index}>{ing.quantity} {ing.unit} {ing.name}</li>
            ))}
          </ul>
          <h3>Steps</h3>
          <ol>
            {recipe.steps.map((step, index) => <li key={index}>{step}</li>
            )}
          </ol>
        </div>
      )}
    </div>
  );
};

export default BuildRecipe;