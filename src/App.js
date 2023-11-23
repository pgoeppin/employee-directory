import './index.css';
import React from "react";
import CompanyProvider from './context/CompanyContext';
import { CompanyContext } from './context/CompanyContext';
import EmployeeProvider, { EmployeeContext } from './context/EmployeeContext';

//FALTA MATERIAUI
function CompanyList() {
  const { companies } = React.useContext(CompanyContext);
  return (
    <div>
      {companies.map((company) => (
        <li key={company.ID_EMPRESA}>
          {company.NOMBRE_EMPRESA}
        </li>
      ))}
    </div>
  );
}

function EmployeeList() {
  const { employees } = React.useContext(EmployeeContext)
  return (
    <div>
      {employees.map((employee) => (
        <li key={employee.RUT_TRABAJADOR}>
           {employee.NOMBRE_TRABAJADOR}
           {employee.NOMBRE_EMPRESA}
        </li>
      ))}
    </div>
  )
}


function App() {
  return (
    <>
      <CompanyProvider>
        <EmployeeProvider>
        <div>
          <h1>Listado de Empresas</h1>
          <CompanyList />
        </div>
        <div>
          <EmployeeList />
        </div>
        </EmployeeProvider>
      </CompanyProvider>    
    </>

  );
}

export default App;
