import { MissingParamError } from '../errors/missing-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup'

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes {
  emailValidator: EmailValidator
  sut: SignUpController
}
const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidatorStub()
  const sut = new SignUpController(emailValidator)

  return { sut, emailValidator }
}

describe('SignUpController', () => {
  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })

  it('should call EmailValidator with correct params', async () => {
    const { sut, emailValidator } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password'
      }
    }
    const emailValidatorSpy = jest.spyOn(emailValidator, 'isValid')

    await sut.handle(httpRequest)

    expect(emailValidatorSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })

  it('should return 400 if invalid email is provided', async () => {
    const { sut, emailValidator } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalidMail@mail.com',
        password: 'any_password'
      }
    }
    jest.spyOn(emailValidator, 'isValid').mockReturnValue(false)

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('Email is not valid'))
  })

  it('should return 200 if valid email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalidMail@mail.com',
        password: 'any_password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({})
  })
})
