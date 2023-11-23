import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { CompanyContext } from "../context/CompanyContext";
import { EmployeeContext } from "../context/EmployeeContext";

export default function AccordionPanel() {
  const { companies, companiesLoading } = React.useContext(CompanyContext);
  const { employees, employeesLoading } = React.useContext(EmployeeContext);

  return (
    <div>
      {companiesLoading || employeesLoading ? (
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Loading...
        </Typography>
      ) : (
        companies.map((company) => (
            employees.some((employee) => employee.ID_EMPRESA === company.ID_EMPRESA) ? (
          <Accordion key={company.ID_EMPRESA}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {company.NOMBRE_EMPRESA}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {company.AREAS.map((area) => (
                    employees.some((employee) => employee.ID_EMPRESA === company.ID_EMPRESA && employee.ID_AREA === area.ID_AREA) ? (
                    <Accordion key={area.ID_AREA}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {area.NOMBRE_AREA}
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell align="right">Rut</TableCell>
                                        <TableCell align="right">Edad</TableCell>
                                        <TableCell align="right">Profesión</TableCell>
                                        <TableCell align="right">Cargo</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {employees.filter((employee) => employee.ID_EMPRESA === company.ID_EMPRESA && employee.ID_AREA === area.ID_AREA).map((employee) => (
                                        <TableRow
                                        key={employee.RUT_TRABAJADOR}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                        >
                                        <TableCell component="th" scope="row">
                                            {employee.NOMBRE_TRABAJADOR}
                                        </TableCell>
                                        <TableCell align="right">{employee.RUT_TRABAJADOR}</TableCell>
                                        <TableCell align="right">{employee.EDAD}</TableCell>
                                        <TableCell align="right">{employee.PROFESION}</TableCell>
                                        <TableCell align="right">{employee.CARGO}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                    ) : 
                    <Accordion key={area.ID_AREA}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {area.NOMBRE_AREA}
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>No hay empleados en esta área</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </AccordionDetails>
          </Accordion>
        ): <Accordion key={company.ID_EMPRESA}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {company.NOMBRE_EMPRESA}
            </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>No hay empleados en esta empresa</Typography>
            </AccordionDetails>
            </Accordion>))
      )}
    </div>
  );
}
