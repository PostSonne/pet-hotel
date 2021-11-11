import {Autocomplete, Box, Button, Grid, Tab, Tabs, TextField, Typography} from "@mui/material";
import React from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import {Item} from "../Item";
import { StyledStack } from "../StyledComponents/StyledStack";

export const CategoryTabs = () => {
  const [value, setValue] = React.useState(0);
  const [dateValue, setDateValue] = React.useState<Date | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <div>{children}</div>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const data: readonly any[] = [];
  const style = {"margin": "87px 0 0 0"};
  const styleTwo = {"margin": "40px 0 0 0"};
  return (
    <Grid
      container
      justifyContent={"center"}
    >
      <Grid item xs={12}>
        <Item>
          <Tabs
            centered
            variant="fullWidth"
            value={value}
            onChange={handleChange}
          >
            <Tab icon={<PhoneIcon/>} label="RECENTS" {...a11yProps(0)}/>
            <Tab icon={<FavoriteIcon/>} label="FAVORITES" {...a11yProps(1)}/>
            <Tab icon={<PersonPinIcon/>} label="NEARBY" {...a11yProps(2)}/>
          </Tabs>
          <TabPanel value={value} index={0}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Item>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={data}
                    renderInput={(params) => <TextField {...params} label="Выберите район" />}
                  />
                </Item>
              </Grid>
              <Grid item xs={2} flexDirection={"row"}>
                <Item>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Basic example"
                      value={dateValue}
                      onChange={(newValue) => {
                        setDateValue(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} label={"С..."} />}
                    />
                  </LocalizationProvider>
                </Item>
              </Grid>
              <Grid item xs={2} flexDirection={"row"}>
                <Item>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Basic example"
                      value={dateValue}
                      onChange={(newValue) => {
                        setDateValue(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} label={"По..."}/>}
                    />
                  </LocalizationProvider>
                </Item>
              </Grid>
              <Grid item xs={5} >
                <div style={style}>
                  <StyledStack direction="row" spacing={2}>
                    <Typography variant="body1" gutterBottom>У меня...</Typography>
                    <Button size="large" variant="contained">
                      Кот
                    </Button>
                    <Button size="large"  variant="contained">
                      Собака
                    </Button>
                    <Button size="large" variant="contained">
                      Другое
                    </Button>
                  </StyledStack>
                </div>
              </Grid>
              <Grid
                container
                direction="row-reverse"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid item xs={2}>
                  <div style={styleTwo}>
                    <Button color="secondary" size="large" variant="contained">
                      Найти
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
        </Item>
      </Grid>
    </Grid>
  )
}
