import { httpServer } from './app.js';
import { connectMongo } from "./config/mongoose.js";

const PORT = 8080;
httpServer.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

connectMongo();



