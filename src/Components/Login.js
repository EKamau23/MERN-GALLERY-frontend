import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';

// Get API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AnimatedBox = styled(Box)`
  animation: fadeIn 1s ease-in-out;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.role);

      if (user.role === 'admin') navigate('/admin-dashboard');
      else if (user.role === 'user') navigate('/user-dashboard');
    } catch (error) {
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
        padding: 2,
      }}
    >
      <AnimatedBox
        sx={{
          maxWidth: 400,
          width: '100%',
          padding: 4,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          textAlign="center"
          mb={2}
          sx={{ color: '#ff6f61', fontWeight: 'bold' }}
        >
          Welcome Back!
        </Typography>
        <Typography variant="body1" textAlign="center" mb={3}>
          Please login to access your account.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              bgcolor: '#ff6f61',
              '&:hover': { bgcolor: '#e65c50' },
            }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" textAlign="center" mt={2}>
          Not a registered user?{' '}
          <Link to="/register" style={{ color: '#ff6f61', textDecoration: 'none' }}>
            Register here
          </Link>
        </Typography>
      </AnimatedBox>
    </Box>
  );
};

export default Login;
