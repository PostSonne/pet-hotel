import {Grid, Paper, styled} from "@mui/material";
import React from "react";

export const MainPage = () => {
  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    margin: theme.spacing(10, 0, 0 ,0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Item>xs=8</Item>
      </Grid>
      <Grid item xs={4}>
        <Item>xs=4</Item>
      </Grid>
      <Grid item xs={4}>
        <Item>xs=4</Item>
      </Grid>
      <Grid item xs={8}>
        <Item>xs=8</Item>
      </Grid>
    </Grid>
  )
}
