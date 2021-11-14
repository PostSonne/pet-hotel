import {
  Autocomplete,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia, Container,
  Grid, Paper, Rating,
  TextField,
  Typography
} from "@mui/material";
import {StyledStack} from "../StyledComponents/StyledStack";
import React from "react";
import {TabPanel} from "../TabPanel";
import {CategoryTabType} from "../CategoryTabs";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {AppState} from "../../redux/reducers/rootReducer";
import {useSelector, useDispatch} from 'react-redux';
import {searchPetSitters} from "../../redux/actions/searchActions";
import {CustomDatePicker} from "../DatePicker";

export const style = {"margin": "60px 0 0 0"};
export const styleTwo = {"margin": "67px 0 0 0", "text-align": "end"};
export const styleThree = {"margin": "25px 0 0 0"};
export const styleText = {"margin": "0 0 10px 0","text-align": "left", "fontSize": "18px" /*"color": "#9c27b0"*/}
export const styleText2 = {"margin": "0 0 10px 0",};
export const styleText3 = {"fontSize": "10px", "text-align": "left", "position": "relative", "last-child": {"position": "absolute", "top": "0", "right" : "0"}};

export const DogsittersTab: React.FC<CategoryTabType> = ({value, index, category}) => {
  const searchResult = useSelector((state: AppState) => state.searchResult);
  const testData = searchResult?.data.slice(0, 10);
  const dispatch = useDispatch();

  const styledText =

  function handleSearchData() {
    dispatch(searchPetSitters(category));
  }

  return (
    <TabPanel value={value} index={index}>
        <Grid container alignItems="stretch" spacing={1}>

          <Grid item xs={12} sm={2}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={[]}
              renderInput={(params) => <TextField {...params} label="Выберите район"/>}
            />
          </Grid>

          <Grid item xs={12} sm={3} flexDirection={"row"}>
            <CustomDatePicker label={"C..."}/>
          </Grid>

          <Grid item xs={12} sm={4}>
            <StyledStack direction="row" spacing={2}>
              <Typography variant="body1" gutterBottom>У меня...</Typography>
              <Button size="medium" variant="contained">
                Кот
              </Button>
              <Button size="medium" variant="contained">
                Собака
              </Button>
              <Button size="medium" variant="contained">
                Другое
              </Button>
            </StyledStack>
          </Grid>


          <Grid xs={12} sm={3}>
            <Button
              color="secondary"
              size="medium"
              variant="contained"
              endIcon={<SearchRoundedIcon/>}
              onClick={handleSearchData}
            >
              Найти
            </Button>
          </Grid>


        </Grid>

      <Container component="section" maxWidth="lg">
        <Grid container alignItems="stretch" spacing={3}>
          {testData.map((item) => (
            <Grid item xs={12} sm={4}
                  sx={{
                    "margin": "25px 0 0 0"
                  }}
            >
              <Paper elevation={5}>
                <Card elevation={5} sx={{height: 400}}>

                    <CardMedia
                      component="img"
                      height="240"
                      image="http://sun9-51.userapi.com/impf/c855528/v855528342/112bb2/3exLa2o8NyE.jpg?size=604x476&quality=96&sign=2cb7f2e526a3157c4bb20a2c32a045e8&type=album"
                    />
                    <CardContent>
                      <div style={styleText}>
                        {item.fullName}
                      </div>
                      <StyledText>
                        <Rating name="read-only" value={5} readOnly size="small"/>
                        <span>
                          (412)
                        </span>
                      </StyledText>
                      <Typography variant="subtitle2" textAlign={"left"} style={styleText2}>
                        {item.location}
                      </Typography>
                    </CardContent>
                </Card>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </TabPanel>
  )
}

