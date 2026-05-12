import { Page, Locator } from '@playwright/test';

export class logviewerPage {
  private readonly page: Page;
  private readonly ocppLogViewerHeading: Locator;
  private readonly transactionIdIdtagFaultcodeInput: Locator;
  private readonly chargerText: Locator;
  private readonly connectorText: Locator;
  private readonly pleaseSelectText: Locator;
  private readonly allLogsText: Locator;
  private readonly allLogsCount: Locator;
  private readonly exportButton: Locator;
  private readonly last1HourText: Locator;
  private readonly HourText: Locator;
  private readonly WeekText: Locator;
  private readonly customText: Locator;
  private readonly autoRefreshText: Locator;
  private readonly messageTypeDropdown: Locator;
  private readonly messageTypeDropdownValues: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ocppLogViewerHeading = page.getByRole('heading', { name: 'OCPP Log Viewer'});
    this.transactionIdIdtagFaultcodeInput = page.getByRole('textbox', { name: 'Transaction ID, Idtag, faultcode', exact: true });
    this.chargerText = page.getByText('Charger');
    this.connectorText = page.getByText('Connector');
    this.pleaseSelectText = page.getByText('Please select');
    this.allLogsText = page.getByText('All Logs');
    this.allLogsCount = page.locator('.dc-table-datacount .dc-datacount-val');
    this.exportButton = page.getByRole('button', { name: 'Export'});
    this.last1HourText = page.getByText('Last 1 hour', { exact: true });
    this.HourText = page.getByText('24 hour', { exact: true });
    this.WeekText = page.getByText('1 week', { exact: true });
    this.customText = page.getByText('Custom', { exact: true });
    this.autoRefreshText = page.getByText('Auto Refresh');
    this.messageTypeDropdown = page.locator('app-depotco-log-viewer-ant-multi-select').filter({ hasText: 'Message type' }).locator('nz-select-top-control');
    this.messageTypeDropdownValues = page.locator('nz-option-container nz-option-item .overflow');
  }


  async getTitle() : Promise<string> {
    return await this.page.title();
  }

  async isPageLoaded (): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    const ispageReady = await this.ocppLogViewerHeading.isVisible({timeout: 10000});
    const ispageReady1 = await this.messageTypeDropdown.isVisible({timeout: 10000});
    console.log('OCPPLogs Loaded:' + ispageReady,  ispageReady1);
    return (ispageReady || ispageReady1);
  }


  /* 
      Uses a Set<string> to store unique values as we scroll (avoids duplicates)
      Scrolling strategy:
            Collects visible options at current scroll position
            Scrolls down by 100px
            Waits for new items to render
            Repeats until scrollTop stops changing (reached bottom)
            Collects final values at the bottom to ensure we don't miss the last items

      Returns trimmed array of all unique values found during the scroll

      This approach ensures that even though only 15 items are visible in the DOM at once, we capture all 25+ dropdown values by collecting them incrementally as we scroll through the virtual list.
*/

  async getMessageTypeDropdownValues(): Promise<string[]> {
    
    await this.messageTypeDropdown.click();
    await this.messageTypeDropdownValues.first().waitFor({ state: 'visible' });

    const dropdownContainer = this.page.locator('nz-option-container .cdk-virtual-scroll-viewport');
    await dropdownContainer.waitFor({ state: 'visible' });

    // Track which values we've seen to avoid collecting same visible items multiple times during scroll
    const seenValues = new Set<string>();   // "SET" avoids duplicate insertion
    const allValues: string[] = [];
    let previousScrollTop = -1;
    let currentScrollTop = 0;

    // Keep scrolling and collecting values until we reach the bottom
    while (currentScrollTop !== previousScrollTop) {

      console.log(`scrollTop -- : ${previousScrollTop}  ${currentScrollTop}`);

      const rawvisibleOptions = await this.messageTypeDropdownValues.allInnerTexts();  // Get currently visible options
      const visibleOptions = rawvisibleOptions.map(i => i.trim());
      console.log('visibleOptions: '+ visibleOptions);
     
      // Add only new values we haven't seen before
      visibleOptions.forEach(option => {
        if (!seenValues.has(option)) {
              seenValues.add(option); 
              allValues.push(option);
        }
      });

      // Scroll down
      previousScrollTop = currentScrollTop;
      currentScrollTop = await dropdownContainer.evaluate((el) => {   // evaluate() :  Execute JavaScript code in the page, taking the matching element as an argument
        el.scrollTop += 100;       // Scroll by 100px
        return el.scrollTop;
      });

      await this.page.waitForTimeout(1000); // Wait for new items to render
    }

    // Collect any remaining visible options at the bottom
    const rawfinalOptions = await this.messageTypeDropdownValues.allInnerTexts();
    const finalOptions = rawfinalOptions.map(i => i.trim());
    console.log('Final Visible Options: '+ finalOptions);

    finalOptions.forEach(option => {
      if (!seenValues.has(option)) {
            seenValues.add(option);
            allValues.push(option);
      }
    });

    console.log(`MessageType dropdown values (${allValues.length}): ${allValues}`);
    await this.page.keyboard.press('Escape');   // Close the dropdown by pressing Escape

    return allValues;
  }

 /**
      *  Tracks DOM elements by their data-index or aria-posinset attribute
      *  Collects values based on actual position in the list, not text content
      *  Will capture "Authorize" at position 2 AND position 3 if both exist
      *  Returns all values including duplicates
  */
  async getMessageTypeDropdownValuesWithDuplicates(): Promise<string[]> {
    await this.messageTypeDropdown.click();
    await this.messageTypeDropdownValues.first().waitFor({ state: 'visible' });

    const dropdownContainer = this.page.locator('nz-option-container .cdk-virtual-scroll-viewport');
    await dropdownContainer.waitFor({ state: 'visible' });

    // Collect all values including duplicates by tracking actual DOM indices
    const allValues: string[] = [];
    const collectedIndices = new Set<string>();
    let previousScrollTop = -1;
    let currentScrollTop = 0;

    // Keep scrolling and collecting values until we reach the bottom
    while (currentScrollTop !== previousScrollTop) {
      
      const visibleElements = await this.messageTypeDropdownValues.all();  // Get all currently visible option elements
      for (const element of visibleElements) {
        // Create unique identifier using element's position in the full list
        const elementId = await element.evaluate((el) => {
          const index = el.getAttribute('data-index') || el.getAttribute('aria-posinset');
          return index || el.textContent?.trim();
        });

        const uniqueId = `${elementId}`;

        // Only collect if we haven't seen this exact DOM position before
        if (!collectedIndices.has(uniqueId)) {
          collectedIndices.add(uniqueId);
          const text = (await element.textContent())?.trim() || '';
          allValues.push(text);
        }
      }

      // Scroll down
      previousScrollTop = currentScrollTop;
      currentScrollTop = await dropdownContainer.evaluate((el) => {
        el.scrollTop += 100; // Scroll by 100px
        return el.scrollTop;
      });

      // Wait for new items to render
      await this.page.waitForTimeout(200);
    }

    console.log(`MessageType dropdown values including duplicates (${allValues.length}): ${allValues}`);

    // Close the dropdown by pressing Escape
    await this.page.keyboard.press('Escape');

    return allValues;
  }


  async ExportLogs(savePath: string) {
    const [download] = await Promise.all(
      [
            this.page.waitForEvent('download'), 
            await this.exportButton.click()
      ]);

     await download.saveAs(savePath); 
  }

async getAllRowCount (): Promise<number> {
  const logsCount = await this.allLogsCount.innerText();
  console.log(`logsCount: ${logsCount}`);
  const count = await parseInt(logsCount.trim(), 10);
  console.log(`Count: ${count}`);
  return count;
} 
}

