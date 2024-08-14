export const checkNotNullString = (ParameterName: string, Parameter: string | null, Error: string) => {
  if (Parameter !== null) {
    expect(Parameter).to.be.a('string').and.not.empty;
  } else {
    expect(Error).to.be.a('string').and.eq('Field could not be empty.');
    cy.log(`${ParameterName}:  ${Error}`);
  }
};

export const checkString = (Parameter: string | null) => {
  if (Parameter !== null) {
    expect(Parameter).to.be.a('string').and.not.empty;
  }
};

export const checkNotNullNumber = (
  ParameterName: string,
  Parameter: string | null,
  Error: string,
  ParameterRegex: RegExp
) => {
  if (Parameter !== null) {
    expect(Parameter).to.be.a('string').and.not.empty;
    if (!Parameter.match(ParameterRegex)) {
      expect(Error).to.be.a('string').and.eq('Field has incorrect format.');
      cy.log(`${ParameterName} (${Parameter}):  ${Error}`);
    }
  } else {
    expect(Error).to.be.a('string').and.eq('Field could not be empty.');
    cy.log(`${ParameterName}:  ${Error}`);
  }
};

export const checkNumber = (ParameterName: string, Parameter: string | null, Error: string, ParameterRegex: RegExp) => {
  if (Parameter !== null) {
    expect(Parameter).to.be.a('string').and.not.empty;
    if (!Parameter.match(ParameterRegex)) {
      expect(Error).to.be.a('string').and.eq('Field has incorrect format.');
      cy.log(`${ParameterName} (${Parameter}):  ${Error}`);
    }
  }
};

export const checkNotNullDate = (
  ParameterName: string,
  Parameter: string | null,
  Error: string,
  ParameterRegex: RegExp
) => {
  if (Parameter !== null) {
    expect(Parameter).to.be.a('string').and.not.empty;
    if (!Parameter.match(ParameterRegex)) {
      expect(Error).to.be.a('string').and.eq('Field has incorrect format.');
      cy.log(`${ParameterName} (${Parameter}):  ${Error}`);
    }
  } else {
    expect(Error).to.be.a('string').and.eq('Field could not be empty.');
    cy.log(`${ParameterName}:  ${Error}`);
  }
};

export const checkDate = (ParameterName: string, Parameter: string | null, Error: string, ParameterRegex: RegExp) => {
  if (Parameter !== null) {
    expect(Parameter).to.be.a('string').and.not.empty;
    if (!Parameter.match(ParameterRegex)) {
      expect(Error).to.be.a('string').and.eq('Field has incorrect format.');
      cy.log(`${ParameterName} (${Parameter}):  ${Error}`);
    }
  }
};

export const checkKey = (Parameter: number | null) => {
  if (Parameter !== null) {
    expect(Parameter).to.be.a('number');
    expect(Parameter.toString()).to.be.not.empty;
  }
};

export const checkUid = (Parameter: string, ParameterRegex: RegExp) => {
  expect(Parameter).to.be.a('string').and.not.empty;
  expect(Parameter).to.be.match(ParameterRegex);
};
