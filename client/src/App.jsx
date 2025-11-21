import styled from "styled-components"
import Menu from "./components/Menu"
import Navbar from "./components/Navbar"
import {ThemeProvider} from "styled-components";
import { darkTheme, lightTheme } from "./utils/theme.js";
import { useState } from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Video from "./pages/Video.jsx";
import SignIn from "./pages/SignIn.jsx"
import AuthBootstrap from "./AuthBootstrap.jsx";
import Search from "./pages/Search.jsx";
import { useSelector } from "react-redux";
import AiHelper from "./pages/AiHelper.jsx";
const Container =styled.div`
display:flex;`;
const Main=styled.div`
  flex:7;
  background-color:${({theme})=>theme.bg};`;
const Wrapper=styled.div``
function App() {
  const [darkMode,setdarkMode]=useState(true);
  const { currentUser } = useSelector((state) => state.user);
  return (
    <ThemeProvider theme={darkMode ? darkTheme:lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setdarkMode={setdarkMode}/>
          <Main>
            <Navbar/>
            <AuthBootstrap />
            <Wrapper>
               <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="trends" element={<Home type="trend" />} />
                  <Route path="subscriptions" element={<Home type="sub" />} />
                  <Route path="search" element={<Search />} />
                  <Route path="ai-helper" element={<AiHelper />} />
                  <Route
                    path="signin"
                    element={currentUser ? <Home /> : <SignIn />}
                  />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
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
