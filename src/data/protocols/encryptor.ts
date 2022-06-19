export interface Encryptor {
  hash: (value: string) => Promise<string>
}
