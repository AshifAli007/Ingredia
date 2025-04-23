import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { TextField, Button, Box, Typography, Grid, Card, CardContent, CardMedia, Checkbox, IconButton } from "@mui/material";
import { Favorite, FavoriteBorder, FileCopy, Download } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const RecipeList = () => {
  const { user } = useUser();
  const userId = user?.id;
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [userItems] = useState(["salt", "sugar"]); // Example of items user already has
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem(`favorites_${userId}`)) || []);

  // Fetch 5 random popular recipes on page load
  useEffect(() => {
    const fetchRandomRecipes = async () => {
      try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/random`, {
          params: {
            number: 3,
            apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
          },
        });
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error("Error fetching random recipes:", error);
      }
    };
    fetchRandomRecipes();
  }, []);

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

  const handleSelectRecipe = async (id) => {
    if (selectedRecipes.includes(id)) {
      // Remove recipe from selected list
      setSelectedRecipes((prev) => prev.filter((recipeId) => recipeId !== id));
      const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/ingredientWidget.json`, {
        params: {
          apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
        },
      });
      const ingredients = response.data.ingredients.map((ingredient) => ingredient.name);
      setShoppingList((prevList) => prevList.filter((item) => !ingredients.includes(item)));
    } else {
      // Add recipe to selected list
      setSelectedRecipes((prev) => [...prev, id]);
      try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/ingredientWidget.json`, {
          params: {
            apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
          },
        });
        const ingredients = response.data.ingredients.map((ingredient) => ingredient.name);
        const filteredIngredients = ingredients.filter((item) => !userItems.includes(item));
        setShoppingList((prevList) => [...new Set([...prevList, ...filteredIngredients])]);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    }
  };

  const handleCheckItem = (item) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((checkedItem) => checkedItem !== item) : [...prev, item]
    );
  };

  const handleCopyToClipboard = () => {
    const uncheckedItems = shoppingList.filter((item) => !checkedItems.includes(item));
    navigator.clipboard.writeText(uncheckedItems.join("\n"));
    alert("Unchecked items copied to clipboard!");
  };

  const handleDownloadAsText = () => {
    const uncheckedItems = shoppingList.filter((item) => !checkedItems.includes(item));
    const blob = new Blob([uncheckedItems.join("\n")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "shopping_list.txt";
    link.click();
  };

  const handleDownloadAsPDF = () => {
    const uncheckedItems = shoppingList.filter((item) => !checkedItems.includes(item));
    const doc = new jsPDF();
    doc.text("Shopping List", 10, 10);
    uncheckedItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item}`, 10, 20 + index * 10);
    });
    doc.save("shopping_list.pdf");
  };
  const toggleFavorite = (recipe) => {
    const updatedFavorites = favorites.some((fav) => fav.id === recipe.id)
      ? favorites.filter((fav) => fav.id !== recipe.id) // Remove from favorites
      : [...favorites, recipe]; // Add to favorites

    setFavorites(updatedFavorites);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites)); // Persist favorites in localStorage
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Left Section: Recipes */}
      <Box sx={{ flex: 7, overflowY: "auto", padding: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
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

        </Box>
        <Typography variant="h6">Popular Recipes</Typography>
        <Grid container spacing={3}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card sx={{ display: "flex", flexDirection: "column", cursor: "pointer" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={recipe.image}
                  alt={recipe.title}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                />
                <CardContent>
                  <Typography variant="h6">{recipe.title}</Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 1 }}>
                    <Checkbox
                      checked={selectedRecipes.includes(recipe.id)}
                      onChange={() => handleSelectRecipe(recipe.id)}
                    />
                    <IconButton onClick={() => toggleFavorite(recipe)}>
                      {favorites.some((fav) => fav.id === recipe.id) ? (
                        <Favorite sx={{ color: "red" }} />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Right Section: Shopping List */}
      <Box sx={{ flex: 3, overflowY: "auto", padding: 2, borderLeft: "1px solid #ccc" }}>
        <Typography variant="h6">Shopping List</Typography>
        {shoppingList.length === 0 ? (
          <Typography variant="body1" sx={{ color: "#aaa", marginTop: 2 }}>
            Select items to generate shopping list
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {shoppingList.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                >
                  <Checkbox
                    checked={checkedItems.includes(item)}
                    onChange={() => handleCheckItem(item)}
                  />
                  <Typography variant="body1">{item}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
        <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
          <Button variant="contained" startIcon={<FileCopy />} onClick={handleCopyToClipboard}>
            Copy
          </Button>
          <Button variant="contained" startIcon={<Download />} onClick={handleDownloadAsText}>
            .TXT
          </Button>
          <Button variant="contained" startIcon={<Download />} onClick={handleDownloadAsPDF}>
            .PDF
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RecipeList;