import React from 'react'
import styled from 'styled-components'
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { useState } from 'react';
import  Upload  from './Upload';
import { useNavigate } from 'react-router-dom';

const Container=styled.div`
position:sticky;
top:0;
background-color:${({theme})=>theme.bgLighter};
height:56px;`;

const Wrapper=styled.div`
display:flex;
align-items:center;
height:100%;
padding:0px 20px;
justify-content:flex-end;
position:relative;`;

const Search=styled.div`
position:absolute;
width:40%;
left:0px;
right:0px;
margin:auto;
display:flex;
align-items:center;
justify-content:space-between;
padding:5px;
border: 1px solid  #ccc;
border-radius: 3px;
`;
const Input=styled.input`
border:none;
background-color: transparent;
width:80%;
;`;
const Button=styled.button`
padding:5px 15px;
background-color: transparent;
border:1px solid #3ea6ff;
color: #3ea6ff;
border-radius:3px;
font-weight:500;
cursor:pointer;
display:flex;
align-items:center;
gap:5px;`;  

const User=styled.div`
display:flex;
align-items:center;
gap:10px;
font-weight:500;
color:${({theme})=>theme.text}`

const Avatar=styled.img`
width:32px;
height:32px;
border-radius:50%;
background-color: #999`
const Navbar=()=>{
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input placeholder='Search'/>
            <SearchIcon/>
          </Search>
          {currentUser ? (
            <User>
              <UploadOutlinedIcon onClick={()=>setOpen(true)}/>
              <Avatar src={currentUser.img}/>
              {currentUser.name}
            </User>
          ) : (<Link to="signin" style={{textDecoration:"none"}}>
            <Button><AssignmentIndIcon/>SIGN IN</Button>
          </Link>)}
        </Wrapper>
      </Container>
      {open && (
        <Upload setOpen={setOpen} />
      )}
    </>
  )
}

export default Navbar