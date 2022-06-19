export class InvalidParamError extends Error {
  constructor (param: string) {
    super(`${param} is not valid`)
    this.name = 'InvalidParamError'
  }
}
