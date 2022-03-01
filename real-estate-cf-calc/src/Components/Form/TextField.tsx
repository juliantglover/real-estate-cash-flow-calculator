import React from "react";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { FormControl } from "@mui/material";
import { Spacer } from "../../Components/Layout/Spacer";

export const TextField = ({
  meta,
  input,
  label,
  variant = "standard",
  fieldId,
  hasAdornment = false,
  adornmentPosition = "start",
  adornment,
  disabled = false,
  error = false,
  errorText = null,
}) => {
  return (
    <>
      <Spacer margin="0.15em" />
      <FormControl {...input} variant={variant} fullWidth>
        <InputLabel htmlFor={fieldId}>{label}</InputLabel>
        {hasAdornment && adornmentPosition === "start" && (
          <Input
            error={meta.error && meta.touched}
            disabled={disabled}
            id={fieldId}
            startAdornment={
              <InputAdornment position={adornmentPosition}>
                {adornment}
              </InputAdornment>
            }
          />
        )}
        {hasAdornment && adornmentPosition === "end" && (
          <Input
            id={fieldId}
            error={meta.error && meta.touched}
            disabled={disabled}
            endAdornment={
              <InputAdornment position={adornmentPosition}>
                {adornment}
              </InputAdornment>
            }
          />
        )}
        {!hasAdornment && (
          <Input
            id={fieldId}
            error={meta.error && meta.touched}
            disabled={disabled}
          />
        )}
      </FormControl>
      <Spacer margin="0.15em" />
    </>
  );
};
