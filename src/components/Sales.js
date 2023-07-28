import React from "react";
import Base from "./Base";
import { AppBar, Autocomplete, Box, Button, Dialog, Divider, Fab, Grid, IconButton, List, ListItem, ListItemText, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { URL, token } from "../App";
import CloseIcon from '@mui/icons-material/Close';
import { forwardRef } from "react";
import { toast } from "react-toastify";

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

const Sales = ({
  overall,
  overpending,
  monthName,
  year,
  totalAmountMonth,
  totalAmountYear,
  totalNoYear,
  totalNoMonth,
}) => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    updatedBy
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
          saleData.updatedBy
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
      <GenerateSale/>
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
                    .map((row) => (
                      <TableRow
                        key={row.contactId}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        onClick={handleClickOpen}
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
        <div>
        <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', background: "#00695f" }}>
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
              Sound
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItem>
        </List>
      </Dialog>
        </div>
      </Grid>
    </Base>
  );
};
export default Sales;


function GenerateSale() {
  const [open, setOpen] = useState(false);
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    getContacts();
  },[])

  const getContacts = async () => {
    try {
      const res = await axios.get(`${URL}/contacts/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContactData(res.data.contacts);
    } catch (error) {
      toast.error(error.res.data.message);
    }
  };

  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSale = () => {
    // 
  }


  return(
    <div>
      <Fab variant="extended" 
      sx={{ mb: 3, background: "orange", position: "fixed", top: "5rem", right: "2rem", zIndex: 1000 }}
       onClick={handleClickOpen} >
        Generate Sales
      </Fab>    
    <div>
        <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', background: "#00695f" }}>
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
              Generate Sales
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSale}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Box
          component="form"
          noValidate
          onSubmit={handleSale}
          encType="multipart/form-data"
          sx={{ mt: 1 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              
                <div className="contact-details">
          <Grid item xs={12} md={6} lg={6}>
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
               <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={contactData}
      getOptionLabel={(option) => option.fullName}
      
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Billing To" />}
    />

            </Paper>
          </Grid>
                </div>
 
              </Paper> 
            </Grid>
          </Grid>
        </Box>
      </Dialog>
        </div>
        </div>
  )
}