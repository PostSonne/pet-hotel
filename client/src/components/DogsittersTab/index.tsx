import {
  Autocomplete,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid, Paper,
  TextField,
  Typography
} from "@mui/material";
import {StyledStack} from "../StyledComponents/StyledStack";
import React from "react";
import {TabPanel} from "../TabPanel";
import {CategoryTabType} from "../CategoryTabs";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {AppState} from "../../redux/reducers/rootReducer";
import { useSelector, useDispatch } from 'react-redux';
import {searchPetSitters} from "../../redux/actions/searchActions";
import {CustomDatePicker} from "../DatePicker";

export const style = {"margin": "60px 0 0 0"};
export const styleTwo = {"margin": "67px 0 0 0", "text-align": "end"};
export const styleThree = {"margin": "25px 0 0 0"};
export const styleText = {"margin": "0 0 10px 0", "color": "#9c27b0"};
export const styleText2 = {"margin": "0 0 10px 0",};

export const DogsittersTab: React.FC<CategoryTabType> = ({value, index, category}) => {
  const searchResult = useSelector((state: AppState) => state.searchResult);
  const testData = searchResult?.data.slice(0, 10);
  const dispatch = useDispatch();

  function handleSearchData() {
    dispatch(searchPetSitters(category));
  }

  return (
    <TabPanel value={value} index={index}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <div style={style}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={[]}
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
      </Grid>
      <Grid
        container
        direction={"row"}
        spacing={2}
      >
        <Grid item xs={12} >
          <Grid container spacing={2} style={styleThree}>
            {testData.map((item) => (
              <Grid item xs={3}>
                <Paper elevation={5}>
                  <Card elevation={5} sx={{ height: 400 }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="240"
                        image="http://sun9-51.userapi.com/impf/c855528/v855528342/112bb2/3exLa2o8NyE.jpg?size=604x476&quality=96&sign=2cb7f2e526a3157c4bb20a2c32a045e8&type=album"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="body1" textAlign={"left"} style={styleText}>
                          {item.fullName}
                        </Typography>
                        <Typography variant="subtitle2" textAlign={"left"} style={styleText2}>
                          {item.location}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
               </Paper>
              </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </TabPanel>
  )
}

