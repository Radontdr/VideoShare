import axiosInstance from "../utils/axiosInstance.js";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card.jsx";

const Container = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const IframeWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  aspect-ratio: 16 / 9;
  margin-bottom: 10px;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 10px;
  }
`;

const Recommendation = ({ tags }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const tagQuery = Array.isArray(tags) ? tags.join(",") : tags;
        const res = await axiosInstance.get(`/api/videos/tags?tags=${tagQuery}`);
        setVideos(res.data || []);
      } catch (err) {
        console.error("Failed to fetch recommended videos:", err);
      }
    };

    fetchVideos();
  }, [tags]);

  return (
    <Container>
      {videos.map((video) =>
        video.isYouTube ? (
          <IframeWrapper key={video._id}>
            <iframe
              src={`https://www.youtube.com/embed/${video._id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </IframeWrapper>
        ) : (
          <Card type="sm" key={video._id} video={video} />
        )
      )}
    </Container>
  );
};

export default Recommendation;
