import { Account } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { MissingParamError } from '../errors/missing-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup'

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (accountData: AddAccountModel): Promise<Account> {
      return await new Promise((resolve) => resolve(
        {
          id: 'valid_id',
          email: 'valid_mail@mail.com',
          name: 'valid_name',
          password: 'hash_password'
        }
      ))
    }
  }

  return new AddAccountStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes {
  addAccount: AddAccount
  emailValidator: EmailValidator
  sut: SignUpController
}
const makeSut = (): SutTypes => {
  const addAccount = makeAddAccount()
  const emailValidator = makeEmailValidator()
  const sut = new SignUpController(emailValidator, addAccount)

  return { sut, emailValidator, addAccount }
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
        email: 'valid@mail.com',
        password: 'any_password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: 'valid_id',
      email: 'valid_mail@mail.com',
      name: 'valid_name',
      password: 'hash_password'
    })
  })

  it('should call add account with correct params', async () => {
    const { sut, addAccount } = makeSut()
    const addAccountSpy = jest.spyOn(addAccount, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'valid@mail.com',
        password: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'valid@mail.com',
      password: 'any_password'
    })
  })
})
