const ReportName = 'Accounts Payable Report';

import { ReportTimeoutValue } from 'cypress/constants/global/timeoutValue';
import * as pageElements from '../../../constants/ddtdReports/global/pageElements';
import { checkInterceptions, setupInterceptors } from 'cypress/helpers/ddtdTests/functions';

describe('Accounts Payable Report @S0c848855', { tags: ['ddtd', 'high'] }, () => {
  beforeEach(() => {
    setupInterceptors();
  });
  afterEach(() => {
    checkInterceptions();
  });
  it('BAPR-1: Verify the user can access the report, set the Submit Report Id value and trigger the file download @Tb879bde6', () => {
    const exportedFileHeader =
      'AccountName|AccountNumber|InvoiceNumber|BillDate|ServiceStart|ServiceEnd|TotalDue1|PreviousBalance|TotalDue|VendorName1|VendorId|Location|Address1|AccountCode|Energy|Units|OtherExpenses';

    cy.ddtdLogin();
    cy.intercept(
      '/ReportServer/Pages'
    ).as('ReportViewer');
    cy.reportAvailable(ReportName);
    cy.wait('@ReportViewer', {
      timeout: ReportTimeoutValue
    });

    cy.getIframeBody().find(pageElements.ViewerControlFilterFirst).select('2023-06-19');
    cy.getIframeBody().find(pageElements.ViewReportButton).click();
    cy.wait('@ReportViewer', {
      timeout: ReportTimeoutValue
    }).should(({ response }) => {
      expect(response).not.to.be.undefined;
      expect(response?.statusCode).to.eq(200);
      expect(response).not.to.be.null;
    });

    cy.getIframeBody().find(pageElements.ExportButton).click({ force: true });
    cy.wait('@ReportViewer');
    cy.getIframeBody().find(pageElements.ExportOption).contains('TXT (pipe delimited)').click({ force: true });

    cy.getIframeBody()
      .find(pageElements.ColumnHeaderCell)
      .should('contain', 'Account Name')
      .should('contain', 'Account Number')
      .should('contain', 'Invoice Number')
      .should('contain', 'Invoice Date')
      .should('contain', 'Service Start')
      .should('contain', 'Service End')
      .should('contain', 'TotalDue1')
      .should('contain', 'Previous Balance')
      .should('contain', 'Total Due')
      .should('contain', 'Vendor Name')
      .should('contain', 'Vendor Id')
      .should('contain', 'Location')
      .should('contain', 'Address1')
      .should('contain', 'Account Code')
      .should('contain', 'Energy')
      .should('contain', 'Units')
      .should('contain', 'Other Expenses');
    cy.getIframeBody().find(pageElements.ColumnHeaderCell).its('length').should('be.eq', 17);
    cy.getIframeBody().find(pageElements.TableRow).its('length').should('be.at.least', 2);

    cy.readFile('./cypress/downloads/Accounts Payable Report.txt').should('include', exportedFileHeader);
    cy.deleteDownloadsFolder();
  });
});
