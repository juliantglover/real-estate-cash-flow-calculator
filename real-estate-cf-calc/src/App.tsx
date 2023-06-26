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
import SavedProperties from "./SavedProperties";
import Calculator from "./Calculator";

interface Expense {
  name: string;
  monthlyValue: number;
}
const propertiesKey = "property-values";

function App() {
  const scrollRef = useRef(null);
  const [anchorOpen, setAnchorOpen] = useState<boolean>(false);

  const [page, setPage] = useState<string>("calc");

  const iconClass = !anchorOpen ? "showMenu" : "hideMenu";

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  const [propertyName, setPropertyName] = useState<string>();

  const [propertyValues, setPropertyValues] = useState({
    purchasePrice: 0,
    rent: 0,
    interestRate: 0,
    taxes: 0,
    hoa: 0,
    monthlyUtilities: 0,
    vacancy: 0,
    insurance: 0,
    additionalMonthlyExpenses: 0,
    closingCostPercent: 0,
    closingCostCalculationChoice: "percent",
    propertyManagementCalculationChoice: "percent",
    maintenanceCalculationChoice: "percent",
    capitalExpendituresCalculationChoice: "percent",
    downPaymentCalculationChoice: "percent",
  });

  const [cashFlowValues, setCashFlowValues] = useState({
    downPayment: 0,
    interestConstant: 0,
    mortgageLoanAmount: 0,
    principalAndInterest: 0,
    capitalExpenditures: 0,
    vacancy: 0,
    totalMonthlyExpenses: 0,
    cashFlow: 0,
    closingCosts: 0,
    maintenance: 0,
    fixedExpenses: 0,
    propertyManagement: 0,
    netOperatingExpenses: 0,
    requiredStartingCapital: 0,
    cashOnCashReturn: 0,
    netOperatingIncome: 0,
    pmi: 0,
    capRate: 0,
  });

  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const formatCurrency = (numberValue: number) =>
    Math.round(numberValue).toLocaleString("en-US");

  const calculateMortgagePayment = (propertyValues) => {
    const downPayment: number =
      propertyValues.downPaymentCalculationChoice === "percent"
        ? (propertyValues.downPaymentPercent / 100) *
          propertyValues.purchasePrice
        : propertyValues.downPaymentDollarValue;
    const closingCosts: number =
      propertyValues.closingCostCalculationChoice === "percent"
        ? (propertyValues.closingCostPercent / 100) *
          propertyValues.purchasePrice
        : propertyValues.closingCostDollarValue;
    const propertyManagement: number =
      propertyValues.propertyManagementCalculationChoice === "percent"
        ? (propertyValues.propertyManagementPercent / 100) * propertyValues.rent
        : propertyValues.propertyManagementDollarValue;
    const capitalExpenditures: number =
      propertyValues.capitalExpendituresCalculationChoice === "percent"
        ? (propertyValues.capitalExpendituresPercent / 100) *
          propertyValues.rent
        : propertyValues.capitalExpendituresDollarValue;
    const maintenance: number =
      propertyValues.maintenanceCalculationChoice === "percent"
        ? (propertyValues.maintenancePercent / 100) * propertyValues.rent
        : propertyValues.maintenanceDollarValue;
    const interestConstant: number =
      Number(propertyValues.interestRate) / 100 / 12;
    const mortgageLoanAmount: number =
      Number(propertyValues.purchasePrice) - downPayment;
    const principalAndInterest: number =
      mortgageLoanAmount *
      ((interestConstant * Math.pow(1 + interestConstant, 360)) /
        (Math.pow(1 + interestConstant, 360) - 1));
    const vacancy: number =
      (propertyValues.vacancy / 100) * propertyValues.rent;
    const fixedExpenses: number =
      principalAndInterest +
      propertyManagement +
      Number(propertyValues.monthlyUtilities) +
      Number(propertyValues.hoa) +
      Number(propertyValues.taxes) +
      Number(propertyValues.insurance);
    const totalMonthlyExpenses: number =
      principalAndInterest +
      vacancy +
      propertyManagement +
      capitalExpenditures +
      maintenance +
      Number(propertyValues.additionalMonthlyExpenses) +
      Number(propertyValues.monthlyUtilities) +
      Number(propertyValues.hoa) +
      Number(propertyValues.taxes) +
      Number(propertyValues.insurance);
    const netOperatingExpenses: number =
      vacancy +
      propertyManagement +
      maintenance +
      Number(propertyValues.additionalMonthlyExpenses) +
      Number(propertyValues.monthlyUtilities) +
      Number(propertyValues.hoa) +
      Number(propertyValues.taxes) +
      Number(propertyValues.insurance);
    const netOperatingIncome: number =
      Number(propertyValues.rent) - netOperatingExpenses;
    const cashFlow: number = Number(propertyValues.rent) - totalMonthlyExpenses;
    const requiredStartingCapital: number =
      Number(closingCosts) + Number(downPayment);

    let capRate: number = 0;
    if (propertyValues.purchasePrice > 0) {
      capRate =
        ((netOperatingIncome * 12) / propertyValues.purchasePrice) * 100;
    }

    let pmi: number = 0;
    if (propertyValues.purchasePrice > 0) {
      if (mortgageLoanAmount / propertyValues.purchasePrice > 0.8) {
        const annualPmi = (1.235 / 100) * mortgageLoanAmount;
        pmi = annualPmi / 12;
      }
    }
    let startingCapital = 1;
    if (requiredStartingCapital > 0) {
      startingCapital = requiredStartingCapital;
    }
    const cashOnCashReturn =
      (((Number(propertyValues.rent) - fixedExpenses) * 12) / startingCapital) *
      100;
    setCashFlowValues({
      downPayment,
      interestConstant,
      mortgageLoanAmount,
      principalAndInterest,
      capitalExpenditures,
      vacancy,
      totalMonthlyExpenses,
      cashFlow,
      fixedExpenses,
      closingCosts,
      maintenance,
      propertyManagement,
      netOperatingExpenses,
      requiredStartingCapital,
      cashOnCashReturn,
      netOperatingIncome,
      pmi,
      capRate,
    });
  };

  const roiData = () => [
    {
      name: "Starting Capital Required",
      value: cashFlowValues.requiredStartingCapital,
      label: "$",
      bold: true,
    },
    {
      name: "Net Operating Income",
      value: cashFlowValues.netOperatingIncome,
      label: "$",
      bold: true,
    },
    {
      name: "Cash on Cash Return",
      value: cashFlowValues.cashOnCashReturn,
      label: "%",
      bold: true,
    },
    { name: "CAP Rate", value: cashFlowValues.capRate, label: "%", bold: true },
  ];
  const expenseData = () => {
    const expenses: Expense[] = [
      {
        name: "Principal & Interest",
        monthlyValue: cashFlowValues.principalAndInterest,
      },
      { name: "Pmi", monthlyValue: cashFlowValues.pmi },
      { name: "Home Insurance", monthlyValue: propertyValues.insurance },
      { name: "Property Taxes", monthlyValue: propertyValues.taxes },
      { name: "HOA Fee", monthlyValue: propertyValues.hoa },
      { name: "Utilities", monthlyValue: propertyValues.monthlyUtilities },
      {
        name: "Capital Expenditures",
        monthlyValue: cashFlowValues.capitalExpenditures,
      },
      { name: "Maintenance", monthlyValue: cashFlowValues.maintenance },
      { name: "Vacancy", monthlyValue: cashFlowValues.vacancy },
      {
        name: "Miscellaneous Expenses",
        monthlyValue: propertyValues.additionalMonthlyExpenses,
      },
    ];

    return expenses.map((expense) => {
      return {
        name: expense.name,
        monthlyCost: Math.round(expense.monthlyValue),
        annualCost: Math.round(expense.monthlyValue * 12),
      };
    });
  };

  const onSubmit = async (values) => {
    window.scrollTo(0, scrollRef.current.offsetTop);
    setPropertyValues(values);
    calculateMortgagePayment(values);
  };

  const onSubmitPropertyName = async (values) => {
    console.log("values");
    console.log(values);
    const propName = values.PropertyName;
    setPropertyName(propName);
    const currentProperties = localStorage.getItem(propertiesKey);
    let properties: any[] = [];
    console.log(currentProperties);
    if (currentProperties && currentProperties.length > 0) {
      properties = JSON.parse(currentProperties);
    }
    properties.push({
      propertyName: propName,
      propertyValues: propertyValues,
    });
    console.log("propertyName");
    console.log(propName);
    console.log(propertyValues);
    localStorage.setItem(propertiesKey, JSON.stringify(properties));
  };

  const required = (value) => (value ? undefined : "Required");
  const mustBeNumber = (value) =>
    isNaN(value) ? "Must be a number" : undefined;
  const minValue = (min) => (value) =>
    isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`;
  const maxValue = (max) => (value) =>
    isNaN(value) || value <= max ? undefined : `Should be less than ${max}`;
  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );

  let boxBorder = {};
  if (screenWidth > 1000) {
    boxBorder = {
      borderRight: "solid 1px #1976d2",
      borderRadius: "2px",
      padding: "10px",
      height: "100%",
    };
  }

  return (
    <div>
      <span className={iconClass}>
        <MenuOutlinedIcon
          fontSize="large"
          color="action"
          onClick={() => setAnchorOpen(true)}
        />
      </span>
      <Drawer
        anchor={"left"}
        open={anchorOpen}
        onClose={() => setAnchorOpen(false)}
      >
        <p onClick={() => setPage("calc")}>Calculator</p>
        <p onClick={() => setPage("savedprops")}>Saved Properties</p>
      </Drawer>
      <Container>
        {page === "savedprops" && <SavedProperties />}
        {page === "calc" && <Calculator />}
      </Container>
    </div>
  );
}

export default App;
