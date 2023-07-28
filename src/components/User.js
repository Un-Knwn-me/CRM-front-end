import React, { forwardRef } from 'react'
import Base from './Base'
import { AppBar, Box, Button, Card, CardActionArea, CardContent, CardMedia, Dialog, Fab, Grid, IconButton, Paper, Slide, TextField, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from '@mui/material'
import { useState } from 'react';
import { useEffect } from 'react';
import { URL, token } from '../App';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ContactPhoneSharpIcon from "@mui/icons-material/ContactPhoneSharp";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BusinessIcon from "@mui/icons-material/Business";
import jwtDecode from 'jwt-decode';


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const User = ({users, setUsers}) => {
  const navigate = useNavigate();
 
  return (
    <Base
    title={"User Management"}>
      <AddUser />
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={10} lg={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <div>
                <Grid container spacing={3}>
                  {users.map((user) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
                      <Card
                        key={user._id}
                        sx={{ display: "flex", width: 200 }}
                      >
                        <CardMedia
                          component="img"
                          sx={{ width: 75 }}
                          image={`${URL}/uploads/${user.image}`}
                          alt="-"
                        />
                        <CardActionArea
                          onClick={() =>
                            navigate(`/edit/user/${user._id}`)
                          }
                        >
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <CardContent sx={{ flex: "1 0 auto" }}>
                              <Typography
                                component="div"
                                variant="h6"
                                color="#00695f"
                              >
                                {user.firstName} {user.lastName}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                              >
                                {user.role}
                              </Typography>
                            </CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                pl: 1,
                                pb: 1,
                              }}
                            >
                              {user.mobile}
                            </Box>
                          </Box>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Base>
  )
}

export default User

// Add user

function AddUser({ users, setUsers }) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("User");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [createdBy, setCreatedBy] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // toggle role
  const handleChangeRole = (event, newRole) => {
    setRole(newRole);
  };

  // upload image
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    // preview of the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setFileInputKey(Date.now());
  };

  useEffect(()=>{
    
    // Fetching user name
   const getUser = async() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const { firstName, lastName } = decodedToken;
      const fullName = `${firstName} ${lastName}`;
      setCreatedBy(fullName);
    }
  };
  getUser();

  }, [])

  const handleAdd = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("mobile", mobile);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("country", country); 
      formData.append("pincode", pincode);
      formData.append("createdBy", createdBy);

      if (image) {
        formData.append("image", image);
      }

      console.log(formData)
      const response = await axios.post(`${URL}/users/signup`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Fab variant="extended" 
      sx={{ mb: 3, background: "orange", position: "fixed", top: "5rem", right: "1rem", zIndex: 1000 }}
       onClick={handleClickOpen} >
        <AddIcon sx={{ mr: 1 }} />
        Add User
      </Fab>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", background: "#00695f" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add Contact
            </Typography>
            <Button autoFocus color="inherit" onClick={handleAdd}>
              Save
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          component="form"
          noValidate
          onSubmit={handleAdd}
          encType="multipart/form-data"
          sx={{ mt: 1 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={10} lg={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Grid container spacing={3} sx={{ml: 3}}>
                  <Grid item xs={9} md={8} lg={9}>
                    <Box sx={{ width: 800, maxWidth: "100%" }}>
                      <TextField
                        fullWidth
                        label="First Name"
                        id="fullWidth"
                        variant="standard"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Last Name"
                        id="fullWidth"
                        variant="standard"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <h5>Role:-</h5>
                      <ToggleButtonGroup
                      color="orange"
                      value={role}
                      exclusive
                      onChange={handleChangeRole}
                      aria-label="Platform"
                    >
                      <ToggleButton value="Admin">Admin</ToggleButton>
                      <ToggleButton value="Manager">Manager</ToggleButton>
                      <ToggleButton value="User">User</ToggleButton>
                      <ToggleButton value="Employee">Employee</ToggleButton>
                    </ToggleButtonGroup>
                    </Box>
                  </Grid>
                  <Grid item xs={3} md={4} lg={3}>
                    <div>
                      <Card sx={{ maxWidth: 140 }}>
                        <CardActionArea>
                          <label htmlFor="upload-input">
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Upload preview"
                                style={{ width: "100%", height: 130 }}
                              />
                            ) : (
                              <CardMedia
                                component="img"
                                height="130"
                                image=""
                                alt="Upload image"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                          </label>
                          <input
                            id="upload-input"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            key={fileInputKey}
                          />
                        </CardActionArea>
                      </Card>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={3} sx={{ml: 3}}>
                  <Grid item xs={6} md={6} lg={6}>
                    <h5>Contact:</h5>
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <ContactPhoneSharpIcon
                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                      />
                      <TextField
                        id="input-with-sx"
                        label="Mobile"
                        variant="standard"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <ContactMailIcon
                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                      />
                      <TextField
                        id="input-with-sx"
                        label="E-mail"
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <TextField
                        sx={{ml: 1}}
                        id="input-with-sx"
                        label="Password"
                        variant="standard"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        width: 425,
                        maxWidth: "100%",
                      }}
                    >
                      <BusinessIcon
                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                      />
                      <TextField
                        fullWidth
                        label="Address"
                        id="fullWidth"
                        variant="standard"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Box>
                    <TextField
                      sx={{ ml: 4 }}
                      id="standard-basic"
                      label="City"
                      variant="standard"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <TextField
                      sx={{ ml: 4 }}
                      id="standard-basic"
                      label="State"
                      variant="standard"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                    <TextField
                      sx={{ ml: 4 }}
                      id="standard-basic"
                      label="Country"
                      variant="standard"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                    <TextField
                      sx={{ ml: 4 }}
                      id="standard-basic"
                      label="Pincode"
                      variant="standard"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} md={6} lg={6}>
                    <h5>Created By: </h5>
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      {createdBy}
                    </Box>
                    </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </div>
  );
}
