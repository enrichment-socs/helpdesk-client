import { PromiseWrapper } from './promise-wrapper';

export class ClientPromiseWrapper extends PromiseWrapper {
  private toast;

  constructor(toast) {
    super();
    this.toast = toast;
  }

  public async handle<T>(promise: Promise<T>, message?: string): Promise<T> {
    return promise.catch((e) => {
      console.error(e.message);
      this.toast.error(message || e.message);
      return Promise.reject(message || e.message);
    });
  }
}
