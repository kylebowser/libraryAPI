const swaggerAutogen = require("swagger-autogen")();
const doc = {
  info: {
    title: "Library API",
    description: "A simple API to manage library books and patrons",
  },
  host: "libraryapi-wk5f.onrender.com",
  schemes: ["https"],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
