export class PromiseWrapper {
  public async handle(promise: Promise<any>) {
    return promise.catch((e) => {
      console.error(e.message);
      throw new Error(e);
    });
  }
}
