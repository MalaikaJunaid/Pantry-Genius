// pages/LandingPage.js
import { useRouter } from 'next/router';
import { Box, Typography, Button, Container, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { UserAuth } from '@/context/AuthContext'; // Adjust the import path as needed

const LandingContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  backgroundColor: '#325F7D',
});

const Title = styled(Typography)({
  fontSize: '3rem',
  fontWeight: 'bold',
  color: '#FFFFFF', // White text
  marginBottom: '1rem',
});

const SubTitle = styled(Typography)({
  fontSize: '1.5rem',
  color: '#FFFFFF', // White text
  marginBottom: '2rem',
});

const StartButton = styled(Button)({
  fontSize: '1rem',
  padding: '0.75rem 2rem',
  backgroundColor: '#FFFFFF', // White button
  color: '#325F7D', // Deep blue text
  '&:hover': {
    backgroundColor: '#e0e0e0', // Light gray on hover
  },
});

const LandingPage = () => {
  const router = useRouter();
  const { user } = UserAuth();

  useEffect(() => {
    if (user) {
      router.push('/page'); // Redirect to the main page if the user is logged in
    }
  }, [user, router]);

  const handleGetStarted = () => {
    // If the user is not logged in, redirect to the login page
    if (!user) {
      router.push('/login');
    } else {
      router.push('/page');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#325F7D', height: '100vh' }}>
      <CssBaseline />
      <LandingContainer>
        <Title>PantryGenius</Title>
        <SubTitle>Welcome to your ultimate pantry management system</SubTitle>
        <StartButton onClick={handleGetStarted}>Get Started</StartButton>
      </LandingContainer>
    </Box>
  );
};

export default Home;
