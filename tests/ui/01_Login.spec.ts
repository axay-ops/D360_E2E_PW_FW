import { test, expect} from '../../fixtures/base.fixture';
import { Loginpage } from '../../pages/01_loginPage';
import * as APPCONSTANTS from '../../data/app-constants'


test ('TC01: verify Successfull Login for Admin', async ({ AdminhomePage }) => {
  
    expect(await AdminhomePage.getTitle()).toEqual(APPCONSTANTS.LOGIN_TITLE); 
    expect(await AdminhomePage.isLoggedIn()).toBeTruthy();
    
});

test ('TC02: verify Successfull Login for Non-Admin', async ({ nonadminhomePage }) => {
  
     expect(await nonadminhomePage.getTitle()).toEqual(APPCONSTANTS.LOGIN_TITLE); 
     expect(await nonadminhomePage.isLoggedIn()).toBeTruthy();

});


test('TC03: Verify Error Message for Incorrect credentials', async ({ page, baseURL }) => {
  
        const loginpage =  new Loginpage (page);
        await loginpage.navigatetoLoginPage(baseURL);
        const errMessage: string = await loginpage.invalidLogin('wrong@mail.com', 'Test@1233');
        expect(errMessage).toContain(APPCONSTANTS.LOGIN_ERROR_MESSAGE);

});


test('TC04: Verify Language Dropdown has all values', async ({ page, baseURL }) => {
  
    const loginpage =  new Loginpage (page);
    await loginpage.navigatetoLoginPage(baseURL);
    const langValues: string[] = await loginpage.getLanguageDropdownValues();
    console.log(langValues);
    expect(langValues).toEqual(APPCONSTANTS.LOGIN_LANG_LIST);

});


test('TC05: Verify elements on Reset Password page', async ({ page , baseURL}) => {
    const loginpage =  new Loginpage (page);
    await loginpage.navigatetoLoginPage(baseURL);
    await loginpage.navigatetoForgotPassword();
    expect(await loginpage.isforgotPasswordHeader1Present()).toBeTruthy();
    expect(await loginpage.isforgotPasswordHeader2Present()).toBeTruthy();
    expect(await loginpage.isforgotPasswordHeader6Present()).toBeTruthy();

});
