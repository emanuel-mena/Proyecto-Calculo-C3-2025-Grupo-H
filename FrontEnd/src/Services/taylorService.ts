import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/taylor";

export interface TaylorRequest {
    funcion: string;
    center: number;
    x_eval: number;
    order: number;
    num_points?: number;
    x_min?: number;
    x_max?: number;
}

export const calcularTaylor = async (data: TaylorRequest) => {
    const response = await axios.post(API_URL, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    return response.data;
};
