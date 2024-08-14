import { GetContracts } from '../../constants/global/portalApiUrls';
import { env } from '../../../env';
import { SustainabilityUrl } from '../../constants/global/portalUrls';
import { AutotestsCustomerId } from 'cypress/constants/global/customers';
import { FacilityFirstId } from 'cypress/constants/global/facilities';
import { ElectricCommodityId } from 'cypress/constants/global/commodities';
import { ContractThirdValue } from 'cypress/constants/high-zone/SustainabilityPage/pageElements';

describe('ContractualInstrument/GetContracts @Sa043948b', { tags: ['api', 'medium'] }, () => {
  it('1: Verify private access without authorization @Tc8ade172', () => {
    cy.clearCookies();
    cy.request({
      method: 'POST',
      url: GetContracts,
      headers: {
        Referer: SustainabilityUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          Fields: [],
          Filter: {
            CustomerId: AutotestsCustomerId
          }
        }
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('2: Verify private access without permission @T00ce8849', () => {
    cy.login(env.userNameBroker, env.userPassword);
    cy.request({
      method: 'POST',
      url: GetContracts,
      headers: {
        Referer: SustainabilityUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          Fields: [],
          Filter: {
            CustomerId: AutotestsCustomerId
          }
        }
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });

  it('3: Verify the filled body with valid data @T2305202f', () => {
    cy.login(env.userNameAdmin, env.userPassword);
    cy.wait(500);
    cy.request({
      method: 'POST',
      url: GetContracts,
      headers: {
        Referer: SustainabilityUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Fields: [],
        Filter: {
          CustomerId: AutotestsCustomerId
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.Data.length).to.be.greaterThan(0);
    });
  });

  it('4: Verify required and optional parameters in the body @T7e731906', () => {
    cy.request({
      method: 'POST',
      url: GetContracts,
      headers: {
        Referer: SustainabilityUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {}
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.ErrorMessages).to.eq('Technical error has occurred during the process.');
    });
  });

  it('5: Verify the sorting @T7dd39d81', () => {
    const StartDateValue = '03/06/2009';
    const EndDateValue = '06/02/2014';

    cy.wait(500);
    cy.request({
      method: 'POST',
      url: GetContracts,
      headers: {
        Referer: SustainabilityUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          CustomerId: AutotestsCustomerId,
          ProfileName: ContractThirdValue
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      const firstResponse = response.body.Data;
      expect(firstResponse).to.be.not.empty;

      cy.wait(500);
      cy.request({
        method: 'POST',
        url: GetContracts,
        headers: {
          Referer: SustainabilityUrl,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: {
          Filter: {
            CustomerId: AutotestsCustomerId,
            StartDate: StartDateValue,
            EndDate: EndDateValue
          }
        }
      }).then((response2) => {
        expect(response2.status).to.eq(200);
        expect(response2.body.Data).to.be.not.empty;
        expect(response2.body.Data).be.not.eq(firstResponse);
      });
    });
  });

  it('6: Verify the server pagination @Te6b4c454', () => {
    cy.request({
      method: 'POST',
      url: GetContracts,
      headers: {
        Referer: SustainabilityUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          CustomerId: AutotestsCustomerId
        },
        Skip: 0,
        Take: 1
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      const firstResponse = response.body.Data;
      expect(firstResponse).to.be.not.empty;

      cy.wait(500);
      cy.request({
        method: 'POST',
        url: GetContracts,
        headers: {
          Referer: SustainabilityUrl,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: {
          Filter: {
            CustomerId: AutotestsCustomerId
          },
          Skip: 2,
          Take: 1
        }
      }).then((response2) => {
        expect(response2.status).to.eq(200);
        expect(response2.body.Data).to.be.not.empty;
        expect(response2.body.Data).be.not.eq(firstResponse);
      });
    });
  });

  it('7: Verify the empty response @Tbe680b94', () => {
    const StartDateValue = '03/06/2000';
    const EndDateValue = '03/06/2001';
    const invalidProfileNameValue = 'Test Contract 4';

    cy.request({
      method: 'POST',
      url: GetContracts,
      headers: {
        Referer: SustainabilityUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          Fields: [],
          Filter: {
            CustomerId: AutotestsCustomerId,
            ProfileName: invalidProfileNameValue,
            StartDate: StartDateValue,
            EndDate: EndDateValue,
            FacilityId: FacilityFirstId,
            CommodityType: ElectricCommodityId
          }
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.Data).to.eq(null);
    });
  });
});
