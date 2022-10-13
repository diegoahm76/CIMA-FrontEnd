import { browser, logging } from 'protractor';
import { AppPage } from './app.po';

describe('ng2angle App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display Angle in h1 tag', async () => {
    await page.navigateTo();
    expect(await page.getParagraphText()).toEqual('Angle');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
