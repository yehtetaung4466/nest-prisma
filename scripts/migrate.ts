import { Sequelize } from 'sequelize-typescript';
import * as models from '../src/core/database/models'; // Adjust the path to your models

(async () => {
  try {
    // Extract models from the `models` object
    const modelList = Object.values(models);

    // Create a Sequelize instance
    const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/connect_db', {
      models: modelList, // Pass the array of models here
    });

    // Synchronize the database
    await sequelize.sync({ alter: {
      drop: false,

      
    } }); // Use `alter: true` for safe updates without dropping tables
    console.log('Database synchronized successfully.');

    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error('Error during database synchronization:', error);
    process.exit(1);
  }
})();
