import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardMedia, Typography, Grid, IconButton } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SavedRecipes = () => {
    const { user } = useUser();
    const userId = user?.id;

    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        if (userId) {
            const recipes = JSON.parse(localStorage.getItem(`savedRecipes_${userId}`)) || [];
            setSavedRecipes(recipes);
        }
    }, [userId]);

    const navigate = useNavigate();

    const handleCardClick = (id) => {
        navigate(`/recipe/${id}`);
    };

    const removeRecipe = (id) => {
        const updatedRecipes = savedRecipes.filter((recipe) => recipe.id !== id);
        setSavedRecipes(updatedRecipes);
        localStorage.setItem(`savedRecipes_${userId}`, JSON.stringify(updatedRecipes)); // Update localStorage
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Saved Recipes
            </Typography>
            {savedRecipes.length > 0 ? (
                <Grid container spacing={3}>
                    {savedRecipes.map((recipe) => (
                        <Grid item xs={12} key={recipe.id}>
                            <Card
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    marginBottom: '20px',
                                    cursor: 'pointer',
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                                    image={recipe.image}
                                    alt={recipe.title}
                                    onClick={() => handleCardClick(recipe.id)} // Navigate on image click
                                />
                                <CardContent style={{ flex: 1 }}>
                                    <Typography variant="h6" component="div">
                                        {recipe.title}
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
                                    onClick={() => removeRecipe(recipe.id)} // Remove recipe on heart click
                                >
                                    <Favorite style={{ color: 'red' }} />
                                </IconButton>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography>No saved recipes found. Start saving your favorite recipes!</Typography>
            )}
        </div>
    );
};

export default SavedRecipes;