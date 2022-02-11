import React from 'react';
import logo from './logo.svg';
import './App.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Form, Field } from 'react-final-form';
import { FormControl, FormLabel, InputGroup, FormCheck } from 'react-bootstrap';

function App() {

const onSubmit = async values => {
  window.alert(JSON.stringify(values))
}

const required = value => (value ? undefined : 'Required')
const mustBeNumber = value => (isNaN(value) ? 'Must be a number' : undefined)
const minValue = min => value =>
  isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`
const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined)

  return (
    <Container fluid>
      <Form
      initialValues={
        {
          "propertyManagementCalculationChoice":"percent",
          "maintenanceCalculationChoice":"percent",
          "closingCostCalculationChoice":"percent",
          "downPaymentCalculationChoice":"percent"
        }
      }
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
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
          </Row>
          <Row>
            <Col>
            <Field  name="downPaymentCalculationChoice">
            {({ input, meta }) => (
              <>
                 <FormLabel>Down Payment Calculation Choice</FormLabel> 
                 <FormCheck
                 {...input}
                  type="radio"
                  label="As Percent of Purchase Price"
                  name="downPaymentChoice"
                  value="percent"
                  checked={values?.downPaymentCalculationChoice == "percent"}
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="As Dollar Value"
                  name="downPaymentChoice"
                  value="dollarValue"
                  />
              </>
            )}
            </Field>
            </Col>
            <Col>
            <Field  name="downPayment" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Down Payment Percent</FormLabel>
                <InputGroup>
               
                <FormControl {...input} disabled={values?.downPaymentCalculationChoice != "percent"} type="number" placeholder="Down Payment Percent" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
            <Col>
            <Field  name="downPayment" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Down Payment Dollar Value</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl disabled={values?.downPaymentCalculationChoice == "percent"} {...input} type="number" placeholder="Down Payment Dollar Value" />
    
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
          </Row>
          <Row>
            <Col>
            <Field  name="closingCostCalculationChoice">
            {({ input, meta }) => (
              <>
                 <FormLabel>Closing Cost Calculation Choice</FormLabel> 
                 <FormCheck
                 {...input}
                  type="radio"
                  label="As Percent of Closing Cost"
                  name="closingCostChoice"
                  value="percent"
                  checked={values?.closingCostCalculationChoice == "percent"}
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="As Dollar Value"
                  name="closingCostChoice"
                  value="dollarValue"
                  />
              </>
            )}
            </Field>
            </Col>
            <Col>
            <Field  name="closingCost" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Closing Cost Percent</FormLabel>
                <InputGroup>
                
                <FormControl {...input} disabled={values?.closingCostCalculationChoice != "percent"} type="number" placeholder="Closing Cost Percent" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
            <Col>
            <Field  name="closingCost" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Closing Cost Dollar Value</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl disabled={values?.closingCostCalculationChoice == "percent"} {...input} type="number" placeholder="Closing Cost Dollar Value" />
               
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
          </Row>
          <Row>
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
          <Row>
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
          <Row>
            <Col>
            <Field name="vacancy" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <>
                <FormLabel>Vacancy</FormLabel>
                <InputGroup>
                <FormControl {...input} type="number" placeholder="Vacancy" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </>
            )}
          </Field>
            </Col>
          </Row>
          <Row>
            <Col>
            <Field  name="propertyManagementCalculationChoice">
            {({ input, meta }) => (
              <>
                 <FormLabel>Property Management Calculation Choice</FormLabel> 
                 <FormCheck
                 {...input}
                  type="radio"
                  label="As Percent of Rent"
                  name="propertyManagementChoice"
                  value="percent"
                  checked={values?.propertyManagementCalculationChoice == "percent"}
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="As Dollar Value"
                  name="propertyManagementChoice"
                  value="dollarValue"
                  />
              </>
            )}
            </Field>
            </Col>
            <Col>
            <Field  name="propertyManagement" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Property Management Percent</FormLabel>
                <InputGroup>
               
                <FormControl {...input} disabled={values?.propertyManagementCalculationChoice != "percent"} type="number" placeholder="Property Management Percent" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
            <Col>
            <Field  name="propertyManagement" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Property Management Dollar Value</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl disabled={values?.propertyManagementCalculationChoice == "percent"} {...input} type="number" placeholder="Property Management Dollar Value" />
                
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
          </Row>
          <Row>
            <Col>
            <Field  name="maintenanceCalculationChoice">
            {({ input, meta }) => (
              <>
                 <FormLabel>Maintenance Calculation Choice</FormLabel> 
                 <FormCheck
                 {...input}
                  type="radio"
                  label="As Percent of Rent"
                  name="maintenanceChoice"
                  value="percent"
                  checked={values?.maintenanceCalculationChoice == "percent"}
                  />
                  <FormCheck
                  {...input}
                  type="radio"
                  label="As Dollar Value"
                  name="maintenanceChoice"
                  value="dollarValue"
                  />
              </>
            )}
            </Field>
            </Col>
            <Col>
            <Field  name="maintenance" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Maintenance Percent</FormLabel>
                <InputGroup>
                
                <FormControl {...input} disabled={values?.maintenanceCalculationChoice != "percent"} type="number" placeholder="Maintenance Percent" />
                <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
            <Col>
            <Field  name="maintenance" validate={composeValidators(required, mustBeNumber, minValue(0))}>
            {({ input, meta }) => (
              <div>
                <FormLabel>Maintenance Dollar Value</FormLabel>
                <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl disabled={values?.maintenanceCalculationChoice == "percent"} {...input} type="number" placeholder="Maintenance Dollar Value" />
               
                </InputGroup>
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
            </Col>
          </Row>
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
          <div className="buttons">
            <button type="submit" disabled={submitting}>
              Submit
            </button>
            <button
              type="button"
              onClick={form.reset}
              disabled={submitting || pristine}
            >
              Reset
            </button>
          </div>
          <pre>{JSON.stringify(values)}</pre>
        </form>
      )}
    />
    </Container>
  );
}

export default App;
