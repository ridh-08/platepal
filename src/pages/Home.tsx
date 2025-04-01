import { Link } from "react-router-dom";
import "../styles/Home.css";



const Home = () => {
  return (
    <div className="home-container">
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

      <header className="hero-section">
        <h2>Discover, Plan & Savor Every Bite!</h2>
        <p>Explore delicious recipes, plan your meals, and simplify your grocery shopping.</p>
        <div className="options">
          <Link to="/search-page" className="card">
            <img src="src\pages\cook_recipe.png" alt="Cook A Recipe" className="icon" />
            <p>Cook A Recipe</p>
          </Link>
          
          <Link to="/build-recipe" className="card">
            <img src="src\pages\create_recipe.png" alt="Create A Recipe" className="icon" />
            <p>Create A Recipe</p>
          </Link>
          
          <Link to="/meal-planner" className="card">
            <img src="src\pages\meal_plan.png" alt="Make A Meal Plan" className="icon" />
            <p>Make A Meal Plan</p>
          </Link>

          <Link to="/dine-like-a-local" className="card">
            <img src="src\pages\meal_plan.png" alt="Dine Like a Local" className="icon" />
            <p>Dine Like a Local</p>
          </Link>
        </div>
      </header>

      <footer className="footer full-width">
        <div className="footer-content">
          <div className="footer-section">
            <p>© 2025 PlatePal All Rights Reserved.</p>
            <p>Privacy Policy | Terms</p>
          </div>
          <div className="footer-section">
            <p className="footer-title">About Us</p>
            <p>Khevan Thanki - AU23L20002</p>
            <p>Riddhi Bhargava - AU2220028</p>
          </div>
          <div className="footer-section">
            <p className="footer-title">Contact Us</p>
            <p>platepal@gmail.com</p>
            <p>+91 1234567890</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;