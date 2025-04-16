// SavedRecipes.js
import React from "react";
import { useUser } from '@clerk/clerk-react';

const SavedRecipes = () => {
    const { user } = useUser();
    const savedRecipes = JSON.parse(localStorage.getItem(user.id)) || [];

    return (
        <div>
            <h2>Saved Recipes</h2>
            <div className="saved-recipes">
                {savedRecipes.map(recipeId => (
                    <div key={recipeId}> {/* Render recipe details here based on recipeId */}</div>
                ))}
            </div>
        </div>
    );
};

export default SavedRecipes;
