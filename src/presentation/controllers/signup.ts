import { AddAccount } from '../../domain/usecases/add-account'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helpers'
import { EmailValidator } from '../protocols/email-validator'
import { Controller, HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password']
      const { body } = httpRequest
      const { name, email, password } = body

      for (const field of requiredFields) {
        if (body[field]) continue

        return badRequest(new MissingParamError(field))
      }

      const isValidMail = this.emailValidator.isValid(body.email)
      if (!isValidMail) return badRequest(new Error('Email is not valid'))

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return {
        statusCode: 200,
        body: account
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new Error('Internal server error')
      }
    }
  }
}
