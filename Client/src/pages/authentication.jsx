import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext'; // Check this path, might be ../contexts/AuthContext.jsx
import { Snackbar } from '@mui/material';

// Use the default theme
const defaultTheme = createTheme();

export default function Authentication() {

    const [username, setUsername] = React.useState(""); // Initialize as empty string
    const [password, setPassword] = React.useState(""); // Initialize as empty string
    const [name, setName] = React.useState("");       // Initialize as empty string
    const [error, setError] = React.useState();
    const [message, setMessage] = React.useState();

    const [formState, setFormState] = React.useState(0); // 0 for Sign In, 1 for Sign Up
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) { // Login
                await handleLogin(username, password);
                // Navigation is handled inside handleLogin
            }
            if (formState === 1) { // Register
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("");
                setFormState(0); // Switch back to login form
                setPassword("");
                setName("");     // Clear name field
            }
        } catch (err) {
            console.log(err);
            let message = (err.response?.data?.message) || "An unexpected error occurred.";
            setError(message);
        }
    };

    // Handle Snackbar close
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        // Using a dynamic image from unsplash for a clean look
                        backgroundImage: 'url(https://source.unsplash.com/random?abstract,pattern)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            fontFamily: "'Poppins', sans-serif" // Apply theme font
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: '#6a11cb' }}> {/* Use purple accent color */}
                            <LockOutlinedIcon />
                        </Avatar>
                        
                        {/* Tab-like Toggle Buttons */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', mb: 3 }}>
                            <Button 
                                variant="text"
                                onClick={() => { setFormState(0); setError(""); }}
                                sx={{ 
                                    mr: 1,
                                    fontWeight: formState === 0 ? 700 : 400,
                                    color: formState === 0 ? '#6a11cb' : 'text.secondary',
                                    borderBottom: formState === 0 ? '3px solid #6a11cb' : '3px solid transparent',
                                    borderRadius: 0,
                                    pb: 1,
                                    fontFamily: "'Poppins', sans-serif",
                                    textTransform: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                Sign In
                            </Button>
                            <Button 
                                variant="text"
                                onClick={() => { setFormState(1); setError(""); }}
                                sx={{ 
                                    fontWeight: formState === 1 ? 700 : 400,
                                    color: formState === 1 ? '#6a11cb' : 'text.secondary',
                                    borderBottom: formState === 1 ? '3px solid #6a11cb' : '3px solid transparent',
                                    borderRadius: 0,
                                    pb: 1,
                                    fontFamily: "'Poppins', sans-serif",
                                    textTransform: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>

                        <Typography component="h1" variant="h5" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, mb: 1 }}>
                            {formState === 0 ? "Welcome Back" : "Create Account"}
                        </Typography>

                        <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
                            {formState === 1 && ( // Only show Name field for Sign Up
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    value={name}
                                    autoFocus
                                    onChange={(e) => setName(e.target.value)}
                                />
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus={formState === 0} // Autofocus on username if signing in
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                            />

                            {/* Display Error Message */}
                            {error && (
                                <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                                    {error}
                                </Typography>
                            )}

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                // This will pick up the global styles from index.css
                                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }} 
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Sign In" : "Register"}
                            </Button>

                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Success Message Snackbar */}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                message={message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </ThemeProvider>
    );
}