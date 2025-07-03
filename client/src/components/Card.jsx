import React from 'react'
import styled from 'styled-components';
import channel from '../Images/channel-5.jpeg'
import { Link } from 'react-router-dom';
const  Container=styled.div`
width:${(props)=>props.type!=="sm" && "360px"};
margin-bottom:${(props)=>props.type==="sm"?"10px" : "45px"};
cursor:pointer;
display:${(props)=>props.type==="sm" && "flex"};
`;
const Image=styled.img`
width:100%;
height:${(props)=>props.type==="sm"?"100px" : "202px"};
background-color:grey;
flex:1;`
;

const Details=styled.div`
display:flex;
margin-top=${(props)=>props.type==="sm" && "16px"};
gap:12px;
flex:1;`;

const ChannelImg=styled.img`
width:36px;
height:36px;
background-color:grey;
border-radius:50%;
display:${(props)=>props.type==="sm" && "none"};`

const Texts=styled.div``;
const Title=styled.h1`
font-size:16px;
font-weight:500;
color:${({theme})=>theme.text}`;

const ChannelName=styled.h2`
font-size:14px;
color:${({theme})=>theme.textSoft}
margin:10px 0px;`;

const Info=styled.div`
font-size:14px;
color:${({theme})=>theme.textSoft};`;
function Card({type}) {
  return (
    <Link to="/video/test" style={{textDecoration:"none"}}>
      <Container type={type}>
          <Image type={type}/>
          <Details type={type}>
            <ChannelImg  type={type} src={channel}/>
            <Texts>
              <Title>Title</Title>
              <ChannelName>channel</ChannelName>
              <Info>Info</Info>
            </Texts>
          </Details>
      </Container>
    </Link>
  )
}

export default Card