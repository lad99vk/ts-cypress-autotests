const PageName = 'SUBMIT REPORT';

import { AutotestsCustomer } from '../../../constants/global/customers';
import { env } from '../../../../env';
import * as pageElements from '../../../constants/high-zone/SubmitReportPage/pageElements';
import * as globalPageElements from '../../../constants/global/pageElements';
import { GridLoader, PageLoader } from '../../../constants/global/pageElements';
import { SubmitReportUrl } from 'cypress/constants/global/portalUrls';
import { checkSubmitProcess } from 'cypress/helpers/SubmitReportPage/functions';
import { PortalTimeoutValue } from 'cypress/constants/global/timeoutValue';

describe('Submit Report page @Sbb699fa2', { tags: ['portal', 'high'] }, () => {
  it('SubR-1: Verify the page is available for Admin user @T005324c9', () => {
    cy.login(env.userNameAdmin, env.userPassword);
    cy.pageAvailable(PageName);
    cy.waitElementBecomesVisible(PageLoader);
    cy.intercept('/SubmitProcess/GetSubmitReports').as('GetSubmitReports');

    cy.selectCustomer(AutotestsCustomer);
    cy.wait('@GetSubmitReports');
    cy.waitElementBecomesVisible(PageLoader);
    cy.get(pageElements.Table)
      .contains(/^Bills$/)
      .click({ force: true });
    cy.waitElementBecomesVisible(pageElements.Table);
    cy.waitElementBecomesVisible(PageLoader);

    cy.get(globalPageElements.EditButton).eq(1).click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);

    cy.get(pageElements.EXCEL).last().click();
    cy.checkTextValue(pageElements.BatchTableProvider);
    cy.checkTextValue(pageElements.BatchTableAccount);
    cy.checkTextValue(pageElements.BatchTableType);
    cy.checkTextValue(pageElements.BatchTableProduction);
    cy.checkTextValue(pageElements.BatchTableCompleted);
    cy.checkTextValue(pageElements.BatchTableInvoiced);
    cy.checkTextValue(pageElements.BatchTableTotalDue);
    cy.checkTextValue(pageElements.BatchTableUsns);
    cy.checkTextValue(pageElements.BatchTableInvoice);

    cy.get(pageElements.BatchTable).find(globalPageElements.EditButton).first().click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);

    cy.checkTextValue(pageElements.BillTableUtility);
    cy.checkTextValue(pageElements.BillTableUsnAccount);
    cy.checkTextValue(pageElements.BillTableProduction);
    cy.checkTextValue(pageElements.BillTableStartDate);
    cy.checkTextValue(pageElements.BillTableEndDate);
    cy.checkTextValue(pageElements.BillTableInvoicedAmount);
    cy.checkTextValue(pageElements.BillTableNotes);

    cy.readFile(pageElements.FileXlsx).should('exist');
    cy.deleteDownloadsFolder();
  });

  it('SubR-2: Verify the creation of a new batch + Save @T753260da', () => {
    cy.reload();
    cy.waitElementBecomesVisible(PageLoader);

    cy.get(pageElements.Table).then(($el) => {
      if ($el.find(`${pageElements.TableCell}:contains("In Progress")`).length !== 0) {
        Cypress.runner.stop();
        cy.fail('To complete the test you need to deliver the batch.');
      }
    });

    cy.get(pageElements.CreateButton).click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.get(globalPageElements.EditButton).eq(0).click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);
    cy.get(globalPageElements.Checkbox).eq(1).click();
    cy.get(pageElements.NextButton).contains('Next').click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);
    cy.get(globalPageElements.Checkbox).eq(1).click();

    cy.get(pageElements.SaveButton).click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);
    cy.get(pageElements.Message).contains('Save completed.').should('exist');
    cy.get(pageElements.GeneralTable).contains(pageElements.InProgress).should('exist');
    cy.get(pageElements.GeneralTable).contains(pageElements.Title).should('exist');
    cy.get(pageElements.GeneralTable).contains(pageElements.NotDelivered).should('exist');
    cy.get(pageElements.GeneralTable).contains(/^2$/).should('exist');
    cy.get(pageElements.GeneralTable)
      .contains(/^0.00$/)
      .should('not.exist');

    cy.get(pageElements.EXCEL).last().click();
    checkSubmitProcess(pageElements.SubmitProcessReportButton);
    cy.intercept('/SubmitProcess/GetBills').as('GetBills');
    cy.get(globalPageElements.EditButton).eq(0).click();
    cy.wait('@GetBills', { timeout: PortalTimeoutValue });
    checkSubmitProcess(pageElements.InvoiceCollectionButton);

    cy.readFile(pageElements.FileXlsx).should('exist');
    cy.deleteDownloadsFolder();
  });

  it('SubR-3: Verify the delivery of a previously saved batch +  Cancel @T6afddae4', () => {
    cy.visit(SubmitReportUrl);
    cy.waitElementBecomesVisible(PageLoader);

    cy.get(pageElements.TableCell).contains(pageElements.InProgress).should('exist');
    cy.get(pageElements.TableCell).contains(pageElements.Title).should('exist');
    cy.get(pageElements.TableCell).contains(pageElements.NotDelivered).should('exist');
    cy.get(pageElements.TableCell).eq(4).contains(/^2$/).should('exist');
    cy.get(pageElements.TableCell)
      .eq(5)
      .contains(/^0.00$/)
      .should('not.exist');
    cy.get(pageElements.TableCell)
      .eq(6)
      .contains(/^0.00$/)
      .should('not.exist');
    cy.get(pageElements.PDF).should('exist');
    cy.get(pageElements.PDF).should('exist');
    cy.get(pageElements.EXCEL).should('exist');

    cy.intercept('/SubmitProcess/GetBills').as('GetBills');
    cy.get(globalPageElements.EditButton).eq(0).click();
    cy.wait('@GetBills', { timeout: PortalTimeoutValue });
    cy.get(pageElements.DeliverButton).click();
    cy.get(pageElements.PDFCheckbox).click();
    cy.get(pageElements.Deliver2Button).click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);
    cy.get(pageElements.Message).contains('Submit Report complete.').should('exist');

    checkSubmitProcess(pageElements.InvoiceCollectionButton);
    cy.get(globalPageElements.EditButton).eq(0).click();
    cy.wait('@GetBills', { timeout: PortalTimeoutValue });
    checkSubmitProcess(pageElements.SubmitProcessReportButton);
  });

  it('SubR-4: Verify Export + Notes + Filter @T84c28479', () => {
    cy.visit(SubmitReportUrl);
    cy.waitElementBecomesVisible(PageLoader);
    cy.get(pageElements.ExportButton).click();

    cy.get(pageElements.Table).then(($el) => {
      if ($el.find(`${pageElements.TableCell}:contains("In Progress")`).length !== 0) {
        Cypress.runner.stop();
        cy.fail('To complete the test you need to deliver the batch.');
      }
    });

    cy.get(pageElements.CreateButton).click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.get(globalPageElements.EditButton).eq(0).click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);
    cy.get(globalPageElements.EditButton).eq(10).click().blur({ force: true });
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);
    cy.get(pageElements.BillTable).contains(/^0$/).should('exist');
    cy.get(globalPageElements.EditButton).last().click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);
    cy.get(pageElements.AddNoteButton).click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.get(pageElements.NoteCell)
      .click()
      .type('Test Note', { force: true })
      .type('{enter}')
      .type('Test Note 2', { force: true });
    cy.get(pageElements.TypeList)
      .contains(/^Null$/)
      .click();
    cy.get(pageElements.CriticalType)
      .contains(/^Critical$/)
      .click();
    cy.get(globalPageElements.SaveButton).click();
    cy.waitElementBecomesVisible(PageLoader);

    cy.get(pageElements.Back3rdButton).click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.get(pageElements.BillTable).contains(/^1$/).should('exist');
    cy.get(pageElements.Back2ndButton).click();
    cy.waitElementBecomesVisible(PageLoader);

    cy.intercept('/SubmitProcess/GetBills').as('GetBills');
    cy.get(globalPageElements.Map).click();
    cy.get(pageElements.MapInputField)
      .type('CM_Template_Facility')
      .then(() => {
        cy.get(pageElements.MapSearchListOption).first().click({ force: true });
        cy.wait('@GetBills', { timeout: PortalTimeoutValue });
        cy.waitElementBecomesVisible(PageLoader);
        cy.waitElementBecomesInvisible(GridLoader);
      });
    cy.get(pageElements.TotalRecordsEdit).contains(/^0$/).should('exist');
    cy.get(pageElements.Filter)
      .click()
      .then(() => {
        cy.wait('@GetBills', { timeout: PortalTimeoutValue });
        cy.get(pageElements.Filter).click();
        cy.waitElementBecomesVisible(PageLoader);
        cy.checkNumberOfChildren(pageElements.ProviderFilter, 2);
        cy.checkNumberOfChildren(globalPageElements.CommodityFilterList, 2);
      });

    cy.readFile(pageElements.FileExport, { timeout: 10000 }).should('exist');
    cy.deleteDownloadsFolder();
  });

  it('SubR-5: Verify delivery of a new batch + Select @T4bc94807', () => {
    cy.reload();
    cy.waitElementBecomesVisible(PageLoader);

    cy.get(pageElements.TableCell).contains(pageElements.InProgress).should('exist');
    cy.get(globalPageElements.EditButton).eq(0).click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);

    cy.get(pageElements.SelectBillButton).click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);
    cy.get(pageElements.Message).contains('All bills are selected. Save completed.').should('exist');

    cy.get(pageElements.RowsNumber).click().type('{selectall}{backspace}');
    cy.get(pageElements.RowsNumber).click().type('2000', { force: true }).type('{enter}').blur();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);

    cy.get(pageElements.CancelButton).click();
    cy.get(pageElements.Message).contains('Selection Cancelled.').should('exist');
    cy.get(pageElements.SaveButton).click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);
    cy.get(pageElements.Message).contains('Save completed.').should('exist');

    cy.get(pageElements.RowsNumber).click().type('{selectall}{backspace}');
    cy.get(pageElements.RowsNumber).click().type('10', { force: true }).type('{enter}').blur();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);
    cy.get(globalPageElements.Checkbox).eq(0).click().blur({ force: true });
    cy.get(globalPageElements.Checkbox).eq(0).click().blur({ force: true });

    cy.get(globalPageElements.Checkbox).eq(1).click();
    cy.get(pageElements.DeliverButton).click();
    cy.get(pageElements.ZIPCheckbox).click();
    cy.get(pageElements.Deliver2Button).click();
    cy.waitElementBecomesVisible(PageLoader);
    cy.waitElementBecomesInvisible(GridLoader);
    cy.get(pageElements.Message).contains('Submit Report complete.').should('exist');
  });

  it('SubR-6: Verify basic unimportant checks @T96adaeb7', () => {
    cy.reload();
    cy.waitElementBecomesVisible(PageLoader);

    let batchCounter: string;

    cy.get(pageElements.SubmittedReports).then(($spanCntSubmitted) => {
      batchCounter = $spanCntSubmitted.text();
    });
    cy.get(pageElements.TotalRecords).should(($SubmitProcessReport_div_PagerTotalRecords) => {
      const lineCounter = $SubmitProcessReport_div_PagerTotalRecords.text();
      expect(lineCounter).to.equal(batchCounter);
    });

    cy.get(pageElements.MonthYear)
      .click()
      .then(() => {
        cy.get(pageElements.NextYearButton).click();
        cy.get(pageElements.MonthMar).contains(/^Mar$/).click();
      });
    cy.get(pageElements.GoButton).click();
    cy.get(pageElements.TotalRecords).contains(/^0$/).should('exist');
  });
});
