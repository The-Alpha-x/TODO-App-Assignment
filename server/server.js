import app from './src/app.js';
import config from './src/config/index.js';
import connectDatabase from './src/config/database.js';

await connectDatabase();

app.listen(config.port, () => {
  console.log(`Server running on port :${config.port}`);
});
