export class MissingParamError extends Error {
  constructor (param: string) {
    super(`${param} is required`)
    this.name = 'MissingParamError'
  }
}
