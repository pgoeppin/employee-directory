import './index.css';
import React from "react";
import CompanyProvider from './context/CompanyContext';
import { CompanyContext } from './context/CompanyContext';

function CompanyList() {
  const { companies } = React.useContext(CompanyContext);
  console.log(companies)
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


function App() {
  return (
    <>
      <CompanyProvider>
        <div>
          <h1>Listado de Empresas</h1>
          <CompanyList />
        </div>
      </CompanyProvider>    
    </>

  );
}

export default App;
