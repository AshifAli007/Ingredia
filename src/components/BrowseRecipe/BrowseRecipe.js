import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    IconButton,
    Button,
    Drawer,
    Checkbox,
    FormControlLabel,
    FormControl,
    MenuItem,
    InputLabel,
    Select
} from '@mui/material';
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

const TIME_OPTIONS = [
    { label: 'Ready in < 5 min', value: 'under 5' },
    { label: 'Ready in < 15 min', value: 'under 15' },
    { label: 'Ready in < 30 minutes', value: 'under 30' },
    { label: 'Ready in < 60 minutes', value: 'under 60' },
    { label: 'Ready in 1-2 hours', value: '1-2 hours' },
    { label: 'Ready in 2-3 hours', value: '2-3 hours' },
    { label: 'Ready in 4+ hours', value: '4+ hours' },
];

const CALORIE_OPTIONS = [
    { label: 'Under 200 kcal', value: 'under 200' },
    { label: '200-500 kcal', value: '200-500' },
    { label: 'Over 500 kcal', value: 'over 500' },
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

    const [sortOption, setSortOption] = useState(''); // State for sorting


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
                                number: 8,
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
                                        includeNutrition: true,
                                        apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
                                    },
                                }
                            );
                            return {
                                ...recipe,
                                ...details.data,
                                nutrition: details.data.nutrition?.nutrients.find(n => n.name === 'Calories') || { amount: 0 }
                            }; // Merge basic and detailed data
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
    const clearAllFilters = () => {
        setFilters({ diet: [], cuisine: [], time: [], difficulty: [], calories: [] }); // Reset all filters
        setFilteredRecipes(recipes); // Reset filtered recipes to show all recipes
        setDrawerOpen(false); // Close the drawer
    };
    const handleSortChange = (option) => {
        setSortOption(option);

        const sortedRecipes = [...filteredRecipes]; // Clone the array to avoid mutating state
        if (option === 'caloriesLowToHigh') {
            sortedRecipes.sort((a, b) => (a.nutrition?.amount || 0) - (b.nutrition?.amount || 0));
        } else if (option === 'caloriesHighToLow') {
            sortedRecipes.sort((a, b) => (b.nutrition?.amount || 0) - (a.nutrition?.amount || 0));
        } else if (option === 'timeFastest') {
            sortedRecipes.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
        } else if (option === 'timeSlowest') {
            sortedRecipes.sort((a, b) => b.readyInMinutes - a.readyInMinutes);
        } else if (option === 'healthiest') {
            sortedRecipes.sort((a, b) => b.healthScore - a.healthScore);
        } else if (option === 'unhealthiest') {
            sortedRecipes.sort((a, b) => a.healthScore - b.healthScore);
        }

        setFilteredRecipes(sortedRecipes); // Update the filtered recipes
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

        // Diet filter
        if (filters.diet.length > 0) {
            filtered = filtered.filter((recipe) =>
                filters.diet.every((diet) => recipe.diets?.includes(diet.toLowerCase()))
            );
        }

        // Cuisine filter
        if (filters.cuisine.length > 0) {
            filtered = filtered.filter((recipe) =>
                recipe.cuisines.some((cuisine) => filters.cuisine.includes(cuisine))
            );
        }

        // Time filter
        if (filters.time.length > 0) {
            filtered = filtered.filter((recipe) =>
                filters.time.some((time) => {
                    const minutes = recipe.readyInMinutes;
                    if (time === 'under 5') return minutes <= 5;
                    if (time === 'under 15') return minutes <= 15;
                    if (time === 'under 30') return minutes <= 30;
                    if (time === 'under 60') return minutes <= 60;
                    if (time === '1-2 hours') return minutes > 60 && minutes <= 120;
                    if (time === '2-3 hours') return minutes > 120 && minutes <= 180;
                    if (time === '4+ hours') return minutes > 240;
                    return false;
                })
            );
        }

        // Calories filter
        if (filters.calories.length > 0) {
            console.log('here', filtered)
            filtered = filtered.filter((recipe) =>
                filters.calories.some((range) => {
                    console.log(recipe)
                    const calories = recipe.nutrition?.amount || 0;
                    if (range === 'under 200') return calories <= 200;
                    if (range === '200-500') return calories > 200 && calories <= 500;
                    if (range === 'over 500') return calories > 500;
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

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
                {/* Filter Buttons */}
                <Button variant="outlined" onClick={() => handleFilterClick('diet')}>Diet</Button>
                <Button variant="outlined" onClick={() => handleFilterClick('cuisine')}>Cuisine</Button>
                <Button variant="outlined" onClick={() => handleFilterClick('time')}>Time</Button>
                <Button variant="outlined" onClick={() => handleFilterClick('calories')}>Calories</Button>

                {/* Sorting Dropdown */}
                <FormControl style={{ minWidth: 120, marginLeft: '10px' }} size="small" variant="outlined">
                    <InputLabel htmlFor="sort-by-select">Sort By</InputLabel>
                    <Select
                        id="sort-by-select"
                        value={sortOption}
                        onChange={(e) => handleSortChange(e.target.value)}
                        label="Sort By"
                    >
                        <MenuItem value="caloriesLowToHigh">Calories: Low to High</MenuItem>
                        <MenuItem value="caloriesHighToLow">Calories: High to Low</MenuItem>
                        <MenuItem value="timeFastest">Time: Fastest</MenuItem>
                        <MenuItem value="timeSlowest">Time: Slowest</MenuItem>
                        <MenuItem value="healthiest">Healthiest</MenuItem>
                        <MenuItem value="unhealthiest">Unhealthiest</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <Drawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <div style={{ padding: '20px' }}>
                    <Typography variant="h6">{activeFilter} Filters</Typography>

                    {/* Diet Filters */}
                    {activeFilter === 'diet' && DIET_OPTIONS.map((diet) => (
                        <FormControlLabel
                            key={diet}
                            control={
                                <Checkbox
                                    checked={filters.diet.includes(diet)} // Show selected filters
                                    onChange={() => handleFilterChange('diet', diet)}
                                />
                            }
                            label={diet}
                        />
                    ))}

                    {/* Cuisine Filters */}
                    {activeFilter === 'cuisine' && CUISINE_OPTIONS.map((cuisine) => (
                        <FormControlLabel
                            key={cuisine}
                            control={
                                <Checkbox
                                    checked={filters.cuisine.includes(cuisine)} // Show selected filters
                                    onChange={() => handleFilterChange('cuisine', cuisine)}
                                />
                            }
                            label={cuisine}
                        />
                    ))}

                    {/* Time Filters */}
                    {activeFilter === 'time' && TIME_OPTIONS.map((time) => (
                        <FormControlLabel
                            key={time.value}
                            control={
                                <Checkbox
                                    checked={filters.time.includes(time.value)} // Show selected filters
                                    onChange={() => handleFilterChange('time', time.value)}
                                />
                            }
                            label={time.label}
                        />
                    ))}

                    {/* Calorie Filters */}
                    {activeFilter === 'calories' && CALORIE_OPTIONS.map((calorie) => (
                        <FormControlLabel
                            key={calorie.value}
                            control={
                                <Checkbox
                                    checked={filters.calories.includes(calorie.value)} // Show selected filters
                                    onChange={() => handleFilterChange('calories', calorie.value)}
                                />
                            }
                            label={calorie.label}
                        />
                    ))}

                    {/* Apply Filters Button */}
                    <Button
                        variant="contained"
                        onClick={applyFilters}
                        style={{ marginTop: '20px', marginRight: '10px' }}
                    >
                        Apply Filters
                    </Button>

                    {/* Clear All Filters Button */}
                    <Button
                        variant="outlined"
                        onClick={clearAllFilters}
                        style={{ marginTop: '20px' }}
                    >
                        Clear All Filters
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
                                        <strong>Calories:</strong> {recipe.nutrition?.amount || 'N/A'}
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