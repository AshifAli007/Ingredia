import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react'; // Import Clerk's useUser hook
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

const BrowseRecipe = () => {
    const { user } = useUser(); // Get the current user
    const userId = user?.id; // Retrieve the userId from Clerk

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        if (!userId) return; // Ensure userId is available

        // Get ingredients from localStorage for the current user
        const ingredients = JSON.parse(localStorage.getItem(`ingredients_${userId}`)) || [];

        if (ingredients.length > 0) {
            // Call Spoonacular API
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
                                number: 10, // Number of recipes to fetch
                                apiKey: 'dda4f0b377a04cec9f8471c5ec912e4d', // Replace with your API key
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
        navigate(`/recipe/${id}`); // Redirect to the recipe details page
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
                                onClick={() => handleCardClick(recipe.id)} // Add click handler
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