import React from 'react'
import styled from 'styled-components'
import ApnaTube from "../Images/channel-5.jpeg"
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsIcon from '@mui/icons-material/Sports';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SettingsIcon from '@mui/icons-material/Settings';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LightModeIcon from '@mui/icons-material/LightMode';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import {Link} from "react-router-dom"
const Container=styled.div`
 flex:1;
 background-color:${({theme})=>theme.bgLighter};
 color:${({theme})=>theme.text};
 height:100vh;
 font-size:14px;
 position:sticky;
 top:0;`;

const Wrapper=styled.div`
  padding:18px 26px`;

const Logo=styled.div`
  display:flex;
  aligns-items:center;
  gap:5px;
  font-weight:bold;
  margin-bottom:25px`;
  
const Img=styled.img`
  height:23px;
  `;

const Item=styled.div`
  display:flex;
  align-items:center;
  gap:20px;
  cursor:pointer;
  padding:7.5px 0px;
  &:hover{
  background-color:${({theme})=>theme.soft}`;

const Hr=styled.hr`
margin:15px 0px ; 
border:0.5px solid ${({theme})=>theme.soft};`;

const Login=styled.div``;
const Button=styled.button`
padding:5px 15px;
background-color: transparent;
border:1px solid #3ea6ff;
color: #3ea6ff;
border-radius:3px;
font-weight:500;
margin-top:10px;
cursor:pointer;
display:flex;
align-items:center;
gap:5px;`;  
const Menu=({darkMode,setdarkMode})=>{
  const {currentUser}=useSelector((state)=>state.user.currentUser);
  return (
    <Container>
      <Wrapper>
        <Link to="/" style={{textDecoration:"none"}}>
          <Logo>
            <Img src={ApnaTube}/>
            ApnaTube
          </Logo>
        </Link>
        <Item>
          <HomeIcon/>
          Home
        </Item>
        <Link to="trending" style={{textDecoration:"none", color:"inherit"}}>
          <Item>
            <ExploreIcon/>
            Explore
          </Item>
        </Link>
        <Link to="subscription" style={{textDecoration:"none",color:"inherit"}}>
          <Item>
            <SubscriptionsIcon/>
            Subscriptions
          </Item>
        </Link>
        <Hr/>
        <Item>
          <VideoLibraryIcon/>
          Library
        </Item>
        <Item>
          <HistoryIcon/>
          History
        </Item>
        <Hr/>
        {!currentUser &&
          <>
          <Login>
            Sign in to like videos,comment and subcribe
            <Link to="signin" style={{textDecoration:"none"}}>
              <Button><AssignmentIndIcon/>SIGN IN</Button>
            </Link>
          </Login>
          <Hr/>
        </>}
        <Item>
          <MusicNoteIcon/>
          Music
        </Item>
        <Item>
          <SportsIcon/>
          Sports
        </Item>
        <Item>
          <SportsEsportsIcon/>
          Gaming
        </Item>
        <Item>
          <MovieCreationIcon/>
          Movies
        </Item>
        <Item>
          <NewspaperIcon/>
          News
        </Item>
        <Item>
          <LiveTvIcon/>
          Live
        </Item>
        <Hr/>
        <Item>
          <SettingsIcon/>
          Settings
        </Item>
        <Item>
          <ReportGmailerrorredIcon/>
          Report
        </Item>
        <Item>
          <HelpOutlineIcon/>
          Help
        </Item>
        <Item onClick={()=>setdarkMode(!darkMode)}>
          <LightModeIcon/>
          {darkMode ? "Light" : "Dark"} Mode
        </Item>
      </Wrapper>
    </Container>
  )
}

export default Menu