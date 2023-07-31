
export function loginSuccess(state,user) {
    state.logged = true;
    state.local = true;
    state.Token = user.SessionToken;
}

 export function logout(state) {
    state.logged = false;
    state.local = false;
    state.Token = null;
}