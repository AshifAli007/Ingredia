// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { ClerkProvider, RedirectToSignIn, useClerk, useUser } from '@clerk/clerk-react';
import RecipeList from './components/RecipeList';
import RecipeDetails from './components/RecipeDetails';
import SavedRecipes from './components/SavedRecipes';
import ShoppingList from './components/ShoppingList';
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";
import img1 from './Assets/Img/img1.jpeg';
import Auth from './components/Auth';
import { getRecipes, getFilteredRecipes } from './api';
import './App.css'

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
              <SignIn routing="hash" />
            </div>
          </div>
        </SignedOut>
        <SignedIn>
          <nav>
            <a href="/">Home</a>
            <a href="/saved-recipes">My Recipes</a>
            <a href="/shopping-list">Shopping List</a>
          </nav>
          <Routes>
            <Route exact path="/" Component={() => <RecipeList recipes={filteredRecipes} onFilterChange={handleFilterChange} />} />
            {/* <Route exact path="/auth" Component={Auth} /> */}
            <Route path="/recipe/:id" Component={RecipeDetails} />
            <Route path="/saved-recipes" Component={SavedRecipes} />
            <Route path="/shopping-list" Component={ShoppingList} />
          </Routes>
        </SignedIn>




      </div>
    </Router>
  );
}

export default App;
