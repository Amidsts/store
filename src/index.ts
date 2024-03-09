import app from "./app";
import appConfig from "./configs";

const { port, environment} = appConfig;

(() => {
  app.listen(port, () => {
    console.log(
      `${environment?.toLocaleUpperCase()} is running on port ${port}`
    );
  });
})();
