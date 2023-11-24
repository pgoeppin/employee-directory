import React from "react";
import * as XLSX from "xlsx";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Grid from "@mui/material/Grid";
import Swal from "sweetalert2";

import { EmployeeContext } from "../context/EmployeeContext";
import { Container, Typography } from "@mui/material";

export default function UploadForm() {
    const { uploadData } = React.useContext(EmployeeContext);
    const [file, setFile] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const inputRef = React.useRef(null);

    // The handleFileUpload function is called when the user selects a file. It checks if the file is valid and if so, it sets the file state to the selected file. If not, it sets the error state to a message.
    
    const handleFileUpload = (e) => {
        e.preventDefault();
        if (!e.target.files[0]) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se ha seleccionado un archivo",
              })
            setLoading(false);
            return;
        }
        const fileType = e.target.files[0].type;
        const validFileTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ];
        if (!validFileTypes.includes(fileType)) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "El archivo seleccionado no es un archivo Excel",
              })
            setLoading(false);
            return;
        }
        setFile(e.target.files[0]);
    }

    // The React.useEffect hook is used to read the file and parse it into a JSON object. It uses the XLSX library to read the file and then it uses the FileReader API to convert the file into a buffer. Then it uses the XLSX library to parse the buffer into a JSON object.
    // Finally, it calls the uploadData function from the EmployeeContext to upload the data to the "database". In this case, the context.

    React.useEffect(() => {
        const readFile = async () => {
            if (!file.name) return;
            setLoading(true);
            try {
                const r = await new Response(file).arrayBuffer();
                const xl = XLSX.read(r, { type: "buffer" });
                const sheetName = xl.SheetNames[0];
                const sheet = xl.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet);
                uploadData(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        readFile();
    }, [file, uploadData]);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    // The render logic checks if the file is loading or if there is an error. If so, it renders a loading message or an error message. If not, it renders the upload button.

    if (loading) return <Typography component="div" variant="h4" sx={{color:"white", mx:4, px:4 }}>Cargando archivo...</Typography>;
    
    return (
        <Grid container justifyContent="center" alignContent="center">
            <Container sx={{ width: "100%", height: "100%", pt:4}}>
                    <Input
                        type="file"
                        onChange={handleFileUpload}
                        sx={{ display: "none" }}
                        inputRef={inputRef}
                    />
                    <Button
                        variant="contained"
                        onClick={handleClick}
                        sx={{ bgcolor: "#434343", color: "white" }}
                    >
                        Subir archivo
                    </Button>
            </Container>
        </Grid>
    );
}
