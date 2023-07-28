import React, { useState } from 'react'
import { AppBar, Avatar, Box, Button, Checkbox, CssBaseline, FormControlLabel, Grid, Link, Paper, TextField, ThemeProvider, ToggleButton, ToggleButtonGroup, Toolbar, Typography, createTheme } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { URL } from '../App';
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

const Signup = () => {
    const navigate =useNavigate();
    const [alignment, setAlignment] = useState('admin');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
    
    const handleSubmit = async(event) => {
      try {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        
        let firstName = data.get('firstName');
        let lastName = data.get('lastName');
        let email = data.get('email');
        let password = data.get('password');
        let role = data.get(alignment);
           
      let res = await axios.post(`${URL}/users/signup`, {
        firstName,
        lastName,
        email,
        password,
        role
        })
        console.log(
          res
          );
          toast.success(res.data.message);
          navigate('/')
      
    } catch (error) {
      toast.error(error.response.data.message);
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
          <Button color="inherit" onClick={()=> navigate("/")}>Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
        </header>
        <br/>
        <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        
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
              Sign Up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                id="firstName"
                color='tang'
                label="First Name"
                name="firstName"
                autoComplete="firstName"
                autoFocus
                sx={{m : 2}}
              />
              <TextField
                margin="normal"
                required
                id="lastName"
                color='tang'
                label="Last Name"
                name="lastName"
                autoComplete="lastName"
                autoFocus
                sx={{m : 2}}
              />
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
              Role:
               <ToggleButtonGroup
      color='tang'
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      sx={{m : 2}}
    >
      <ToggleButton value="admin">Admin</ToggleButton>
      <ToggleButton value="manager">Manager</ToggleButton>
      <ToggleButton value="employee">Employee</ToggleButton>
      <ToggleButton value="user">User</ToggleButton>
    </ToggleButtonGroup>
              <FormControlLabel
                control={<Checkbox value="terms" color="primary" required />}
                label="I Agree terms & conditions"
              />
              <Button
                type="submit"
                fullWidth
                color='tang'
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="#" color={"#00695f"} variant="body2" onClick={()=>navigate("/")}>
                    {"Do have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
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
      </Grid>
    </ThemeProvider>

    </div>
  )
}

export default Signup