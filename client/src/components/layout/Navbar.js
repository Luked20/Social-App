import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Box } from '@mui/material';
import { Home, Notifications, Message } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#fff', color: '#333' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }}
        >
          CloneSocial
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="primary" component={Link} to="/">
              <Home />
            </IconButton>
            <IconButton color="primary">
              <Notifications />
            </IconButton>
            <IconButton color="primary">
              <Message />
            </IconButton>
            <IconButton
              component={Link}
              to={`/profile/${user.id}`}
              sx={{ padding: 0.5 }}
            >
              <Avatar
                src={user.profilePicture}
                alt={user.name}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              sx={{ ml: 2 }}
            >
              Sair
            </Button>
          </Box>
        ) : (
          <Box>
            <Button
              color="primary"
              component={Link}
              to="/login"
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/register"
            >
              Registrar
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 