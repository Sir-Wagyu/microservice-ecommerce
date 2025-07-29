const CustomerModel = require("../models/customerModel");
const axios = require("axios");

const CustomerController = {
   createCustomer: async (req, res) => {
      const { userId, name, email, phone, address } = req.body;
      if (!userId || !name || !email) {
         return res.status(400).json({ message: "User ID, name, and email are required" });
      }
      try {
         // Panggil User Service untuk memvalidasi userId
         const userResponse = await axios.get(`${process.env.USER_SERVICE_URL}/api/users/${userId}`);
         if (userResponse.status !== 200 || !userResponse.data) {
            return res.status(404).json({ message: "User not found in User Service" });
         }
         const customerId = await CustomerModel.create(userId, name, email, phone, address);
         res.status(201).json({ message: "Customer created successfully", customerId });
      } catch (error) {
         console.error("Error creating customer:", error.response ? error.response.data : error.message);
         res.status(500).json({ message: "Error creating customer", error: error.message });
      }
   },

   getCustomerById: async (req, res) => {
      const { id } = req.params;

      try {
         const customer = await CustomerModel.findById(id);
         if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
         }

         const userResponse = await axios.get(`${process.env.USER_SERVICE_URL}/api/users/${customer.user_id}`);
         if (userResponse.status !== 200 || !userResponse.data) {
            return res.status(404).json({ message: "User not found in User Service" });
         }
         customer.user_info = userResponse.data.user;
         delete customer.user_id;

         res.status(200).json({ customer });
      } catch (error) {
         console.error("Error fetching customer by ID:", error);
         res.status(500).json({ message: "Error Getting Customer" });
      }
   },

   getCustomerByUserId: async (req, res) => {
      const { userId } = req.params;

      try {
         const customer = await CustomerModel.findByUserId(userId);
         if (!customer) {
            return res.status(404).json({ message: "Customer not found for this user" });
         }

         res.status(200).json({ customer });
      } catch (error) {
         console.error("Error fetching customer by User ID:", error);
         res.status(500).json({ message: "Error Getting Customer by User ID" });
      }
   },

   updateCustomer: async (req, res) => {
      const { id } = req.params;
      const { name, email, phone, address } = req.body;

      try {
         const affectedRows = await CustomerModel.update(id, name, email, phone, address);
         if (affectedRows === 0) {
            return res.status(404).json({ message: "Customer not found" });
         }

         res.status(200).json({ message: "Customer updated successfully" });
      } catch (error) {
         console.error("Error updating customer:", error);
         res.status(500).json({ message: "Error Updating Customer" });
      }
   },

   deleteCustomer: async (req, res) => {
      const { id } = req.params;

      try {
         const affectedRows = await CustomerModel.delete(id);
         if (affectedRows === 0) {
            return res.status(404).json({ message: "Customer not found" });
         }

         res.status(200).json({ message: "Customer deleted successfully" });
      } catch (error) {
         console.error("Error deleting customer:", error);
         res.status(500).json({ message: "Error Deleting Customer" });
      }
   },

   getAllCustomers: async (req, res) => {
      try {
         const customers = await CustomerModel.getAll();
         res.status(200).json({ customers });
      } catch (error) {
         console.error("Error fetching all customers:", error);
         res.status(500).json({ message: "Error Getting All Customers" });
      }
   },
};

module.exports = CustomerController;
