import React, { useEffect, useRef, useState } from 'react';
import Base from './Base';
import { Box, Card, Button, TextField, ToggleButton, ToggleButtonGroup, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Fab, Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { URL, token } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { toast } from 'react-toastify';


const Service = () => {
  // const navigate = useNavigate();
  const [services, setServices] = useState([]);

  // Get service
  const getServices = async () => {
    try {
      const res = await axios.get(`${URL}/services/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(res.data.services);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <Base
    title={"Services"}>
      <div>

      <AddService getServices={getServices}/>

            <Grid container spacing={3}>
             
              <Grid item xs={6} md={4} lg={2}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: "#E6F0EF",
                  }}
                  style={{maxHeight: 400, overflow: 'auto'}}
                >
                  <h3>Created</h3>
                  <ServiceStatus services={services.filter((service) => service.status === 'Created')}/>
                </Paper>
              </Grid>

              <Grid item xs={6} md={4} lg={2}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: "#E6F0EF",
                  }}
                  style={{maxHeight: 400, overflow: 'auto'}}
                >
                  <h3>Open</h3>
                  <ServiceStatus title="Open" services={services.filter((service) => service.status === 'Open')}/>
                </Paper>
              </Grid>

              <Grid item xs={6} md={4} lg={2}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: "#E6F0EF",
                  }}
                  style={{maxHeight: 400, overflow: 'auto'}}
                >
                  <h3>In Process</h3>
                <ServiceStatus services={services.filter((service) => service.status === 'In process')}/>
                </Paper>
              </Grid>

              <Grid item xs={6} md={4} lg={2}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: "#E6F0EF",
                  }}
                  style={{maxHeight: 400, overflow: 'auto'}}
                >
                  <h3>Released</h3>
                  <ServiceStatus title="Released" services={services.filter((service) => service.status === 'Released')}/>
                </Paper>
              </Grid>

              <Grid item xs={6} md={4} lg={2}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: "#E6F0EF",
                  }}
                  style={{maxHeight: 400, overflow: 'auto'}}
                >
      
               <h3>Canceled</h3>
                <ServiceStatus services={services.filter((service) => service.status === 'Canceled')}/>
                </Paper>
              </Grid>

              <Grid item xs={6} md={4} lg={2}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: "#E6F0EF",
                  }}
                  style={{maxHeight: 400, overflow: 'auto'}}
                >
                 
                  <h3>Completed</h3>
                <ServiceStatus title="Completed" services={services.filter((service) => service.status === 'Completed')}/>
                </Paper>
              </Grid>

            </Grid>
            </div>
    </Base>
  )
}

export default Service


function AddService({ getServices }) {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');
  const [curstatus, setCurStatus] = useState('Created');
  const [type, setType] = useState('Individual');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [industry, setIndustry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');

  // Toggle
  const handleChange = (event, newAlignment) => {
    setType(newAlignment);
  };

  const handleChangeStatus = (event, NewStatus) => {
    setCurStatus(NewStatus);
  };

  // Paper function
  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = useRef(null);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const handleAdd = async () => {
    try {
      const payload = {
        type: type,
        companyName: companyName,
        fullName: fullName,
        mobile: mobile,
        email: email,
        address: address,
        city: city,
        state: state,
        country: country,
        pincode: pincode,
        industry: industry,
        status: curstatus,
        description: description
      };

      const response = await axios.post(`${URL}/services/add`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        getServices();
        setOpen(false);
        toast.success(response.data.message);
      } 
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Fab variant="extended" sx={{ mb: 3, background: 'orange', position: 'fixed', top: '5rem', right: '1rem', zIndex: 1000 }} onClick={handleClickOpen('paper')}>
        <AddIcon sx={{ mr: 1 }} />
        Add Service
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Add Service</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
            <div>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField id="companyName" label="Company Name" variant="filled" value={companyName} onChange={(e) => setCompanyName(e.target.value)}/>
                <TextField id="fullName" label="Full Name" variant="filled" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                <TextField id="email" label="E-mail" variant="filled" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <TextField id="mobile" label="Mobile" variant="filled" value={mobile} onChange={(e) => setMobile(e.target.value)}/>
                <TextField id="address" label="Address" variant="filled" value={address} onChange={(e) => setAddress(e.target.value)}/>
                <TextField id="city" label="City" variant="filled" value={city} onChange={(e) => setCity(e.target.value)}/>
                <TextField id="state" label="State" variant="filled" value={state} onChange={(e) => setState(e.target.value)}/> 
                <TextField id="country" label="Country" default="India" variant="filled" value={country} onChange={(e) => setCountry(e.target.value)}/>
                <TextField id="pincode" label="Pincode" variant="filled" value={pincode} onChange={(e) => setPincode(e.target.value)}/>
                <TextField id="industry" label="Industry" variant="filled" value={industry} onChange={(e) => setIndustry(e.target.value)}/>
                <ToggleButtonGroup
                  color="orange"
                  value={type}
                  exclusive
                  onChange={handleChange}
                  aria-label="Platform"
                >
                  <ToggleButton value="Individual">Individual</ToggleButton>
                  <ToggleButton value="Company">Company</ToggleButton>
                </ToggleButtonGroup>
                <p style={{ color: 'black' }}>Status:</p>
                <ToggleButtonGroup
                  color="orange"
                  value={curstatus}
                  exclusive
                  onChange={handleChangeStatus}
                  aria-label="Platform"
                >
                  <ToggleButton value="Created">Created</ToggleButton>
                  <ToggleButton value="Open">Open</ToggleButton>
                  <ToggleButton value="In process">In Process</ToggleButton>
                  <ToggleButton value="Released">Released</ToggleButton>
                  <ToggleButton value="Canceled">Canceled</ToggleButton>
                  <ToggleButton value="Completed">Completed</ToggleButton>
                </ToggleButtonGroup>
                <br/>
                <TextField
          id="description"
          label="Description"
          value= {description}
          multiline
          rows={4}
          variant="filled"
          onChange={(e) => setDescription(e.target.value)}
        />
              </Box>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="tang" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="tang" onClick={handleAdd}>
            Add Service
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


function ServiceStatus ({services}){
  const navigate = useNavigate();

  return(
<div>
      {services.map((service) => (
        <Card
          key={service._id}
          sx={{ width: '100%', mb: 2 }}
        >
          <CardActionArea onClick={() => navigate(`/edit/service/${service._id}`)}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h6" color={'#00695f'}>
                  {service.fullName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                  {service.mobile}
                </Typography>
              </CardContent>

              <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                {service.type}
              </Box>
            </Box>
          </CardActionArea>
        </Card>
      ))}
    </div>
  )
}