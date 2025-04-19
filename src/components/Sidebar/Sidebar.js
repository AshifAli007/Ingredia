import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KitchenIcon from '@mui/icons-material/Kitchen';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const Sidebar = () => {
    const activeStyle = {
        color: '#4caf50', // Active text color
        borderRight: '4px solid #4caf50', // Active strip on the right
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
                },
            }}
        >
            <div style={{ padding: '16px' }}>
                <Typography variant="h6" color="textSecondary">
                    MENU BAR
                </Typography>
            </div>
            <List>
                <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                    <ListItem button>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                </NavLink>
                <NavLink to="/ingredients" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                    <ListItem button>
                        <ListItemIcon>
                            <KitchenIcon />
                        </ListItemIcon>
                        <ListItemText primary="Your ingredients" />
                    </ListItem>
                </NavLink>
                <NavLink to="/browse-recipe" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                    <ListItem button>
                        <ListItemIcon>
                            <MenuBookIcon />
                        </ListItemIcon>
                        <ListItemText primary="Browse Recipe" />
                    </ListItem>
                </NavLink>
                <NavLink to="/saved-recipes" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                    <ListItem button>
                        <ListItemIcon>
                            <BookmarkIcon />
                        </ListItemIcon>
                        <ListItemText primary="Saved Recipe" />
                    </ListItem>
                </NavLink>
            </List>
        </Drawer>
    );
};

export default Sidebar;