import React, { useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { TextField, Button, Box, Typography, Grid, Card, CardContent, CardMedia, Checkbox, IconButton } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecipeList = () => {
  const { user } = useUser();
  const userId = user?.id;
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [userItems, setUserItems] = useState(["salt", "sugar"]); // Example of items user already has
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem(`favorites_${userId}`)) || []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
        params: {
          query: searchQuery,
          apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
        },
      });
      setRecipes(response.data.results);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleAddToShoppingList = async () => {
    try {
      const ingredientPromises = selectedRecipes.map((recipeId) =>
        axios.get(`https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json`, {
          params: {
            apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
          },
        })
      );

      const responses = await Promise.all(ingredientPromises);
      const allIngredients = responses.flatMap((response) =>
        response.data.ingredients.map((ingredient) => ingredient.name)
      );

      const filteredIngredients = allIngredients.filter((item) => !userItems.includes(item));
      setShoppingList((prevList) => [...new Set([...prevList, ...filteredIngredients])]);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  const toggleFavorite = (recipe) => {
    const updatedFavorites = favorites.some((fav) => fav.id === recipe.id)
      ? favorites.filter((fav) => fav.id !== recipe.id)
      : [...favorites, recipe];

    setFavorites(updatedFavorites);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
  };

  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  const handleCardClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  const handleSelectRecipe = (id) => {
    setSelectedRecipes((prev) =>
      prev.includes(id) ? prev.filter((recipeId) => recipeId !== id) : [...prev, id]
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
      {/* Top Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TextField
          label="Search Recipes"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "70%" }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <UserButton />
      </Box>

      {/* Recipe Results */}
      <Box>
        <Typography variant="h6">Recipes</Typography>
        <Grid container spacing={3}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card sx={{ display: "flex", flexDirection: "column", cursor: "pointer" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={recipe.image}
                  alt={recipe.title}
                  onClick={() => handleCardClick(recipe.id)}
                />
                <CardContent>
                  <Typography variant="h6">{recipe.title}</Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 1 }}>
                    <Checkbox
                      checked={selectedRecipes.includes(recipe.id)}
                      onChange={() => handleSelectRecipe(recipe.id)}
                    />
                    <IconButton onClick={() => toggleFavorite(recipe)}>
                      {isFavorite(recipe.id) ? <Favorite sx={{ color: "red" }} /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Shopping List */}
      <Box>
        <Typography variant="h6">Shopping List</Typography>
        <Button
          variant="contained"
          onClick={handleAddToShoppingList}
          disabled={selectedRecipes.length === 0}
          sx={{ marginBottom: 2 }}
        >
          Generate Shopping List
        </Button>
        <Box>
          {shoppingList.map((item, index) => (
            <Typography key={index} variant="body1">
              {item}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default RecipeList;