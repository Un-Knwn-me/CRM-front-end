import React, { useEffect, useState } from "react";
import Base from "./Base";
import { Box, Card, CardActionArea, CardMedia, Fab, Grid, Paper, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import ContactPhoneSharpIcon from "@mui/icons-material/ContactPhoneSharp";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import LanguageIcon from "@mui/icons-material/Language";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import WhatsAppIcon from "@mui/icons-material/WhatsApp";
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

const ContactEdit = () => {
  const { id } = useParams();
  const [contactData, setContactData] = useState({});
  const [imagePreview, setImagePreview] = useState(
    contactData.imagePreview || null
  );
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [image, setImage] = useState(null);
  const [type] = useState(contactData.type || "");
  const navigate = useNavigate();

  // Function to handle input changes for all the fields
  const handleInputChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  // toggle type
  const handleChangeType = (event, newType) => {
    setContactData({ ...contactData, type: newType });
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

  // Fetch the data of the particular contact based on the id
  const fetchContactData = async () => {
    try {
      const response = await axios.get(`${URL}/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const formattedData = {
        ...response.data.contact,
        createdAt: formatDate(response.data.contact.createdAt),
        updatedAt: formatDate(response.data.contact.updatedAt),
      };
      setContactData(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, [id]);

  const handleMail = async () => {
    try {
      const res = await axios.post(
        `${URL}/sales/remainder/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  // Update the new data in to the server
  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image); // Append the new image
      }

      // Append other contact data to the FormData
      Object.keys(contactData).forEach((key) => {
        if (key === "image" && !contactData.image) {
          return;
        }
        formData.append(key, contactData[key]);
      });

      const res = await axios.put(`${URL}/contacts/edit/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        navigate('/contact');
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async(event) => {
    try {
      const response = await axios.delete(`${URL}/contacts/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        navigate('/contact');
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  if (Object.keys(contactData).length !== 0) {
    return (
      <Base title={"Contacts"}>

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
                    value={type || contactData.type}
                    exclusive
                    onChange={handleChangeType}
                    name="type"
                    aria-label="Platform"
                  >
                    <ToggleButton value="Individual">Individual</ToggleButton>
                    <ToggleButton value="Company">Company</ToggleButton>
                  </ToggleButtonGroup>
                  <Box
                    sx={{
                      width: 800,
                      maxWidth: "100%",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Company Name"
                      value={contactData.companyName}
                      onChange={(e) => handleInputChange(e)}
                      name="companyName"
                      id="fullWidth"
                      variant="standard"
                    />
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={contactData.fullName}
                      onChange={(e) => handleInputChange(e)}
                      name="fullName"
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
                                `${URL}/uploads/${contactData.image}`
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
                      value={contactData.mobile}
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
                      value={contactData.email}
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
                      value={contactData.address}
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
                    value={contactData.city}
                    onChange={(e) => handleInputChange(e)}
                    name="city"
                    label="City"
                    variant="standard"
                  />
                  <TextField
                    sx={{ ml: 4 }}
                    id="standard-basic"
                    value={contactData.state}
                    onChange={(e) => handleInputChange(e)}
                    name="state"
                    label="State"
                    variant="standard"
                  />
                  <TextField
                    sx={{ ml: 4 }}
                    id="standard-basic"
                    value={contactData.country}
                    onChange={(e) => handleInputChange(e)}
                    name="country"
                    label="Country"
                    variant="standard"
                  />
                  <TextField
                    sx={{ ml: 4 }}
                    id="standard-basic"
                    value={contactData.pincode}
                    onChange={(e) => handleInputChange(e)}
                    name="pincode"
                    label="Pincode"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={4} md={4} lg={4}>
                  <h5> </h5>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <WorkIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                    <TextField
                      id="input-with-sx"
                      value={contactData.jobTitle}
                      onChange={(e) => handleInputChange(e)}
                      name="jobTitle"
                      label="Job Position"
                      variant="standard"
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <LanguageIcon
                      sx={{ color: "action.active", mr: 1, my: 0.5 }}
                    />
                    <TextField
                      id="input-with-sx"
                      value={contactData.website}
                      onChange={(e) => handleInputChange(e)}
                      name="website"
                      label="Website"
                      variant="standard"
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <AccountBalanceIcon
                      sx={{ color: "action.active", mr: 1, my: 0.5 }}
                    />
                    <TextField
                      id="input-with-sx"
                      value={contactData.gstin}
                      onChange={(e) => handleInputChange(e)}
                      name="gstin"
                      label="GSTIN"
                      variant="standard"
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <LocalOfferIcon
                      sx={{ color: "action.active", mr: 1, my: 0.5 }}
                    />
                    <TextField
                      id="input-with-sx"
                      value={contactData.tag}
                      onChange={(e) => handleInputChange(e)}
                      name="tag"
                      label="Tag"
                      variant="standard"
                    />
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
                <Grid>
                  <br />
                  <h5>Total amount: Rs. {contactData.totalPayment}</h5>
                  <h5>Pending Amount: Rs. {contactData.pendingPayment}</h5>

                  {/* <Fab variant="extended" color="tang" sx={{ mt: 2 }}>
        <WhatsAppIcon sx={{ mr: 1 }} />
        WhatsApp
      </Fab> */}
                  <Fab variant="extended" onClick={handleMail} sx={{ mt: 2 }}>
                    <ForwardToInboxIcon sx={{ mr: 1 }} />
                    Mail
                  </Fab>
                </Grid>
              </Grid>
              <Grid sx={{ ml: 5, mt: 3 }}>
                <br />
                <br />
                <Grid container item spacing={3}>
                  <Grid sm={12} md={12} lg={6}>
                    <Typography variant="button">
                      Created By: {contactData.createdBy}
                    </Typography>
                    <br />
                    <Typography variant="button">
                      Created At: {contactData.createdAt}
                    </Typography>
                  </Grid>
                  <Grid sm={12} md={12} lg={6}>
                    <Typography variant="button">
                      Updated By: {contactData.updatedBy}
                    </Typography>
                    <br />
                    <Typography variant="button">
                      Updated At: {contactData.updatedAt}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Base>
    );
  }
};

export default ContactEdit;
