import React from "react";
import {CategoryTabs} from "../../components/CategoryTabs";
import Header from "../../components/Header";
import {Container} from "@mui/material";

export const MainPage = () => {
  return (
    <>
      <Header/>
      <Container
        maxWidth={false}
        sx={{
          backgroundImage: `url(${"bg.jpg"})`,
          backgroundSize: 'auto 150%',
          backgroundPosition: '0 75%',
          maxHeight: "300px",
          minHeight: "300px"
        }}
      >
        <CategoryTabs/>
      </Container>
    </>
  )
}
