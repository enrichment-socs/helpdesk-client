export class PromiseWrapper {
  public async handle<T>(promise: Promise<T>): Promise<T> {
    return promise.catch((e) => {
      console.error(e.message);
      throw new Error(e);
    });
  }
}
