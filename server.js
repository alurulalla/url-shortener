const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Server running at ${port}`);
});
