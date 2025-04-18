import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Comment,
  MoreVert,
  Send,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Post = ({ post, onUpdate }) => {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async () => {
    try {
      const response = await api.post(`/posts/${post.id}/like`);
      onUpdate(response.data);
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await api.post(`/posts/${post.id}/comments`, {
        content: comment
      });
      onUpdate(response.data);
      setComment('');
    } catch (error) {
      console.error('Erro ao comentar:', error);
    }
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            src={post.author?.profilePicture}
            alt={post.author?.name}
          />
        }
        action={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
        title={post.author?.name}
        subheader={formatDate(post.createdAt)}
      />
      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
        {post.image && (
          <Box
            component="img"
            src={post.image}
            alt="Post"
            sx={{
              width: '100%',
              borderRadius: 1,
              mt: 2
            }}
          />
        )}
      </CardContent>
      <Divider />
      <CardActions disableSpacing>
        <IconButton
          onClick={handleLike}
          color={post.likes?.some(like => like.user_id === user?.id) ? 'primary' : 'default'}
        >
          {post.likes?.some(like => like.user_id === user?.id) ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.likes?.length || 0} curtidas
        </Typography>
        <IconButton
          onClick={() => setShowComments(!showComments)}
          sx={{ ml: 1 }}
        >
          <Comment />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.comments?.length || 0} comentários
        </Typography>
      </CardActions>
      {showComments && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            {post.comments?.map((comment) => (
              <Box key={comment.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar
                    src={comment.user?.profilePicture}
                    alt={comment.user?.name}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  <Typography variant="subtitle2">
                    {comment.user?.name}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {comment.content}
                </Typography>
              </Box>
            ))}
            <Box component="form" onSubmit={handleComment} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Adicione um comentário..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!comment.trim()}
                >
                  <Send />
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Card>
  );
};

export default Post; 