import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardMedia, Typography, Grid, IconButton, Button, Drawer, Checkbox, FormControlLabel } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CUISINE_OPTIONS = [
    'African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 'European', 'French',
    'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean',
    'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'
];

const DIET_OPTIONS = [
    'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian', 'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo',
    'Primal', 'Low FODMAP', 'Whole30'
];

const BrowseRecipe = () => {
    const { user } = useUser();
    const userId = user?.id;

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedRecipes, setSavedRecipes] = useState(() => JSON.parse(localStorage.getItem(`savedRecipes_${userId}`)) || []);
    const [filters, setFilters] = useState({ diet: [], cuisine: [], time: [], difficulty: [], calories: [] });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState([]);

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
                                number: 2,
                                apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
                            },
                        }
                    );

                    // Fetch detailed information for each recipe
                    const detailedRecipes = await Promise.all(
                        response.data.map(async (recipe) => {
                            const details = await axios.get(
                                `https://api.spoonacular.com/recipes/${recipe.id}/information`,
                                {
                                    params: {
                                        includeNutrition: false,
                                        apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
                                    },
                                }
                            );
                            return { ...recipe, ...details.data }; // Merge basic and detailed data
                        })
                    );

                    setRecipes(detailedRecipes);
                    setFilteredRecipes(detailedRecipes); // Initialize filtered recipes
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
            ? savedRecipes.filter((saved) => saved.id !== recipe.id)
            : [...savedRecipes, recipe];

        setSavedRecipes(updatedSavedRecipes);
        localStorage.setItem(`savedRecipes_${userId}`, JSON.stringify(updatedSavedRecipes));
    };

    const isRecipeSaved = (id) => savedRecipes.some((saved) => saved.id === id);

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        setDrawerOpen(true);
    };

    const applyFilters = () => {
        let filtered = recipes;

        if (filters.diet.length > 0) {
            filtered = filtered.filter((recipe) =>
                filters.diet.every((diet) => recipe.diets?.includes(diet.toLowerCase()))
            );
        }

        if (filters.cuisine.length > 0) {
            filtered = filtered.filter((recipe) =>
                recipe.cuisines.some((cuisine) => filters.cuisine.includes(cuisine))
            );
        }

        if (filters.time.length > 0) {
            filtered = filtered.filter((recipe) =>
                filters.time.some((time) => {
                    if (time === 'under 15') return recipe.readyInMinutes <= 15;
                    if (time === '15-30') return recipe.readyInMinutes > 15 && recipe.readyInMinutes <= 30;
                    if (time === '30+') return recipe.readyInMinutes > 30;
                    return false;
                })
            );
        }

        if (filters.calories.length > 0) {
            filtered = filtered.filter((recipe) =>
                filters.calories.some((range) => {
                    const calories = recipe.nutrition?.calories || 0;
                    if (range === 'under 200') return calories <= 200;
                    if (range === '200-500') return calories > 200 && calories <= 500;
                    if (range === '500+') return calories > 500;
                    return false;
                })
            );
        }

        setFilteredRecipes(filtered);
        setDrawerOpen(false);
    };

    const handleFilterChange = (filterCategory, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterCategory]: prev[filterCategory].includes(value)
                ? prev[filterCategory].filter((item) => item !== value)
                : [...prev[filterCategory], value],
        }));
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Discover Recipes
            </Typography>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <Button variant="outlined" onClick={() => handleFilterClick('diet')}>Diet</Button>
                <Button variant="outlined" onClick={() => handleFilterClick('cuisine')}>Cuisine</Button>
                <Button variant="outlined" onClick={() => handleFilterClick('time')}>Time</Button>
                <Button variant="outlined" onClick={() => handleFilterClick('calories')}>Calories</Button>
            </div>

            {/* Drawer for Filters */}
            <Drawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <div style={{ padding: '20px' }}>
                    <Typography variant="h6">{activeFilter} Filters</Typography>
                    {activeFilter === 'diet' && DIET_OPTIONS.map((diet) => (
                        <FormControlLabel
                            key={diet}
                            control={<Checkbox onChange={() => handleFilterChange('diet', diet)} />}
                            label={diet}
                        />
                    ))}
                    {activeFilter === 'cuisine' && CUISINE_OPTIONS.map((cuisine) => (
                        <FormControlLabel
                            key={cuisine}
                            control={<Checkbox onChange={() => handleFilterChange('cuisine', cuisine)} />}
                            label={cuisine}
                        />
                    ))}
                    <Button variant="contained" onClick={applyFilters} style={{ marginTop: '20px' }}>
                        Apply Filters
                    </Button>
                </div>
            </Drawer>

            {loading ? (
                <Typography>Loading recipes...</Typography>
            ) : filteredRecipes.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredRecipes.map((recipe) => (
                        <Grid item xs={12} key={recipe.id}>
                            <Card
                                style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px', cursor: 'pointer' }}
                                onClick={() => handleCardClick(recipe.id)}
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
                                        <strong>Calories:</strong> {recipe.nutrition?.calories || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                                        <strong>Time to Cook:</strong> {recipe.readyInMinutes} mins
                                    </Typography>
                                </CardContent>
                                <IconButton
                                    style={{ alignSelf: 'center', marginRight: '10px' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
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