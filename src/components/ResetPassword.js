import React from 'react'
import Base from './Base'
import { Avatar, Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Link, TextField, ThemeProvider, Typography, createTheme } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { toast } from 'react-toastify';
import axios from 'axios';
import { URL } from '../App';
import { useNavigate, useParams } from 'react-router-dom';

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const defaultTheme = createTheme({
  palette: {
      tang: createColor('#00695f')
    }
});

const ResetPassword = () => {
    const {token} = useParams();
    const navigate = useNavigate();

    const handleSubmit = async(event) => {
      try {
        event.preventDefault();
      const data = new FormData(event.currentTarget);
      let password = data.get('password');
      console.log(token)
      let res = await axios.post(`${URL}/users/reset-password/${token}`, {
        password
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
            Reset Password
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I accept all the Terms & Conditions."
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
              Reset
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link onClick={()=>navigate("/")}  color={"#00695f"} variant="body2">
                  Remembered Password? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>

    </Base>
  )
}

export default ResetPassword