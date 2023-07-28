import React, { forwardRef, useEffect, useState } from "react";
import Base from "./Base";
import { AppBar, Box, Button, Card, CardActionArea, CardContent, CardMedia, Dialog, Fab, Grid, IconButton, Paper, Slide,
  TextField, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ContactPhoneSharpIcon from "@mui/icons-material/ContactPhoneSharp";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import LanguageIcon from "@mui/icons-material/Language";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FactoryIcon from "@mui/icons-material/Factory";
import { URL, token } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Contact = ({contacts, setContacts}) => {
  const navigate = useNavigate();
  return (
    <Base title={"Contacts"}>
      <AddContact />
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={10} lg={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <div>
                <Grid container spacing={3}>
                  {contacts.map((contact) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={contact._id}>
                      <Card
                        key={contact._id}
                        sx={{ display: "flex", width: 200 }}
                      >
                        <CardMedia
                          component="img"
                          sx={{ width: 75 }}
                          image={`${URL}/uploads/${contact.image}`}
                          alt="-"
                        />
                        <CardActionArea
                          onClick={() =>
                            navigate(`/edit/contact/${contact._id}`)
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
                                {contact.fullName}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                              >
                                {contact.mobile}
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
                              {contact.type}
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
  );
};

export default Contact;

// Add contact

function AddContact({ contacts, setContacts }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Individual");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [gstin, setGstin] = useState("");
  const [website, setWebsite] = useState("");
  const [tag, setTag] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // toggle type
  const handleChangeType = (event, newType) => {
    setType(newType);
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

  const handleAdd = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();

      formData.append("type", type);
      formData.append("companyName", companyName);
      formData.append("fullName", fullName);
      formData.append("mobile", mobile);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("pincode", pincode);
      formData.append("jobTitle", jobTitle);
      formData.append("website", website);
      formData.append("gstin", gstin);
      formData.append("tag", tag);

      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(`${URL}/contacts/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {

        setOpen(false);
        toast.success(response.data.message);
        window.location.reload();
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
        Add Contact
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
                <Grid container spacing={3}>
                  <Grid item xs={10} md={9} lg={10}>
                    <ToggleButtonGroup
                      color="orange"
                      value={type}
                      exclusive
                      onChange={handleChangeType}
                      aria-label="Platform"
                    >
                      <ToggleButton value="Individual">Individual</ToggleButton>
                      <ToggleButton value="Company">Company</ToggleButton>
                    </ToggleButtonGroup>
                    <Box sx={{ width: 800, maxWidth: "100%" }}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        id="fullWidth"
                        variant="standard"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Full Name"
                        id="fullWidth"
                        variant="standard"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
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
                <Grid container spacing={3}>
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
                      defaultValue="India"
                      variant="standard"
                      disabled
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
                    <h5></h5>
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <WorkIcon
                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                      />
                      <TextField
                        id="input-with-sx"
                        label="Job Position"
                        variant="standard"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <FactoryIcon
                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                      />
                      <TextField
                        id="input-with-sx"
                        label="Industry"
                        variant="standard"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <LanguageIcon
                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                      />
                      <TextField
                        id="input-with-sx"
                        label="Website"
                        variant="standard"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <AccountBalanceIcon
                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                      />
                      <TextField
                        id="input-with-sx"
                        label="GSTIN"
                        variant="standard"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <LocalOfferIcon
                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                      />
                      <TextField
                        id="input-with-sx"
                        label="Tag"
                        variant="standard"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                      />
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
