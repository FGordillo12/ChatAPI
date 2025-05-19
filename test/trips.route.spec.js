import supertest from 'supertest';
import { app } from '../server';
describe('Pruebas sobre la API', () => {
  describe('POST /api/registro', () =>{

    it('El registro esta bien', async () =>{

      const metodoPOST = 
      {
        nombreCompleto: "Usuario Prueba", 
        email:"usuarioprueba@gmail.com", 
        password:"Hola",
        type:"Usuario" 
      }

      const response = await supertest(app).post('/api/registro').send(metodoPOST)
      expect(response.status).toBe(201);
    
    })


  })
});
