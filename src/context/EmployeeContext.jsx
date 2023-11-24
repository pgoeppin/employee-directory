import React from "react";
import { CompanyContext } from "./CompanyContext";
import Swal from "sweetalert2";

export const EmployeeContext = React.createContext({});

const EmployeeProvider = (props) => {
  const [employees, setEmployees] = React.useState([]);
  const [employeesLoading, setEmployeesLoading] = React.useState(true);
  const { companies, companiesLoading } = React.useContext(CompanyContext);

  // Function to validate data types and regex for RUT
  // NOMBRE_TRABAJADOR, PROFESION, CARGO should be strings, EDAD should be an integer more than 0 and less than 120 years old, RUT should be a regex where the first 8 digits are integer then a dash then a number or a letter K
  const validateData = (data) => {
    return data.every((item) => {
      const { NOMBRE_TRABAJADOR, PROFESION, CARGO, EDAD, RUT_TRABAJADOR } =
        item;
      const validRut = /^(\d{1,8})-(\d|k)$/.test(RUT_TRABAJADOR);
      const validEdad = Number.isInteger(EDAD) && EDAD > 0 && EDAD < 120;
      const validNombreTrabajador = typeof NOMBRE_TRABAJADOR === "string";
      const validProfesion = typeof PROFESION === "string";
      const validCargo = typeof CARGO === "string";
      return (
        validRut &&
        validEdad &&
        validNombreTrabajador &&
        validProfesion &&
        validCargo
      );
    });
  };

  // function to validate if company IDs exist in the database
  const validateCompanyIDs = (employeeCompanyIDs, validCompanyIDs) => {
    return employeeCompanyIDs.every((employeeID) =>
      validCompanyIDs.includes(employeeID)
    );
  };
    
  // function to validate if area IDs exist in the database
  const validateAreaIDs = (employeeAreaIDs, validAreaIDs) => {
    return employeeAreaIDs.every((employeeID) =>
        validAreaIDs.includes(employeeID)
      );
    };

  // function to upload data from excel file using useCallback to avoid infinite loop when using useEffect in UploadForm.jsx to call this function when the file state changes
  const uploadData = React.useCallback((parsedData) => {
    // Validate column structure
    const expectedColumns = [
      "ID_EMPRESA",
      "ID_AREA",
      "RUT_TRABAJADOR",
      "NOMBRE_TRABAJADOR",
      "EDAD",
      "CARGO",
    ];

    const actualColumns = Object.keys(parsedData[0] || {});

    // Check if all required columns are present
    if (!expectedColumns.every((col) => actualColumns.includes(col))) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El archivo seleccionado no tiene la estructura correcta y no se puede subir",
      });
      return;
    }

    // If "PROFESION" is missing, add it and set the value to "No informa"
    if (!actualColumns.includes("PROFESION")) {
      parsedData.forEach((item) => {
        item.PROFESION = "No informa";
      });
    }

    // Check for duplicates in the same excel file
    const uniqueParsedData = [
      ...new Set(parsedData.map((item) => item.RUT_TRABAJADOR)),
    ].map((rut) => {
      return parsedData.find((item) => item.RUT_TRABAJADOR === rut);
    });

    const isValidData = validateData(uniqueParsedData);

    // array with company IDs from the excel file
    const parsedCompanyIDs = uniqueParsedData.map(
      (employee) => employee.ID_EMPRESA
    );

    // array with company IDs from the database (JSON)
    const companyIDs = companies.map((company) => company.ID_EMPRESA);

    // array with area IDs from the excel file
    const parsedAreaIDs = uniqueParsedData.map((employee) => employee.ID_AREA);

    // array with area ids from the database (JSON)
    const areaIDs = companies
      .map((company) => company.AREAS)
      .flat()
      .map((area) => area.ID_AREA);

    // validate if area IDs exist in the database
    const isValidAreaIDs = validateAreaIDs(parsedAreaIDs, areaIDs);

    // validate if company IDs exist in the database
    const isValidCompanyIDs = validateCompanyIDs(parsedCompanyIDs, companyIDs);

    // If any of the validations fail, set employeesLoading to true
    if (
      companiesLoading ||
      !isValidAreaIDs ||
      !isValidCompanyIDs ||
      !isValidData
    ) {
      setEmployeesLoading(true);
    } else {
      // Map company and area names to employees
      const employeesWithNames = uniqueParsedData.map((employee) => ({
        ...employee,
        NOMBRE_EMPRESA: companies.find(
          (company) => company.ID_EMPRESA === employee.ID_EMPRESA
        ).NOMBRE_EMPRESA,
        NOMBRE_AREA: companies
          .find((company) => company.ID_EMPRESA === employee.ID_EMPRESA)
          .AREAS.find((area) => area.ID_AREA === employee.ID_AREA).NOMBRE_AREA,
      }));

      setEmployees(employeesWithNames);
      setEmployeesLoading(false);
    }
  }, [companies, companiesLoading, setEmployees, setEmployeesLoading]);

  return (
    <EmployeeContext.Provider
      value={{ employees, employeesLoading, uploadData }}
    >
      {props.children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeProvider;
