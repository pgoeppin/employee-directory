import './index.css';
import React from "react";
import CompanyProvider from './context/CompanyContext';
import EmployeeProvider from './context/EmployeeContext';
import AccordionPanel from './components/AccordionPanel';
import Header from './components/Header';
import Footer from './components/Footer';
import Grid from "@mui/material/Grid";

function App() {
  return (
    <Grid container sx={{width: '100%', maxHeight: '100%', minHeight: '100vh', bgcolor: '#292929'}}>
      <CompanyProvider>
        <EmployeeProvider>
          <Grid item xs={12}>
          <Header />
          </Grid>
          <AccordionPanel />
          <Grid item xs={12}>
          <Footer />
          </Grid>
        </EmployeeProvider>
      </CompanyProvider>    
    </Grid>
  );
}

export default App;
