/* eslint-disable */
import axios from 'axios'; 

import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal'; // Import the Modal component

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import Dialog from '@mui/material/Dialog'; // Import Dialog component
import DialogTitle from '@mui/material/DialogTitle'; // Import DialogTitle component
import DialogActions from '@mui/material/DialogActions'; // Import DialogActions component
// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  location,
  field,
  status,
}) {
  const [open, setOpen] = useState(false); // State variable to control the modal

  const [employees, setEmployees] = useState([])

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenModal = () => {
    // When the "Get Employees" button is clicked, fetch the data
    handleGetEmployees(name);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleGetEmployees = (name) => {
    axios.get(`http://localhost:8030/company/getEmployeesByCompanyName/${name}`)
      .then((response) => {
        // Handle success, set employees state with the array of employee names
        const employeeNames = response.data.map((item) => item.EmployeeName.value); // Assuming 'value' is the correct property
        setEmployees(employeeNames);
  
        // Open the modal to display the employee data
        setOpen(true);
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
        console.error('Error fetching employees:', error);
      });
  };
  
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{location}</TableCell>

        <TableCell>{field}</TableCell>

        <TableCell align="center">
          <Button variant="contained" color="inherit" onClick={handleOpenModal}>
            Get Employees
          </Button>
        </TableCell>

        <TableCell>
          <Label color={(status === 'banned' && 'error') || 'success'}>{status}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Employees</DialogTitle>
       
        <ul>
         {employees.length === 0 ? (
            <p>This company has no employees</p>
          ) : 
          employees.map((employee, index) => (
          <li key={index}>{employee}</li>
    ))
  }
</ul>
        
        <DialogActions>
          <Button onClick={handleCloseMenu } color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  field: PropTypes.any,
  location: PropTypes.any,
  employees: PropTypes.array, // Update prop type for employees to array
  name: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
