export class PromiseWrapper {
  public async handle<T>(promise: Promise<T>, message?: string): Promise<T> {
    return promise.catch((e) => {
      console.error(message || e.message);
      throw new Error(e);
    });
  }
}
