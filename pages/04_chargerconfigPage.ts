import { Page, Locator } from '@playwright/test';

export class chargerConfigPage {
  readonly page: Page;
  readonly addCustomButton: Locator;
  readonly depotDefaultValueText: Locator;
  readonly kwText: Locator;
  readonly addCustomText: Locator;
  readonly svgElement: Locator;
  readonly noChargersSelectedForCustomConfigurationDepText: Locator;
  readonly iElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addCustomButton = page.getByRole('button', { name: 'Add Custom', exact: true });
    this.depotDefaultValueText = page.getByText('Depot default value:', { exact: true });
    this.kwText = page.getByText('2.7kW', { exact: true });
    this.addCustomText = page.getByText('Add Custom', { exact: true });
    this.svgElement = page.locator(`xpath=//*[local-name()='svg']`);
    this.noChargersSelectedForCustomConfigurationDepText = page.getByText('No chargers selected for custom configuration. Dep');
    this.iElement = page.locator(`.icon`);
  }

  async getTitle() : Promise<string> {
    return await this.page.title();
  }
  async isPageLoaded(): Promise<boolean> {
    return await this.depotDefaultValueText.isVisible();
  }

}
