import { createBunServer } from "./api";

(() => {
  const server = createBunServer();

  console.log(server.url);
})();
