require("dotenv").config({ path: __dirname + "/../.env" });
const express = require("express");
const app = express();
const product = require("./routes/productRoutes");

app.use(express.json());
app.use("/api/products", product);
app.get("/", (req, res) => {
   res.send("Product Service API");
});
const PORT = process.env.PORT || 3003; // Port unik
app.listen(PORT, () => {
   console.log(`Product Service running on port ${PORT}`);
});
