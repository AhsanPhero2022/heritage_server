# Heritage Real Estate Platform - Backend

## Overview

This backend service powers the Real Estate Platform, providing RESTful APIs for managing properties, user authentication, and other core functionalities. It is built using Express.js and MongoDB, with a focus on secure and efficient data handling.

## Features

- **CRUD Operations:** Create, Read, Update, and Delete operations for properties.
- **User Authentication:** Secure authentication using Clerk.
- **Property Management:** APIs for managing property data, including bidding and testimonials.

## Technologies Used

- **Express**: A web application framework for Node.js, designed for building APIs and web applications.
- **Node.js**: A JavaScript runtime built on Chrome's V8 engine, used for backend development.
- **MongoDB**: A NoSQL database used for storing and managing application data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js, used for data validation and query building.
- **Clerk**: Authentication and user management service for secure login and registration.

## Live Demo

You can view the live project here: [Live Demo](#) _https://sm-technology-server.vercel.app_

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/AhsanPhero2022/heritage_server.git
   cd heritage_server
   npm install
   npm start

   ```

## Api end points

// GET all properties
app.get("/properties", async (req, res) => {
const result = await propertiesCollection.find().toArray();
res.send(result);
});

    // GET all testimonials
    app.get("/testimonials", async (req, res) => {
      const result = await testimonialsCollection.find().toArray();
      res.send(result);
    });

    // POST a new property
    app.post("/properties", async (req, res) => {
      const property = req.body;
      const result = await propertiesCollection.insertOne(property);
      res.send(result);
    });

    // GET properties by category
    app.get("/price", async (req, res) => {
      const result = await propertiesCollection.find().toArray();
      result.sort((a, b) => {
        if (a.price < b.price) return -1;
        if (a.price > b.price) return 1;
        return 0;
      });
      res.send(result);
    });

    // GET a property by ID
    app.get("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertiesCollection.findOne(query);
      res.send(result);
    });

    // PUT to update a property price
    app.post("/testimonials", async (req, res) => {
      const property = req.body;
      const result = await testimonialsCollection.insertOne(property);
      res.send(result);
    });
    app.post("/bid_properties", async (req, res) => {
      const property = req.body;
      const result = await bidProperties.insertOne(property);
      res.send(result);
    });

    // PUT to update a property price
    app.put("/properties/:id", async (req, res) => {
      try {
        const { price, user } = req.body;
        const propertyId = req.params.id;
        const filter = { _id: new ObjectId(propertyId) };
        const updateDoc = {
          $set: { price: price, userId: user },
        };

        const result = await propertiesCollection.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Property not found" });
        }

        res.status(200).json({ message: "Property updated successfully" });
      } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // DELETE a property by ID
    app.delete("/properties/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await propertiesCollection.deleteOne(query);
      res.send(result);
    });
