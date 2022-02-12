import React, {useState} from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Form, Field } from 'react-final-form';
import { FormControl, FormLabel, InputGroup, FormCheck } from 'react-bootstrap';
import { Header } from './Components/Text/Header';
import { SubHeader } from './Components/Text/SubHeader';
import { Divider } from './Components/Layout/Divider';
import { Spacer } from './Components/Layout/Spacer';
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
      cashFlow: 0
    });

  const calculateMortgagePayment = (propertyValues) => {
      const downPayment: number = propertyValues.downPaymentCalculationChoice === 'percent' ? ((propertyValues.downPaymentPercent)/100)*propertyValues.purchasePrice : propertyValues.downPaymentDollarValue;
      const closingCosts: number = propertyValues.closingCostCalculationChoice === 'percent' ? ((propertyValues.closingCostPercent)/100)*propertyValues.purchasePrice : propertyValues.closingCostDollarValue;
      const interestConstant: number = ((propertyValues.interestRate/100)/12);
      const mortgageLoanAmount: number = propertyValues.purchasePrice - downPayment;
      const principalAndInterest: number = mortgageLoanAmount*(interestConstant*Math.pow((1+interestConstant),360)/(Math.pow((1+interestConstant),360)-1));
      const vacancy: number = (propertyValues.vacancy/100)*propertyValues.rent;
      const totalMonthlyExpenses: number = principalAndInterest + vacancy + propertyValues.monthlyUtilities + propertyValues.hoa + propertyValues.taxes + propertyValues.insurance;
      const cashFlow: number = propertyValues.rent - totalMonthlyExpenses
      setCashFlowValues({
        downPayment: downPayment,
        interestConstant: interestConstant,
        mortgageLoanAmount: mortgageLoanAmount,
        principalAndInterest: principalAndInterest,
        capitalExpenditures: 0,
        vacancy: vacancy,
        totalMonthlyExpenses:totalMonthlyExpenses,
        cashFlow: cashFlow
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
          <Header text="Property Details" />

      <Form
      initialValues={
        {
          "propertyManagementCalculationChoice":"percent",
          "maintenanceCalculationChoice":"percent",
          "closingCostCalculationChoice":"percent",
          "downPaymentCalculationChoice":"percent",
          "capitalExpendituresCalculationChoice":"percent",
        }
      }
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <SubHeader text="Loan Details" />
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
                {meta.error && meta.touched && <span>{meta.error}</span>}
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
                {meta.error && meta.touched && <span>{meta.error}</span>}
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
                {meta.error && meta.touched && <span>{meta.error}</span>}
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
                 <SubHeader text="Down Payment" /> 
                 <Container>
                 <FormCheck
                 {...input}
                  type="radio"
                  label="As Percent of Purchase Price"
                  name="downPaymentChoice"
                  value="percent"
                  checked={values?.downPaymentCalculationChoice === "percent"}
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="As Dollar Value"
                  name="downPaymentChoice"
                  value="dollarValue"
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
                {meta.error && meta.touched && <span>{meta.error}</span>}
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
                {meta.error && meta.touched && <span>{meta.error}</span>}
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
                 <SubHeader text="Closing Costs" />
                 <Container>
                 <FormCheck
                 {...input}
                  type="radio"
                  label="As Percent of Purchase Price"
                  name="closingCostChoice"
                  value="percent"
                  checked={values?.closingCostCalculationChoice === "percent"}
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="As Dollar Value"
                  name="closingCostChoice"
                  value="dollarValue"
                  />
                  </Container>
              </>
            )}
            </Field>
            </Row>
            <Spacer margin="0.25em" />
            <Row>
            <Col>
            <Field  name="closingCostPercent" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Percent</FormLabel>
                <InputGroup>
                
                <FormControl {...input} disabled={values?.closingCostCalculationChoice !== "percent"} type="number" placeholder="Closing Cost Percent" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
            <Col>
            <Field  name="closingCostDollarValue" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel> Dollar Value</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl disabled={values?.closingCostCalculationChoice === "percent"} {...input} type="number" placeholder="Closing Cost Dollar Value" />
               
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
            </Row>
            <Divider margin={"1em"}/>
          <Row>
          <SubHeader text="Monthly Expenses" />
            <Col>
            <Field name="rent" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                <FormLabel>Monthly Rent</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl {...input} type="number" placeholder="Monthly Rent" />
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
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
                {meta.error && meta.touched && <span>{meta.error}</span>}
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
                {meta.error && meta.touched && <span>{meta.error}</span>}
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
                {meta.error && meta.touched && <span>{meta.error}</span>}
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
                {meta.error && meta.touched && <span>{meta.error}</span>}
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
                {meta.error && meta.touched && <span>{meta.error}</span>}
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
                {meta.error && meta.touched && <span>{meta.error}</span>}
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
                 <SubHeader text="Capital Expenditures" size="h3"/> 
                 <Container>
                 <FormCheck
                 {...input}
                  type="radio"
                  label="As Percent of Rent"
                  name="capitalExpendituresChoice"
                  value="percent"
                  checked={values?.capitalExpendituresCalculationChoice === "percent"}
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="As Dollar Value"
                  name="capitalExpendituresChoice"
                  value="dollarValue"
                  />
                  </Container>
              </>
            )}
            </Field>
            </Row>
            <Spacer margin="0.5em" />
            <Row>
            <Col>
            <Field  name="capitalExpendituresPercent" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Percent</FormLabel>
                <InputGroup>
                
                <FormControl {...input} disabled={values?.capitalExpendituresCalculationChoice !== "percent"} type="number" placeholder="Capital Expenditures Percent" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
            <Col>
            <Field  name="capitalExpendituresDollarValue" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Dollar Value</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl disabled={values?.capitalExpendituresCalculationChoice === "percent"} {...input} type="number" placeholder="Capital Expenditures Dollar Value" />
               
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
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
                 <SubHeader text="Property Management" size="h3"/> 
                 <Container>
                 <FormCheck
                 {...input}
                  type="radio"
                  label="As Percent of Rent"
                  name="propertyManagementChoice"
                  value="percent"
                  checked={values?.propertyManagementCalculationChoice === "percent"}
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="As Dollar Value"
                  name="propertyManagementChoice"
                  value="dollarValue"
                  />
                  </Container>
              </>
            )}
            </Field>
            </Row>
            <Spacer margin="0.5em" />
            <Row>
            <Col>
            <Field  name="propertyManagementPercent" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel> Percent</FormLabel>
                <InputGroup>
               
                <FormControl {...input} disabled={values?.propertyManagementCalculationChoice !== "percent"} type="number" placeholder="Percent" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
            <Col>
            <Field  name="propertyManagementDollarValue" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Dollar Value</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl disabled={values?.propertyManagementCalculationChoice === "percent"} {...input} type="number" placeholder="Dollar Value" />
                
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
            </Row>
          <Row>
            <Field  name="maintenanceCalculationChoice">
            {({ input, meta }) => (
              <>
              <Divider margin="1.5em" width="50%" />
                 <SubHeader text="Maintenance" size="h3"/> 
                 <Container>
                 <FormCheck
                 {...input}
                  type="radio"
                  label="As Percent of Rent"
                  name="maintenanceChoice"
                  value="percent"
                  checked={values?.maintenanceCalculationChoice === "percent"}
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="As Dollar Value"
                  name="maintenanceChoice"
                  value="dollarValue"
                  />
                  </Container>
              </>
            )}
            </Field>
            </Row>
            <Spacer margin="0.5em" />
            <Row>
            <Col>
            <Field  name="maintenancePercent" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel> Percent</FormLabel>
                <InputGroup>
                
                <FormControl {...input} disabled={values?.maintenanceCalculationChoice !== "percent"} type="number" placeholder="Maintenance Percent" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
            <Col>
            <Field  name="maintenanceDollarValue" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Dollar Value</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl disabled={values?.maintenanceCalculationChoice === "percent"} {...input} type="number" placeholder="Maintenance Dollar Value" />
               
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
          </Row>
            <Button type="submit" disabled={submitting}>
              Submit
            </Button>
          {/* <pre>{JSON.stringify(values)}</pre> */}
        </form>
      )}
    />
    </Col>
    <Col lg={8}>
    <Row>
    <Header text="Cash Flow Analysis" />
      <Col>
      Monthy Rent: $ {propertyValues.rent}
      </Col>
      <Col>
      Monthly Principal and Interest: $ {cashFlowValues.principalAndInterest}
      </Col>
      <Col>
      Monthly Taxes: $ {propertyValues.taxes}
      </Col>
      <Col>
      Monthly Mortgage: $ {cashFlowValues.principalAndInterest + propertyValues.taxes}
      </Col>
      </Row>
      <Row>
      <Col>
      Monthly Utilities: $ {propertyValues.monthlyUtilities}
      </Col>
      <Col>
      Monthly HOA Fee: $ {propertyValues.hoa}
      </Col>
      <Col>
      Monthly Vacancy: $ {cashFlowValues.vacancy}
      </Col>
      <Col>
      Monthly Capital Expenditures: $ {cashFlowValues.capitalExpenditures}
      </Col>
      <Col>
      Monthly CashFlow: $ {cashFlowValues.principalAndInterest + propertyValues.taxes}
      </Col>
    </Row>
    </Col>
    </Row>
    </Container>
    </div>
  );
}

export default App;
