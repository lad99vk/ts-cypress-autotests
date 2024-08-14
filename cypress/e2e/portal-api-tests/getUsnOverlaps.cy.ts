import { GetUsnOverlaps } from '../../constants/global/portalApiUrls';
import { env } from '../../../env';
import { UsnGapsReportUrl } from '../../constants/global/portalUrls';
import { AutotestsCustomerId } from 'cypress/constants/global/customers';
import { DemoAgencyId } from 'cypress/constants/global/agencies';
import { DemoUtilityId } from 'cypress/constants/global/provider';
import { UsnForthId } from 'cypress/constants/global/usns';
import { PropaneCommodityId } from 'cypress/constants/global/commodities';

const StartDateValue = '2023-01-01T00:00:00.000Z';
const EndDateValue = '2024-12-31T00:00:00.000Z';

describe('UsnGaps/GetUsnOverlaps @S9b1a0bc4', { tags: ['api', 'medium'] }, () => {
  it('1: Verify private access without authorization @Tcc2dad8f', () => {
    cy.clearCookies();
    cy.debug();
    cy.request({
      method: 'POST',
      url: GetUsnOverlaps,
      headers: {
        Referer: UsnGapsReportUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          Filter: {
            CustomerIds: [AutotestsCustomerId],
            AgencyId: DemoAgencyId,
            ProviderId: DemoUtilityId,
            CommodityTypeId: PropaneCommodityId,
            UsnAccountId: UsnForthId,
            StartDate: StartDateValue,
            EndDate: EndDateValue,
            SortCriteria: 0
          },
          Skip: 0,
          Take: 1000
        }
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('2: Verify the filled body with valid data @T2fef69e5', () => {
    cy.login(env.userNameAdmin, env.userPassword);
    cy.request({
      method: 'POST',
      url: GetUsnOverlaps,
      headers: {
        Referer: UsnGapsReportUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          Filter: {
            CustomerIds: [AutotestsCustomerId],
            AgencyId: DemoAgencyId,
            ProviderId: DemoUtilityId,
            CommodityTypeId: PropaneCommodityId,
            UsnAccountId: UsnForthId,
            StartDate: StartDateValue,
            EndDate: EndDateValue,
            SortCriteria: 0
          },
          Skip: 0,
          Take: 1000
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.Data.Data.length).to.be.greaterThan(0);
    });
  });

  it('3: Verify required and optional parameters in the body @T7e5e38b1', () => {
    cy.request({
      method: 'POST',
      url: GetUsnOverlaps,
      headers: {
        Referer: UsnGapsReportUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          Filter: {
            CustomerIds: null,
            AgencyId: null,
            StartDate: StartDateValue,
            EndDate: EndDateValue
          }
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.TechnicalErrorMessage).to.eq(
        'Agency or Customer should be specified to get the gaps data populated on the report'
      );
    });

    cy.wait(500);

    cy.request({
      method: 'POST',
      url: GetUsnOverlaps,
      headers: {
        Referer: UsnGapsReportUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {}
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.TechnicalErrorMessage).to.eq('The filter must not be null');
    });
  });

  it('4: Verify the system validations @T9199a09e', () => {
    const invalidStartDateValue = '2017-01-01T00:00:00.000Z';
    const invalidEndDateValue = '2018-12-31T00:00:00.000Z';

    cy.wait(500);
    cy.request({
      method: 'POST',
      url: GetUsnOverlaps,
      headers: {
        Referer: UsnGapsReportUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          Filter: {
            CustomerIds: [AutotestsCustomerId],
            StartDate: StartDateValue,
            EndDate: invalidEndDateValue
          }
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.TechnicalErrorMessage).to.eq(
        '"To" value shall be equal or greater than the value set in "From" field”'
      );
    });

    cy.request({
      method: 'POST',
      url: GetUsnOverlaps,
      headers: {
        Referer: UsnGapsReportUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          Filter: {
            CustomerIds: [AutotestsCustomerId],
            StartDate: invalidStartDateValue,
            EndDate: EndDateValue
          }
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.TechnicalErrorMessage).to.eq('Selected date range should be less than 5 years');
    });
  });

  it('5: Verify the sorting @T1b3a5d9e', () => {
    cy.wait(500);
    cy.request({
      method: 'POST',
      url: GetUsnOverlaps,
      headers: {
        Referer: UsnGapsReportUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          Filter: {
            CustomerIds: [AutotestsCustomerId],
            StartDate: StartDateValue,
            EndDate: EndDateValue,
            SortCriteria: 1
          }
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.TechnicalErrorMessage).to.eq('Invalid criterion for sorting');
    });

    cy.wait(500);
    cy.request({
      method: 'POST',
      url: GetUsnOverlaps,
      headers: {
        Referer: UsnGapsReportUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          Filter: {
            CustomerIds: [AutotestsCustomerId],
            StartDate: StartDateValue,
            EndDate: EndDateValue,
            SortCriteria: 20
          }
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      const firstResponse = response.body.Data.Data;
      expect(firstResponse).to.be.not.empty;

      cy.wait(500);
      cy.request({
        method: 'POST',
        url: GetUsnOverlaps,
        headers: {
          Referer: UsnGapsReportUrl,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: {
          Filter: {
            Filter: {
              CustomerIds: [AutotestsCustomerId],
              StartDate: StartDateValue,
              EndDate: EndDateValue,
              SortCriteria: 30
            }
          }
        }
      }).then((response2) => {
        expect(response2.status).to.eq(200);
        expect(response2.body.Data.Data).to.be.not.empty;
        expect(response2.body.Data.Data).be.not.eq(firstResponse);
      });
    });
  });

  it('6: Verify the server pagination @T53aeb4c2', () => {
    cy.request({
      method: 'POST',
      url: GetUsnOverlaps,
      headers: {
        Referer: UsnGapsReportUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          Filter: {
            CustomerIds: [AutotestsCustomerId],
            StartDate: StartDateValue,
            EndDate: EndDateValue,
            SortCriteria: 0
          },
          Skip: 0,
          Take: 5
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      const firstResponse = response.body.Data.Data;
      expect(firstResponse).to.be.not.empty;

      cy.wait(500);
      cy.request({
        method: 'POST',
        url: GetUsnOverlaps,
        headers: {
          Referer: UsnGapsReportUrl,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: {
          Filter: {
            Filter: {
              CustomerIds: [AutotestsCustomerId],
              StartDate: StartDateValue,
              EndDate: EndDateValue,
              SortCriteria: 0
            },
            Skip: 5,
            Take: 5
          }
        }
      }).then((response2) => {
        expect(response2.status).to.eq(200);
        expect(response2.body.Data.Data).to.be.not.empty;
        expect(response2.body.Data.Data).be.not.eq(firstResponse);
      });
    });
  });

  it('7: Verify the empty response @Tfbd2bf5e', () => {
    const invalidStartDateValue = '2030-01-01T00:00:00.000Z';
    const invalidEndDateValue = '2030-12-31T00:00:00.000Z';

    cy.request({
      method: 'POST',
      url: GetUsnOverlaps,
      headers: {
        Referer: UsnGapsReportUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        Filter: {
          Filter: {
            CustomerIds: [AutotestsCustomerId],
            AgencyId: DemoAgencyId,
            ProviderId: DemoUtilityId,
            CommodityTypeId: PropaneCommodityId,
            UsnAccountId: UsnForthId,
            StartDate: invalidStartDateValue,
            EndDate: invalidEndDateValue,
            SortCriteria: 0
          },
          Skip: 0,
          Take: 1000
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.Data.Data).to.be.empty;
    });
  });
});
