import React, {useState} from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { VictoryPie } from 'victory';
import { Form, Field } from 'react-final-form';
import { FormControl, FormLabel, InputGroup, FormCheck } from 'react-bootstrap';
import { Header } from './Components/Text/Header';
import { Divider } from './Components/Layout/Divider';
import { ButtonWrapper } from './Components/Layout/ButtonWrapper';
import { Spacer } from './Components/Layout/Spacer';
import { ErrorText } from './Components/Text/ErrorText';

function App() {

  const data02 = [
    {
      "name": "Group A",
      "value": 2400
    },
    {
      "name": "Group B",
      "value": 4567
    },
    {
      "name": "Group C",
      "value": 1398
    },
    {
      "name": "Group D",
      "value": 9800
    },
    {
      "name": "Group E",
      "value": 3908
    },
    {
      "name": "Group F",
      "value": 4800
    }
  ];
    
  
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
    <Container fluid>
      <Row>
        <Col className="AppHeightScroll" lg={4}>
          <Header text="Property Details" weight={500} size={2}/> 
          

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
          <Header text="Loan Details" weight={400} size={1.5}/> 
          <Row>
            <Col>
            <Field name="purchasePrice" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                <FormLabel>Purchase Price</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl {...input} type="number" placeholder="Purchase Price" />
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
            </Col>
            <Col>
            <Field name="mortgageTerm" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                <FormLabel>Mortgage Term</FormLabel>
                <InputGroup>
                <FormControl {...input} type="number" placeholder="Mortgage Term" />
                <InputGroup.Text>Years</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
          </Col>
          <Col>
            <Field  name="interestRate" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Interest Rate</FormLabel>
                <InputGroup>
                <FormControl {...input} type="number" placeholder="Interest Rate" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
          </Col>
            </Row>
           
              <Divider margin={"1em"}/>
              
          <Row>
            <Field name="downPaymentCalculationChoice">
            {({ input, meta }) => (
              <>
                 <Header text="Down Payment" weight={400} size={1.5}/> 
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
            </Row>
            <Spacer margin="0.25em" />
            <Row>
              <Col>
            <Field  name="downPaymentPercent" validate={values?.downPaymentCalculationChoice === "percent" ? composeValidators(required, mustBeNumber, minValue(0)) : null}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Percent</FormLabel>
                <InputGroup>
               
                <FormControl {...input} disabled={values?.downPaymentCalculationChoice !== "percent"} type="number" placeholder="Down Payment Percent" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
          </Col>
          <Col>
            <Field  name="downPaymentDollarValue" validate={values?.downPaymentCalculationChoice !== "percent" ? composeValidators(required, mustBeNumber, minValue(0)) : null}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Dollar Value</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl disabled={values?.downPaymentCalculationChoice === "percent"} {...input} type="number" placeholder="Down Payment Dollar Value" />
    
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
          </Col>
            </Row>
            <Divider margin={"1em"}/>
          <Row>
            <Field  name="closingCostCalculationChoice">
            {({ input, meta }) => (
              <>
                
                 <Header text="Closing Costs" weight={400} size={1.5}/> 
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
            </Row>
            <Spacer margin="0.25em" />
            <Row>
            <Col>
            <Field  name="closingCostPercent" validate={ propertyValues.closingCostCalculationChoice === "percent" ? composeValidators(required, mustBeNumber, minValue(0), maxValue(100)) : null}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Percent</FormLabel>
                <InputGroup>
                
                <FormControl {...input} disabled={values?.closingCostCalculationChoice !== "percent"} type="number" placeholder="Closing Cost Percent" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
            </Col>
            <Col>
            <Field  name="closingCostDollarValue" validate={ propertyValues.closingCostCalculationChoice !== "percent" ? composeValidators(required, mustBeNumber, minValue(0)) : null}>
            {({ input, meta }) => (
              <div>
                <FormLabel> Dollar Value</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl disabled={values?.closingCostCalculationChoice === "percent"} {...input} type="number" placeholder="Closing Cost Dollar Value" />
               
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
            </Col>
            </Row>
            <Divider margin={"1em"}/>
          <Row>
 
          <Header text="Monthly Income and Expenses" weight={400} size={1.5}/> 
            <Col>
            <Field name="rent" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                <FormLabel>Monthly Rent</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl {...input} type="number" placeholder="Monthly Rent" />
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
            </Col>
            <Col>
            <Field name="monthlyUtilities" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                <FormLabel>Monthly Utilities</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl {...input} type="number" placeholder="Monthly Utilities" />
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
            </Col>
            </Row>
            <Spacer margin="0.5em" />
            <Row>
            <Col>
            <Field name="vacancy" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                <FormLabel>Vacancy Percent</FormLabel>
                <InputGroup>
                <FormControl {...input} type="number" placeholder="Vacancy" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
            </Col>
            <Col>
            <Field name="hoa" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                <FormLabel>Monthly HOA Fee</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl {...input} type="number" placeholder="Monthly HOA Fee" />
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
            </Col>
          </Row>
          <Spacer margin="0.5em" />
          <Row>
            <Col>
            <Field name="insurance" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                <FormLabel>Insurance</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl {...input} type="number" placeholder="Insurance" />
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
            </Col>
            <Col>
            <Field name="taxes" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                <FormLabel>Taxes</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl {...input} type="number" placeholder="Taxes" />
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
            </Col>
          </Row>
          <Spacer margin="0.25em" />
          <Row>
            <Col>
            <Field name="additionalMonthlyExpenses" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                <FormLabel>Additional Monthly Expenses</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl {...input} type="number" placeholder="Additional Monthly Expenses" />
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </>
            )}
          </Field>
            </Col>
          </Row>
          <Row>
            <Field  name="capitalExpendituresCalculationChoice">
            {({ input, meta }) => (
              <> 
                  <Divider margin="1.5em" width="50%" />
                 
                 <Header text="Capital Expenditures" weight={400} size={1.5}/> 
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
            </Row>
            <Spacer margin="0.5em" />
            <Row>
            <Col>
            <Field  name="capitalExpendituresPercent" validate={ propertyValues.capitalExpendituresCalculationChoice === "percent" ? composeValidators(required, mustBeNumber, minValue(0), maxValue(100)) : null}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Percent</FormLabel>
                <InputGroup>
                
                <FormControl {...input} disabled={values?.capitalExpendituresCalculationChoice !== "percent"} type="number" placeholder="Percent" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
            </Col>
            <Col>
            <Field  name="capitalExpendituresDollarValue" validate={ propertyValues.capitalExpendituresCalculationChoice !== "percent" ? composeValidators(required, mustBeNumber, minValue(0)) : null}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Dollar Value</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl disabled={values?.capitalExpendituresCalculationChoice === "percent"} {...input} type="number" placeholder="Dollar Value" />
               
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
            </Col>
          </Row>
          <Row>
           
            <Field  name="propertyManagementCalculationChoice">
            {({ input, meta }) => (
              <>
              <Divider margin="1.5em" width="50%" />
                 
                 <Header text="Property Management" weight={400} size={1.5}/> 
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
            </Row>
            <Spacer margin="0.5em" />
            <Row>
            <Col>
            <Field  name="propertyManagementPercent" validate={composeValidators(required, mustBeNumber, minValue(0), maxValue(100))}>
            {({ input, meta }) => (
              <div>
                <FormLabel> Percent</FormLabel>
                <InputGroup>
               
                <FormControl {...input} disabled={values?.propertyManagementCalculationChoice !== "percent"} type="number" placeholder="Percent" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
            </Col>
            <Col>
            <Field  name="propertyManagementDollarValue" validate={ propertyValues.propertyManagementCalculationChoice !== "percent" ? composeValidators(required, mustBeNumber, minValue(0), maxValue(100)) : null}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Dollar Value</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl disabled={values?.propertyManagementCalculationChoice == "percent"} {...input} type="number" placeholder="Dollar Value" />
                
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
            </Col>
            </Row>
          <Row >
            <Field  name="maintenanceCalculationChoice">
            {({ input, meta }) => (
              <>
              <Divider margin="1.5em" width="50%" />
                 <Header text="Maintenance" weight={400} size={1.5}/> 
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
            </Row>
            <Spacer margin="0.5em" />
            <Row>
            <Col>
            <Field  name="maintenancePercent" validate={ propertyValues.maintenanceCalculationChoice === "percent" ? composeValidators(required, mustBeNumber, minValue(0), maxValue(100)) : null}>
            {({ input, meta }) => (
              <div>
                <FormLabel> Percent</FormLabel>
                <InputGroup>
                
                <FormControl {...input} disabled={values?.maintenanceCalculationChoice !== "percent"} type="number" placeholder="Percent" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
            </Col>
            <Col>
            <Field  name="maintenanceDollarValue" validate={ propertyValues.maintenanceCalculationChoice !== "percent" ? composeValidators(required, mustBeNumber, minValue(0)) : null}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Dollar Value</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl disabled={values?.maintenanceCalculationChoice === "percent"} {...input} type="number" placeholder="Dollar Value" />
               
                </InputGroup>
                {meta.error && meta.touched && <ErrorText message={meta.error}/>}
              </div>
            )}
          </Field>
            </Col>
          </Row>
          <Spacer margin="1em" />
         
            
              <ButtonWrapper text="Calculate Cash Flow" type="submit" disabled={submitting} />
          
           
            <Spacer margin="1em" />
          
        </form>
      )}
    />
    </Col>
    <Col lg={8} className="AppHeightScroll">
      <Container>
    <Row>
    <Header text="Cash Flow Analysis" weight={500} size={2}/>
    <Row>
      <Header text="Monthly Expenses" weight={400} size={1.5}></Header>
      <Row>
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
      </Row>
      <Row>
      <VictoryPie
      colorScale={["tomato", "orange", "gold", "cyan"]}
      style={{
        labels: {
          fontSize: 8, fill: "#c43a31", margin:"1px"
        }
      }}
  data={[
    { x: "Prinicipal and Interest", y: cashFlowValues.principalAndInterest },
    { x: "Home Insurance", y: propertyValues.insurance },
    { x: "Property Taxes", y: propertyValues.taxes },
    { x: "HOA Fees", y: propertyValues.hoa },
  ]}
/>
      </Row>
    </Row>
    </Row>
    </Container>
    </Col>
    </Row>
    </Container>
    </div>
  );
}

export default App;
