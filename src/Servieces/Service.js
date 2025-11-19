
import api from "../api";

export const fetchMessages = async (sender, receiver) => {
  const res = await api.get(`/messages/${sender}/${receiver}`);
  return res.data;
};

export const sendMessageApi = async (payload) => {
  const res = await api.post(`/send`, payload);
  return res.data;
};

export const fetchUsers = async () => {
 
  const res = await api.get("/allusers");
  return res.data;
};
