import React, { useEffect, useState } from 'react'
import Base from './Base'
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, ToggleButtonGroup, ToggleButton, Fab } from '@mui/material'
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { URL, token } from "../App";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';

const SaleEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [saleData, setSaleData] = useState();
    const [rows, setRows] = useState([
      createData('', '', 0, 0),
    ]);

    useEffect(() => {
        getSales();
      },[])
    
      const getSales = async () => {
        try {
          const res = await axios.get(`${URL}/sales/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSaleData(res.data);
          setRows(res.data); 
        } catch (error) {
          toast.error(error.res.data.message);
        }
      };

    function createData(productName, productType, quantity, amount) {
        return { productName, productType, quantity, amount };
      }
      

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
          const payload = {
            amount: saleData.amount,
            contactId: saleData.contactId,
            paymentStatus: saleData.paymentStatus
          };
          
          const res = await axios.put(`${URL}/sales/updatePayment/${id}`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });

          if (res.status === 200) {
            toast.success(res.data.message);
            navigate('/sales')
          } else {
            toast.error('Failed to update payment');
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
    }

    const handleChange = (event, newPayment) => {
      setSaleData({ ...saleData, paymentStatus: newPayment });
    };

return (
    <Base
    title={"Sales"}>

                <Box component="form" noValidate onSubmit={handleUpdate} sx={{ mt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <div className="contact-details">
        <Grid container spacing={1}>
          <Grid item xs={6} md={6} lg={6}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 250,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                verticalAlign: 'middle',
                bgcolor: '#E6F0EF',
              }}
            >
             <Box>
             <ToggleButtonGroup
                  color="orange"
                  value={ saleData?.paymentStatus }
                  exclusive
                  name= "paymentStatus"
                  onChange={handleChange}
                  aria-label="Platform"
                >
                  <ToggleButton value="Paid">Paid</ToggleButton>
                  <ToggleButton value="Pending">Pending</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <br/>
              <Box>
            <Fab variant="extended" onClick={handleUpdate} sx={{bgcolor:'#00695f'}}>
            <EditIcon sx={{ mr: 1 }} />
              Update
            </Fab>
              </Box> 
              
            </Paper>
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 250,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                verticalAlign: 'middle',
                bgcolor: '#E6F0EF',
              }}
            >
              <Typography variant="h6">Billed To</Typography><br/>
              <Grid container item spacing={1} sx={{ml:10}}>              
                <Grid item >
              <Typography align="right" variant="button">Company Name: </Typography></Grid>
              <Grid item >
              <Typography align="left">{saleData?.companyName}</Typography></Grid>
              </Grid>
              <Grid container item spacing={1} sx={{ml:10}}>
                <Grid item>
              <Typography align="right" variant="button">Name: </Typography></Grid>
              <Grid item>
              <Typography align="left">{saleData?.contactName}</Typography></Grid>
              </Grid>
              <Grid container item spacing={1} sx={{ml:10}}>
                <Grid item>
              <Typography align="left" variant="button">Address: </Typography></Grid>
              <Grid item>
              <Typography align="left">{saleData?.address}</Typography>
              <Grid container item spacing={1}>
                <Grid item>
              <Typography align="right">{saleData?.city} </Typography></Grid>
              <Grid item >
              <Typography align="left">{saleData?.state}</Typography></Grid>
              </Grid>
              <Grid container item spacing={3}>
                <Grid item>
              <Typography align="left">{saleData?.country} </Typography></Grid>
              <Grid item>
              <Typography align="left">{saleData?.pincode}</Typography></Grid>
              </Grid></Grid>

                <Grid container item spacing={1}>
              <Grid item>
              <Typography align="left" variant="button">Mobile: </Typography></Grid>
              <Grid item>
              <Typography>{saleData?.mobile}</Typography></Grid>
              </Grid>
              <Grid item>
              <Typography align="left" variant="button">Email: </Typography></Grid>
              <Grid item>
              <Typography>{saleData?.email}</Typography></Grid>
              </Grid>
              
            </Paper>
          </Grid>
        </Grid>
      </div>

        

          <div>
          <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell align="right">Product Type</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {/* {[rows].map((row) => ( */}
            <TableRow
              key={rows?._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {rows?.productName}
              </TableCell>
              <TableCell align="right">{rows?.productType}</TableCell>
              <TableCell align="right">{rows?.quantity}</TableCell>
              <TableCell align="right">{rows?.amount}</TableCell>
            </TableRow>
          {/* ))} */}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    </Paper>
              </Grid>
            </Grid>
          </Box>

    </Base>
  )
}

export default SaleEdit