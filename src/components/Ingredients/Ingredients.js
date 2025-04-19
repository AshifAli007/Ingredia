import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Grid, Card, CardContent, CardActions, Accordion, AccordionSummary, AccordionDetails, Popover, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { gsap } from 'gsap';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react'; // Import Clerk's useUser hook
import ingredientsData from '../../Assets/Img/ingredients.json'; // Import the JSON file

const Ingredients = () => {
    const { user } = useUser(); // Get the current user
    const userId = user?.id; // Retrieve the userId from Clerk

    // Initialize selectedIngredients from localStorage if it exists
    const [selectedIngredients, setSelectedIngredients] = useState(() => {
        if (userId) {
            const savedIngredients = localStorage.getItem(`ingredients_${userId}`);
            return savedIngredients ? JSON.parse(savedIngredients) : [];
        }
        return [];
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [availableIngredients] = useState(
        Object.entries(ingredientsData).map(([category, items]) => ({
            category,
            items,
        }))
    ); // Static ingredients remain constant
    const [searchResults, setSearchResults] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    const searchBoxRef = useRef(null); // Ref for the search box

    // Save ingredients to localStorage whenever selectedIngredients changes
    useEffect(() => {
        if (userId) {
            localStorage.setItem(`ingredients_${userId}`, JSON.stringify(selectedIngredients));
        }
    }, [selectedIngredients, userId]);

    // Debounce search term to avoid excessive API calls
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim()) {
                fetchIngredientsFromAPI(searchTerm);
                setAnchorEl(searchBoxRef.current); // Bind the popover to the search box
            } else {
                setSearchResults([]); // Clear search results if search term is empty
                setAnchorEl(null); // Close the popover
            }
        }, 1000); // 1 second debounce

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchIngredientsFromAPI = async (query) => {
        try {
            const response = await axios.get(
                'https://api.spoonacular.com/food/ingredients/autocomplete',
                {
                    params: {
                        query,
                        number: 10, // Limit results to 10
                        apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY, // Replace with your API key
                    },
                }
            );
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching ingredients from Spoonacular API:', error);
        }
    };
    const handleRemoveIngredient = (ingredient) => {
        setSelectedIngredients((prev) => prev.filter((item) => item !== ingredient));

        // Update localStorage
        if (userId) {
            const updatedIngredients = selectedIngredients.filter((item) => item !== ingredient);
            localStorage.setItem(`ingredients_${userId}`, JSON.stringify(updatedIngredients));
        }
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Update the search term
    };

    const handleAddIngredient = (ingredient) => {
        if (!selectedIngredients.includes(ingredient)) {
            setSelectedIngredients((prev) => [...prev, ingredient]);

            // GSAP animation
            const element = document.getElementById(`ingredient-${ingredient}`);
            gsap.fromTo(
                element,
                { opacity: 0, x: -100 },
                { opacity: 1, x: 0, duration: 0.5 }
            );
        }
        setSearchTerm(''); // Clear search term
        setSearchResults([]); // Clear search results
        setAnchorEl(null); // Close the popover
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', padding: 4 }}>
            {/* Left Section: Available Ingredients */}
            <Box sx={{ flex: 1, marginRight: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Choose Ingredients
                </Typography>
                <TextField
                    id="search-box"
                    fullWidth
                    variant="outlined"
                    placeholder="Search ingredients..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    inputRef={searchBoxRef} // Attach the ref to the TextField
                    sx={{ marginBottom: 2 }}
                />
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <List>
                        {searchResults.map((result) => (
                            <ListItem
                                button
                                key={result.name}
                                onClick={() => handleAddIngredient(result.name)}
                            >
                                <ListItemText primary={result.name} />
                            </ListItem>
                        ))}
                    </List>
                </Popover>
                {availableIngredients.map(({ category, items }) => (
                    <Accordion key={category}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">{category.replace(/_/g, ' ')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {items.map((ingredient) => (
                                    <Grid item xs={6} sm={4} md={3} key={ingredient}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="body1">{ingredient}</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleAddIngredient(ingredient)}
                                                >
                                                    Add
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            {/* Right Section: Selected Ingredients */}
            <Box sx={{ flex: 1, marginLeft: 2 }}>
                <Typography variant="h5" gutterBottom>
                    My Ingredients
                </Typography>
                <Grid container spacing={2}>
                    {selectedIngredients.map((ingredient) => (
                        <Grid item xs={6} sm={4} md={3} key={ingredient}>
                            <Card id={`ingredient-${ingredient}`}>
                                <CardContent>
                                    <Typography variant="body1">{ingredient}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleRemoveIngredient(ingredient)}
                                    >
                                        Remove
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default Ingredients;