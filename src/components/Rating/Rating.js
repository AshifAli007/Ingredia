import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Rating as MuiRating } from '@mui/material';

const Rating = ({ recipeId }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [username, setUsername] = useState('');
    const [reviews, setReviews] = useState(() => {
        // Retrieve existing reviews from localStorage
        return JSON.parse(localStorage.getItem(`reviews_${recipeId}`)) || [];
    });

    const handleSubmit = () => {
        if (rating === 0 || review.trim() === '' || username.trim() === '') {
            alert('Please provide a rating, a review, and your username.');
            return;
        }

        const newReview = {
            id: Date.now(),
            username,
            rating,
            review,
        };

        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        localStorage.setItem(`reviews_${recipeId}`, JSON.stringify(updatedReviews)); // Save to localStorage

        // Reset form
        setRating(0);
        setReview('');
        setUsername('');
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        return (totalRating / reviews.length).toFixed(1); // Average rating rounded to 1 decimal
    };

    return (
        <Box sx={{ marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Rate and Review
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <MuiRating
                    name="recipe-rating"
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                />
                <TextField
                    label="Your Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    variant="outlined"
                />
                <TextField
                    label="Write a review"
                    multiline
                    rows={3}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    variant="outlined"
                />
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
            <Typography variant="h6" gutterBottom>
                Overall Rating: {calculateAverageRating()} ({reviews.length} reviews)
            </Typography>
            <List>
                {reviews.length > 0 ? (
                    reviews.map((r) => (
                        <ListItem key={r.id} alignItems="flex-start">
                            <ListItemText
                                primary={`${r.username} - Rating: ${r.rating} stars`}
                                secondary={r.review}
                            />
                        </ListItem>
                    ))
                ) : (
                    <Typography>No reviews yet. Be the first to review!</Typography>
                )}
            </List>
        </Box>
    );
};

export default Rating;