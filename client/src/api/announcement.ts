import axios from "axios";

export const getAnnouncements = async () => {
    const response = await axios.get('http://localhost:3000/announcement');
    return response.data;
}

export const addAnnouncement = async (announcement: string) => {
    const response = await axios.post('http://localhost:3000/announcement', {announcement_message: announcement});
    return response.data;
}