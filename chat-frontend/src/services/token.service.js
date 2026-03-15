const TOKEN_KEY = "auth_token";

export const TokenService = {
    get(){
        return localStorage.getItem(TOKEN_KEY);
    },

    set(token){
        localStorage.setItem(TOKEN_KEY, token);
    },

    remove(){
        localStorage.removeItem(TOKEN_KEY);
    },
};