import styled from "styled-components"
import Menu from "./components/Menu"
import Navbar from "./components/Navbar"
import {ThemeProvider} from "styled-components";
import { darkTheme, lightTheme } from "./utils/theme";
import { useState } from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn"
const Container =styled.div`
display:flex;`;
const Main=styled.div`
  flex:7;
  background-color:${({theme})=>theme.bg};`;
const Wrapper=styled.div``
function App() {
  const [darkMode,setdarkMode]=useState(true);
  return (
    <ThemeProvider theme={darkMode ? darkTheme:lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setdarkMode={setdarkMode}/>
          <Main>
            <Navbar/>
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home type="random"/>}/>
                  <Route path="trending" element={<Home type="trend"/>}/>
                  <Route path="subscription" element={<Home type="sub"/>}/>
                  <Route path="signin" element={<SignIn/>}/>
                  <Route path="video">
                    <Route path=":id" element={<Video/>}/>
                  </Route>
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  )
}

export default App
