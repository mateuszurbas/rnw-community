import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { testID$ } from '../command';

export class VisibleComponent {
    private readonly constructorEl: WebdriverIO.Element | undefined;
    private readonly constructorSelector: string = '';

    constructor(selectorOrElement: WebdriverIO.Element | string) {
        if (isNotEmptyString(selectorOrElement)) {
            this.constructorSelector = selectorOrElement;
        } else {
            this.constructorEl = selectorOrElement;
        }
    }

    get RootEl(): Promise<WebdriverIO.Element> {
        return isDefined(this.constructorEl) ? Promise.resolve(this.constructorEl) : testID$(this.constructorSelector);
    }

    /** @deprecated Use RootEl getter to follow semantic */
    get rootEl(): Promise<WebdriverIO.Element> {
        return this.RootEl;
    }

    async isExisting(): Promise<boolean> {
        return await (await this.RootEl).isExisting();
    }

    async isNotExisting(): Promise<void> {
        await (await this.RootEl).waitForDisplayed({ reverse: true });
    }

    async isReady(): Promise<void> {
        await (await this.RootEl).waitForDisplayed();
    }

    async isDisplayed(): Promise<boolean> {
        return await (await this.RootEl).isDisplayed();
    }

    async click(): Promise<void> {
        await (await this.RootEl).click();
    }

    async getChildEl(selector: string, root = this.rootEl): Promise<WebdriverIO.Element> {
        return await root.then(async rootEl => await rootEl.testID$(selector));
    }

    async getChildEls(selector: string, root = this.rootEl): Promise<WebdriverIO.ElementArray> {
        return await root.then(async rootEl => await rootEl.testID$$(selector));
    }

    async getChildElByIdx(selector: string, idx: number, root = this.rootEl): Promise<WebdriverIO.Element> {
        return await root.then(async rootEl => await rootEl.testID$$Index(selector, idx));
    }

    async clickChildEl(selector: string, root = this.rootEl): ReturnType<WebdriverIO.Element['click']> {
        await (await this.getChildEl(selector, root)).click();
    }

    async clickByIdxChildEl(selector: string, idx: number, root = this.rootEl): ReturnType<WebdriverIO.Element['click']> {
        await (await this.getChildElByIdx(selector, idx, root)).click();
    }

    async isDisplayedChildEl(selector: string, root = this.rootEl): ReturnType<WebdriverIO.Element['isDisplayed']> {
        return await (await this.getChildEl(selector, root)).isDisplayed();
    }

    async isExistingChildEl(selector: string, root = this.rootEl): ReturnType<WebdriverIO.Element['isExisting']> {
        return await (await this.getChildEl(selector, root)).isExisting();
    }

    async getTextChildEl(selector: string, root = this.rootEl): ReturnType<WebdriverIO.Element['getText']> {
        return await (await this.getChildEl(selector, root)).getText();
    }

    async waitForExistsChildEl(selector: string, root = this.rootEl): ReturnType<WebdriverIO.Element['waitForExist']> {
        return await (await this.getChildEl(selector, root)).waitForExist();
    }

    async waitForDisplayedChildEl(
        selector: string,
        root = this.rootEl
    ): ReturnType<WebdriverIO.Element['waitForDisplayed']> {
        return await (await this.getChildEl(selector, root)).waitForDisplayed();
    }
}
