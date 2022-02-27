import React, {useState} from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Form, Field } from 'react-final-form';
import { FormCheck } from 'react-bootstrap';
import { Header } from './Components/Text/Header';
import { Divider } from './Components/Layout/Divider';
import { ColumnDivider } from './Components/Layout/ColumnDivider';
import { Spacer } from './Components/Layout/Spacer';
import { ErrorText } from './Components/Text/ErrorText';
import { TextField } from './Components/Form/TextField';
import { Button } from '@mui/material';

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
      profitAfterFixedExpenses: 0,
      propertyManagement:0
    });

  const calculateMortgagePayment = (propertyValues) => {
      const downPayment: number = propertyValues.downPaymentCalculationChoice === 'percent' ? ((propertyValues.downPaymentPercent)/100)*propertyValues.purchasePrice : propertyValues.downPaymentDollarValue;
      const closingCosts: number = propertyValues.closingCostCalculationChoice === 'percent' ? ((propertyValues.closingCostPercent)/100)*propertyValues.purchasePrice : propertyValues.closingCostDollarValue;
      const propertyManagement: number = propertyValues.propertyManagementCalculationChoice === 'percent' ? ((propertyValues.propertyManagementPercent)/100)*propertyValues.rent : propertyValues.propertyManagementDollarValue;
      const capitalExpenditures: number = propertyValues.capitalExpendituresCalculationChoice === 'percent' ? ((propertyValues.capitalExpendituresPercent)/100)*propertyValues.rent : propertyValues.capitalExpendituresDollarValue;
      const maintenance: number = propertyValues.maintenanceCalculationChoice === 'percent' ? ((propertyValues.maintenancePercent)/100)*propertyValues.rent : propertyValues.maintenanceDollarValue;
      const interestConstant: number = ((propertyValues.interestRate/100)/12);
      const mortgageLoanAmount: number = propertyValues.purchasePrice - downPayment;
      const principalAndInterest: number = mortgageLoanAmount*(interestConstant*Math.pow((1+interestConstant),360)/(Math.pow((1+interestConstant),360)-1));
      const vacancy: number = (propertyValues.vacancy/100)*propertyValues.rent;
      const fixedExpenses: number = principalAndInterest + propertyManagement + propertyValues.monthlyUtilities + propertyValues.hoa + propertyValues.taxes + propertyValues.insurance;
      const totalMonthlyExpenses: number = principalAndInterest + vacancy + propertyManagement + capitalExpenditures + maintenance + propertyValues.monthlyUtilities + propertyValues.hoa + propertyValues.taxes + propertyValues.insurance;
      const cashFlow: number = propertyValues.rent - totalMonthlyExpenses;
      const profitAfterFixedExpenses: number = propertyValues.rent - fixedExpenses;
      setCashFlowValues({
        downPayment: downPayment,
        interestConstant: interestConstant,
        mortgageLoanAmount: mortgageLoanAmount,
        principalAndInterest: principalAndInterest,
        capitalExpenditures: capitalExpenditures,
        vacancy: vacancy,
        totalMonthlyExpenses:totalMonthlyExpenses,
        cashFlow: cashFlow,
        fixedExpenses: fixedExpenses,
        closingCosts: closingCosts,
        maintenance: maintenance,
        profitAfterFixedExpenses: profitAfterFixedExpenses,
        propertyManagement:propertyManagement
      })
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

  return (
    <div className='AppHeight'>
    <Container>
      <Row>
          <Header text="Cash Flow Calculator" weight={500} size={2}/> 
          

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
          <Row>
            <Col lg={3}>
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
          
          <Divider margin="1.8em" width="75%" />
            <Field name="downPaymentCalculationChoice">
            {({ input, meta }) => (
              <>
                 <Header color="#1976d2" text="Down Payment" weight={400} size={1.2}/> 
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
                <Divider margin="1.8em" width="75%" />
                 <Header color="#1976d2" text="Closing Costs" weight={400} size={1.2}/> 
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
          </Col>
          <Col lg={1}>
          <ColumnDivider />
          </Col>
          <Col lg={3}>
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
              <Divider margin="1.8em" width="75%" />
                 
                 <Header color="#1976d2" text="Property Management" weight={400} size={1.2}/> 
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
          </Col>
            <Col lg={1}>
            <ColumnDivider />
            </Col>
            <Col lg={3}>
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
              <Divider margin="1.8em" width="75%" />
                 <Header color="#1976d2" text="Capital Expenditures" weight={400} size={1.2}/> 
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
              <Divider margin="1.8em" width="75%" />
                 <Header color="#1976d2" text="Maintenance" weight={400} size={1.2}/> 
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

            </Col>
          </Row>
          </Container>
          <Spacer margin="1.5em" />
              <Container>
              <Row>
                <Col className="text-center">
              <Button type="submit" disabled={submitting} variant="contained"> Calculate Cash Flow</Button>
              </Col>
              </Row>
              </Container>
           
            <Spacer margin="1em" />
          
        </form>
      )}
    />
    
      <Container>
    <Row>
    <Header text="Cash Flow Analysis" weight={500} size={2}/>
      <Header text="Monthly Expenses" weight={400} size={1.5}></Header>
        <p>Principal &amp; Interest: $ {cashFlowValues.principalAndInterest}</p>
        <p>Home Insurance: $ {propertyValues.insurance}</p>
        <p>Property Taxes: $ {propertyValues.taxes}</p>
        <p>HOA Fee: $ {propertyValues.hoa}</p>
        <p>Mortgage Insurance: $ 0</p>
        <p>Utilities: $ {propertyValues.monthlyUtilities}</p>
        <p>Capital Expenditures: $ {cashFlowValues.capitalExpenditures}</p>
        <p>Maintenance: $ {cashFlowValues.maintenance}</p>
        <p>Vacancy: $ {cashFlowValues.vacancy}</p>
        <p>Profit after Fixed Expenses: $ {cashFlowValues.profitAfterFixedExpenses}</p>
        <p>Cash Flow: $ {cashFlowValues.cashFlow}</p>
      <Row>
      </Row>
    </Row>
    
    </Container>
    </Row>
    </Container>
    </div>
  );
}

export default App;
