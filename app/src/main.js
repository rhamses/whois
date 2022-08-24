import { registerSW } from "virtual:pwa-register";
import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

createApp(App).mount("#app");
