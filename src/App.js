import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RecipeList from './components/RecipeList';
import SavedRecipes from './components/SavedRecipes';
import ShoppingList from './components/ShoppingList';
import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import img1 from './Assets/Img/img1.jpeg';
import { getRecipes, getFilteredRecipes } from './api';
import './App.css'; // Ensure this file contains the necessary styles
import Sidebar from "./components/Sidebar/Sidebar";
import Ingredients from "./components/Ingredients/Ingredients";
import BrowseRecipe from "./components/BrowseRecipe/BrowseRecipe";
import Recipe from "./components/Recipe/Recipe";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({
    dietary: '',
    cuisine: '',
    prepTime: '',
    difficulty: '',
    calories: [0, 1000],
  });

  useEffect(() => {
    getRecipes().then(setRecipes);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const filteredRecipes = getFilteredRecipes(recipes, filters);

  return (
    <Router>
      <div className="App">
        <SignedOut>
          <div className="signed-out-container">
            <div className="image-container">
              <img src={img1} alt="Welcome" className="welcome-image" />
            </div>
            <div className="signin-container">
              <Routes>
                <Route
                  path="/"
                  element={<SignIn routing="hash" signUpUrl="/sign-up" />}
                />
                <Route
                  path="/sign-up"
                  element={<SignUp routing="hash" signInUrl="/" />}
                />
              </Routes>
            </div>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="main-layout">
            <Sidebar />
            <div className="content">
              <Routes>
                <Route exact path="/" Component={() => <RecipeList recipes={filteredRecipes} onFilterChange={handleFilterChange} />} />
                <Route path="/ingredients" Component={Ingredients} />
                <Route path="browse-recipe" Component={BrowseRecipe} />
                <Route path="/recipe/:id" Component={Recipe} />
                <Route path="/saved-recipes" Component={SavedRecipes} />
                <Route path="/shopping-list" Component={ShoppingList} />
              </Routes>
            </div>
          </div>
        </SignedIn>
      </div>
    </Router>
  );
}

export default App;