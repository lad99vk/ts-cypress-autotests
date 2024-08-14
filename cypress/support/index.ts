export {};

declare global {
  namespace Cypress {
    interface Chainable {

      login(userName: string, password: string): Chainable<JQuery<HTMLElement>>;
      ddtdLogin(): Chainable<JQuery<HTMLElement>>;
      getIframeBody(): Chainable<JQuery<HTMLElement>>;
      selectCustomer(customer: string): Chainable<JQuery<HTMLElement>>;
      reportAvailable(reportName: string): Chainable<JQuery<HTMLElement>>;
      pageAvailable(pageName: string): Chainable<JQuery<HTMLElement>>;
      waitElementBecomesVisible(elementLocator: string): Chainable<JQuery<HTMLElement>>;
      waitElementBecomesInvisible(elementLocator: string): Chainable<JQuery<HTMLElement>>;
      checkElementVisibility(targetElement: string, quantity: number): Chainable<JQuery<HTMLElement>>;
      checkNumberOfChildren(targetElement: string, quantity: number): Chainable<JQuery<HTMLElement>>;
      cancelPageLoad(): Chainable<JQuery<HTMLElement>>;
      selectCustomTimeline(
        inputDate: string,
        fromYear: string,
        fromMonth: string,
        toYear: string,
        toMonth: string
      ): Chainable<JQuery<HTMLElement>>;
      checkTextValue(targetElement: string): Chainable<JQuery<HTMLElement>>;
      setDate(year: string, month: string, day: RegExp): Chainable<JQuery<HTMLElement>>;
    }
  }
}
