import app from "./src/app.js";
import connectToDB from "./src/configs/database.js";
import { PORT } from "./src/configs/env.js";

const startServer = async () => {
  await connectToDB();

  app.listen(PORT, () => {
    console.log(`api is running on http://localhost:${PORT}`);
  });
};

startServer();
