const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Library API',
    description: 'This project will perform CRUD operations on a MongoDB database, be published on Render, incorporate security measures.'
  },
  // host: 'localhost:3000',
  // schemes: ['http', 'https']

  host: 'cse341-project2-ykx8.onrender.com',
  schemes: ['https']


};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);