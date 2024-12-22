import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username,
      email,
      password,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, payload);
      console.log(response.data);
      toast.success('Registration successful!', {
        position: "top-center",
      });
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Error during registration:', error.response ? error.response.data : error.message);
      toast.error('Registration failed. Please try again.', {
        position: "top-center",
      });
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
      <ToastContainer />
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
          Join Us Today!
        </Typography>
        <Typography variant="body1" textAlign="center" mb={3}>
          Create your account to get started.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
              mt: 3,
              bgcolor: '#ff6f61',
              '&:hover': { bgcolor: '#e65c50' },
            }}
          >
            Register
          </Button>
        </form>
        <Typography variant="body2" textAlign="center" mt={2}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#ff6f61', textDecoration: 'none' }}>
            Login here
          </Link>
        </Typography>
      </AnimatedBox>
    </Box>
  );
};

export default Register;
