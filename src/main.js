import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import vue3GoogleLogin from "vue3-google-login";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vue3GoogleLogin, {
  clientId:
    "153499108040-2ra119d90197jbre34ppgfsslnh0etpe.apps.googleusercontent.com",
});
app.mount("#app");
