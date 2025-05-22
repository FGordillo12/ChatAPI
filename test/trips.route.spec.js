import supertest from 'supertest';
import { app } from '../server';
describe('Pruebas sobre la API', () => {
  describe('POST /api/registro', () =>{

    it('El registro esta bien', async () =>{

      const metodoPOST = 
      {
        nombreCompleto: "Jose Alfonso", 
        email:"cuenta99cuenta9@gmail.com", 
        password:"Alfonso12@",
        type:"Usuario" 
      }

      const response = await supertest(app).post('/api/registro').send(metodoPOST)
      expect(response.status).toBe(201);
    
    })


  })
});
