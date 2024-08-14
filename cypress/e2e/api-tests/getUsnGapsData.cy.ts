import { AutotestsCustomerId } from 'cypress/constants/global/customers';
import { GetUsnGapsData } from '../../constants/global/apiUrls';
import { DemoAgencyId } from 'cypress/constants/global/agencies';
import { UsnFirstId } from 'cypress/constants/global/usns';
import { DemoUtilityId } from 'cypress/constants/global/provider';
import { ElectricCommodityId } from 'cypress/constants/global/commodities';
import { ObjectReferenceError } from 'cypress/constants/global/commonTextMessages';

const StartDateValue = '2023-01-01T00:00:00.000Z';
const EndDateValue = '2024-12-31T00:00:00.000Z';

describe('api/GetUsnGapsData @S6f43a60b', { tags: ['api', 'medium'] }, () => {
  it('1: Response Body Validation @T2d7ea186', () => {
    cy.request({
      method: 'POST',
      url: GetUsnGapsData,
      body: {
        Filter: {
          CustomerIds: [AutotestsCustomerId],
          AgencyId: DemoAgencyId,
          ProviderId: DemoUtilityId,
          CommodityTypeId: ElectricCommodityId,
          UsnAccountId: UsnFirstId,
          StartDate: StartDateValue,
          EndDate: EndDateValue,
          SortCriteria: []
        },
        Skip: 0,
        Take: 1000
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.Data.length).to.be.greaterThan(0);
      const firstEntry = response.body.Data[0];
      expect(firstEntry.CustomerName).to.be.a('string').and.not.empty;
      expect(firstEntry.Pan).to.be.a('string').and.not.empty;
      expect(firstEntry.Usn).to.be.a('string').and.not.empty;
      expect(firstEntry.FacilityName).to.be.a('string').and.not.empty;
      expect(firstEntry.Address).to.be.a('string').and.not.empty;
      expect(firstEntry.ProviderName).to.be.a('string').and.not.empty;
      expect(firstEntry.CommodityName).to.be.a('string').and.not.empty;
      expect(firstEntry.UsnStartDate).to.be.a('string').and.not.empty;
      expect(firstEntry.UsnStartDate).to.be.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
      expect(firstEntry.UsnEndDate).to.be.a('string').and.not.empty;
      expect(firstEntry.UsnEndDate).to.be.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
      expect(firstEntry.DcMethod).to.be.a('string').and.not.empty;

      const serviceDatesStatusModels = firstEntry.ServiceDatesStatusModels;
      expect(serviceDatesStatusModels).to.be.a('array');
      expect(serviceDatesStatusModels).to.have.length.greaterThan(0);
      serviceDatesStatusModels.forEach(
        (statusModel: {
          GapStartDate: string;
          GapEndDate: string;
          GapType: string;
          MonthCount: string;
          AffectedMonths: string[];
        }) => {
          expect(statusModel.GapStartDate).to.be.a('string').and.not.empty;
          expect(statusModel.GapEndDate).to.be.a('string').and.not.empty;
          expect(statusModel.GapType).to.be.a('number');
          expect(statusModel.GapType.toString()).to.be.not.empty;
          expect(statusModel.MonthCount).to.be.a('number');
          expect(statusModel.MonthCount.toString()).to.be.not.empty;
          expect(statusModel.AffectedMonths).to.be.a('array').and.not.empty;
          expect(statusModel.GapStartDate).to.be.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
          expect(statusModel.GapEndDate).to.be.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
          expect(statusModel.GapType).to.be.within(1, 5);
          const arrayLength = statusModel.AffectedMonths.length;
          expect(statusModel.MonthCount).to.eql(arrayLength);
          statusModel.AffectedMonths.forEach((Date: string) => {
            expect(Date).to.be.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
          });
        }
      );
    });
  });

  it('2: Required parameters @T8d68ceba', () => {
    cy.request({
      method: 'POST',
      url: GetUsnGapsData,
      body: {
        Filter: {
          CustomerIds: [AutotestsCustomerId],
          StartDate: StartDateValue,
          EndDate: EndDateValue
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.Data.length).to.be.greaterThan(0);
    });
  });

  it('3: Empty JSON @T6817eeef', () => {
    cy.request({
      method: 'POST',
      url: GetUsnGapsData,
      failOnStatusCode: false,
      body: {}
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body.Message).to.eq(ObjectReferenceError);
    });
  });

  it('4: No body @Td64e2768', () => {
    cy.request({
      method: 'POST',
      url: GetUsnGapsData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body.Message).to.eq(ObjectReferenceError);
    });
  });
});
