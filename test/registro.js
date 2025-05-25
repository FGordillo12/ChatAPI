import supertest from 'supertest';
import { app } from '../server';
describe('Pruebas sobre la API', () => {
  describe('POST /api/registro', () =>{

    it('Prueba de registro', async () =>{

      const metodoPOST = 
      {
        nombreCompleto: "Prueba Uno", 
        email:"pruebauno@gmail.com", 
        password:"Hola12345*",
        type:"Usuario" 
      }

      const response = await supertest(app).post('/api/registro').send(metodoPOST)
      expect(response.status).toBe(201);
      console.log('RESPUESTA DEL SERVIDOR:', response.body); 
    
    })


  })
});
