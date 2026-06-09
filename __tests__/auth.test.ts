import bcrypt from "bcryptjs";
import { describe } from "node:test";
import jwt from "jsonwebtoken"

describe('Auth - Password hashing', () => {

    test('hashes a password', async () => {
        const password = 'password123'
        const hashed = await bcrypt.hash(password, 10)

        expect(hashed).not.toBe(password)
        expect(hashed).toBeTruthy()
    })

    test('verifies correct password', async () => {
        const password = 'password123'
        const hashed = await bcrypt.hash(password, 10)
        const result = await bcrypt.compare(password, hashed)

        expect(result).toBe(true)
    })

    test('rejects wrong password', async () => {
        const password = 'password123'
        const hashed = await bcrypt.hash(password, 10)
        const result = await bcrypt.compare('wrongpassword', hashed)

        expect(result).toBe(false)
    })
})

describe('Token - jwt token', () => {

    const JWT_SECRET = 'testsecret'

    test('generates a token', async () => {
        const token = jwt.sign(
            {id: '1'},
            JWT_SECRET
        )

        expect(token).toBeTruthy()
    })

    test('verifies valid token', () => {
        const token = jwt.sign(
            {id: '1'},
            JWT_SECRET
        )
        const result = jwt.verify(token, JWT_SECRET)
        expect(result).toBeTruthy()
    })

    test('rejects invalid token', () => {
        expect(() => jwt.verify('invalidtoken', JWT_SECRET)).toThrow()
    })
})