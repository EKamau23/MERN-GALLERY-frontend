import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Paper, Typography, Grid, TextField, Button, CircularProgress, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link component for navigation

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Centralized API base URL

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
  const [selectedUser, setSelectedUser] = useState({ id: "", newPassword: "" });
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Fetch users from the backend
  const fetchUsers = () => {
    axios
      .get(`${API_BASE_URL}/api/admin/users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users", error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add a new user
  const handleAddUser = () => {
    setIsLoading(true); // Start loading
    axios
      .post(`${API_BASE_URL}/api/admin/add-user`, newUser)
      .then((response) => {
        fetchUsers(); // Re-fetch users after adding a new user
        setNewUser({ username: "", email: "", password: "" }); // Reset the form
      })
      .catch((error) => {
        console.error("Error adding user", error);
      })
      .finally(() => {
        setIsLoading(false); // End loading
      });
  };

  // Delete a user
  const handleDeleteUser = (userId) => {
    axios
      .delete(`${API_BASE_URL}/api/admin/delete-user/${userId}`)
      .then(() => {
        setUsers(users.filter((user) => user._id !== userId)); // Remove deleted user from the list
      })
      .catch((error) => {
        console.error("Error deleting user", error);
      });
  };

  // Change user password
  const handleChangePassword = () => {
    axios
      .put(`${API_BASE_URL}/api/admin/change-password/${selectedUser.id}`, {
        password: selectedUser.newPassword,
      })
      .then(() => {
        setSelectedUser({ id: "", newPassword: "" }); // Reset the password fields
      })
      .catch((error) => {
        console.error("Error changing password", error);
      });
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Welcome to the admin dashboard! Manage users, view reports, and oversee system activity here.
        </Typography>

        {/* Link to Gallery */}
        <Typography variant="h6" color="secondary" gutterBottom>
          <Link to="/gallery" style={{ textDecoration: "none", color: "#1976d2" }}>
            Go to Gallery
          </Link>
        </Typography>

        {/* Display users */}
        <Typography variant="h5" color="secondary" gutterBottom>
          Manage Users
        </Typography>
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card sx={{ padding: 2 }}>
                <CardContent>
                  <Typography variant="h6">{user.username}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user.email}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteUser(user._id)}
                    sx={{ marginTop: 2 }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => setSelectedUser({ ...selectedUser, id: user._id })}
                    sx={{ marginTop: 2, marginLeft: 1 }}
                  >
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add new user */}
        <Typography variant="h5" color="secondary" gutterBottom sx={{ marginTop: 4 }}>
          Add New User
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUser}
          sx={{ marginTop: 2 }}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {isLoading ? "Adding..." : "Add User"}
        </Button>

        {/* Change user password */}
        {selectedUser.id && (
          <Paper elevation={2} sx={{ padding: 4, marginTop: 4 }}>
            <Typography variant="h5" color="secondary" gutterBottom>
              Change Password
            </Typography>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={selectedUser.newPassword}
              onChange={(e) => setSelectedUser({ ...selectedUser, newPassword: e.target.value })}
              variant="outlined"
            />
            <Button
              variant="contained"
              color="secondary"
              sx={{ marginTop: 2 }}
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </Paper>
        )}
      </Paper>
    </Container>
  );
}

export default AdminDashboard;
