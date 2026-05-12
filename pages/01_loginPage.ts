import { Page, Locator } from '@playwright/test';
import {STORAGE_STATE_PATH} from '../playwright.config'
import { Homepage } from '../pages/02_homePage'

export class Loginpage {
    
    /* 1) page locators --  (all are private. classic example of Encapsulation, where locators are private, and used in public methods) */
    private readonly page: Page;
    private readonly userNameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly forgotPasswordLink: Locator;
    private readonly logInButton: Locator;
    private readonly errorMessage: Locator;
    private readonly languageDropdown: Locator;
    private readonly languageDropValues: Locator;
    private readonly forgotPasswordHeader1: Locator;
    private readonly forgotPasswordHeader2: Locator;
    private readonly forgotPasswordHeader6: Locator;
    


    /* 2) page class constructor */
  constructor(page: Page) {
    this.page = page;
    this.userNameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password' });
    this.logInButton = page.getByRole('button', { name: 'Log in' });
    this.errorMessage = page.getByText('Invalid username or password. Please try again.');
    this.languageDropdown = page.getByRole('combobox', { name: 'SI_LANGUAGE_SWITCHER.LABEL' });
    this.languageDropValues = page.getByRole('combobox', { name: 'SI_LANGUAGE_SWITCHER.LABEL' }).getByRole('option');
    this.forgotPasswordHeader1 = page.getByRole('heading', { name: 'Depot360 AI', level: 1 });
    this.forgotPasswordHeader2 = page.getByRole('heading', { name: 'Reset Password', level: 2 });
    this.forgotPasswordHeader6 = page.getByRole('heading', { name: 'Enter the email address to receive a password reset code.', level: 6 });

  }


   /* 3) Page Methods/Actions */

    async navigatetoLoginPage(baseURL: string | undefined) {
        await this.page.goto(baseURL!);  // waits for 'load' event by default
    }

    async validLogin(username: string, password: string): Promise<Homepage> {
        await this.userNameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.logInButton.click();
        //await this.page.waitForURL(/.*(depot-map|vehicles\/overview)/);
        //await Promise.race([
        //    this.page.waitForURL('**/depot-map'),
        //    this.page.waitForURL('**/vehicles/overview')  ]);

        await this.page.waitForSelector('.user-profile-icon', {timeout: 15000});
        return new Homepage(this.page);
    }

    async invalidLogin(username: string, password: string): Promise<string> {
        await this.userNameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.logInButton.click();
        await this.errorMessage.waitFor();
        return (await this.errorMessage.innerText()).trim();
    }

    async getTitle(): Promise<string> {
        const title= await this.page.title();
        return title;
    }
    
    async saveSessionState(role: string) {
        await this.page.context().storageState({path: STORAGE_STATE_PATH(role)});
    }

    async waitForLoadState(state: string|any) {
        await this.page.waitForLoadState(state);
    }

    async getLanguageDropdownValues(): Promise<string[]>{

        await this.languageDropdown.click();
        // await this.languageDropValues.first().waitFor();
        const actualLanguageValues = await this.languageDropValues.allInnerTexts();
        const trimmedValues = actualLanguageValues.map(t => t.trim());
        return trimmedValues;
    }

    async navigatetoForgotPassword() {
        await this.forgotPasswordLink.click(); 
        await this.page.waitForURL('**/forgot-password');

    }

    async isforgotPasswordHeader1Present(): Promise<boolean> {
        return (await this.forgotPasswordHeader1.isVisible());
    }

    async isforgotPasswordHeader2Present(): Promise<boolean> {
        return (await this.forgotPasswordHeader2.isVisible());
    }

    async isforgotPasswordHeader6Present(): Promise<boolean> {
        return (await this.forgotPasswordHeader6.isVisible());
    }

}
