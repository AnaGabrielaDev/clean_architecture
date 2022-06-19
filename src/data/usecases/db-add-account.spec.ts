import { Encryptor } from '../protocols/encryptor'
import { DbAddAccount } from './db-add-account'

const makeEncryptor = (): Encryptor => {
  class EncryptorStub implements Encryptor {
    async hash (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hash_password'))
    };
  }

  return new EncryptorStub()
}

interface SutTypes {
  sut: DbAddAccount
  encryptor: Encryptor
}
const makeSut = (): SutTypes => {
  const encryptor = makeEncryptor()
  const sut = new DbAddAccount(encryptor)

  return {
    sut,
    encryptor
  }
}
describe('DbAddAccount', () => {
  it('should call encryptor with correct param', async () => {
    const { sut, encryptor } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'validMail@mail.com',
      password: 'valid_password'
    }
    const hashSpy = jest.spyOn(encryptor, 'hash')

    await sut.add(accountData)

    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  it('throw error if encryptor throws', async () => {
    const { sut, encryptor } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'validMail@mail.com',
      password: 'valid_password'
    }
    jest.spyOn(encryptor, 'hash').mockImplementationOnce(() => { throw new Error() })

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })
})
