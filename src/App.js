import './index.css';
import React from "react";
import CompanyProvider from './context/CompanyContext';
import EmployeeProvider from './context/EmployeeContext';
import AccordionPanel from './components/AccordionPanel';

function App() {
  return (
    <>
      <CompanyProvider>
        <EmployeeProvider>
          <AccordionPanel />
        </EmployeeProvider>
      </CompanyProvider>    
    </>

  );
}

export default App;
