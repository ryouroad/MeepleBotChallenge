import axios from 'axios'
const API_KEY = process.env.VUE_APP_API_KEY;
const SERVER_URL = process.env.VUE_APP_SERVER_URL;

export const commonStore = {
    namespaced: true,
    state: {
        isFeedbackLoading: false
    },
    mutations: {
        setIsFeedbackLoading(state, isFeedbackLoading){
            state.isFeedbackLoading = isFeedbackLoading;
        }
    },
    actions: {
        async sendFeedback({ commit }, {message, name, page}) {
            commit('setIsFeedbackLoading', true); // ローディング開始
            // console.log(message, name ,page)
            try{
                const post_response = await axios.post(SERVER_URL+'feedback', {
                    feedback: message,
                    name: name,
                    page: page
                }, {
                    headers: {
                        'x-api-key': API_KEY, // ヘッダーにAPIキーを追加
                    }
                });
                console.log(post_response)
            } catch (error) {
                console.error('Error fetching feedback:', error);
            }
            commit('setIsFeedbackLoading', false); // ローディング終了
        },
    }
}