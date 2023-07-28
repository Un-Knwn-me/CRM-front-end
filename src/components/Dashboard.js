import React, { useEffect, useState } from 'react'
import Base from './Base'
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import {URL, token} from '../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const columns = [
  { id: "type", label: "Type", minWidth: 100 },
  { id: "fullName", label: "Full Name", minWidth: 150 },
  { id: "companyName", label: "Company Name", minWidth: 100 },
  { id: "email", label: "E-mail", minWidth: 100, align: "right" },
  { id: "mobile", label: "Mobile", minWidth: 100, align: "right", },
  { id: "industry", label: "Industry", minWidth: 150 },
  { id: "city", label: "City", minWidth: 150 },
  { id: "state", label: "state", minWidth: 150 },
  { id: "createdAt", label: "Created At", minWidth: 170 },
  { id: "createdBy", label: "Created By", minWidth: 150 },
  { id: "updatedAt", label: "Updated At", minWidth: 170 },
  { id: "updatedBy", label: "Updated By", minWidth: 150 },
];

const Dashboard = ({ overall, overpending, totalAmountYear, totalAmountMonth, monthName, year, greeting, userName }) => {
  // const [leads, setLeads] = useState([]);
  // const [leadcount, setLeadCount] = useState([]);
  
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

    // Fetching Leads
    const getLeads = async () => {
      try {
        const res = await axios.get(`${URL}/leads/status/Created`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const leadsData = res.data.leads;
        const transformedRows = leadsData.map((leadData) =>
          createData(
            leadData.type,
            leadData.companyName,
            leadData.fullName,
            leadData.email,
            leadData.mobile,
            leadData.industry,
            leadData.city,
            leadData.status,
            leadData.createdAt,
            leadData.createdBy,
            leadData.updatedAt,
            leadData.updatedBy
          )
        );
        setRows(transformedRows);

      } catch (error) {
        console.error(error);
      }
    };
    
  useEffect(() => {
    getLeads();
  });

  // table

  const createData = (
    type,
    fullName,
    companyName,
    mobile,
    email,
    industry,
    city,
    status,
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
      type,
      fullName,
      companyName,
      mobile,
      email,
      industry,
      city,
      status,
      createdAt: formatDateAndTime(createdAt),
      createdBy,
      updatedAt: formatDateAndTime(updatedAt),
      updatedBy,
    };
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Base
    title={"Dashboard"}
    >
    <div>
        <Grid container spacing={3}>
             {/* Chart */}
             <Grid item xs={12} md={4} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240, 
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    verticalAlign: "middle"
                  }}
                > 
                 <Typography variant="button" display="block" gutterBottom>
        Overall Total Sales Amount
      </Typography>
      <Typography variant="h4" display="block"  color={"#00b0ff"} gutterBottom>
      Rs. {overall}
      </Typography>
      <br/>
      <Typography variant="button" display="block" gutterBottom>
        Overall Total Pending Amount
      </Typography>
      <Typography variant="h4" display="block"  color={"#ff9100"} gutterBottom>
        Rs. {overpending}
      </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    verticalAlign: "middle"
                  }}
                > 
                <Typography variant="button" display="block" gutterBottom>
        Total Sales Amount - {year}
      </Typography>
      <Typography variant="h4" display="block"  color={"#00b0ff"} gutterBottom>
        Rs. {totalAmountYear}
      </Typography>
      <br/>
      <Typography variant="button" display="block" gutterBottom>
        Total sales Amount - {monthName}
      </Typography>
      <Typography variant="h4" display="block"  color={"#00b0ff"} gutterBottom>
        Rs. {totalAmountMonth}
      </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    verticalAlign: "middle"
                  }}
                >
                   <Typography variant="h5" gutterBottom>
        {greeting},
      </Typography>
      <Typography variant="h4" gutterBottom color={'#8bc34a'}>
        {userName}
      </Typography>
                </Paper>
              </Grid>
              {/* Lead Table */}
               
      <Grid item xs={12} md={12} lg={12}>
        <Typography variant="h5" gutterBottom>
        Present undertakings:- (Created Lead)
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
                        key={row._id}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        onClick={()=> navigate(`/edit/lead/${row._id}`)}
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
            </Grid>
    </div>
    </Base>
  )
}

export default Dashboard