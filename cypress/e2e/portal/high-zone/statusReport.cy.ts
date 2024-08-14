const PageName = 'STATUS REPORT';

import { env } from '../../../../env';
import { AutotestsCustomer } from '../../../constants/global/customers';
import { DemoUtility } from '../../../constants/global/provider';
import { UsnNinth } from '../../../constants/global/usns';
import * as pageElements from '../../../constants/high-zone/StatusReportPage/pageElements';
import * as globalPageElements from '../../../constants/global/pageElements';

const AvBillingPeriodValue = { value: [] };

describe('Status Report page @S0dd0bb64', { tags: ['portal', 'high'] }, () => {
  it('StatR-1: Verify the page is available for Admin user @T866d901a', () => {
    cy.login(env.userNameAdmin, env.userPassword);
    cy.pageAvailable(PageName);
    cy.selectCustomer(AutotestsCustomer);
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);

    cy.get(pageElements.MonthYearDatePicker).click();
    cy.get(globalPageElements.VisibleDatePicker).find(globalPageElements.PreviousButtonDatePicker).click();
    cy.get(pageElements.MonthYearNovemberValue).click();
    cy.get(pageElements.GoButton).click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.waitElementBecomesVisible(pageElements.StatusReportPageLoader);

    cy.get(pageElements.ExcelDownloadButton).click();
    cy.checkTextValue(pageElements.Provider);
    cy.checkTextValue(pageElements.PanNumber);
    cy.checkTextValue(pageElements.BillDate);
    cy.checkTextValue(pageElements.AvBillingPeriod);

    cy.get(globalPageElements.TableCell).find('span').should('have.class', pageElements.DotStatus);

    cy.get(pageElements.PanFilterCrossIcon).click({ force: true });

    cy.get(pageElements.FromDatePicker).click();
    cy.get(globalPageElements.VisibleDatePicker).find(pageElements.DatePickerHeader).click();
    cy.get(globalPageElements.VisibleDatePicker).find(globalPageElements.PreviousButtonDatePicker).click();
    cy.get(globalPageElements.VisibleDatePicker).find(pageElements.MonthYearJulyValue).click();
    cy.get(pageElements.DatePickerCalendar).contains(/^15$/).click();

    cy.get(pageElements.ToDatePicker).click();
    cy.get(globalPageElements.VisibleDatePicker).find(pageElements.DatePickerHeader).click();
    cy.get(globalPageElements.VisibleDatePicker).find(globalPageElements.PreviousButtonDatePicker).click();
    cy.get(globalPageElements.VisibleDatePicker).find(pageElements.MonthYearNovemberValue).click();
    cy.get(pageElements.DatePickerCalendar).contains(/^31$/).click();
    cy.get(pageElements.UsnFilter).type(`${UsnNinth}{enter}`);
    cy.get(pageElements.GoButton).click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.waitElementBecomesVisible(pageElements.StatusReportPageLoader);

    cy.checkTextValue(pageElements.Provider);
    cy.checkTextValue(pageElements.PanNumber);
    cy.checkTextValue(pageElements.BillDate);
    cy.checkTextValue(pageElements.AvBillingPeriod);
    cy.get(globalPageElements.TableCell).find('span').should('have.class', pageElements.DotStatus);

    cy.get(pageElements.AvBillingPeriod)
      .invoke('text')
      .then((textValue) => {
        Object.defineProperty(AvBillingPeriodValue, 'value', {
          value: textValue
        });
      });
    cy.get(pageElements.UsnFilterCrossIcon).click({ force: true });
  });

  it('StatR-2: Verify the user is able to sort data via Global Filter and data was exported successfully @T818e4548', () => {
    const DataCollectionMethodValue = 'AVG';
    let billAgeValue: string;

    cy.get(globalPageElements.Map).click();
    cy.get(globalPageElements.MapSelector)
      .contains('Group')
      .click()
      .waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.get(globalPageElements.MapLocationFilter).click();
    cy.get(globalPageElements.MapLocationFilterArrow).click();
    cy.get(globalPageElements.MapLocationFilterOption)
      .contains('Group')
      .click()
      .waitElementBecomesInvisible(globalPageElements.MapLoader);
    cy.get(globalPageElements.Map).click();
    cy.waitElementBecomesVisible(pageElements.GoButton);
    cy.get(pageElements.GoButton).click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.waitElementBecomesVisible(pageElements.StatusReportPageLoader);

    cy.checkTextValue(pageElements.Provider);
    cy.checkTextValue(pageElements.PanNumber);
    cy.checkTextValue(pageElements.BillDate);
    cy.checkTextValue(pageElements.AvBillingPeriod);

    cy.get(globalPageElements.TableCell).find('span').should('have.class', pageElements.DotStatus);

    cy.get(globalPageElements.Map).click();
    cy.get(globalPageElements.MapSelector)
      .contains('Location')
      .click()
      .waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.get(globalPageElements.MapLocationFilter).click();
    cy.get(globalPageElements.MapLocationFilterArrow).click();
    cy.get(globalPageElements.MapLocationFilterOption)
      .contains('Location')
      .click()
      .waitElementBecomesInvisible(globalPageElements.MapLoader);
    cy.get(globalPageElements.Map).click();
    cy.waitElementBecomesVisible(pageElements.GoButton);
    cy.get(pageElements.GoButton).click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.waitElementBecomesVisible(pageElements.StatusReportPageLoader);

    cy.checkTextValue(pageElements.Provider);
    cy.checkTextValue(pageElements.PanNumber);
    cy.checkTextValue(pageElements.BillDate);
    cy.checkTextValue(pageElements.AvBillingPeriod);

    cy.get(pageElements.BillAgeCurrentValue)
      .invoke('attr', 'class')
      .then((currentStatus) => {
        if (currentStatus === 'dots g') {
          return (billAgeValue = 'Green');
        } else if (currentStatus === 'dots y') {
          return (billAgeValue = 'Yellow');
        } else if (currentStatus === 'dots r') {
          return (billAgeValue = 'Red');
        } else {
          return (billAgeValue = 'White');
        }
      })
      .then(() => {
        cy.get(globalPageElements.TableCell).find('span').should('have.class', pageElements.DotStatus);
        cy.get(globalPageElements.GlobalFilterSecondLvl).click();
        cy.get(pageElements.ProviderSearchField).type(DemoUtility);
        cy.get(pageElements.DropdownOption).contains(DemoUtility).click();
        cy.get(pageElements.DropdownOption).contains(billAgeValue).click();
        cy.get(pageElements.DropdownOption).contains(DataCollectionMethodValue).click();
      });

    cy.get(globalPageElements.SelectButton).click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.get(pageElements.GoButton).click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.waitElementBecomesVisible(pageElements.StatusReportPageLoader);

    cy.checkTextValue(pageElements.Provider);
    cy.checkTextValue(pageElements.PanNumber);
    cy.checkTextValue(pageElements.BillDate);
    cy.checkTextValue(pageElements.AvBillingPeriod);

    cy.get(globalPageElements.TableCell).find('span').should('have.class', pageElements.DotStatus);

    cy.readFile('./cypress/downloads/BillStatus.xlsx').should('exist');
    cy.deleteDownloadsFolder();
  });

  it('StatR-3: Verify the user is able to sort data via column filters @Tb94d6a86', () => {
    cy.reload();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.waitElementBecomesVisible(pageElements.StatusReportPageLoader);
    cy.get(pageElements.FromDatePicker).click();
    cy.get(globalPageElements.VisibleDatePicker).find(pageElements.DatePickerHeader).click();
    cy.get(globalPageElements.VisibleDatePicker).find(globalPageElements.PreviousButtonDatePicker).click();
    cy.get(globalPageElements.VisibleDatePicker).find(pageElements.MonthYearJulyValue).click();
    cy.get(pageElements.DatePickerCalendar).contains(/^15$/).click();

    cy.get(pageElements.ToDatePicker).click();
    cy.get(globalPageElements.VisibleDatePicker).find(pageElements.DatePickerHeader).click();
    cy.get(globalPageElements.VisibleDatePicker).find(globalPageElements.PreviousButtonDatePicker).click();
    cy.get(globalPageElements.VisibleDatePicker).find(pageElements.MonthYearNovemberValue).click();
    cy.get(pageElements.DatePickerCalendar).contains(/^31$/).click();
    cy.get(pageElements.GoButton).click();
    cy.waitElementBecomesVisible(pageElements.StatusReportPageLoader);

    cy.get(pageElements.UsnFilter).type(`${UsnNinth}{enter}`);
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.get(pageElements.Table).click();

    cy.checkTextValue(pageElements.Provider);
    cy.checkTextValue(pageElements.PanNumber);
    cy.checkTextValue(pageElements.BillDate);
    cy.checkTextValue(pageElements.AvBillingPeriod);

    cy.get(pageElements.AvBillingFilter).type(`${AvBillingPeriodValue.value}{enter}`);
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.get(pageElements.Table).click();

    cy.checkTextValue(pageElements.Provider);
    cy.checkTextValue(pageElements.PanNumber);
    cy.checkTextValue(pageElements.BillDate);
    cy.checkTextValue(pageElements.AvBillingPeriod);

    cy.get(globalPageElements.TableCell).find('span').should('have.class', pageElements.DotStatus);
  });
});
