import React from 'react'
import Base from './Base'
import { Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { URL } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const defaultTheme = createTheme({
  palette: {
      tang: createColor('#00695f')
    }
});

const MailService = () => {

    const navigate = useNavigate();

    const handleSubmit = async(event) => {
      try {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email = data.get('email');
        let res = await axios.post(`${URL}/users/forgot-password`, {
          email
          })
          if(res.status === 200){
            navigate('/')
            toast.success(res.data.message);
          }
      } catch (error) {
        toast.error(error.response.data.message);
      }
      };

  return (
    <Base>

    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Confirm Profile
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
            
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              color='tang'
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Mail
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link onClick={()=> navigate("/")} color={"#00695f"}
                style={{cursor:"pointer"}} variant="body2">
                  Remembered Password? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    <br/><br/>

    </Base>
  )
}

export default MailService