export async function login({ commit }, user) {
    await commit("loginSuccess", user);
}

export function logout({ commit }) {
    return new Promise((resolve) => {
        commit("logout");
        resolve();
    });
}
