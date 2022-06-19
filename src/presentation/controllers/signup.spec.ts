import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './signup'

describe('SignUpController', () => {
  it('should return 400 if no name is provided', async () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        password: 'any_password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if no email is provided', async () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })
})
