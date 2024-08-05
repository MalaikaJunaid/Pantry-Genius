import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { UserAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, googleSignIn, logOut } = UserAuth();
    const [loading, setLoading] = useState(true);

    const handleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);
        }
    }

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setLoading(false);
        }
        checkAuthentication();
    }, [user]);

    return (
        <AppBar position="static" sx={{ backgroundColor: '#325F7D' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, color: '#FFFFFF' }}>
                    Pantry Genius
                </Typography>
                {loading ? null : !user ? (
                    <>
                        <Button 
                            color="inherit" 
                            sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: '#1e3a59' } }} 
                            onClick={handleSignIn}
                        >
                            Login
                        </Button>
                        <Button 
                            color="inherit" 
                            sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: '#1e3a59' } }} 
                            onClick={handleSignIn}
                        >
                            Signup
                        </Button>
                    </>
                ) : (
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" sx={{ marginRight: 2, color: '#FFFFFF' }}>
                            Welcome, {user.displayName}!
                        </Typography>
                        <Button 
                            color="inherit" 
                            sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: '#1e3a59' } }} 
                            onClick={handleSignOut}
                        >
                            Logout
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
