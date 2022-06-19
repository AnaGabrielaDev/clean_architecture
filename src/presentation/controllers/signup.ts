import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'email']
    const { body } = httpRequest

    for (const field of requiredFields) {
      if (body[field]) continue

      return badRequest(new MissingParamError(field))
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
