import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

import { CompanyContext } from "../context/CompanyContext";
import { EmployeeContext } from "../context/EmployeeContext";

export default function AccordionPanel() {
  const { companies, companiesLoading } = React.useContext(CompanyContext);
  const { employees, employeesLoading } = React.useContext(EmployeeContext);

  // The rendering logic first checks if the companies and employees are still loading and if so, it renders a loading message. If not, it renders the companies and employees data.
  // Then is a nested map function that renders the companies and areas and then the employees for each area.

  return (
    <Grid container justifyContent="center" alignItems="center">
    <Container sx={{ width: "100%", height: "100%", m: 2, pt: 4}}>
      {companiesLoading || employeesLoading ? (
        <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, color:"white" }}>
        </Typography>
        </Container>
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
                            <Grid container>
                                <Grid item xs={12}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Rut</TableCell>
                                        <TableCell>Edad</TableCell>
                                        <TableCell>Profesión</TableCell>
                                        <TableCell>Cargo</TableCell>
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
                                        <TableCell>{employee.RUT_TRABAJADOR}</TableCell>
                                        <TableCell>{employee.EDAD}</TableCell>
                                        <TableCell>{employee.PROFESION}</TableCell>
                                        <TableCell>{employee.CARGO}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                </Grid>
                            </Grid>
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
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>No hay información de empleados en esta área</Typography>
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
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>No hay información de empleados en esta empresa</Typography>
            </AccordionDetails>
            </Accordion>))
      )}
    </Container>
    </Grid>
  );
}
