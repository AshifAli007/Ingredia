// RecipeFilter.js
import React from "react";

const RecipeFilter = ({ filters, onFilterChange }) => {
  return (
    <div>
      <select onChange={(e) => onFilterChange('dietary', e.target.value)} value={filters.dietary}>
        <option value="">Dietary Restrictions</option>
        <option value="vegan">Vegan</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="gluten-free">Gluten-Free</option>
      </select>
      
      <select onChange={(e) => onFilterChange('cuisine', e.target.value)} value={filters.cuisine}>
        <option value="">Cuisine Type</option>
        <option value="Italian">Italian</option>
        <option value="Mexican">Mexican</option>
        <option value="Indian">Indian</option>
      </select>

      <select onChange={(e) => onFilterChange('difficulty', e.target.value)} value={filters.difficulty}>
        <option value="">Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <input 
        type="number" 
        placeholder="Min Calories" 
        value={filters.calories[0]}
        onChange={(e) => onFilterChange('calories', [parseInt(e.target.value), filters.calories[1]])}
      />
      <input 
        type="number" 
        placeholder="Max Calories" 
        value={filters.calories[1]}
        onChange={(e) => onFilterChange('calories', [filters.calories[0], parseInt(e.target.value)])}
      />
    </div>
  );
};

export default RecipeFilter;
