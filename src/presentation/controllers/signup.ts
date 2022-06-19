import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
