import React from 'react'
import { AppBar, Avatar, Box, Button, Checkbox, CssBaseline, FormControlLabel, Grid, Link, Paper, TextField, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import {URL} from '../App';
import { toast } from 'react-toastify';
import axios from 'axios';


function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright Un_Knwn © '}
        <Link color="inherit" href="#">
          CRM App
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    )
  }

  const { palette } = createTheme();
const { augmentColor } = palette;
  const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
  const defaultTheme = createTheme({
    palette: {
        tang: createColor('#00695f')
      }
  });

const Signin = () => {
  
  const navigate = useNavigate();

  const handleSubmit = async(event) => {
    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      
      let email = data.get('email');
      let password = data.get('password');
         
    let res = await axios.post(`${URL}/users/signin`, {
      email,
      password
      })
      if(res.status === 200){
        navigate("/dashboard")
        sessionStorage.setItem("token", res.data.token);
        toast.success(res.data.message);
      }
    
  } catch (error) {
    toast.error(error.res.data.message);
  }   
    };
      
  return (
    
    <div>
        <header>
        <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{background:"#00695f"}}>
        <Toolbar>
          <Typography variant="h6" textAlign={"center"} component="div" sx={{ flexGrow: 1 }} >
            CRM-App
          </Typography>
          <Button color="inherit" onClick={()=>navigate("/register")}>Signup</Button>
        </Toolbar>
      </AppBar>
    </Box>
        </header>
        <br/>
        <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                color='tang'
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                color='tang'
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                color='tang'
                variant="contained"
                style={{cursor:"pointer"}}
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link color={"#00695f"} onClick={()=>navigate('/confirm-mail')} variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link color={"#00695f"} onClick={()=>navigate('/register')} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>

    </div>
  )
}

export default Signin