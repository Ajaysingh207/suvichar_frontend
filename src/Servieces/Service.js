
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
export const fetchUserById = async (id) => {
  const res = await api.get(`/user/${id}`);
  return res.data;
};
export const uploadPic = async () => {
  const res = await api.post(`/updateProfilePic`);
  return res.data;
};

