import supertest from 'supertest';
import { app } from '../server';

describe('Pruebas sobre la API', () => {

    describe('POST /api/login', () => {
        it('El login funciona correctamente', async () => {

            const metodoPOST = 
            {
                email:"cuenta99cuenta9@gmail.com",
                password:"Alfonso12@"
            };

            const response = await supertest(app).post('/api/login').send(metodoPOST);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');

        });

        it('El login falla con credenciales incorrectas', async () => {

            const metodoPOST = 
            {
                email:"cuenta99cuenta9@gmail.com",
                password:"contraseñaincorrecta"
            };
            
            const response = await supertest(app).post('/api/login').send(metodoPOST);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('mensaje de error');

        });

    });

});