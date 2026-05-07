import createApiClient from "./api.service";

class AuthService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  async login(data) {
    return (await this.api.post("/login", data)).data;
  }

  async register(data) {
    return (await this.api.post("/register", data)).data;
  }

  async loginWithGoogle(credential) {
    return (await this.api.post("/google", { credential })).data;
  }
}

export default new AuthService();
