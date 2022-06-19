import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helpers'
import { EmailValidator } from '../protocols/email-validator'
import { Controller, HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'email', 'password']
    const { body } = httpRequest

    for (const field of requiredFields) {
      if (body[field]) continue

      return badRequest(new MissingParamError(field))
    }

    const isValidMail = this.emailValidator.isValid(body.email)
    if (!isValidMail) return badRequest(new Error('Email is not valid'))

    return {
      statusCode: 200,
      body: {}
    }
  }
}
