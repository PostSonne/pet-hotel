import React from 'react';
import './App.css';
import {Container} from "@mui/material";
import {MainPage} from "./containers/MainPage";

function App() {
  return (
    <Container maxWidth={"xl"} fixed={true}>
        <MainPage/>
    </Container>
  );
}

export default App;
