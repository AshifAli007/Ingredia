// ShoppingList.js
import React from "react";

const ShoppingList = () => {
    const recipes = []; // Retrieve selected recipes
    const shoppingList = recipes.flatMap(recipe => recipe.ingredients);

    return (
        <div>
            <h2>Shopping List</h2>
            <ul>
                {shoppingList.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
        </div>
    );
};

export default ShoppingList;
