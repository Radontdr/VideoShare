import axiosInstance from "../utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 20px;
`;

const Message = styled.p`
  color: orange;
  padding: 0 20px;
`;

const IframeWrapper = styled.div`
  width: 100%;
  max-width: 400px;
`;

const Search = () => {
  const [videos, setVideos] = useState([]);
  const [source, setSource] = useState(""); // 'local' or 'youtube'
  const query = useLocation().search;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get(`/api/videos/search${query}`);
        setVideos(res.data.videos || []);
        setSource(res.data.source || "local");
      } catch (error) {
        console.error("Search failed", error);
      }
    };

    fetchVideos();
  }, [query]);

  return (
    <>
      {source === "youtube" && (
        <Message>
          No results found on our platform. Showing results from YouTube instead.
        </Message>
      )}

      <Container>
        {videos.map((video) =>
          video.isYouTube ? (
            <IframeWrapper key={video._id}>
              <iframe
                width="100%"
                height="220"
                src={`https://www.youtube.com/embed/${video._id}`}
                title={video.title}
                frameBorder="0"
                allowFullScreen
              />
            </IframeWrapper>
          ) : (
            <Card key={video._id} video={video} />
          )
        )}
      </Container>
    </>
  );
};

export default Search;
