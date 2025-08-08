import { secureStorage } from "src/utils/secureStorage.js";

export const authGuard = (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = secureStorage.getItem("token");
    const expiresAt = secureStorage.getItem("expires_at");
    const isExpired = expiresAt ? Date.now() > parseInt(expiresAt, 10) : true;

    if (!token || isExpired) {
      // Limpia storage si expiró
      secureStorage.removeItem("token");
      secureStorage.removeItem("expires_at");
      next({
        name: "login",
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      next();
    }
  } else {
    next();
  }
};
