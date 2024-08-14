const ReportName = 'SubmitReportById';

import { AutotestsCustomerId } from 'cypress/constants/global/customers';
import { ReportTimeoutValue } from 'cypress/constants/global/timeoutValue';
import * as pageElements from '../../../constants/ddtdReports/global/pageElements';
import { checkInterceptions, setupInterceptors } from 'cypress/helpers/ddtdTests/functions';

describe('SubmitReportById @Sff6b1ae7', { tags: ['ddtd', 'low'] }, () => {
  beforeEach(() => {
    setupInterceptors();
  });
  afterEach(() => {
    checkInterceptions();
  });
  it('SRBI-1: Verify the user can access the report, set the Customer Id value and trigger the file download @T2e007a16', () => {
    const exportedFileHeader =
      'Textbox389|Textbox8|AccountNumber|CommodityName|Textbox34|InvoiceNumber|BillDate|ServiceStart|ServiceEnd|EnergyUsage|InputTotalInvoiced|LateFee|PreviousBalance|TotalAmountDue|Note1|Textbox445|InputTotalInvoiced3|Textbox45|Textbox446|Textbox51|Textbox447|InputTotalInvoiced4|Textbox46|Textbox448|Textbox52';

    cy.ddtdLogin();
    cy.intercept('reports/api/v2.0').as('CatalogItemByPath');
    cy.reportAvailable(ReportName);
    cy.wait('@CatalogItemByPath', {
      timeout: ReportTimeoutValue
    });

    cy.intercept('/ReportServer/Pages').as(
      'ReportViewer'
    );
    cy.getIframeBody().find(pageElements.ViewerControlFilterFifth).click().type(`${AutotestsCustomerId}{enter}`);
    cy.wait('@ReportViewer', {
      timeout: ReportTimeoutValue
    });
    cy.getIframeBody().find(pageElements.ViewerControlFilterSeventh).click().type('Autotest Report');
    cy.getIframeBody().find(pageElements.ViewerControlFilterSecond).select(1);

    cy.getIframeBody().find(pageElements.ViewReportButton).click();
    cy.wait('@ReportViewer', {
      timeout: ReportTimeoutValue
    }).should(({ response }) => {
      expect(response).not.to.be.undefined;
      expect(response?.statusCode).to.eq(200);
      expect(response).not.to.be.null;
    });
    cy.wait('@ReportViewer');

    cy.getIframeBody()
      .find(pageElements.TableSubmitReport)
      .should('contain', 'USN')
      .should('contain', 'Commodity')
      .should('contain', 'Facility ')
      .should('contain', 'Invoice Number')
      .should('contain', 'Invoice Date')
      .should('contain', 'Start')
      .should('contain', 'End')
      .should('contain', 'Energy Usage')
      .should('contain', 'Current Charges')
      .should('contain', 'Late Fee')
      .should('contain', 'Prev Bal')
      .should('contain', 'Total Amount Due')
      .should('contain', 'Total');
    cy.getIframeBody().find(pageElements.TableRowSubmitReport).its('length').should('be.at.least', 9);

    cy.getIframeBody().find(pageElements.ExportButton).click({ force: true });
    cy.getIframeBody().find(pageElements.ExportOption).contains('TXT (pipe delimited)').click({ force: true });

    cy.readFile('./cypress/downloads/SubmitReportById.txt').should('include', exportedFileHeader);
    cy.deleteDownloadsFolder();
  });
});
