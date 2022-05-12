import { PromiseWrapper } from './promise-wrapper';

export class ClientPromiseWrapper extends PromiseWrapper {
  private toast;

  constructor(toast) {
    super();
    this.toast = toast;
  }

  public async handle(promise: Promise<any>): Promise<any> {
    return promise.catch((e) => {
      console.error(e.message);
      this.toast.error(e.message);
    });
  }
}
