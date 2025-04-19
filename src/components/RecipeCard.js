// RecipeCard.js
import React from "react";
// import { useUser } from '@clerk/clerk-react';

const RecipeCard = ({ recipe }) => {
    //   const { user } = useUser();
    //   const savedRecipes = JSON.parse(localStorage.getItem(user.id)) || [];

    //   const handleSaveRecipe = () => {
    //     if (!savedRecipes.includes(recipe.id)) {
    //       savedRecipes.push(recipe.id);
    //       localStorage.setItem(user.id, JSON.stringify(savedRecipes));
    //     }
    //   };

    return (
        <div className="recipe-card">
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
            {/* <button onClick={handleSaveRecipe}>Save Recipe</button> */}
        </div>
    );
};

export default RecipeCard;
