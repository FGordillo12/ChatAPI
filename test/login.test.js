import supertest from 'supertest';
import { app } from '../server';

describe('Pruebas sobre la API', () => {

    describe('POST /api/login', () => {
        it('Prueba de Inicio de Sesion', async () => {

            const metodoPOST =
            {
                email: "pruebauno@gmail.com",
                password: "Hola12345*"
            };

            const response = await supertest(app).post('/api/login').send(metodoPOST);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            console.log(response.body);

        });

    });

});