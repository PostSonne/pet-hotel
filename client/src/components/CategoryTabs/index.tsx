import {Grid, Tab, Tabs} from "@mui/material";
import React from "react";
import PersonIcon from '@mui/icons-material/Person';
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import {Item} from "../Item";
import {a11yProps} from "../../utils/a11yProps";
import {DogsittersTab} from "../DogsittersTab";
import {ZooHotelTab} from "../ZooHotelTab";
import {DaySittersTab} from "../DaySIttersTab";

export type CategoryTabType = {
  value: number;
  index: number
}

export const CategoryTabs = () => {
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
            <Tab icon={<PersonIcon/>} label="ПЕРЕДЕРЖКА" {...a11yProps(0)}/>
            <Tab icon={<EmojiPeopleOutlinedIcon/>} label="СИТТЕР У ВАС ДОМА" {...a11yProps(1)}/>
            <Tab icon={<HomeRoundedIcon/>} label="ЗООГОСТИНИЦЫ" {...a11yProps(2)}/>
          </Tabs>
          <DogsittersTab value={value} index={0}/>
          <DaySittersTab value={value} index={1}/>
          <ZooHotelTab value={value} index={2}/>
        </Item>
      </Grid>
    </Grid>
  )
}
