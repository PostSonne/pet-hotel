import {Grid, Paper, styled, Tab, Tabs} from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import React from "react";

export const MainPage = () => {
  const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    margin: theme.spacing(10, 0, 0, 0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
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
            <Tab icon={<PhoneIcon/>} label="RECENTS"/>
            <Tab icon={<FavoriteIcon/>} label="FAVORITES"/>
            <Tab icon={<PersonPinIcon/>} label="NEARBY"/>
          </Tabs>
        </Item>
      </Grid>
    </Grid>
  )
}
