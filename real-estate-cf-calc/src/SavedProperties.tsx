import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Form, Field } from "react-final-form";
import { FormCheck } from "react-bootstrap";
import { Header } from "./Components/Text/Header";
import { Spacer } from "./Components/Layout/Spacer";
import { ErrorText } from "./Components/Text/ErrorText";
import { TextField } from "./Components/Form/TextField";
import { Button } from "@mui/material";
import Table from "@mui/material/Table";
import Box from "@mui/material/Box";
import { Drawer } from "@mui/material";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
const propertiesKey = "property-values";

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState<any[]>();

  useEffect(() => {
    const savedProps = localStorage.getItem(propertiesKey);
    if (savedProps) {
      setSavedProperties(JSON.parse(savedProps));
    }
  }, []);

  const [rowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ]);

  const [columnDefs] = useState<any>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);
  return (
    <Container>
      <>
        {savedProperties?.map((p) => (
          <Typography key={p.propertyName}>{p.propertyName}</Typography>
        ))}
      </>
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
      </div>
    </Container>
  );
};

export default SavedProperties;
