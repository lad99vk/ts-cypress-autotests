import 'cypress-wait-until';
import 'cypress-ntlm-auth/dist/commands';
import { PortalTimeoutValue, ReportTimeoutValue } from '../constants/global/timeoutValue';
import { env } from '../../env';

require('cypress-downloadfile/lib/downloadFileCommand');
require('cypress-delete-downloads-folder').addCustomCommand();

Cypress.Commands.add('login', (userName, password) => {
  cy.clearCookies();
  cy.visit('/');
  cy.get('#UserName').type(userName);
  cy.get('#Password').type(password, { log: false });
  cy.get('input[type=submit]').click();

  cy.getCookie('.AUTH').then(($cookie) => {
    if ($cookie == null) {
      Cypress.runner.stop();
      cy.fail('The login attempt failed.');
    } else {
      return true;
    }
  });
});

Cypress.Commands.add('ddtdLogin', () => {
  cy.clearCookies();
  cy.ntlm(env.ddtdUrl, env.ddtdUserName, env.ddtdUserPassword);
});

Cypress.Commands.add('getIframeBody', () => {
  return cy
    .get('iframe', { log: false })
    .its('0.contentDocument.body', { log: false })
    .should('not.be.empty')
    .then((body) => cy.wrap(body, { log: false }));
});

Cypress.Commands.add('selectCustomer', (customer) => {
  cy.intercept('/Customer/GetUsers').as('GetUsers');
  cy.intercept('/Filter/SetSelectedUser').as('SetSelectedUser');
  return cy
    .get('#global-customer span')
    .first()
    .click({ force: true })
    .then(() => {
      cy.get('#comboCustomer-list')
        .find('.k-textbox')
        .type(customer, { force: true })
        .wait(1000)
        .type('{enter}', { force: true });
      cy.wait('@GetUsers');
      cy.wait('@SetSelectedUser');
    });
});

Cypress.Commands.add('reportAvailable', (reportName) => {
  const searchPattern = new RegExp(`^${reportName}$`);
  cy.visit(`${env.ddtdUrl}reports/browse/`);
  cy.waitElementBecomesVisible('.name:contains("ReportsPROD")');
  cy.get('.name:contains("ReportsPROD")').click();
  cy.get('span .name', { timeout: ReportTimeoutValue }).contains(searchPattern).click({ force: true });
});

Cypress.Commands.add('pageAvailable', (pageName) => {
  const searchPattern = new RegExp(`^${pageName}$`);
  cy.get('.main-menu').click();
  cy.get('a.menulink').contains(searchPattern).click({ force: true });
});

Cypress.Commands.add('waitElementBecomesVisible', (elementLocator) => {
  cy.waitUntil(() => Cypress.$(elementLocator).length > 0, {
    timeout: PortalTimeoutValue
  });
});

Cypress.Commands.add('waitElementBecomesInvisible', (elementLocator) => {
  cy.waitUntil(() => Cypress.$(elementLocator).length === 0, {
    timeout: PortalTimeoutValue
  });
});

Cypress.Commands.add('checkElementVisibility', (targetElement, quantity) => {
  cy.get(targetElement).should('be.visible').its('length').should('be.at.least', quantity);
});

Cypress.Commands.add('checkNumberOfChildren', (targetElement, quantity) => {
  cy.get(targetElement).children().should('be.visible').its('length').should('be.at.least', quantity);
});

Cypress.Commands.add('cancelPageLoad', () => {
  cy.window().then((win) => {
    const triggerAutIframeLoad = () => {
      const AUT_IFRAME_SELECTOR = '.aut-iframe';
      const autIframe = win.parent.document.querySelector(AUT_IFRAME_SELECTOR);
      if (!autIframe) {
        throw new ReferenceError(`Failed to get the application frame using the selector '${AUT_IFRAME_SELECTOR}'`);
      }
      autIframe.dispatchEvent(new Event('load'));
      win.removeEventListener('beforeunload', triggerAutIframeLoad);
    };
    win.addEventListener('beforeunload', triggerAutIframeLoad);
  });
});

Cypress.Commands.add('selectCustomTimeline', (inputDate, fromYear, fromMonth, toYear, toMonth) => {
  cy.get(inputDate).click();
  cy.get('[name="from_year"]').select(fromYear, { force: true });
  cy.get('[name="from_month"]').select(fromMonth, { force: true });
  cy.get('[name="to_year"]').select(toYear, { force: true });
  cy.get('[name="to_month"]').select(toMonth, { force: true });
  cy.get('.fr > .select').click();
});

Cypress.Commands.add('checkTextValue', (targetElement) => {
  cy.get(targetElement).invoke('text').should('have.length.gt', 0);
});

Cypress.Commands.add('setDate', (year, month, day) => {
  cy.get('.dp_visible').find('.dp_caption').click();
  cy.get('.dp_visible').find('.dp_caption').click();
  cy.get('.dp_visible').contains(year).click();
  cy.get('.dp_visible').find(month).click();
  cy.get('.dp_visible').contains(day).click();
});
