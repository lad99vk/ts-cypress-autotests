import { PortalTimeoutValue } from 'cypress/constants/global/timeoutValue';

export const checkSubmitProcess = (targetButton: string) => {
  cy.intercept(`/ReportGenHandler/ProcessRequest*`).as('ProcessRequest');
  cy.get(targetButton).invoke('removeAttr', 'target');
  cy.cancelPageLoad();
  cy.get(targetButton).click();
  cy.wait('@ProcessRequest', {
    timeout: PortalTimeoutValue
  }).should(({ response }) => {
    expect(response?.statusCode).to.eq(200);
  });
  cy.intercept('/SubmitProcess/GetSubmitReports').as('GetSubmitReports');
  cy.go('back');
  cy.wait('@GetSubmitReports', { timeout: PortalTimeoutValue });
};
