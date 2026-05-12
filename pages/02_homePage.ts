import { Page, Locator } from '@playwright/test';
import { logviewerPage } from '../pages/03_logviewerPage';
import { chargerConfigPage } from '../pages/04_chargerconfigPage'
import { overviewPage } from '../pages/05_overviewPage'
import {STORAGE_STATE_PATH} from '../playwright.config'

export class Homepage {
  private readonly page: Page;
  private readonly depotMapHeading: Locator;
  private readonly BrandImage: Locator;
  private readonly depotDropdown: Locator;
  private readonly docsHelpImage: Locator;
  private readonly signOutText: Locator;
  private readonly menu: Locator;
  private readonly ocppLogslink: Locator;
  private readonly emslink: Locator;
  private readonly depotName: Locator;
  private readonly chargerConfigTab: Locator;
  private readonly overviewPagelink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.depotMapHeading = page.getByRole('heading', { name: 'Depot Map', level: 1 });
    this.BrandImage = page.getByRole('img', { name: 'Siemens Brand' });
    this.docsHelpImage = page.getByRole('img', { name: 'Docs Help'});
    this.depotDropdown = page.getByText('Depots Selected'); 
    this.signOutText = page.getByText('Sign Out');
    this.menu = page.getByRole('img', { name: 'menu'});
    this.ocppLogslink =     page.getByRole('link', { name: 'sidebar.menu_items.ocpp_log_viewer' });
    this.overviewPagelink = page.getByRole('link', { name: 'sidebar.menu_items.charging_stations' });
    this.emslink = page.getByAltText('sidebar.menu_items.ems');
    this.depotName = page.getByText('CMS QA AUTO-1', { exact: true });
    this.chargerConfigTab = page.getByRole('tab', { name: 'Charger configurations' });


  }

  async getTitle(): Promise<string> {
    return await this.page.title(); 
  }

  async isLoggedIn(): Promise<boolean> {
        const isdocHelpvisible = (await this.docsHelpImage.isVisible({timeout: 10000}) || await this.depotDropdown.isVisible({timeout: 10000})); 
        return isdocHelpvisible;
  }

  async waitForLoadState(state: string|any) {
     await this.page.waitForLoadState(state);
  }

  async saveSessionState(role: string) {
     await this.page.context().storageState({path: STORAGE_STATE_PATH(role)});
  }


  async navigateOCPPlogs(): Promise<logviewerPage> {
    await this.ocppLogslink.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForURL('**depotId**');        // glob pattern
    await this.page.waitForURL(/ocpplogviewer/);     // regular expression
    await this.page.getByRole('heading', { name: 'OCPP Log Viewer'}).waitFor({state:'visible'})

    //await this.page.waitForTimeout(15000);
    console.log(this.page.url());
    return new logviewerPage(this.page);  
  }
  

  async navigateOverviewpage(): Promise<overviewPage> {
    await this.overviewPagelink.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForURL('**overview');        // glob pattern
    await this.page.getByRole('tab', { name: 'Overview'}).waitFor({state:'visible'})
     // await this.page.waitForTimeout(15000);
    console.log(this.page.url());
    return new overviewPage(this.page); 
  }

  
   async navigateChargerConfigpage(): Promise<chargerConfigPage> {
    await this.emslink.click();
    await this.depotName.click();
    await this.chargerConfigTab.click();
    return new chargerConfigPage(this.page);  
  } 



}