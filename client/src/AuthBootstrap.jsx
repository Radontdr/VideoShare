import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice.js";

const AuthBootstrap = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("/api/users/me", { withCredentials: true });
        dispatch(loginSuccess(res.data));
      } catch (err) {
        console.warn("User not logged in or token expired");
      }
    };
    fetchMe();
  }, [dispatch]);

  return null; // This renders nothing visually
};

export default AuthBootstrap;
