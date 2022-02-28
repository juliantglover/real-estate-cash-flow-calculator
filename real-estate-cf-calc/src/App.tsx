import React, {useState} from 'react';
import './App.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Form, Field } from 'react-final-form';
import { FormCheck } from 'react-bootstrap';
import { Header } from './Components/Text/Header';
import { Spacer } from './Components/Layout/Spacer';
import { ErrorText } from './Components/Text/ErrorText';
import { TextField } from './Components/Form/TextField';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


interface Expense {
  name: string;
  monthlyValue: number;
}

function App() {


  const [propertyValues, setPropertyValues] = useState(
    { 
      purchasePrice: 0,
      rent: 0,
      interestRate: 0,
      taxes:0,
      hoa:0,
      monthlyUtilities: 0,
      vacancy: 0,
      insurance: 0,
      additionalMonthlyExpenses: 0,
      closingCostPercent: 0,
      closingCostCalculationChoice: "percent",
      propertyManagementCalculationChoice:"percent",
      maintenanceCalculationChoice:"percent",
      capitalExpendituresCalculationChoice:"percent",
      downPaymentCalculationChoice: "percent",

    }
  );

  const [cashFlowValues, setCashFlowValues] = useState(
    {
      downPayment: 0,
      interestConstant: 0,
      mortgageLoanAmount: 0, 
      principalAndInterest: 0,
      capitalExpenditures: 0,
      vacancy: 0,
      totalMonthlyExpenses: 0,
      cashFlow: 0,
      closingCosts:0,
      maintenance:0,
      fixedExpenses: 0,
      propertyManagement:0,
      netOperatingExpenses:0,
      requiredStartingCapital: 0,
      cashOnCashReturn: 0,
      netOperatingIncome: 0,
      pmi:0,
      capRate: 0
    });
  
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const calculateMortgagePayment = (propertyValues) => {
      const downPayment: number = propertyValues.downPaymentCalculationChoice === 'percent' ? ((propertyValues.downPaymentPercent)/100)*propertyValues.purchasePrice : propertyValues.downPaymentDollarValue;
      const closingCosts: number = propertyValues.closingCostCalculationChoice === 'percent' ? ((propertyValues.closingCostPercent)/100)*propertyValues.purchasePrice : propertyValues.closingCostDollarValue;
      const propertyManagement: number = propertyValues.propertyManagementCalculationChoice === 'percent' ? ((propertyValues.propertyManagementPercent)/100)*propertyValues.rent : propertyValues.propertyManagementDollarValue;
      const capitalExpenditures: number = propertyValues.capitalExpendituresCalculationChoice === 'percent' ? ((propertyValues.capitalExpendituresPercent)/100)*propertyValues.rent : propertyValues.capitalExpendituresDollarValue;
      const maintenance: number = propertyValues.maintenanceCalculationChoice === 'percent' ? ((propertyValues.maintenancePercent)/100)*propertyValues.rent : propertyValues.maintenanceDollarValue;
      const interestConstant: number = ((Number(propertyValues.interestRate)/100)/12);
      const mortgageLoanAmount: number = Number(propertyValues.purchasePrice) - downPayment;
      const principalAndInterest: number = mortgageLoanAmount*(interestConstant*Math.pow((1+interestConstant),360)/(Math.pow((1+interestConstant),360)-1));
      const vacancy: number = (propertyValues.vacancy/100)*propertyValues.rent;
      const fixedExpenses: number = principalAndInterest + propertyManagement + Number(propertyValues.monthlyUtilities) + Number(propertyValues.hoa) + Number(propertyValues.taxes) + Number(propertyValues.insurance);
      const totalMonthlyExpenses: number = principalAndInterest + vacancy + propertyManagement + capitalExpenditures + maintenance + Number(propertyValues.additionalMonthlyExpenses) + Number(propertyValues.monthlyUtilities) + Number(propertyValues.hoa) + Number(propertyValues.taxes) + Number(propertyValues.insurance);
      const netOperatingExpenses: number = vacancy + propertyManagement + maintenance + Number(propertyValues.additionalMonthlyExpenses) + Number(propertyValues.monthlyUtilities) + Number(propertyValues.hoa) + Number(propertyValues.taxes) + Number(propertyValues.insurance);
      const netOperatingIncome: number = Number(propertyValues.rent) - netOperatingExpenses;
      const cashFlow: number = Number(propertyValues.rent) - totalMonthlyExpenses;
      const requiredStartingCapital: number = closingCosts + downPayment;
      console.log(vacancy , propertyManagement , capitalExpenditures,maintenance , propertyValues.additionalMonthlyExpenses, propertyValues.monthlyUtilities , propertyValues.hoa , propertyValues.taxes , propertyValues.insurance,fixedExpenses, totalMonthlyExpenses, netOperatingExpenses, netOperatingIncome, cashFlow, requiredStartingCapital);

      let capRate: number = 0;
      if(propertyValues.purchasePrice > 0){
        capRate = (netOperatingIncome*12 / propertyValues.purchasePrice)*100;
      }

      let pmi: number = 0
      if (propertyValues.purchasePrice > 0){
        if (((mortgageLoanAmount/propertyValues.purchasePrice)) > 0.8){
          const annualPmi = ((1.235)/100)*mortgageLoanAmount;
          pmi = annualPmi/12;
        }
      }
      let startingCapital = 1;
      if (requiredStartingCapital > 0){
        startingCapital = requiredStartingCapital;
      }
      const cashOnCashReturn = (netOperatingIncome*12 / startingCapital)*100;
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
        capRate
      })
  }

  const roiData = () => [
      {name: "Net Operating Income", value: cashFlowValues.netOperatingIncome, label:"$"},
      {name: "Starting Capital Required", value: cashFlowValues.requiredStartingCapital, label: "$"},
      {name: "Cash on Cash Return", value: cashFlowValues.cashOnCashReturn, label: "%"},
      {name:"CAP Rate", value: cashFlowValues.capRate, label:"%"}
    ]
  const expenseData = () => {
    const expenses: Expense[] = [
      {name: "Principal & Interest", monthlyValue :cashFlowValues.principalAndInterest},
      {name: "Pmi", monthlyValue :cashFlowValues.pmi},
      {name: "Home Insurance", monthlyValue :propertyValues.insurance} ,
      {name: "Property Taxes",monthlyValue :propertyValues.taxes},
      {name: "HOA Fee", monthlyValue :propertyValues.hoa},
      {name: "Utilities", monthlyValue :propertyValues.monthlyUtilities},
      {name: "Capital Expenditures", monthlyValue :cashFlowValues.capitalExpenditures},
      {name: "Maintenance", monthlyValue :cashFlowValues.maintenance},
      {name: "Vacancy", monthlyValue :cashFlowValues.vacancy},
      {name: "Miscellaneous Expenses", monthlyValue : propertyValues.additionalMonthlyExpenses},
    ]

    return expenses.map(expense => {
      return {
      "name": expense.name,
      "monthlyCost": Math.round(expense.monthlyValue),
      "annualCost": Math.round(expense.monthlyValue*12)
    }
  }
    )
  }

const onSubmit = async values => {
  setPropertyValues(values);
  calculateMortgagePayment(values);
}

const required = value => (value ? undefined : 'Required')
const mustBeNumber = value => (isNaN(value) ? 'Must be a number' : undefined)
const minValue = min => value =>
  isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`
  const maxValue = max => value =>
  isNaN(value) || value <= max ? undefined : `Should be less than ${max}`
const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined)

  if(screenWidth) // stbox thinf
  return (
    <div>
    <Container>
      <Row>
          <Header text="Rental Property Cash Flow Calculator" weight={400} size={2}/> 
      <Form
      initialValues={
        {
          propertyManagementCalculationChoice:"percent",
          maintenanceCalculationChoice:"percent",
          closingCostCalculationChoice:"percent",
          downPaymentCalculationChoice:"percent",
          capitalExpendituresCalculationChoice:"percent",
        }
      }
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <Container>
            <Box sx={{
              border: "solid 1px #bdbdbd",
              borderRadius: "5px",
              padding: "30px"
      }}>
          <Row>
            <Col lg={4}>
              <Box sx={{
              borderRight: "solid 1px #1976d2",
              borderRadius: "1px",
      }}>
            <Container>
            <Header color="#1976d2" text="Loan Details" weight={400} size={1.5}/> 
            <Field name="purchasePrice" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                
                <TextField
                input={input}
                fieldId="purchasePriceField"
                hasAdornment
                adornment = "$"
                label="Purchase Price"
                meta={meta}
                />
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
    
            <Field name="mortgageTerm" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                
                <TextField
                input={input}
                fieldId="mortgageTermField"
                hasAdornment
                adornmentPosition = "end"
                adornment = "Years"
                label="Mortgage Term"
                meta={meta}
                />
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
       
            <Field  name="interestRate" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                
                <TextField
                input={input}
                fieldId="interestRateField"
                hasAdornment
                adornmentPosition = "end"
                adornment = "%"
                label="Interest Rate"
                meta={meta}
                />
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
          
          <Spacer margin="1em"/>
            <Field name="downPaymentCalculationChoice">
            {({ input, meta }) => (
              <>
                 <Header color="#1976d2" text="Down Payment" weight={400} size={1.1}/> 
                 <Spacer margin="1em"/>
                 <Container>
                 <FormCheck
                 {...input}
                  type="radio"
                  label="Percent of Purchase Price"
                  name="downPaymentChoice"
                  value="percent"
                  checked={values?.downPaymentCalculationChoice === "percent"}
                  inline
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="Dollar Value"
                  name="downPaymentChoice"
                  value="dollarValue"
                  inline
                  />
                  </Container>
              </>
            )}
            </Field>
        
            <Field  name="downPaymentPercent" validate={values?.downPaymentCalculationChoice === "percent" ? composeValidators(required, mustBeNumber, minValue(0)) : null}>
            {({ input, meta }) => (
              <div>
                
                
                <TextField
                input={input}
                fieldId="downPaymentPercentField"
                hasAdornment
                adornmentPosition = "end"
                adornment = "%"
                label="Down Payment Percent"
                disabled={values?.downPaymentCalculationChoice !== "percent"}
                meta={meta}
                />
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
       
          
            <Field  name="downPaymentDollarValue" validate={values?.downPaymentCalculationChoice !== "percent" ? composeValidators(required, mustBeNumber, minValue(0)) : null}>
            {({ input, meta }) => (
              <div>
                <TextField
                input={input}
                fieldId="downPaymentDollarField"
                hasAdornment
                adornment = "$"
                label="Down Payment"
                disabled={values?.downPaymentCalculationChoice === "percent"}
                meta={meta}
                />
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
          <Field  name="closingCostCalculationChoice">
            {({ input, meta }) => (
              <>
                <Spacer margin="1em"/>
                 <Header color="#1976d2" text="Closing Costs" weight={400} size={1.1}/> 
                 <Spacer margin="1em"/>
                 <Container>
                 <FormCheck
                 {...input}
                  type="radio"
                  label="Percent of Purchase Price"
                  name="closingCostChoice"
                  value="percent"
                  checked={values?.closingCostCalculationChoice === "percent"}
                  inline
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="Dollar Value"
                  name="closingCostChoice"
                  value="dollarValue"
                  inline
                  />
                  </Container>
              </>
            )}
            </Field>
            <Field  name="closingCostPercent" validate={ propertyValues.closingCostCalculationChoice === "percent" ? composeValidators(required, mustBeNumber, minValue(0), maxValue(100)) : null}>
            {({ input, meta }) => (
              <div>

                <TextField
                input={input}
                fieldId="closingCostPercentField"
                hasAdornment
                adornmentPosition = "end"
                adornment = "%"
                label="Closing Cost Percent"
                disabled={values?.closingCostCalculationChoice !== "percent"}
                meta={meta}
                />

                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
            <Field  name="closingCostDollarValue" validate={ propertyValues.closingCostCalculationChoice !== "percent" ? composeValidators(required, mustBeNumber, minValue(0)) : null}>
            {({ input, meta }) => (
              <div>
                
                <TextField
                input={input}
                fieldId="closingCostDollarField"
                hasAdornment
                adornment = "$"
                label="Closing Costs"
                disabled={values?.closingCostCalculationChoice === "percent"}
                meta={meta}
                />
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
          </Container>
          </Box>
          </Col>
          <Col lg={4}>
          <Box sx={{
              borderRight: "solid 1px #1976d2",
              borderRadius: "1px",
      }}>
            <Container>
          <Header color="#1976d2" text="Monthly Income and Expenses" weight={400} size={1.5}/> 
            
            <Field name="rent" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                
                <TextField
                input={input}
                fieldId="monthlyRentField"
                hasAdornment
                adornment = "$"
                label="Monthly Rent"
                meta={meta}
                />

                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
         
            <Field name="monthlyUtilities" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>

                <TextField
                input={input}
                fieldId="monthlyUtilitiesField"
                hasAdornment
                adornment = "$"
                label="Monthly Utilities"
                meta={meta}
                />
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
            <Field name="hoa" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>

                <TextField
                input={input}
                fieldId="monthlyHoaField"
                hasAdornment
                adornment = "$"
                label="Monthly HOA"
                meta={meta}
                />
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
            <Field name="insurance" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                
                <TextField
                input={input}
                fieldId="monthlyInsuranceField"
                hasAdornment
                adornment = "$"
                label="Insurance"
                meta={meta}
                />
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
            <Field name="taxes" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                
                <TextField
                input={input}
                fieldId="monthlyTaxesField"
                hasAdornment
                adornment = "$"
                label="Taxes"
                meta={meta}
                />
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
            <Field name="additionalMonthlyExpenses" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                
                <TextField
                input={input}
                fieldId="monthlyMiscField"
                hasAdornment
                adornment = "$"
                label="Misc Expenses"
                meta={meta}
                />
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
          <Field  name="propertyManagementCalculationChoice">
            {({ input, meta }) => (
              <>
              <Spacer margin="1em"/>
                 
                 <Header color="#1976d2" text="Property Management" weight={400} size={1.1}/> 
                 <Spacer margin="1em"/>
                 <Container>
                 <FormCheck
                 {...input}
                  type="radio"
                  label="Percent of Rent"
                  name="propertyManagementChoice"
                  value="percent"
                  inline
                  checked={values?.propertyManagementCalculationChoice === "percent"}
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="Dollar Value"
                  name="propertyManagementChoice"
                  value="dollarValue"
                  inline
                  />
                  </Container>
              </>
            )}
            </Field>

         
            <Field  name="propertyManagementPercent" validate={composeValidators(required, mustBeNumber, minValue(0), maxValue(100))}>
            {({ input, meta }) => (
              <div>
                
                <TextField
                input={input}
                fieldId="propManPercentField"
                hasAdornment
                adornment = "%"
                adornmentPosition = "end"
                label="Percent"
                disabled={values?.propertyManagementCalculationChoice !== "percent"} 
                meta={meta}
                />

                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
          
            <Field  name="propertyManagementDollarValue" validate={ propertyValues.propertyManagementCalculationChoice !== "percent" ? composeValidators(required, mustBeNumber, minValue(0), maxValue(100)) : null}>
            {({ input, meta }) => (
              <div>
                
                <TextField
                input={input}
                fieldId="propManDollarField"
                hasAdornment
                adornment = "$"
                label="Dollar Value"
                disabled={values?.propertyManagementCalculationChoice == "percent"}
                meta={meta}
                />
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
          </Container>
          </Box>
          </Col>

            <Col lg={4}>
              <Box>
                <Container>
            <Header color="#1976d2" text="Estimated Expenses" weight={400} size={1.5}/> 
            <Field name="vacancy" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>

                <TextField
                input={input}
                fieldId="vacancyPercent"
                hasAdornment
                adornment = "%"
                adornmentPosition = "end"
                label="Vacancy Rate"
                meta={meta}
                />

                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
            <Field  name="capitalExpendituresCalculationChoice">
            {({ input, meta }) => (
              <> 
              <Spacer margin="1em"/>
                 <Header color="#1976d2" text="Capital Expenditures" weight={400} size={1.1}/> 
                 <Spacer margin="1em"/>
                 <Container>
                 <FormCheck
                 {...input}
                  type="radio"
                  label="Percent of Rent"
                  name="capitalExpendituresChoice"
                  value="percent"
                  checked={values?.capitalExpendituresCalculationChoice === "percent"}
                  inline
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="Dollar Value"
                  name="capitalExpendituresChoice"
                  value="dollarValue"
                  inline
                  />
                  </Container>
              </>
            )}
            </Field>
            <Field  name="capitalExpendituresPercent" validate={ propertyValues.capitalExpendituresCalculationChoice === "percent" ? composeValidators(required, mustBeNumber, minValue(0), maxValue(100)) : null}>
            {({ input, meta }) => (
              <div>
                
                <TextField
                input={input}
                fieldId="capExPercent"
                hasAdornment
                adornment = "%"
                adornmentPosition = "end"
                label="Percent"
                disabled={values?.capitalExpendituresCalculationChoice !== "percent"}
                meta={meta}
                />

                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>

            <Field  name="capitalExpendituresDollarValue" validate={ propertyValues.capitalExpendituresCalculationChoice !== "percent" ? composeValidators(required, mustBeNumber, minValue(0)) : null}>
            {({ input, meta }) => (
              <div>
                
                <TextField
                input={input}
                fieldId="capExDollarValue"
                hasAdornment
                adornment = "$"
                label="Dollar Value"
                disabled={values?.capitalExpendituresCalculationChoice === "percent"}
                meta={meta}
                />

                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
            <Field  name="maintenanceCalculationChoice">
            {({ input, meta }) => (
              <>
              <Spacer margin="1em"/>
                 <Header color="#1976d2" text="Maintenance" weight={400} size={1.1}/> 
                 <Spacer margin="1em"/>
                 <Container>
                 <FormCheck
                 {...input}
                  type="radio"
                  label="Percent of Rent"
                  name="maintenanceChoice"
                  value="percent"
                  inline
                  checked={values?.maintenanceCalculationChoice === "percent"}
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="Dollar Value"
                  name="maintenanceChoice"
                  value="dollarValue"
                  inline
                  />
                  </Container>
              </>
            )}
            </Field>

            <Field  name="maintenancePercent" validate={ propertyValues.maintenanceCalculationChoice === "percent" ? composeValidators(required, mustBeNumber, minValue(0), maxValue(100)) : null}>
            {({ input, meta }) => (
              <div>
                
                <TextField
                input={input}
                fieldId="maintPercent"
                hasAdornment
                adornment = "%"
                adornmentPosition="end"
                label="Percent"
                disabled={values?.maintenanceCalculationChoice !== "percent"}
                meta={meta}
                />
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>

            <Field  name="maintenanceDollarValue" validate={ propertyValues.maintenanceCalculationChoice !== "percent" ? composeValidators(required, mustBeNumber, minValue(0)) : null}>
            {({ input, meta }) => (
              <div>
                
                <TextField
                input={input}
                fieldId="maintDV"
                hasAdornment
                adornment = "$"
                adornmentPosition="start"
                label="Dollar Value"
                disabled={values?.maintenanceCalculationChoice === "percent"}
                meta={meta}
                />

                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
            </Container>
            </Box>
            </Col>
          </Row>
          <Spacer margin="1.5em" />
              <Container>
              <Row>
                <Col className="text-center">
              <Button type="submit" disabled={submitting} variant="contained"> Calculate Cash Flow</Button>
              </Col>
              </Row>
              </Container>
           
            <Spacer margin="1em" />
          </Box>
          </Container>
          
        </form>
      )}
    />
    
      <Container>

    <Row>
      <Col lg={6}>
      <Spacer margin="1.5em" />
    <Header text="Cash Flow Analysis" weight={400} size={2} color="#1976d2"/>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 150 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Expense</TableCell>
            <TableCell align="right">Monthly Value ($)</TableCell>
            <TableCell align="right">Annual Value ($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenseData().filter(expense => expense.name !="Total").map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.monthlyCost}</TableCell>
              <TableCell align="right">{row.annualCost}</TableCell>
            </TableRow>
          ))}
          
                      <TableRow key="totalMonthly" sx={{borderTop: "solid 2px black"}}>
          
                      <TableCell component="th" scope="row">
                        Total Expenses
                      </TableCell>
                      <TableCell align="right">{Math.round(cashFlowValues.totalMonthlyExpenses)}</TableCell>
                      <TableCell align="right">{Math.round(cashFlowValues.totalMonthlyExpenses*12)}</TableCell>
                    </TableRow>
          <TableRow key="rent">
          
          <TableCell component="th" scope="row">
            Rent
          </TableCell>
          <TableCell align="right">{Math.round(propertyValues.rent)}</TableCell>
          <TableCell align="right">{Math.round(propertyValues.rent*12)}</TableCell>
        </TableRow>
        <TableRow key="cashFlow" sx={{borderTop: "solid 2px black"}}>
          
          <TableCell component="th" scope="row">
            Cash Flow
          </TableCell>
          <TableCell align="right">{Math.round(cashFlowValues.cashFlow)}</TableCell>
          <TableCell align="right">{Math.round(cashFlowValues.cashFlow*12)}</TableCell>
        </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </Col>
    <Col lg={6}>
    <Spacer margin="1.5em" />
    <Header text="Property Analysis" weight={400} size={2} color="#1976d2"/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 150 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Calculation</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roiData().map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.label === "$" ? "$ " : null} { row.label === "%" ? row.value.toFixed(2) : row.value} {row.label === "%" ? " %" : null}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Col>
    </Row>
    
    </Container>
    </Row>
    <Spacer margin="1.5em" />
    </Container>
    </div>
  );
}

export default App;
