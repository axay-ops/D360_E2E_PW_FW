import { Page, Locator, expect, BrowserContext } from '@playwright/test';


export class overviewPage {
    private readonly page: Page;
    private readonly resultsLabel: Locator;
    private readonly chargerDataTable: Locator;
    private readonly chargerDetailsDataTable: Locator;
    private readonly hardResetbtn: Locator; 
    private readonly softResetbtn: Locator; 
    private readonly toastNotification: Locator;
    private readonly sessionIdLink: Locator;
    private readonly searchFilter: Locator;
    private readonly applybtn: Locator;
  
 ;

  constructor(page: Page) {
    this.page = page;
    this.resultsLabel = page.locator('charger-details-datatable .dc-datacount-title');
    this.chargerDataTable = page.locator('datatable-body datatable-body-row') ; // .filter({ has: page.getByText('CAM QA C1')}).locator('.dc-link');
    this.chargerDetailsDataTable =  page.locator('charger-details-datatable datatable-body-row');
    this.hardResetbtn = page.getByRole('button', {name: 'Hard reset'});
    this.softResetbtn = page.getByRole('button', {name: 'Soft reset'});
    this.toastNotification = page.locator('si-toast-notification-drawer si-toast-notification');
    this.sessionIdLink =  page.locator('.connector-table .session-text'); //('app-charger-details .connector-table tbody tr .session-text')
    this.searchFilter = page.getByRole('textbox', {name: 'Charger'});
    this.applybtn = page.getByRole('button', {name: 'Apply'});

  }

  async getTitle() : Promise<string> {
    return await this.page.title();
  }

  async isPageLoaded (): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    await expect(this.chargerDetailsDataTable.first()).toBeVisible();
    return true;
  }

  async openChargerInfoPanel(chargername: string): Promise<boolean> {
    
    await expect(this.searchFilter).toBeVisible();
    await this.searchFilter.fill(chargername); 
    await this.applybtn.click();
    await expect(this.chargerDetailsDataTable.filter({ has: this.page.getByText(`${chargername}`)})).toBeVisible();
    await this.chargerDetailsDataTable.filter({ has: this.page.getByText(`${chargername}`)}).locator('.dc-link').click();

    await Promise.all(
      [
        await expect(this.hardResetbtn).toBeVisible(),
        await expect(this.softResetbtn).toBeVisible()
      ]
    )
    return true;
  }

  async clickOnHardReset (): Promise<string[]> {
      this.hardResetbtn.click();
      await expect(this.toastNotification).toBeVisible();
      const toastText = await this.toastNotification.allInnerTexts();
      console.log(`Toast Content: ${toastText} :  ${toastText.length}`); 
      return toastText;
  }


  async mockAPIResponse(status: number, data: object) {
      await this.page.route('**cm-charger-dashboard/v1/reset', route => route.fulfill({
              body: JSON.stringify(data),
              status: 200,              // Set your desired status code here (e.g., 200, 201, 400, 500) -- defaults to 200.
              headers: { 'X-Custom-Header': 'my-value' } 
      }));

  }

  async mockAPIResponseNetworkdown() {
      await this.page.route('**cm-charger-dashboard/v1/reset', (route)=> route.abort());
  }    


  async clickOnSessionId(): Promise<string> {
      let sessionId = await this.sessionIdLink.innerText();
      await this.sessionIdLink.click(); 
      return sessionId;
      
  }

  // get context (parent) from page (child)
  getPageContext(): BrowserContext {
      return this.page.context();
  }


    


}

