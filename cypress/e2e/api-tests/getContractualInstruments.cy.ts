import { AutotestsCustomerId } from 'cypress/constants/global/customers';
import { GetContractualInstruments } from '../../constants/global/apiUrls';
import { ObjectReferenceError } from 'cypress/constants/global/commonTextMessages';
import { FacilityFirstId } from 'cypress/constants/global/facilities';
import { ElectricCommodityId } from 'cypress/constants/global/commodities';
import { ContractFirstValue } from 'cypress/constants/high-zone/SustainabilityPage/pageElements';

const StartDateValue = '2009-03-06T00:00:00';
const EndDateValue = '2014-06-02T00:00:00';

describe('api/GetContractualInstruments @S16a83fda', { tags: ['api', 'medium'] }, () => {
  it('1: Response Body Validation @T34ffca3b', () => {
    cy.request({
      method: 'POST',
      url: GetContractualInstruments,
      body: {
        Filter: {
          CustomerId: AutotestsCustomerId,
          FacilityId: FacilityFirstId,
          ProfileName: ContractFirstValue,
          EndDate: EndDateValue,
          StartDate: StartDateValue,
          CommodityTypes: [ElectricCommodityId]
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.Result.length).to.be.greaterThan(0);

      const firstEntry = response.body.Result[0];
      expect(firstEntry.CalculationMethod).to.be.a('number');
      expect(firstEntry.CalculationMethod.toString()).to.be.not.empty;
      expect(firstEntry.CommaSeparatedNames).to.be.a('string').and.not.empty;
      expect(firstEntry.ContactName).to.be.a('string').and.not.empty;
      expect(firstEntry.ContractualInstrumentType).to.be.a('number');
      expect(firstEntry.ContractualInstrumentType.toString()).to.be.not.empty;
      expect(firstEntry.EndDate).to.be.a('string').and.not.empty;
      expect(firstEntry.EndDate).to.be.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
      expect(firstEntry.Id).to.be.a('number');
      expect(firstEntry.Id.toString()).to.be.not.empty;
      expect(firstEntry.ModifiedAt).to.be.a('string').and.not.empty;
      expect(firstEntry.ModifiedAt).to.be.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{7}$/);
      expect(firstEntry.ModifiedById).to.be.a('number');
      expect(firstEntry.ModifiedById.toString()).to.be.not.empty;
      expect(firstEntry.Name).to.be.a('string').and.not.empty;
      expect(firstEntry.PDFLink).to.be.a('string').and.empty;
      expect(firstEntry.PdfName).to.be.a('string').and.empty;
      expect(firstEntry.Source).to.be.a('number');
      expect(firstEntry.Source.toString()).to.be.not.empty;
      expect(firstEntry.StartDate).to.be.a('string').and.not.empty;
      expect(firstEntry.StartDate).to.be.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
      expect(firstEntry.UsnsCount).to.be.a('number');
      expect(firstEntry.UsnsCount.toString()).to.be.not.empty;
      expect(firstEntry.Value).to.be.a('number');
      expect(firstEntry.Value.toString()).to.be.not.empty;

      const UsnAccountIds = firstEntry.UsnAccountIds;
      expect(UsnAccountIds).to.be.a('array');
      expect(UsnAccountIds).to.have.length.greaterThan(0);
      UsnAccountIds.forEach((UsnAccountId: NonNullable<unknown>) => {
        expect(UsnAccountId).to.be.a('number');
        expect(UsnAccountId.toString()).to.be.not.empty;
      });

      const UsnNames = firstEntry.UsnNames;
      expect(UsnNames).to.be.a('array');
      expect(UsnNames).to.have.length.greaterThan(0);
      UsnNames.forEach((UsnName: NonNullable<unknown>) => {
        expect(UsnName).to.be.a('string').and.not.empty;
      });
    });
  });

  it('2: Required parameters @T4fe17d04', () => {
    cy.request({
      method: 'POST',
      url: GetContractualInstruments,
      body: {
        Filter: {
          CustomerId: AutotestsCustomerId
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.Result.length).to.be.greaterThan(0);
    });
  });

  it('3: Empty JSON @T5305952e', () => {
    cy.request({
      method: 'POST',
      url: GetContractualInstruments,
      failOnStatusCode: false,
      body: {}
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body).to.eq(ObjectReferenceError);
    });
  });

  it('4: No body @T7d944c91', () => {
    cy.request({
      method: 'POST',
      url: GetContractualInstruments,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body).to.eq(ObjectReferenceError);
    });
  });
});
