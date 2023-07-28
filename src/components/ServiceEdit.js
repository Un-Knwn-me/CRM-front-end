import React, { useEffect, useState } from "react";
import Base from "./Base";
import { Box, Fab, Grid, Paper, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import ContactPhoneSharpIcon from "@mui/icons-material/ContactPhoneSharp";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
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

const ServiceEdit = () => {
  const { id } = useParams();
  const [serviceData, setServiceData] = useState({});
  const [type] = useState(serviceData.type || "");
  const [status] = useState(serviceData.status || "");
  const navigate = useNavigate();

  // Function to handle input changes for all the fields
  const handleInputChange = (e) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  // toggle type
  const handleChangeType = (event, newType) => {
    setServiceData({ ...serviceData, type: newType });
  };

  const handleChangeStatus = (event, newStatus) => {
    setServiceData({ ...serviceData, status: newStatus });
  };


  // Fetch the data of the particular contact based on the id
  const fetchServiceData = async () => {
    try {
      const response = await axios.get(`${URL}/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const formattedData = {
        ...response.data.service,
        createdAt: formatDate(response.data.service.createdAt),
        updatedAt: formatDate(response.data.service.updatedAt),
      };
      setServiceData(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, [id]);

  // Update the new data in to the server
  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      console.log(serviceData);
      const formDataArray = [
        { name: 'type', value: serviceData.type },
        { name: 'fullName', value: serviceData.fullName },
        { name: 'companyName', value: serviceData.companyName },
        { name: 'status', value: serviceData.status },
        { name: 'email', value: serviceData.email },
        { name:'mobile', value: serviceData.mobile },
        { name: 'address', value: serviceData.address },
        { name: 'city', value: serviceData.city },
        { name: 'state', value: serviceData.state },
        { name: 'country', value: serviceData.country },
        { name: 'pincode', value: serviceData.pincode },
        { name: 'industry', value: serviceData.industry },
        { name: 'description', value: serviceData.description },
      ];
  
      const formData = new FormData();
  
      formDataArray.map((item) => {
        formData.append(item.name, item.value);
        return item; 
      });
  
      // Convert serviceData to JSON string and send as raw JSON
      const jsonString = JSON.stringify(serviceData);
      formData.append("serviceData", jsonString);
  
      const res = await axios.put(`${URL}/services/edit/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (res.status === 200) {
        toast.success(res.data.message);
        navigate('/service')
      } else {
        toast.error('Failed to update service');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async(event) => {
    try {
      const response = await axios.delete(`${URL}/services/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        navigate('/service');
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  if (Object.keys(serviceData).length !== 0) {
    return (
      <Base title={"Services"}>

    <Fab variant="extended" 
      sx={{ mb: 3, background: "#f44336", position: "fixed", top: "5rem", right: "2rem", zIndex: 1000 }}
       onClick={handleDelete} >
        <DeleteForeverIcon sx={{ mr: 1 }} />
        Delete
      </Fab>

        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Grid container spacing={3} sx={{m: 3}}>
                <Grid item xs={12} md={12} lg={12}>
                  <ToggleButtonGroup
                    color="orange"
                    value={type || serviceData.type}
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
                      value={serviceData.companyName}
                      onChange={(e) => handleInputChange(e)}
                      name="companyName"
                      id="fullWidth"
                      variant="standard"
                    />
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={serviceData.fullName}
                      onChange={(e) => handleInputChange(e)}
                      name="fullName"
                      id="fullWidth"
                      variant="standard"
                    />
                  </Box>
                </Grid>
                    <Box sx={{ml: 3}}>
                    <p style={{color:'black'}}>Status:</p>
    <ToggleButtonGroup
      color="orange"
      value={serviceData.status || status}
      exclusive
      onChange={handleChangeStatus}
      name= "status"
      aria-label="Platform"
    >
      <ToggleButton value="Created">Created</ToggleButton>
      <ToggleButton value="Open">Open</ToggleButton>
      <ToggleButton value="In process">In process</ToggleButton>
      <ToggleButton value="Released">Released</ToggleButton>
      <ToggleButton value="Canceled">Canceled</ToggleButton>
      <ToggleButton value="Completed">Completed</ToggleButton>
    </ToggleButtonGroup>
                    </Box>
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
                      value={serviceData.mobile}
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
                      value={serviceData.email}
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
                      value={serviceData.address}
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
                    value={serviceData.city}
                    onChange={(e) => handleInputChange(e)}
                    name="city"
                    label="City"
                    variant="standard"
                  />
                  <TextField
                    sx={{ ml: 4 }}
                    id="standard-basic"
                    value={serviceData.state}
                    onChange={(e) => handleInputChange(e)}
                    name="state"
                    label="State"
                    variant="standard"
                  />
                  <TextField
                    sx={{ ml: 4 }}
                    id="standard-basic"
                    value={serviceData.country}
                    onChange={(e) => handleInputChange(e)}
                    name="country"
                    label="Country"
                    variant="standard"
                  />
                  <TextField
                    sx={{ ml: 4 }}
                    id="standard-basic"
                    value={serviceData.pincode}
                    onChange={(e) => handleInputChange(e)}
                    name="pincode"
                    label="Pincode"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <h5> </h5>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <WorkIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                    <TextField
                      id="input-with-sx"
                      value={serviceData.industry}
                      onChange={(e) => handleInputChange(e)}
                      name="industry"
                      label="Industry"
                      variant="standard"
                    />
                  </Box><br/>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <TextField
                  id="input-with-sx"
                  label="Description"
                  value= {serviceData.description}
                  name='description'
                  multiline
                  rows={4}
                  variant="standard"
                  onChange={(e) => handleInputChange(e)}
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
                
              </Grid>
              <Grid sx={{ ml: 5, mt: 3 }}>
                <br />
                <br />
                <Grid container item spacing={3} sx={{ml: 3}}>
                  <Grid sm={12} md={12} lg={6}>
                    <Typography variant="button">
                      Created By: {serviceData.createdBy}
                    </Typography>
                    <br />
                    <Typography variant="button">
                      Created At: {serviceData.createdAt}
                    </Typography>
                  </Grid>
                  <Grid sm={12} md={12} lg={6}>
                    <Typography variant="button">
                      Updated By: {serviceData.updatedBy}
                    </Typography>
                    <br />
                    <Typography variant="button">
                      Updated At: {serviceData.updatedAt}
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

export default ServiceEdit;
