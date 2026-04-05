import Express = require("express");
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";


const app = Express();
app.use(Express.json());
app.use("/api", routes);
app.use(errorHandler);
export default app;