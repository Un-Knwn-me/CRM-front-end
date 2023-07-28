import React, { useEffect, useState } from "react";
import Base from "./Base";
import { Box, Card, CardActionArea, CardMedia, Fab, Grid, Paper, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import ContactPhoneSharpIcon from "@mui/icons-material/ContactPhoneSharp";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BusinessIcon from "@mui/icons-material/Business";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { URL, token } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const formatDate = (dateString) => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  return `${formattedDate} ${formattedTime}`;
};

const UserEdit = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [imagePreview, setImagePreview] = useState(
    userData.imagePreview || null
  );
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [image, setImage] = useState(null);
  const [role] = useState(userData.role || "");
  const navigate = useNavigate();

  // Function to handle input changes for all the fields
  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // toggle type
  const handleChangeRole = (event, newRole) => {
    setUserData({ ...userData, role: newRole });
  };

  // Function to handle image upload
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

  // Fetch the data of the particular user based on the id
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const formattedData = {
        ...response.data.user,
        createdAt: formatDate(response.data.user.createdAt),
        updatedAt: formatDate(response.data.user.updatedAt),
      };
      setUserData(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);


  // Update the new data in to the server
  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image); // Append the new image
      }

      // Append other user data to the FormData
      Object.keys(userData).forEach((key) => {
        if (key === "image" && !userData.image) {
          return;
        }
        formData.append(key, userData[key]);
      });

      const res = await axios.put(`${URL}/users/edit/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        navigate('/user-management');
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async(event) => {
    try {
      const response = await axios.delete(`${URL}/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        navigate('/user-management');
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  if (Object.keys(userData).length !== 0) {
    return (
      <Base title={"User Management"}>

    <Fab variant="extended" 
      sx={{ mb: 3, background: "#f44336", position: "fixed", top: "5rem", right: "2rem", zIndex: 1000 }}
       onClick={handleDelete} >
        <DeleteForeverIcon sx={{ mr: 1 }} />
        Delete
      </Fab>

        <Grid container spacing={3}>
          <Grid item xs={12} md={10} lg={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={10} md={9} lg={10}>
                  <ToggleButtonGroup
                    color="orange"
                    value={role || userData.role}
                    exclusive
                    onChange={handleChangeRole}
                    name="type"
                    aria-label="Platform"
                  >
                    <ToggleButton value="Admin">Admin</ToggleButton>
                    <ToggleButton value="Manager">Manager</ToggleButton>
                    <ToggleButton value="Employee">Employee</ToggleButton>
                    <ToggleButton value="User">User</ToggleButton>
                  </ToggleButtonGroup>
                  <Box
                    sx={{
                      width: 800,
                      maxWidth: "100%",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="First Name"
                      value={userData.firstName}
                      onChange={(e) => handleInputChange(e)}
                      name="firstName"
                      id="fullWidth"
                      variant="standard"
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={userData.lastName}
                      onChange={(e) => handleInputChange(e)}
                      name="lastName"
                      id="fullWidth"
                      variant="standard"
                    />
                  </Box>
                </Grid>
                <Grid item xs={2} md={3} lg={2}>
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
                              image={
                                imagePreview ||
                                `${URL}/uploads/${userData.image}`
                              }
                              alt="No image"
                              style={{ cursor: "pointer" }}
                            />
                          )}
                        </label>
                        <input
                          id="upload-input"
                          type="file"
                          name="image"
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
              <Grid container spacing={3}>
                <Grid item xs={6} md={5} lg={6}>
                  <h5>Contact:</h5>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <ContactPhoneSharpIcon
                      sx={{ color: "action.active", mr: 1, my: 0.5 }}
                    />
                    <TextField
                      id="input-with-sx"
                      value={userData.mobile}
                      onChange={(e) => handleInputChange(e)}
                      name="mobile"
                      label="Mobile"
                      variant="standard"
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <ContactMailIcon
                      sx={{ color: "action.active", mr: 1, my: 0.5 }}
                    />
                    <TextField
                      id="input-with-sx"
                      value={userData.email}
                      onChange={(e) => handleInputChange(e)}
                      name="email"
                      label="E-mail"
                      variant="standard"
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
                      value={userData.address}
                      onChange={(e) => handleInputChange(e)}
                      name="address"
                      label="Address"
                      id="fullWidth"
                      variant="standard"
                    />
                  </Box>
                  <TextField
                    sx={{ ml: 4 }}
                    id="standard-basic"
                    value={userData.city}
                    onChange={(e) => handleInputChange(e)}
                    name="city"
                    label="City"
                    variant="standard"
                  />
                  <TextField
                    sx={{ ml: 4 }}
                    id="standard-basic"
                    value={userData.state}
                    onChange={(e) => handleInputChange(e)}
                    name="state"
                    label="State"
                    variant="standard"
                  />
                  <TextField
                    sx={{ ml: 4 }}
                    id="standard-basic"
                    value={userData.country}
                    onChange={(e) => handleInputChange(e)}
                    name="country"
                    label="Country"
                    variant="standard"
                  />
                  <TextField
                    sx={{ ml: 4 }}
                    id="standard-basic"
                    value={userData.pincode}
                    onChange={(e) => handleInputChange(e)}
                    name="pincode"
                    label="Pincode"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={4} md={4} lg={4}>
                  <br/><br/>
                  <h5>  </h5>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <Typography variant="button">
                      Created By: {userData.createdBy}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <Typography variant="button">
                      Created At: {userData.createdAt}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <Typography variant="button">
                      Updated By: {userData.updatedBy}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <Typography variant="button">
                      Updated At: {userData.updatedAt}
                    </Typography>
                  </Box>
                  <Fab
                    variant="extended"
                    onClick={handleUpdate}
                    color="orange"
                    sx={{ ml: 3, mt: 4 }}
                  >
                    <SaveAsIcon sx={{ mr: 1 }} />
                    Update
                  </Fab>
                </Grid>
                
              </Grid>
              
            </Paper>
          </Grid>
        </Grid>
      </Base>
    );
  }
};

export default UserEdit;
