import { HttpResponse } from '../protocols/http'

export function badRequest (error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: error
  }
}

export function ok (body: any): HttpResponse {
  return {
    statusCode: 200,
    body
  }
}
