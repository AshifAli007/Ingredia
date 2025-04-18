import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardMedia, Typography, Grid, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material'; // Import heart icons
import { useNavigate } from 'react-router-dom';

const BrowseRecipe = () => {
    const { user } = useUser();
    const userId = user?.id;

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedRecipes, setSavedRecipes] = useState(() => {
        // Retrieve saved recipes from localStorage
        return JSON.parse(localStorage.getItem(`savedRecipes_${userId}`)) || [];
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) return;

        const ingredients = JSON.parse(localStorage.getItem(`ingredients_${userId}`)) || [];

        if (ingredients.length > 0) {
            const fetchRecipes = async () => {
                try {
                    const response = await axios.get(
                        `https://api.spoonacular.com/recipes/findByIngredients`,
                        {
                            params: {
                                ingredients: ingredients.join(','),
                                ranking: 1,
                                ignorePantry: true,
                                sort: "max-used-ingredients",
                                number: 10,
                                apiKey: 'dda4f0b377a04cec9f8471c5ec912e4d',
                            },
                        }
                    );
                    setRecipes(response.data);
                } catch (error) {
                    console.error('Error fetching recipes:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchRecipes();
        } else {
            setLoading(false);
        }
    }, [userId]);

    const handleCardClick = (id) => {
        navigate(`/recipe/${id}`);
    };

    const toggleSaveRecipe = (recipe) => {
        const updatedSavedRecipes = savedRecipes.some((saved) => saved.id === recipe.id)
            ? savedRecipes.filter((saved) => saved.id !== recipe.id) // Remove if already saved
            : [...savedRecipes, recipe]; // Add if not saved

        setSavedRecipes(updatedSavedRecipes);
        localStorage.setItem(`savedRecipes_${userId}`, JSON.stringify(updatedSavedRecipes)); // Save to localStorage
    };

    const isRecipeSaved = (id) => {
        return savedRecipes.some((saved) => saved.id === id);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Discover Recipes
            </Typography>
            {loading ? (
                <Typography>Loading recipes...</Typography>
            ) : recipes.length > 0 ? (
                <Grid container spacing={3}>
                    {recipes.map((recipe) => (
                        <Grid item xs={12} key={recipe.id}>
                            <Card
                                style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px', cursor: 'pointer' }}
                                onClick={() => handleCardClick(recipe.id)} // Navigate on card click
                            >
                                <CardMedia
                                    component="img"
                                    style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                                    image={recipe.image}
                                    alt={recipe.title}
                                />
                                <CardContent style={{ flex: 1 }}>
                                    <Typography variant="h6" component="div">
                                        {recipe.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                                        {recipe.summary || 'No description available.'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                                        <strong>Calories:</strong> {recipe.nutrition?.calories || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                                        <strong>Time to Cook:</strong> {recipe.readyInMinutes} mins
                                    </Typography>
                                </CardContent>
                                <IconButton
                                    style={{ alignSelf: 'center', marginRight: '10px' }}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent navigation when clicking the save button
                                        toggleSaveRecipe(recipe);
                                    }}
                                >
                                    {isRecipeSaved(recipe.id) ? (
                                        <Favorite style={{ color: 'red' }} />
                                    ) : (
                                        <FavoriteBorder />
                                    )}
                                </IconButton>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography>No recipes found. Add ingredients to your list!</Typography>
            )}
        </div>
    );
};

export default BrowseRecipe;