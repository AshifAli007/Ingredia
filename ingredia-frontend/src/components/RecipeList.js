// RecipeList.js
import React, { useState } from "react";
import RecipeCard from './RecipeCard';
import RecipeFilter from './RecipeFilter';
import { UserButton, useUser } from "@clerk/clerk-react";


const RecipeList = ({ recipes, onFilterChange }) => {
  const [ingredientSearch, setIngredientSearch] = useState('');
  const { user } = useUser()
  const [filters, setFilters] = useState({
    dietary: '',
    cuisine: '',
    prepTime: '',
    difficulty: '',
    calories: [0, 1000],
  });

  const handleSearchChange = (e) => {
    setIngredientSearch(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const updatedFilters = { ...prev, [filterType]: value };
      onFilterChange(updatedFilters); // Pass updated filters to parent
      return updatedFilters;
    });
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(ingredientSearch.toLowerCase()))
  );

  return (
    <div>

      <UserButton />
      <h1>Welcome {user.lastName}</h1>
      <RecipeFilter filters={filters} onFilterChange={handleFilterChange} />
      <input
        type="text"
        placeholder="Search by ingredients..."
        value={ingredientSearch}
        onChange={handleSearchChange}
      />
      <div className="recipe-list">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
