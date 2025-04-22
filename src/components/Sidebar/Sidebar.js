import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react'; // Import Clerk components
import DashboardIcon from '@mui/icons-material/Dashboard';
import KitchenIcon from '@mui/icons-material/Kitchen';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import './Sidebar.css';

const Sidebar = () => {
    const { user } = useUser(); // Get user data from Clerk
    const fullName = user?.fullName || 'Guest'; // Fallback to 'Guest' if no user is logged in

    const activeStyle = {
        color: 'rgb(228, 149, 0)', // Active text color
        borderRight: '4px solid rgb(228, 149, 0)', // Active strip on the right
        backgroundColor: '#f5f5f5', // Slight background highlight
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between', // Ensures bottom alignment
                },
            }}
        >
            <div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
                    <img
                        src="/logo.png"
                        alt="Logo"
                        style={{ width: '40px', height: '40px', marginRight: '20px' }}
                    />
                    <Typography variant="h6" color="textSecondary" className="ingredia-text">
                        I<span className="ingredia-n">N</span>GREDIA
                    </Typography>
                </div>
                <List>
                    <NavLink to="/" style={{ textDecoration: 'none' }}>
                        {({ isActive }) => (
                            <ListItem
                                button
                                style={
                                    isActive
                                        ? {
                                            color: 'orange', // Active text color
                                            borderRight: '4px solid orange', // Active strip on the right
                                            backgroundColor: '#f5f5f5', // Active background
                                        }
                                        : {
                                            color: '#4caf50', // Default text color
                                        }
                                }
                            >
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItem>
                        )}
                    </NavLink>
                    <NavLink to="/ingredients" style={{ textDecoration: 'none' }}>
                        {({ isActive }) => (
                            <ListItem
                                button
                                style={
                                    isActive
                                        ? {
                                            color: 'orange',
                                            borderRight: '4px solid orange',
                                            backgroundColor: '#f5f5f5',
                                        }
                                        : {
                                            color: '#4caf50',
                                        }
                                }
                            >
                                <ListItemIcon>
                                    <KitchenIcon />
                                </ListItemIcon>
                                <ListItemText primary="Your ingredients" />
                            </ListItem>
                        )}
                    </NavLink>
                    <NavLink to="/browse-recipe" style={{ textDecoration: 'none' }}>
                        {({ isActive }) => (
                            <ListItem
                                button
                                style={
                                    isActive
                                        ? {
                                            color: 'orange',
                                            borderRight: '4px solid orange',
                                            backgroundColor: '#f5f5f5',
                                        }
                                        : {
                                            color: '#4caf50',
                                        }
                                }
                            >
                                <ListItemIcon>
                                    <MenuBookIcon />
                                </ListItemIcon>
                                <ListItemText primary="Browse Recipe" />
                            </ListItem>
                        )}
                    </NavLink>
                    <NavLink to="/saved-recipes" style={{ textDecoration: 'none' }}>
                        {({ isActive }) => (
                            <ListItem
                                button
                                style={
                                    isActive
                                        ? {
                                            color: 'orange',
                                            borderRight: '4px solid orange',
                                            backgroundColor: '#f5f5f5',
                                        }
                                        : {
                                            color: '#4caf50',
                                        }
                                }
                            >
                                <ListItemIcon>
                                    <BookmarkIcon />
                                </ListItemIcon>
                                <ListItemText primary="Saved Recipe" />
                            </ListItem>
                        )}
                    </NavLink>
                </List>
            </div>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    borderTop: '1px solid #ddd', // Optional: separates the bottom section
                }}
            >
                <UserButton />
                <Typography variant="body1" sx={{ marginLeft: '16px', color: '#4caf50' }}>
                    {fullName}
                </Typography>
            </Box>
        </Drawer>
    );
};

export default Sidebar;