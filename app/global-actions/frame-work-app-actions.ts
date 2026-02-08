import axios from "axios";

export const handleCellUpdate = async (payload: any) => {
    const res = await axios.post("/actions/inline-edit", payload, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    return res.data;
};

// const api = axios.create({
//   baseURL: "/actions",
// });

// api.post("/inline-edit", payload);