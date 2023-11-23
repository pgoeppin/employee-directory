import React from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { CompanyContext } from "./CompanyContext";

export const EmployeeContext = React.createContext({});

const EmployeeProvider = (props) => {
  const [employees, setEmployees] = React.useState([]);
  const [employeesLoading, setEmployeesLoading] = React.useState(true);
  const { companies, companiesLoading } = React.useContext(CompanyContext);

  React.useEffect(() => {
    const getEmployees = async () => {
      try {
        const filename = "./origen-datos-junior.xlsx";

        const r = await axios.get(filename, { responseType: "arraybuffer" });

        const xl = XLSX.read(r.data, { type: "buffer" });
        const sheetName = xl.SheetNames[0];
        const sheet = xl.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        // Validate column structure
        const requiredColumns = [
          "ID_EMPRESA",
          "ID_AREA",
          "RUT_TRABAJADOR",
          "NOMBRE_TRABAJADOR",
          "EDAD",
          "CARGO",
        ];
        const actualColumns = Object.keys(data[0] || {});

        // Check if all required columns are present
        if (!requiredColumns.every((col) => actualColumns.includes(col))) {
          console.error("Invalid column structure in Excel file.");
          return;
        }

        // If "PROFESION" is missing, add it and set the value to "No informa"
        if (!actualColumns.includes("PROFESION")) {
          data.forEach((item) => {
            item.PROFESION = "No informa";
          });
        }

        // Check for duplicates in the same excel file

        const uniqueData = [
          ...new Set(data.map((item) => item.RUT_TRABAJADOR)),
        ].map((rut) => {
          return data.find((item) => item.RUT_TRABAJADOR === rut);
        });

        // NOMBRE_TRABAJADOR, PROFESION, CARGO should be strings, EDAD should be an integer more than 0 and less than 120 years old, RUT should be a regex where the first 8 digits are integer then a dash then a number or a letter K

        // Function to validate data types and regex for RUT
        const validateData = (data) => {
          return data.every((item) => {
            const {
              NOMBRE_TRABAJADOR,
              PROFESION,
              CARGO,
              EDAD,
              RUT_TRABAJADOR,
            } = item;
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

        const isValidData = validateData(uniqueData);

        // in this case, the company IDs are valid, but we need to wait for the API to load the company id first
        // function to validate if company IDs are valid
        const validateCompanyIDs = (employeeCompanyIDs, validCompanyIDs) => {
          return employeeCompanyIDs.every((employeeID) =>
            validCompanyIDs.includes(employeeID)
          );
        };

        // function to validate if area IDs are valid
        const validateAreaIDs = (employeeAreaIDs, validAreaIDs) => {
          return employeeAreaIDs.every((employeeID) =>
            validAreaIDs.includes(employeeID)
          );
        };

        // array with company IDs from the excel file
        const parsedCompanyIDs = uniqueData.map(
          (employee) => employee.ID_EMPRESA
        );

        // array with company IDs from the database (JSON)
        const companyIDs = companies.map((company) => company.ID_EMPRESA);

        // array with area IDs from the excel file
        const parsedAreaIDs = uniqueData.map((employee) => employee.ID_AREA);

        // array with area ids from the database (JSON)
        const areaIDs = companies
          .map((company) => company.AREAS)
          .flat()
          .map((area) => area.ID_AREA);       

        // validate if area IDs exist in the database
        const isValidAreaIDs = validateAreaIDs(parsedAreaIDs, areaIDs);

        // validate if company IDs exist in the database
        const isValidCompanyIDs = validateCompanyIDs(
          parsedCompanyIDs,
          companyIDs
        );

        // If any of the validations fail, set employeesLoading to true
        if (
          companiesLoading ||
          !isValidCompanyIDs ||
          !isValidAreaIDs ||
          !isValidData
        ) {
          setEmployeesLoading(true);
        } else {
          // Map company and area names to employees
          const employeesWithNames = uniqueData.map((employee) => ({
            ...employee,
            NOMBRE_EMPRESA: companies.find(
              (company) => company.ID_EMPRESA === employee.ID_EMPRESA
            ).NOMBRE_EMPRESA,
            NOMBRE_AREA: companies
              .find((company) => company.ID_EMPRESA === employee.ID_EMPRESA)
              .AREAS.find((area) => area.ID_AREA === employee.ID_AREA)
              .NOMBRE_AREA,
          }));
          setEmployees(employeesWithNames);
          setEmployeesLoading(false);
        }
      } catch (err) {
        console.error(err);
        setEmployeesLoading(false);
      }
    };
    getEmployees();
  }, [companies, companiesLoading]);

  const handleFileUpload = (e) => {
    // Reading and parsing the xlsx file
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      // Validate column structure
      const expectedColumns = [
        "ID_EMPRESA",
        "ID_AREA",
        "RUT_TRABAJADOR",
        "NOMBRE_TRABAJADOR",
        "EDAD",
        "PROFESION",
        "CARGO",
      ];

      const actualColumns = Object.keys(parsedData[0] || {});

      if (!expectedColumns.every((col) => actualColumns.includes(col))) {
        console.error("Invalid column structure in Excel file.");
        return;
      }

      // Validate company ID
      const companyIDs = companies.map((company) => company.ID_EMPRESA);
      const parsedCompanyIDs = parsedData.map((rowData) => rowData.ID_EMPRESA);
      if (!parsedCompanyIDs.every((id) => companyIDs.includes(id))) {
        console.error("Invalid company ID in Excel file.");
        return;
      }

      // Check for duplicates and add new data to the state
      setEmployees((prevEmployees) => {
        const uniqueParsedData = parsedData.filter(
          (rowData) =>
            !prevEmployees.some(
              (emp) => emp.RUT_TRABAJADOR === rowData.RUT_TRABAJADOR
            )
        );
        return [...prevEmployees, ...uniqueParsedData];
      });
    };
  };

  return (
    <EmployeeContext.Provider value={{ employees, employeesLoading, handleFileUpload }}>
      {props.children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeProvider;
