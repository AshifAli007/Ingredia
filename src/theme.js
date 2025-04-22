import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#D39738',
        },
        secondary: {
            main: '#fffghj',
        },
        text: {
            primary: '#2D2B2B',
            secondary: '#9D968B',
        },
        background: {
            default: '#ffda9e',
        },
    },
    typography: {
        fontFamily: 'Gatile, Arial, sans-serif',
        h1: {
            fontFamily: 'Gatile, serif',
        },
        h2: {
            fontFamily: 'Gatile, serif',
        },
        h3: {
            fontFamily: 'Gatile, serif',
        },
        h4: {
            fontFamily: 'Gatile, serif',
        },
        h5: {
            fontFamily: 'Gatile, serif',
        },
        h6: {
            fontFamily: 'Gatile, serif',
        },
        body1: {
            fontFamily: 'Gatile, sans-serif',
        },
        body2: {
            fontFamily: 'Gatile, sans-serif',
        },
        button: {
            fontFamily: 'Gatile, sans-serif',
        },
    },
});

export default theme;