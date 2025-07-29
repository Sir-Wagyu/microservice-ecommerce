const pool = require("../config/db");

const ProductModel = {
   create: async (name, description, price, stock, imageUrl) => {
      const [result] = await pool.execute("INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)", [name, description, price, stock, imageUrl]);
      return result.insertId;
   },

   findById: async (id) => {
      const [rows] = await pool.execute("SELECT * FROM products WHERE id = ?", [id]);
      return rows[0];
   },

   update: async (id, data) => {
      const fields = [];
      const values = [];

      if (data.name !== undefined) {
         fields.push("name = ?");
         values.push(data.name);
      }
      if (data.description !== undefined) {
         fields.push("description = ?");
         values.push(data.description);
      }
      if (data.price !== undefined) {
         fields.push("price = ?");
         values.push(data.price);
      }
      if (data.stock !== undefined) {
         fields.push("stock = ?");
         values.push(data.stock);
      }
      if (data.image_url !== undefined) {
         fields.push("image_url = ?");
         values.push(data.image_url);
      }

      if (fields.length === 0) {
         return 0; // No fields to update
      }

      values.push(id); // Add id for WHERE clause
      const query = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;

      const [result] = await pool.execute(query, values);
      return result.affectedRows;
   },

   delete: async (id) => {
      const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [id]);
      return result.affectedRows;
   },

   getAll: async () => {
      const [rows] = await pool.execute("SELECT * FROM products");
      return rows;
   },
};

module.exports = ProductModel;
