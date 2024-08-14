export function comparator(referenceValue: never[], comparedValue: never[]) {
  if (referenceValue === comparedValue) {
    cy.log(`Values ${referenceValue} and ${comparedValue} are equal`);
  } else {
    cy.fail(`Values ${referenceValue} and ${comparedValue} are different`);
  }
}
