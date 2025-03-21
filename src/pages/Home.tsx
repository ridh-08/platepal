import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <h1>PlatePal</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/build-recipe">Build a Recipe</Link></li>
          <li><Link to="/meal-planner">Meal Planner</Link></li>
        </ul>
      </nav>

      <header className="hero-section">
        <h2>Discover, Plan & Savor Every Bite!</h2>
        <p>Explore delicious recipes, plan your meals, and simplify your grocery shopping.</p>
        <div className="options">
          <Link to="/search-page" className="card">
            <span className="icon">🍳</span>
            <p>Cook A Recipe</p>
          </Link>
          
          <Link to="/build-recipe" className="card">
            <span className="icon">👨‍🍳</span>
            <p>Create A Recipe</p>
          </Link>
          
          <Link to="/meal-planner" className="card">
          <span className="icon">📝</span>
            <p>Make A Meal Plan</p>
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
