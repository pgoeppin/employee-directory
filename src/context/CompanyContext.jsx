import React from "react";
import axios from "axios";

export const CompanyContext = React.createContext({})

const CompanyProvider = (props) => {
    const [companies, setCompanies] = React.useState([])
    React.useEffect(() => {
        const getCompanies = async () => {
            try {
                const endpoint = "./dicionario-de-datos.json";
                const r = await axios.get(endpoint)
                setCompanies(r.data.EMPRESAS)
                } catch (error) {
                    console.log(error)
                    };
    }
    getCompanies();
    }, [])
    return (
        <CompanyContext.Provider
        value={{ companies, setCompanies }}
        >
            {props.children}
        </CompanyContext.Provider>
    );
};
export default CompanyProvider;