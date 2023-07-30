import React from "react";
import Base from "./Base";
import { AppBar, Autocomplete, Box, Button, Dialog, Fab, Grid, IconButton, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { URL, token } from "../App";
import CloseIcon from '@mui/icons-material/Close';
import { forwardRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

const columns = [
  { id: "contactName", label: "Customer Name", minWidth: 100 },
  { id: "productName", label: "Product Name", minWidth: 150 },
  { id: "productType", label: "Product Type", minWidth: 100 },
  { id: "quantity", label: "Quantity", minWidth: 100, align: "right" },
  {
    id: "amount",
    label: "Amount",
    minWidth: 100,
    align: "right",
    format: (value) => `Rs. ${value}`,
  },
  { id: "paymentStatus", label: "Payment Status", minWidth: 150 },
  { id: "createdAt", label: "Created At", minWidth: 170 },
  { id: "createdBy", label: "Created By", minWidth: 150 },
  { id: "updatedAt", label: "Updated At", minWidth: 170 },
  { id: "updatedBy", label: "Updated By", minWidth: 150 },
];

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Sales = ({ overall, overpending, monthName, year, totalAmountMonth, totalAmountYear, totalNoYear, totalNoMonth }) => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const createData = (
    contactName,
    productName,
    productType,
    quantity,
    amount,
    paymentStatus,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
    _id
  ) => {
    const formatDateAndTime = (timeString) => {
      if (!timeString) {
        return "-";
      }
  
      const date = new Date(timeString);
      const formattedDate = date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${formattedDate} ${formattedTime}`;
    };
  
    return {
      contactName,
      productName,
      productType,
      quantity,
      amount,
      paymentStatus,
      createdAt: formatDateAndTime(createdAt),
      createdBy,
      updatedAt: formatDateAndTime(updatedAt),
      updatedBy,
      _id
    };
  };

  // Fetching the sales data
  const getSales = async () => {
    try {
      const respon = await axios.get(`${URL}/sales/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const salesData = respon.data.sales;
      const transformedRows = salesData.map((saleData) =>
        createData(
          saleData.contactName,
          saleData.productName,
          saleData.productType,
          saleData.quantity,
          saleData.amount,
          saleData.paymentStatus,
          saleData.createdAt,
          saleData.createdBy,
          saleData.updatedAt,
          saleData.updatedBy,
          saleData._id
        )
      );
      setRows(transformedRows);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getSales();
  }, []);

  return (
    <Base title={"Sales"}>
      <GenerateSale getSales={getSales}/>
      <div className="cardTitle">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <Typography variant="button" display="block" gutterBottom>
                Overall Total Sales Amount
              </Typography>
              <Typography
                variant="h4"
                display="block"
                color={"#00b0ff"}
                gutterBottom
              >
                Rs. {overall}
              </Typography>
              <br />
              <Typography variant="button" display="block" gutterBottom>
                Overall Total Pending Amount
              </Typography>
              <Typography
                variant="h4"
                display="block"
                color={"#ff9100"}
                gutterBottom
              >
                Rs. {overpending}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <Typography variant="button" display="block" gutterBottom>
                Total Sales Amount - {monthName}
              </Typography>
              <Typography
                variant="h4"
                display="block"
                color={"#00b0ff"}
                gutterBottom
              >
                Rs. {totalAmountMonth}
              </Typography>
              <br />
              <Typography variant="button" display="block" gutterBottom>
                Total Sales Amount - {year}
              </Typography>
              <Typography
                variant="h4"
                display="block"
                color={"#00b0ff"}
                gutterBottom
              >
                Rs. {totalAmountYear}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <Typography variant="button" display="block" gutterBottom>
                Total Sales - {year}
              </Typography>
              <Typography
                variant="h5"
                display="block"
                color={"#ff9100"}
                gutterBottom
              >
                {totalNoYear}
              </Typography>
              <Typography variant="button" display="block" gutterBottom>
                Total Sales - {monthName}
              </Typography>
              <Typography
                variant="h5"
                display="block"
                color={"#ff9100"}
                gutterBottom
              >
                {totalNoMonth}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
      <br />
      <Grid item xs={12} md={12} lg={12}>
        <Typography variant="h5" gutterBottom>
          Sales Data:-
        </Typography>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            bgcolor: "#E6F0EF",
          }}
        >
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, ind) => (
                      <TableRow
                        key={ind}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        onClick={()=> navigate(`/edit/sale/${row._id}`)}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Paper>
      </Grid>
    </Base>
  );
};
export default Sales;


function GenerateSale ({getSales}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [contact, setContact] = useState(null);
  const [fullName, setFullName] = useState();
  const [rows, setRows] = useState([
    createData('', '', 0, 0),
  ]);

  useEffect(() => {
    getContacts();
  }, []);

  const getContacts = async () => {
    try {
      const res = await axios.get(`${URL}/contacts/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContactData(res.data.contacts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSale = async () => {
    try {
      const payload = {
        productName: rows[0].productName,
        productType: rows[0].productType,
        amount: rows[0].amount,
        quantity: rows[0].quantity,
        contactId: contact._id,
        contactName: contact.fullName,
      };

      const response = await axios.post(`${URL}/sales/add`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        getSales();
        setOpen(false);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  function createData(productName, productType, quantity, amount) {
    return { productName, productType, quantity, amount };
  }

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };


  return (
    <div>
      <Fab
        variant="extended"
        sx={{
          mb: 3,
          background: 'orange',
          position: 'fixed',
          top: '5rem',
          right: '2rem',
          zIndex: 1000,
        }}
        onClick={handleClickOpen}
      >
        Generate Sales
      </Fab>
      <div>
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <AppBar sx={{ position: 'relative', background: '#00695f' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Generate Sales
              </Typography>
              <Button autoFocus color="inherit" onClick={handleSale}>
                Bill here
              </Button>
            </Toolbar>
          </AppBar>
          <Box component="form" noValidate onSubmit={handleSale} encType="multipart/form-data" sx={{ mt: 1 }}>
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
                height: 240,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                verticalAlign: 'middle',
                bgcolor: '#E6F0EF',
              }}
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={contactData}
                getOptionLabel={(option) => option.fullName}
                sx={{ width: 300 }}
                onChange={(e, value)=>setContact(value)}
                value={contactData._id}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => <TextField {...params} label="Billing To" />}
              />
              <br/>
              <Typography>Can't find contact, click below to add:</Typography>
              <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Fab aria-label="add" onClick={()=> navigate('/contact')}>
        <AddIcon />
      </Fab></Box>
            </Paper>
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                verticalAlign: 'middle',
                bgcolor: '#E6F0EF',
              }}
            >
              <Typography variant="h6">Billing To</Typography><br/>
              
              <Grid container item spacing={1} sx={{ml:10}}>              
                <Grid item >
              <Typography align="right" variant="button">Company Name: </Typography></Grid>
              <Grid item >
              <Typography align="left">{contact?.companyName}</Typography></Grid>
              </Grid>

              <Grid container item spacing={1} sx={{ml:10}}>
                <Grid item>
              <Typography align="right" variant="button">Name: </Typography></Grid>
              <Grid item>
              <Typography align="left" value={fullName} onChange={(e) => setFullName(e.target.value)}>{contact?.fullName}</Typography></Grid>
              </Grid>

              <Grid container item spacing={1} sx={{ml:10}}>
                <Grid item>
              <Typography align="left" variant="button">Address: </Typography></Grid>
              <Grid item>
              <Typography align="left">{contact?.address}</Typography>
              <Grid container item spacing={1}>
                <Grid item>
              <Typography align="right">{contact?.city} </Typography></Grid>
              <Grid item >
              <Typography align="left">{contact?.state}</Typography></Grid>
              </Grid>
              <Grid container item spacing={3}>
                <Grid item>
              <Typography align="left">{contact?.country} </Typography></Grid>
              <Grid item>
              <Typography align="left">{contact?.pincode}</Typography></Grid>
              </Grid></Grid>

              
                <Grid container item spacing={1}>
              <Grid item>
              <Typography align="left" variant="button">Mobile: </Typography></Grid>
              <Grid item>
              <Typography>{contact?.mobile}</Typography></Grid>
              </Grid>
              <Grid item>
              <Typography align="left" variant="button">Email: </Typography></Grid>
              <Grid item>
              <Typography>{contact?.email}</Typography></Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>

                  <div>
                        <Grid item xs={12} md={12} lg={12}>
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
                          bgcolor: '#E6F0EF'
                        }}
                      >
                          <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 600 }} aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Product Name</TableCell>
                                  <TableCell align="center">Product Type</TableCell>
                                  <TableCell align="center">Quantity</TableCell>
                                  <TableCell align="center">Amount</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {rows.map((row, index) => (
                                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                      <TextField
                                        value={row.productName}
                                        onChange={(e) => handleRowChange(index, 'productName', e.target.value)}
                                      />
                                    </TableCell>
                                    <TableCell align="right">
                                      <TextField
                                        value={row.productType}
                                        onChange={(e) => handleRowChange(index, 'productType', e.target.value)}
                                      />
                                    </TableCell>
                                    <TableCell align="right">
                                      <TextField
                                        type="number"
                                        value={row.quantity}
                                        onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                                      />
                                    </TableCell>
                                    <TableCell align="right">
                                      <TextField
                                        type="number"
                                        value={row.amount}
                                        onChange={(e) => handleRowChange(index, 'amount', e.target.value)}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          </Paper></Grid>
                        </div>

                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Dialog>
      </div>
    </div>
  );
};
