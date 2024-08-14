export const setupInterceptors = () => {
  cy.intercept('GET', '**').as('getRequests');
  cy.intercept('POST', '**').as('postRequests');
};

export const checkInterceptions = () => {
  cy.wait(['@getRequests', '@postRequests']).then((interceptions) => {
    const failedRequests = interceptions.filter(
      (interception) => interception.response && interception.response.statusCode >= 400
    );
    expect(failedRequests.length).to.equal(0);
  });
};
