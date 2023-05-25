const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();

// Server connection
const port = 3000;
app.listen(port, () => {
  console.log("Listening to port", port);
});
