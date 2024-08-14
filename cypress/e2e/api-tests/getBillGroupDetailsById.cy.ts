import * as helpers from 'cypress/helpers/ApiTests/functions';
import { GetBillGroupDetailsById } from '../../constants/global/apiUrls';
import { FileId } from 'cypress/constants/medium-zone/AiProvideMyDataPage/entitiesIds';

const FileIdArray = [FileId];
const DateFormat = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
const NumberFormat = /^(-?\d{1,3}(,\d{3})*(\.\d{1,10})?|(-?\d{1,10})*(\.\d{1,10})?)$/;
const UidFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

type BillGroupType = {
  Customer: CustomerType;
  Provider: ProviderType;
  InvoiceNumber: string | null;
  BillDate: string | null;
  DueDate: string | null;
  PreviousBalance: string | null;
  LateFee: string | null;
  CurrentCharges: string | null;
  TotalAmountDue: string | null;
  BillDetails: BillDetailsType;
  Uid: string;
  Errors: ErrorsForBillGroupType;
};

type BillDetailsType = {
  UsnAccount: AccountType;
  Commodity: CommodityType;
  ServiceStart: string | null;
  ServiceEnd: string | null;
  InvoiceNumber: string | null;
  MeterReadings: MeterReadingsType;
  ReceivedCharges: ReceivedChargesType;
  Uid: string;
  Errors: ErrorsForBillDetails;
};

type MeterReadingsType = {
  MeterNumber: MeterType;
  Uom: UomType;
  Multiplier: string | null;
  PreviousReading: string | null;
  CurrentReading: string | null;
  Delta: string | null;
  Total: string | null;
  Uid: string;
  Errors: ErrorsForMeterReadings;
};
type ReceivedChargesType = {
  Name: string | null;
  Qty: string | null;
  Rate: string | null;
  Charges: string | null;
  Uid: string;
  Errors: ErrorsForReceivedCharges;
};

type CustomerType = {
  Key: number | null;
  Label: string | null;
};

type ProviderType = {
  Key: number | null;
  Label: string | null;
};

type AccountType = {
  Key: number | null;
  Label: string | null;
};

type CommodityType = {
  Key: number | null;
  Label: string | null;
};

type MeterType = {
  Key: number | null;
  Label: string | null;
};

type UomType = {
  Key: number | null;
  Label: string | null;
};

type ErrorsForBillGroupType = {
  Customer: string;
  Provider: string;
  BillDate: string;
  DueDate: string;
  PreviousBalance: string;
  LateFee: string;
  CurrentCharges: string;
  TotalAmountDue: string;
};

type ErrorsForBillDetails = {
  UsnAccount: string;
  Commodity: string;
  ServiceStart: string;
  ServiceEnd: string;
};

type ErrorsForMeterReadings = {
  MeterNumber: string;
  Uom: string;
  Multiplier: string;
  PreviousReading: string;
  CurrentReading: string;
  Delta: string;
  Total: string;
};

type ErrorsForReceivedCharges = {
  Name: string;
  Qty: string;
  Rate: string;
  Charges: string;
};

describe('api/GetBillGroupDetailsById @Sf94b1dc2', { tags: ['api', 'medium'] }, () => {
  FileIdArray.forEach((FileIdArray) => {
    it(`1: Response Body Validation for FileId ${FileIdArray} @T8a62e04e`, () => {
      cy.request({
        method: 'GET',
        url: `${GetBillGroupDetailsById}/${FileIdArray}`
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.not.empty;

        const billGroup: BillGroupType = response.body;
        helpers.checkKey(billGroup.Customer.Key);
        helpers.checkNotNullString('Customer', billGroup.Customer.Label, billGroup.Errors.Customer);
        helpers.checkKey(billGroup.Provider.Key);
        helpers.checkNotNullString('Provider', billGroup.Provider.Label, billGroup.Errors.Provider);
        helpers.checkString(billGroup.InvoiceNumber);
        helpers.checkNotNullDate('BillDate', billGroup.BillDate, billGroup.Errors.BillDate, DateFormat);
        helpers.checkDate('DueDate', billGroup.DueDate, billGroup.Errors.DueDate, DateFormat);
        helpers.checkNumber(
          'PreviousBalance',
          billGroup.PreviousBalance,
          billGroup.Errors.PreviousBalance,
          NumberFormat
        );
        helpers.checkNumber('LateFee', billGroup.LateFee, billGroup.Errors.LateFee, NumberFormat);
        helpers.checkNotNullNumber(
          'CurrentCharges',
          billGroup.CurrentCharges,
          billGroup.Errors.CurrentCharges,
          NumberFormat
        );
        helpers.checkNotNullNumber(
          'TotalAmountDue',
          billGroup.TotalAmountDue,
          billGroup.Errors.TotalAmountDue,
          NumberFormat
        );
        helpers.checkUid(billGroup.Uid, UidFormat);

        const BillDetails: BillDetailsType[] = billGroup.BillDetails;
        expect(BillDetails).to.be.a('array');
        expect(BillDetails).to.have.length.greaterThan(0);
        BillDetails.forEach((billDetails) => {
          helpers.checkKey(billDetails.UsnAccount.Key);
          helpers.checkNotNullString('UsnAccount', billDetails.UsnAccount.Label, billDetails.Errors.UsnAccount);
          helpers.checkKey(billDetails.Commodity.Key);
          helpers.checkNotNullString('Commodity', billDetails.Commodity.Label, billDetails.Errors.Commodity);
          helpers.checkNotNullDate(
            'ServiceStart',
            billDetails.ServiceStart,
            billDetails.Errors.ServiceStart,
            DateFormat
          );
          helpers.checkNotNullDate('ServiceEnd', billDetails.ServiceEnd, billDetails.Errors.ServiceEnd, DateFormat);
          helpers.checkString(billDetails.InvoiceNumber);
          helpers.checkUid(billDetails.Uid, UidFormat);

          const MeterReadings: MeterReadingsType[] = billDetails.MeterReadings;
          expect(MeterReadings).to.be.a('array');
          expect(MeterReadings).to.have.length.greaterThan(0);
          MeterReadings.forEach((meterReadings) => {
            helpers.checkKey(meterReadings.MeterNumber.Key);
            helpers.checkNotNullString(
              'MeterNumber',
              meterReadings.MeterNumber.Label,
              meterReadings.Errors.MeterNumber
            );
            helpers.checkKey(meterReadings.Uom.Key);
            helpers.checkNotNullString('Uom', meterReadings.Uom.Label, meterReadings.Errors.Uom);
            helpers.checkNumber('Multiplier', meterReadings.Multiplier, meterReadings.Errors.Multiplier, NumberFormat);
            helpers.checkNumber(
              'PreviousReading',
              meterReadings.PreviousReading,
              meterReadings.Errors.PreviousReading,
              NumberFormat
            );
            helpers.checkNumber(
              'CurrentReading',
              meterReadings.CurrentReading,
              meterReadings.Errors.CurrentReading,
              NumberFormat
            );
            helpers.checkNumber('Delta', meterReadings.Delta, meterReadings.Errors.Delta, NumberFormat);
            helpers.checkNumber('Total', meterReadings.Total, meterReadings.Errors.Total, NumberFormat);
            helpers.checkUid(meterReadings.Uid, UidFormat);
          });

          const ReceivedCharges: ReceivedChargesType[] = billDetails.ReceivedCharges;
          expect(ReceivedCharges).to.be.a('array');
          expect(ReceivedCharges).to.have.length.greaterThan(0);
          ReceivedCharges.forEach((receivedCharges) => {
            helpers.checkNotNullString('Name', receivedCharges.Name, receivedCharges.Errors.Name);
            helpers.checkNumber('Qty', receivedCharges.Qty, receivedCharges.Errors.Qty, NumberFormat);
            helpers.checkNumber('Rate', receivedCharges.Rate, receivedCharges.Errors.Rate, NumberFormat);
            helpers.checkNotNullNumber(
              'Charges',
              receivedCharges.Charges,
              receivedCharges.Errors.Charges,
              NumberFormat
            );
            helpers.checkUid(receivedCharges.Uid, UidFormat);
          });
        });
      });
    });
  });
});
