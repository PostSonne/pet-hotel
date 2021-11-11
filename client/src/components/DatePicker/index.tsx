import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {Box, TextField} from "@mui/material";
import React from "react";
import {DateRangePicker} from "@mui/lab";
import {DateRange, RangeInput} from "@mui/lab/DateRangePicker/RangeTypes";

type CustomDatePickerType = {
  dateValue?: RangeInput<Date> | null;
  label?: string;
  onChange?: () => void
}

export const CustomDatePicker: React.FC<CustomDatePickerType> = () => {
  const [dateValue, setDateValue] = React.useState<DateRange<Date>>([null, null]);

  const handleDateValue = (newDateValue) => {
    setDateValue(newDateValue);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        startText="Введите дату"
        endText="Введите дату"
        value={dateValue}
        onChange={handleDateValue}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> по </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
  )
}
