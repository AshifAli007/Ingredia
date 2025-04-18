import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import Rating from '../Rating/Rating';

const Recipe = () => {
    const { id } = useParams(); // Extract the recipe ID from the URL
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        // Fetch recipe details using the recipe ID
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(
                    `https://api.spoonacular.com/recipes/${id}/information`,
                    {
                        params: {
                            apiKey: 'dda4f0b377a04cec9f8471c5ec912e4d', // Replace with your API key
                        },
                    }
                );
                setRecipe(response.data);
            } catch (error) {
                console.error('Error fetching recipe details:', error);
            }
        };

        fetchRecipe();
    }, [id]);

    if (!recipe) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ padding: '20px' }}>
            {/* Recipe Title and Background Image */}
            <Box
                sx={{
                    position: 'relative',
                    height: '300px',
                    backgroundImage: `url(${recipe.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: '20px',
                    color: '#fff',
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        padding: '10px 20px',
                        borderRadius: '5px',
                    }}
                >
                    {recipe.title}
                </Typography>
            </Box>

            {/* Instructions and Ingredients */}
            <Box sx={{ display: 'flex', marginTop: '20px' }}>
                {/* Instructions Section */}
                <Box sx={{ flex: 2, marginRight: '20px' }}>
                    <Typography variant="h5" gutterBottom>
                        Instructions
                    </Typography>
                    <List>
                        {recipe.analyzedInstructions.length > 0
                            ? recipe.analyzedInstructions[0].steps.map((step) => (
                                <ListItem key={step.number}>
                                    <ListItemText
                                        primary={`Step ${step.number}`}
                                        secondary={step.step}
                                    />
                                </ListItem>
                            ))
                            : 'No instructions available.'}
                    </List>
                </Box>

                {/* Ingredients Section */}
                <Box sx={{ flex: 1 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Ingredients
                            </Typography>
                            <List>
                                {recipe.extendedIngredients.map((ingredient) => (
                                    <ListItem key={ingredient.id}>
                                        <ListItemText
                                            primary={ingredient.original}
                                            secondary={`(${ingredient.amount} ${ingredient.unit})`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
            <Rating recipeId={id} />
        </Box>

    );
};

export default Recipe;