const ReportName = 'Invoice AP Report';

import { ReportTimeoutValue } from 'cypress/constants/global/timeoutValue';
import * as pageElements from '../../../constants/ddtdReports/global/pageElements';
import { checkInterceptions, setupInterceptors } from 'cypress/helpers/ddtdTests/functions';

describe('Invoice AP Report @S92667e48', { tags: ['ddtd', 'high'] }, () => {
  beforeEach(() => {
    setupInterceptors();
  });
  afterEach(() => {
    checkInterceptions();
  });
  it('UIAR-1: Verify the user can access the report, set the Submit Report Id value and trigger the file download @T52e7d09b', () => {
    const exportedFileHeader =
      'COMPANY|VENDOR|INVOICE|BATCH_NUM|PROC_LEVEL|INVOICE_DTE|TRAN_INV_AMT|DUE_DATE|REC_STATUS|POSTING_STATUS';

    cy.ddtdLogin();
    cy.intercept(
      '/ReportServer/Pages/ReportViewer.aspx?%2fReportsPROD%2fUTMC+Invoice+AP+Report&rc%3ashowbackbutton=true'
    ).as('ReportViewer');
    cy.reportAvailable(ReportName);
    cy.wait('@ReportViewer', {
      timeout: ReportTimeoutValue
    });

    cy.getIframeBody().find(pageElements.ViewerControlFilterFirst).select('2023-06-20');
    cy.getIframeBody().find(pageElements.ViewReportButton).click();
    cy.wait('@ReportViewer', {
      timeout: ReportTimeoutValue
    }).should(({ response }) => {
      expect(response).not.to.be.undefined;
      expect(response?.statusCode).to.eq(200);
      expect(response).not.to.be.null;
    });

    cy.getIframeBody().find(pageElements.ExportButton).click({ force: true });
    cy.wait('@ReportViewer', {
      timeout: ReportTimeoutValue
    });
    cy.getIframeBody().find(pageElements.ExportOption).contains('TXT (pipe delimited)').click({ force: true });

    cy.getIframeBody()
      .find(pageElements.ColumnHeaderCell)
      .should('contain', 'COMPANY')
      .should('contain', 'VENDOR')
      .should('contain', 'INVOICE')
      .should('contain', 'BATCH-NUM')
      .should('contain', 'PROC-LEVEL')
      .should('contain', 'INVOICE-DTE')
      .should('contain', 'TRAN-INV-AMT')
      .should('contain', 'DUE-DATE')
      .should('contain', 'REC-STATUS')
      .should('contain', 'POSTING-STATUS');
    cy.getIframeBody().find(pageElements.ColumnHeaderCell).its('length').should('be.eq', 10);
    cy.getIframeBody().find(pageElements.TableRow).its('length').should('be.at.least', 2);

    cy.readFile('./cypress/downloads/Invoice AP Report.txt').should('include', exportedFileHeader);
    cy.deleteDownloadsFolder();
  });
});
