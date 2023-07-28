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

const LeadEdit = () => {
  const { id } = useParams();
  const [leadData, setLeadData] = useState({});
  const [type] = useState(leadData.type || "");
  const [status] = useState(leadData.status || "");
  const navigate = useNavigate();

  // Function to handle input changes for all the fields
  const handleInputChange = (e) => {
    setLeadData({ ...leadData, [e.target.name]: e.target.value });
  };

  // toggle type
  const handleChangeType = (event, newType) => {
    setLeadData({ ...leadData, type: newType });
  };

  const handleChangeStatus = (event, newStatus) => {
    setLeadData({ ...leadData, status: newStatus });
  };


  // Fetch the data of the particular contact based on the id
  const fetchLeadData = async () => {
    try {
      const response = await axios.get(`${URL}/leads/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.createdAt)
      const formattedData = {
        ...response.data,
        createdAt: formatDate(response.data.createdAt),
        updatedAt: formatDate(response.data.updatedAt),
      };
      setLeadData(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, [id]);

  // Update the new data in to the server
  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const formDataArray = [
        { name: 'type', value: leadData.type },
        { name: 'fullName', value: leadData.fullName },
        { name: 'companyName', value: leadData.companyName },
        { name: 'status', value: leadData.status },
        { name: 'email', value: leadData.email },
        { name:'mobile', value: leadData.mobile },
        { name: 'address', value: leadData.address },
        { name: 'city', value: leadData.city },
        { name: 'state', value: leadData.state },
        { name: 'country', value: leadData.country },
        { name: 'pincode', value: leadData.pincode },
        { name: 'industry', value: leadData.industry },
        { name: 'description', value: leadData.description },
      ];
  
      const formData = new FormData();
  
      formDataArray.map((item) => {
        formData.append(item.name, item.value);
        return item; 
      });
  
      // Convert serviceData to JSON string and send as raw JSON
      const jsonString = JSON.stringify(leadData);
      formData.append("leadData", jsonString);
  
      const res = await axios.put(`${URL}/leads/edit/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (res.status === 200) {
        toast.success(res.data.message);
        navigate('/leads')
      } else {
        toast.error('Failed to update service');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async(event) => {
    try {
      const response = await axios.delete(`${URL}/leads/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        navigate('/leads');
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  if (Object.keys(leadData).length !== 0) {
    return (
      <Base title={"Leads"}>

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
                    value={type || leadData.type}
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
                      value={leadData.companyName}
                      onChange={(e) => handleInputChange(e)}
                      name="companyName"
                      id="fullWidth"
                      variant="standard"
                    />
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={leadData.fullName}
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
      value={leadData.status || status}
      exclusive
      onChange={handleChangeStatus}
      name= "status"
      aria-label="Platform"
    >
      <ToggleButton value="New">New</ToggleButton>
      <ToggleButton value="Contacted">Contacted</ToggleButton>
      <ToggleButton value="Qualified">Qualified</ToggleButton>
      <ToggleButton value="Lost">Lost</ToggleButton>
      <ToggleButton value="Canceled">Canceled</ToggleButton>
      <ToggleButton value="Confirmed">Confirmed</ToggleButton>
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
                      value={leadData.mobile}
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
                      value={leadData.email}
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
                      value={leadData.address}
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
                    value={leadData.city}
                    onChange={(e) => handleInputChange(e)}
                    name="city"
                    label="City"
                    variant="standard"
                  />
                  <TextField
                    sx={{ ml: 4 }}
                    id="standard-basic"
                    value={leadData.state}
                    onChange={(e) => handleInputChange(e)}
                    name="state"
                    label="State"
                    variant="standard"
                  />
                  <TextField
                    sx={{ ml: 4 }}
                    id="standard-basic"
                    value={leadData.country}
                    onChange={(e) => handleInputChange(e)}
                    name="country"
                    label="Country"
                    variant="standard"
                  />
                  <TextField
                    sx={{ ml: 4 }}
                    id="standard-basic"
                    value={leadData.pincode}
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
                      value={leadData.industry}
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
                  value= {leadData.description}
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
                      Created By: {leadData.createdBy}
                    </Typography>
                    <br />
                    <Typography variant="button">
                      Created At: {leadData.createdAt}
                    </Typography>
                  </Grid>
                  <Grid sm={12} md={12} lg={6}>
                    <Typography variant="button">
                      Updated By: {leadData.updatedBy}
                    </Typography>
                    <br />
                    <Typography variant="button">
                      Updated At: {leadData.updatedAt}
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

export default LeadEdit;
