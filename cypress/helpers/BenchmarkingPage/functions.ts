import * as pageElements from '../../constants/high-zone/BenchmarkingPage/pageElements';

export const chartCheck = (pageElement: string, entity: string) => {
  cy.get(pageElements.HighchartNoData).should('not.exist');
  cy.get(pageElement).find(entity).its('length').should('be.at.least', 2);
};
