import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axiosInstance from "../utils/axiosInstance"; 
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Label = styled.label`
  font-size: 14px;
`;

const Upload = ({ setOpen }) => {
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const uploadFileToBackend = async (file, urlType) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosInstance.post("/api/upload/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress =
            (progressEvent.loaded / progressEvent.total) * 100;
          urlType === "imgUrl"
            ? setImgPerc(Math.round(progress))
            : setVideoPerc(Math.round(progress));
        },
      });

      const fileUrl = res.data.url;
      setInputs((prev) => ({ ...prev, [urlType]: fileUrl }));
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  useEffect(() => {
    video && uploadFileToBackend(video, "videoUrl");
  }, [video]);

  useEffect(() => {
    img && uploadFileToBackend(img, "imgUrl");
  }, [img]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!inputs.videoUrl || !inputs.imgUrl) {
      return alert("Please wait for both files to finish uploading.");
    }

    try {
      const res = await axiosInstance.post("/api/videos", {
        ...inputs,
        tags,
      });

      if (res.status === 200) {
        setOpen(false);
        navigate(`/video/${res.data._id}`);
      }
    } catch (err) {
      console.error("Error uploading video metadata", err);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a New Video</Title>

        <Label>Video:</Label>
        {videoPerc > 0 && videoPerc < 100 ? (
          <p>Uploading Video: {videoPerc}%</p>
        ) : (
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        )}

        <Input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />

        <Desc
          placeholder="Description"
          name="desc"
          rows={8}
          onChange={handleChange}
        />

        <Input
          type="text"
          placeholder="Separate the tags with commas."
          onChange={handleTags}
        />

        <Label>Image:</Label>
        {imgPerc > 0 && imgPerc < 100 ? (
          <p>Uploading Thumbnail: {imgPerc}%</p>
        ) : (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        )}

        <Button
          onClick={handleUpload}
          disabled={
            (videoPerc > 0 && videoPerc < 100) ||
            (imgPerc > 0 && imgPerc < 100)
          }
        >
          Upload
        </Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;
