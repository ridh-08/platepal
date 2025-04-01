import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BuildRecipe from "./pages/BuildRecipe";
import MealPlanner from "./pages/MealPlanner";
import SearchPage from "./pages/SearchPage";
import RecipePage from "./pages/RecipePage"; 
import DineLikeALocal from "./pages/dine-like-a-local";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/build-recipe" element={<BuildRecipe />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/search-page" element={<SearchPage />} />
        <Route path="/cook-recipe/:id" element={<RecipePage />} />
        <Route path="/dine-like-a-local" element={<DineLikeALocal />}>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
