import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

export const fetchAnalytics = async (userId: string) => {
    const response = await apiClient.get(`/analytics/${userId}`);
    return response.data;
};

export const fetchQuiz = async (userId?: string) => {
    const response = await apiClient.get("/quiz", {
        params: userId ? { user_id: userId } : undefined,
    });
    return response.data;
};

export type QuizSubmissionPayload = {
    user_id: string;
    responses: Array<{
        question_id: string;
        selected_option: string;
        time_taken: number;
    }>;
};

export const submitQuiz = async (data: QuizSubmissionPayload) => {
    const response = await apiClient.post("/quiz/submit", data);
    return response.data;
};
