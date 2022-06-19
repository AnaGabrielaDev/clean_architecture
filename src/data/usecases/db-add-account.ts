import { Account } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { Encryptor } from '../protocols/encryptor'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encryptor: Encryptor
  ) {}

  async add ({ name, email, password }: AddAccountModel): Promise<Account> {
    await this.encryptor.hash(password)
    return {
      id: 'valid_id',
      name: 'valid_name',
      email: 'validMail@mail.com',
      password: 'hash_password'
    }
  }
}
