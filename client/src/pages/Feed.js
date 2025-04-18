import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  styled,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Post from '../components/Post';

const FeedContainer = styled(Container)(({ theme }) => ({
  maxWidth: '614px',
  padding: '30px 0',
  marginTop: '64px',
  [theme.breakpoints.down('sm')]: {
    padding: '20px 0',
    marginTop: '56px',
  },
}));

const PostsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const response = await api.get('/posts/feed');
      setPosts(response.data);
    } catch (error) {
      console.error('Erro ao carregar feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        marginTop: '64px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <FeedContainer>
        <Typography variant="h6" align="center" color="text.secondary">
          Siga alguns usuários para ver posts aqui
        </Typography>
      </FeedContainer>
    );
  }

  return (
    <FeedContainer>
      <PostsContainer>
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onUpdate={handlePostUpdate}
          />
        ))}
      </PostsContainer>
    </FeedContainer>
  );
};

export default Feed; 