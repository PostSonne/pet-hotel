import {Autocomplete, Button, Grid, TextField, Typography} from "@mui/material";
import {StyledStack} from "../StyledComponents/StyledStack";
import React from "react";
import {TabPanel} from "../TabPanel";
import {CategoryTabType} from "../CategoryTabs";
import {CustomDatePicker} from "../DatePicker";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {AppState} from "../../redux/reducers/rootReducer";
import { useSelector, useDispatch } from 'react-redux';
import {search} from "../../redux/actions/searchActions";

export const DogsittersTab: React.FC<CategoryTabType> = ({value, index}) => {
  const searchResult = useSelector((state: AppState) => state.searchResult);
  const dispatch = useDispatch();

  const data: readonly any[] = [];
  const style = {"margin": "60px 0 0 0"};
  const styleTwo = {"margin": "67px 0 0 0", "text-align": "end"};

  function handleSearchData() {
    dispatch(search());
  }

  return (
    <TabPanel value={value} index={index}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <div style={style}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={data}
              renderInput={(params) => <TextField {...params} label="Выберите район" />}
            />
          </div>
        </Grid>
        <Grid item xs={3} flexDirection={"row"}>
          <div style={style}>
            <CustomDatePicker label={"C..."}/>
          </div>
        </Grid>
        <Grid item xs={4} >
          <div style={styleTwo}>
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
        <Grid item xs={2}>
          <div style={styleTwo}>
            <Button
              color="secondary"
              size="large"
              variant="contained"
              endIcon={<SearchRoundedIcon/>}
              onClick={handleSearchData}
            >
              Найти
            </Button>
          </div>
        </Grid>
        <Grid
          container
          direction="row-reverse"
          justifyContent="flex-start"
          alignItems="center"
        >
          <div>
            {searchResult && <div>{searchResult}</div>}
          </div>
        </Grid>
      </Grid>
    </TabPanel>
  )
}

