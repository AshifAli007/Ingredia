// api.js
export const getRecipes = async () => {
    // Replace with real API call or local data
    const recipes = [
        { id: 1, name: "Pasta", ingredients: ["Tomato", "Pasta", "Basil"], cuisine: "Italian", dietary: "vegetarian", prepTime: 20, difficulty: "easy", calories: 500 },
        { id: 2, name: "Tacos", ingredients: ["Tortilla", "Beef", "Cheese"], cuisine: "Mexican", dietary: "non-vegetarian", prepTime: 15, difficulty: "easy", calories: 350 },
        // More recipes
    ];
    return recipes;
};

export const getFilteredRecipes = (recipes, filters) => {
    return recipes.filter(recipe => {
        return (
            (!filters.dietary || recipe.dietary === filters.dietary) &&
            (!filters.cuisine || recipe.cuisine === filters.cuisine) &&
            (!filters.difficulty || recipe.difficulty === filters.difficulty) &&
            recipe.calories >= filters.calories[0] &&
            recipe.calories <= filters.calories[1]
        );
    });
};
