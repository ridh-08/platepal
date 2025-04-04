import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BuildRecipe from "./pages/BuildRecipe";
import MealPlanner from "./pages/MealPlanner";
import SearchPage from "./pages/SearchPage";
import RecipePage from "./pages/RecipePage";
import DineLikeALocal from "./pages/dine-like-a-local";
import { StrictMode, useEffect } from "react";

function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <StrictMode>
      <Router>
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/build-recipe" element={<BuildRecipe />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/search-page" element={<SearchPage />} />
            <Route path="/cook-recipe/:id" element={<RecipePage />} />
            <Route path="/dine-like-a-local" element={<DineLikeALocal />} />
          </Routes>
        </div>
      </Router>
    </StrictMode>
  );
}

export default App;
