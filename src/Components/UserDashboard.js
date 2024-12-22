import React from "react";
import { Link } from "react-router-dom";
import { Box, Container, Typography, Button, Paper } from "@mui/material";

function UserDashboard() {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#FDECEC' }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" color="primary" gutterBottom>
            Welcome to Your Dashboard!
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            We're glad to have you as part of our family! Here, you can access your information, explore the gallery, and manage your account with love and care.
          </Typography>

          {/* Family image from the public folder */}
          <img 
            src="/images/family_website.jpg"  // Image path in public/images
            alt="Family" 
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} 
          />
        </Box>

        {/* Feature sections */}
        <Box mb={4} textAlign="center">
          <Typography variant="h5" color="secondary" gutterBottom>
            Explore More Features
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Here you can find personalized content designed with you in mind. Let's make the most out of your experience together!
          </Typography>
          
          {/* Gallery link using Link from react-router-dom */}
          <Button
            variant="contained"
            color="secondary"
            sx={{ fontSize: '1rem', padding: '10px 20px', margin: '0 10px' }}
            component={Link}
            to="/gallery"
          >
            Visit the Gallery
          </Button>
        </Box>

        {/* Footer Section */}
        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="textSecondary">
            <strong>Our mission is to build a loving community. Thank you for being part of it!</strong>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default UserDashboard;
