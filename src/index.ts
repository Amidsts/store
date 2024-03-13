import app, {
  initializeDatabase,
  initializeMiddlewares,
  initializeRoutes,
} from "./app";
import appConfig from "./configs";

const { port, environment } = appConfig;

(() => {
  initializeDatabase();
  initializeMiddlewares();
  initializeRoutes();

  app.listen(port, () => {
    console.log(
      `${environment?.toLocaleUpperCase()} is running on port ${port}`
    );
  });
})();
