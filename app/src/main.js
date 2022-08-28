import { registerSW } from "virtual:pwa-register";
import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
/**
 * WORKBOX - VUE PWA - CONFIG
 */
const intervalMS = 60 * 60 * 1000;
const updateSW = registerSW({
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update();
      }, intervalMS);
  },
  onNeedRefresh() {
    if (confirm("Bora update?")) {
      updateSW();
    }
  },
});

createApp(App).mount("#app");
