export interface HttpRequest {
  body?: any
}

export interface HttpResponse {
  statusCode: number
  body?: any
}

export interface Controller {
  handle: (request: HttpRequest) => Promise<HttpResponse>
}
