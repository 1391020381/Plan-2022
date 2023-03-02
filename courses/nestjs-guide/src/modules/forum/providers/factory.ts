import { OneProvider } from './one.provider';

export class Factory {
    constructor(private one: OneProvider) {}

    getContent() {
        return this.one.useFactory();
    }

    async getPromise() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.one);
            }, 100);
        });
    }
}
