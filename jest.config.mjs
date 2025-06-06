//Importacion de configuración de Jest para pruebas unitarias
export default {
  testEnvironment: "node", // Entorno de prueba para Node.js
  transform: {},
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.js"],
};
