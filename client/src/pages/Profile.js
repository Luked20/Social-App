import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  Tabs,
  Tab,
  styled,
} from '@mui/material';
import { Edit, GridView, BookmarkBorder } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Post from '../components/Post';

// Componentes estilizados
const ProfileContainer = styled(Container)(({ theme }) => ({
  maxWidth: '935px',
  padding: '30px 20px 0',
  [theme.breakpoints.down('sm')]: {
    padding: '20px 10px 0',
  },
}));

const ProfileHeader = styled(Paper)(({ theme }) => ({
  padding: '40px 0',
  marginBottom: '44px',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  [theme.breakpoints.down('sm')]: {
    padding: '20px 0',
    marginBottom: '24px',
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: '150px',
  height: '150px',
  border: '2px solid #dbdbdb',
  [theme.breakpoints.down('sm')]: {
    width: '77px',
    height: '77px',
  },
}));

const ProfileStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '40px',
  marginBottom: '20px',
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
  },
}));

const ProfileBio = styled(Typography)(({ theme }) => ({
  marginBottom: '20px',
  whiteSpace: 'pre-line',
}));

const ProfileButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '5px 9px',
}));

const PostsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();
  const { userId } = useParams();

  useEffect(() => {
    loadProfile();
    loadUserPosts();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const response = await api.get(`/users/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const loadUserPosts = async () => {
    try {
      const response = await api.get(`/users/${userId}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Erro ao carregar posts do usuário:', error);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await api.post(`/users/follow/${userId}`);
      setProfile(prev => ({
        ...prev,
        followers: response.data.following
          ? [...prev.followers, user]
          : prev.followers.filter(f => f.id !== user.id)
      }));
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  if (!profile) {
    return null;
  }

  const isOwnProfile = user?.id === profile.id;
  const isFollowing = profile.followers?.some(f => f.id === user?.id) || false;

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <ProfileAvatar
              src={profile.profile_picture}
              alt={profile.name}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 300 }}>
                  {profile.username}
                </Typography>
                {!isOwnProfile ? (
                  <ProfileButton
                    variant={isFollowing ? "outlined" : "contained"}
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </ProfileButton>
                ) : (
                  <ProfileButton
                    variant="outlined"
                    startIcon={<Edit />}
                  >
                    Editar Perfil
                  </ProfileButton>
                )}
              </Box>
              <ProfileStats>
                <Typography variant="body1">
                  <strong>{profile.posts?.length || 0}</strong> publicações
                </Typography>
                <Typography variant="body1">
                  <strong>{profile.followers?.length || 0}</strong> seguidores
                </Typography>
                <Typography variant="body1">
                  <strong>{profile.following?.length || 0}</strong> seguindo
                </Typography>
              </ProfileStats>
              <ProfileBio variant="body1">
                {profile.bio || 'Sem biografia'}
              </ProfileBio>
            </Box>
          </Grid>
        </Grid>
      </ProfileHeader>

      <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 'auto',
              padding: '20px',
            },
          }}
        >
          <Tab icon={<GridView />} label="Publicações" />
          <Tab icon={<BookmarkBorder />} label="Salvos" />
        </Tabs>
      </Box>

      <PostsContainer>
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onUpdate={handlePostUpdate}
          />
        ))}
      </PostsContainer>
    </ProfileContainer>
  );
};

export default Profile; 