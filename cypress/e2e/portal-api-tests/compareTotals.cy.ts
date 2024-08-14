import { env } from '../../../env';
import * as portalUrls from '../../constants/global/portalUrls';
import * as portalApiUrls from '../../constants/global/portalApiUrls';
import { comparator } from 'cypress/helpers/compareTotals/functions';
import * as customers from 'cypress/constants/global/customers';
import { DemoAgencyNodeId } from 'cypress/constants/global/agencies';
import { FacilitySecondId } from 'cypress/constants/global/facilities';
import { AllCommoditiesMaskId, NaturalGasCommodityId } from 'cypress/constants/global/commodities';
import { MeterSecondId } from 'cypress/constants/global/meters';
import { EuroCurrencyId, UsdCurrencyId } from 'cypress/constants/global/currencies';
import { UsnSecondId } from 'cypress/constants/global/usns';

const StartDateValueMMDDYYYY = '10/01/2023';
const EndDateValueMMDDYYYY = '10/31/2023';
const StartDateValueYYYYMMDD = '2023-10-01';
const EndDateValueYYYYMMDD = '2023-10-31';
const StartEndDateValueMMMYYYY = 'Oct 2023';
const filterTypeValue = 1;
const locationValue = `Group:${customers.AutotestsCustomerGroupNodeId}:Group:${DemoAgencyNodeId}`;
const totals = {
  overview: {
    cost: {
      calendar: {
        USD: [],
        EUR: []
      },
      production: {
        USD: [],
        EUR: []
      }
    },
    usage: {
      calendar: [],
      production: []
    }
  },
  benchmarking: {
    cost: {
      USD: [],
      EUR: []
    },
    usage: [],
    emission: []
  },
  sustainability: {
    annualValues: {
      CH4: [],
      CO2: [],
      CO2e: [],
      N2O: []
    },
    monthlyValues: {
      CO2e: []
    }
  },
  facilitySummary: {
    cost: {
      USD: [],
      EUR: []
    },
    usage: [],
    emission: []
  },
  annualEnergySummary: {
    usage: []
  },
  usageCost: {
    cost: {
      USD: [],
      EUR: []
    },
    usage: []
  },
  facilities: {
    annualValues: {
      CH4: [],
      CO2: [],
      CO2e: [],
      N2O: []
    }
  },
  commodityVsTransport: {
    usage: [],
    cost: []
  },
  businessMetrics: {
    cost: {
      USD: [],
      EUR: []
    },
    usage: []
  }
};

describe('compareTotals @S7a92cc77', { tags: ['api', 'high'] }, () => {
  it('1: Collect Overview values @Tde0397d9', () => {
    const ProductionEuroDateValue = '11/01/2023';

    cy.login(env.userNameAdmin, env.userPassword);
    cy.selectCustomer(customers.AutotestsCustomer);
    cy.request({
      method: 'POST',
      url: portalApiUrls.GetBillUsageCostData,
      headers: {
        Referer: portalUrls.OverviewUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        rawFilter: {
          Location: locationValue,
          StartDate: StartDateValueMMDDYYYY,
          EndDate: StartDateValueMMDDYYYY,
          CommodityTypeId: NaturalGasCommodityId,
          FacilityId: FacilitySecondId,
          MonthFlag: 'C'
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.overview.cost.calendar, 'USD', {
        value: Math.round((response.body.Data[0].InputCost + Number.EPSILON) * 10000) / 10000
      });
      Object.defineProperty(totals.overview.usage, 'calendar', {
        value: Math.round((response.body.Data[0].Usage + Number.EPSILON) * 10000) / 10000
      });
    });

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetBillUsageCostData,
      headers: {
        Referer: portalUrls.OverviewUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        rawFilter: {
          CustomerId: customers.AutotestsCustomerId,
          CurrencyId: `${EuroCurrencyId}`,
          Location: locationValue,
          StartDate: StartDateValueMMDDYYYY,
          EndDate: StartDateValueMMDDYYYY,
          CommodityTypeId: NaturalGasCommodityId,
          FacilityId: FacilitySecondId,
          MonthFlag: 'C'
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.overview.cost.calendar, 'EUR', {
        value: Math.round((response.body.Data[0].InputCost + Number.EPSILON) * 10000) / 10000
      });
    });

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetBillUsageCostData,
      headers: {
        Referer: portalUrls.OverviewUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        rawFilter: {
          Location: locationValue,
          StartDate: StartDateValueMMDDYYYY,
          EndDate: StartDateValueMMDDYYYY,
          CommodityTypeId: NaturalGasCommodityId,
          FacilityId: FacilitySecondId,
          MeterIds: MeterSecondId,
          MonthFlag: 'P'
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.overview.cost.production, 'USD', {
        value: Math.round((response.body.Data[0].InputCost + Number.EPSILON) * 10000) / 10000
      });
      Object.defineProperty(totals.overview.usage, 'production', {
        value: Math.round((response.body.Data[0].Usage + Number.EPSILON) * 10000) / 10000
      });
    });

    cy.wait(500);
    cy.request({
      method: 'POST',
      url: portalApiUrls.GetBillUsageCostData,
      headers: {
        Referer: portalUrls.OverviewUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        rawFilter: {
          CustomerId: customers.AutotestsCustomerId,
          CurrencyId: `${EuroCurrencyId}`,
          Location: locationValue,
          StartDate: ProductionEuroDateValue,
          EndDate: ProductionEuroDateValue,
          CommodityTypeId: NaturalGasCommodityId,
          FacilityId: FacilitySecondId,
          MeterIds: MeterSecondId,
          MonthFlag: 'P'
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.overview.cost.production, 'EUR', {
        value: Math.round((response.body.Data[0].InputCost + Number.EPSILON) * 10000) / 10000
      });
    });
  });

  it('2: Collect Benchmarking values @T6fe75b3f', () => {
    cy.request({
      method: 'POST',
      url: portalApiUrls.GetNewBenchmarkingData,
      headers: {
        Referer: portalUrls.BenchmarkingUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        StartDate: StartDateValueYYYYMMDD,
        EndDate: EndDateValueYYYYMMDD,
        PageSize: 1,
        PageCurrent: 1,
        Location: locationValue,
        CommodityMaskId: NaturalGasCommodityId,
        MonthFlag: 'C',
        SelectedItemIds: [FacilitySecondId],
        IsEmission: true,
        BenchmarkType: 1
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.benchmarking.cost, 'USD', {
        value: Math.round((response.body.Data[0].TotalCharge + Number.EPSILON) * 10000) / 10000
      });
      Object.defineProperties(totals.benchmarking, {
        usage: { value: Math.round((response.body.Data[0].TotalValue + Number.EPSILON) * 10000) / 10000 },
        emission: { value: Math.round((response.body.Data[0].CO2e + Number.EPSILON) * 10000) / 10000 }
      });
    });

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetNewBenchmarkingData,
      headers: {
        Referer: portalUrls.BenchmarkingUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        CustomerId: customers.AutotestsCustomerId,
        CurrencyId: `${EuroCurrencyId}`,
        StartDate: StartDateValueYYYYMMDD,
        EndDate: EndDateValueYYYYMMDD,
        PageSize: 1,
        PageCurrent: 1,
        Location: locationValue,
        CommodityMaskId: NaturalGasCommodityId,
        MonthFlag: 'C',
        SelectedItemIds: [FacilitySecondId],
        IsEmission: true,
        BenchmarkType: 1
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.benchmarking.cost, 'EUR', {
        value: Math.round((response.body.Data[0].TotalCharge + Number.EPSILON) * 10000) / 10000
      });
    });
  });

  it('3: Collect Sustainability values @T4d2d95ec', () => {
    const StartDateValue = '2023-01-01';
    const EndDateValue = '2023-12-31';

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetTotalEmission,
      headers: {
        Referer: portalUrls.SustainabilityUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        FilterType: filterTypeValue,
        Location: locationValue,
        FacilityId: FacilitySecondId,
        StartDate: StartDateValueYYYYMMDD,
        EndDate: EndDateValueYYYYMMDD,
        CommodityMaskId: NaturalGasCommodityId,
        CalculationMethod: '2'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.sustainability.monthlyValues, 'CO2e', {
        value: Math.round((response.body.CO2e.Emission + Number.EPSILON) * 10000) / 10000
      });
    });

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetTotalEmission,
      headers: {
        Referer: portalUrls.SustainabilityUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        FilterType: filterTypeValue,
        Location: locationValue,
        FacilityId: FacilitySecondId,
        StartDate: StartDateValue,
        EndDate: EndDateValue,
        CommodityMaskId: AllCommoditiesMaskId,
        CalculationMethod: '2'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperties(totals.sustainability.annualValues, {
        CH4: { value: Math.round((response.body.CH4.Emission + Number.EPSILON) * 10000) / 10000 },
        CO2: { value: Math.round((response.body.CO2.Emission + Number.EPSILON) * 10000) / 10000 },
        CO2e: { value: Math.round((response.body.CO2e.Emission + Number.EPSILON) * 10000) / 10000 },
        N2O: { value: Math.round((response.body.N2O.Emission + Number.EPSILON) * 10000) / 10000 }
      });
    });
  });

  it('4: Collect Facility Summary values @Tdf2c179f', () => {
    const DateValue = 2023;

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetTrendUsage,
      headers: {
        Referer: portalUrls.FacilitySummaryUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        location: locationValue,
        customerId: customers.AutotestsCustomerId,
        facilityId: FacilitySecondId,
        startDate: DateValue,
        endDate: DateValue
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.facilitySummary, 'usage', {
        value: Math.round((response.body[1].Usages[9].Usage + Number.EPSILON) * 10000) / 10000
      });
    });

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetTrendCost,
      headers: {
        Referer: portalUrls.FacilitySummaryUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        location: locationValue,
        customerId: customers.AutotestsCustomerId,
        facilityId: FacilitySecondId,
        currencyId: UsdCurrencyId,
        startDate: DateValue,
        endDate: DateValue
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.facilitySummary.cost, 'USD', {
        value: Math.round((response.body[2].Costs[9].Cost + Number.EPSILON) * 10000) / 10000
      });
    });

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetTrendCost,
      headers: {
        Referer: portalUrls.FacilitySummaryUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        location: locationValue,
        customerId: customers.AutotestsCustomerId,
        facilityId: FacilitySecondId,
        currencyId: EuroCurrencyId,
        startDate: DateValue,
        endDate: DateValue
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.facilitySummary.cost, 'EUR', {
        value: Math.round((response.body[2].Costs[9].Cost + Number.EPSILON) * 10000) / 10000
      });
    });

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetTrendEmissions,
      headers: {
        Referer: portalUrls.FacilitySummaryUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        location: locationValue,
        customerId: customers.AutotestsCustomerId,
        facilityId: FacilitySecondId,
        startDate: DateValue,
        endDate: DateValue
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.facilitySummary, 'emission', {
        value: Math.round((response.body[2].Usages[9].Usage + Number.EPSILON) * 10000) / 10000
      });
    });
  });

  it('5: Collect Annual Energy Summary values @T7790fcd9', () => {
    cy.request({
      method: 'POST',
      url: portalApiUrls.GetAnnualEnergySummaryReport,
      headers: {
        Referer: portalUrls.AnnualEnergySummaryUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        filter: {
          MeterIds: MeterSecondId,
          CustomerId: customers.AutotestsCustomerId,
          CommodityType: NaturalGasCommodityId,
          BaseYear: '2022',
          CurrYear: '2023'
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.annualEnergySummary, 'usage', {
        value: Math.round((response.body.Data[9].wCurrActual + Number.EPSILON) * 10000) / 10000
      });
    });
  });

  it('6: Collect Usage & Cost values @T2478a7bf', () => {
    cy.request({
      method: 'POST',
      url: portalApiUrls.GetUsageCostReportData,
      headers: {
        Referer: portalUrls.UsageCostUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        criteria: [
          { Key: 'NodeValue', Value: locationValue },
          { Key: 'CustomerId', Value: customers.AutotestsCustomerId },
          { Key: 'StartDate', Value: StartDateValueMMDDYYYY },
          { Key: 'EndDate', Value: EndDateValueMMDDYYYY },
          { Key: 'CommodityTypeId', Value: NaturalGasCommodityId },
          { Key: 'FacilityId', Value: FacilitySecondId },
          { Key: 'CurrencyId', Value: UsdCurrencyId }
        ]
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.usageCost.cost, 'USD', {
        value: Math.round((response.body.Data[0].InputTotalInvoiced + Number.EPSILON) * 10000) / 10000
      });
      Object.defineProperty(totals.usageCost, 'usage', {
        value: Math.round((response.body.Data[0].EnergyUsage + Number.EPSILON) * 10000) / 10000
      });
    });

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetUsageCostReportData,
      headers: {
        Referer: portalUrls.UsageCostUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        criteria: [
          { Key: 'NodeValue', Value: locationValue },
          { Key: 'CustomerId', Value: customers.AutotestsCustomerId },
          { Key: 'StartDate', Value: StartDateValueMMDDYYYY },
          { Key: 'EndDate', Value: EndDateValueMMDDYYYY },
          { Key: 'CommodityTypeId', Value: NaturalGasCommodityId },
          { Key: 'FacilityId', Value: FacilitySecondId },
          { Key: 'CurrencyId', Value: `${EuroCurrencyId}` }
        ]
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.usageCost.cost, 'EUR', {
        value: Math.round((response.body.Data[0].InputTotalInvoiced + Number.EPSILON) * 10000) / 10000
      });
    });
  });

  it('7: Collect Facilities values @Tee3cc993', () => {
    cy.request({
      method: 'POST',
      url: portalApiUrls.GetTotalEmissionYearWiseCo2E,
      headers: {
        Referer: portalUrls.FacilitiesUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        ytdFilter: {
          Location: locationValue,
          CustomerId: customers.AutotestsCustomerId,
          FacilityId: FacilitySecondId,
          StartDate: StartDateValueYYYYMMDD,
          EndDate: EndDateValueYYYYMMDD
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.facilities.annualValues, 'CO2e', {
        value: Math.round((response.body[3].Emission + Number.EPSILON) * 10000) / 10000
      });
    });

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetTotalEmissionYearWiseCo2,
      headers: {
        Referer: portalUrls.FacilitiesUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        ytdFilter: {
          Location: locationValue,
          CustomerId: customers.AutotestsCustomerId,
          FacilityId: FacilitySecondId,
          StartDate: StartDateValueMMDDYYYY,
          EndDate: EndDateValueMMDDYYYY
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.facilities.annualValues, 'CO2', {
        value: Math.round((response.body[3].Emission + Number.EPSILON) * 10000) / 10000
      });
    });

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetTotalEmissionYearWiseCh4,
      headers: {
        Referer: portalUrls.FacilitiesUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        ytdFilter: {
          Location: locationValue,
          CustomerId: customers.AutotestsCustomerId,
          FacilityId: FacilitySecondId,
          StartDate: StartDateValueMMDDYYYY,
          EndDate: EndDateValueMMDDYYYY
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.facilities.annualValues, 'CH4', {
        value: Math.round((response.body[3].Emission + Number.EPSILON) * 10000) / 10000
      });
    });

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetTotalEmissionYearWiseN2O,
      headers: {
        Referer: portalUrls.FacilitiesUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        ytdFilter: {
          Location: locationValue,
          CustomerId: customers.AutotestsCustomerId,
          FacilityId: FacilitySecondId,
          StartDate: StartDateValueMMDDYYYY,
          EndDate: EndDateValueMMDDYYYY
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.facilities.annualValues, 'N2O', {
        value: Math.round((response.body[3].Emission + Number.EPSILON) * 10000) / 10000
      });
    });
  });

  it('8: Collect Commodity Vs. Transport values @Tf2cdbcef', () => {
    const DateValue = 'Oct 2023';

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetBillUsageData,
      headers: {
        Referer: portalUrls.CommodityVsTransportUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        StartDate: DateValue,
        EndDate: DateValue,
        CustomerId: customers.AutotestsCustomerId,
        CommodityType: NaturalGasCommodityId,
        FacilityId: FacilitySecondId,
        MonthFlag: 'P',
        NodeId: customers.AutotestsCustomerGroupNodeId,
        NodeType: 'Group',
        UsnAccountId: UsnSecondId
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.commodityVsTransport, 'usage', {
        value: Math.round((response.body[0].TotalUsage + Number.EPSILON) * 10000) / 10000
      });
    });

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetBillCostData,
      headers: {
        Referer: portalUrls.CommodityVsTransportUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        StartDate: DateValue,
        EndDate: DateValue,
        CustomerId: customers.AutotestsCustomerId,
        CommodityType: NaturalGasCommodityId,
        FacilityId: FacilitySecondId,
        MonthFlag: 'P',
        NodeId: customers.AutotestsCustomerGroupNodeId,
        NodeType: 'Group',
        UsnAccountId: UsnSecondId
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.commodityVsTransport, 'cost', {
        value: Math.round((response.body[0].InputTotalInvoiced + Number.EPSILON) * 10000) / 10000
      });
    });
  });

  it('9: Collect Business Metrics values @T1732114c', () => {
    cy.request({
      method: 'POST',
      url: portalApiUrls.GetBenchmarkMetricDataReportJson,
      headers: {
        Referer: portalUrls.BusinessMetricsUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        criteria: [
          { Key: 'startdate', Value: StartEndDateValueMMMYYYY },
          { Key: 'enddate', Value: StartEndDateValueMMMYYYY },
          { Key: 'customerid', Value: customers.AutotestsCustomerId },
          { Key: 'location', Value: locationValue },
          { Key: 'commoditymaskid', Value: NaturalGasCommodityId },
          { Key: 'tagsetid', Value: '33' },
          { Key: 'metricid', Value: '39' }
        ]
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.businessMetrics.cost, 'USD', {
        value: Math.round((response.body.Data[1].TotalCost + Number.EPSILON) * 10000) / 10000
      });
      Object.defineProperty(totals.businessMetrics, 'usage', {
        value: Math.round((response.body.Data[1].MeterTotal + Number.EPSILON) * 10000) / 10000
      });
    });

    cy.request({
      method: 'POST',
      url: portalApiUrls.GetBenchmarkMetricDataReportJson,
      headers: {
        Referer: portalUrls.BusinessMetricsUrl,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        criteria: [
          { Key: 'startdate', Value: StartEndDateValueMMMYYYY },
          { Key: 'enddate', Value: StartEndDateValueMMMYYYY },
          { Key: 'customerid', Value: customers.AutotestsCustomerId },
          { Key: 'location', Value: locationValue },
          { Key: 'commoditymaskid', Value: NaturalGasCommodityId },
          { Key: 'tagsetid', Value: '33' },
          { Key: 'metricid', Value: '39' },
          { Key: 'currencyId', Value: `${EuroCurrencyId}` }
        ]
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      Object.defineProperty(totals.businessMetrics.cost, 'EUR', {
        value: Math.round((response.body.Data[1].TotalCost + Number.EPSILON) * 10000) / 10000
      });
    });
  });

  it('10: Compare total values @Tfe20bb99', () => {
    comparator(totals.overview.cost.calendar.USD, totals.benchmarking.cost.USD);
    comparator(totals.overview.cost.calendar.EUR, totals.benchmarking.cost.EUR);
    comparator(totals.overview.cost.calendar.USD, totals.facilitySummary.cost.USD);
    comparator(totals.overview.cost.calendar.EUR, totals.facilitySummary.cost.EUR);
    comparator(totals.overview.cost.calendar.USD, totals.businessMetrics.cost.USD);
    comparator(totals.overview.cost.calendar.EUR, totals.businessMetrics.cost.EUR);

    comparator(totals.overview.cost.production.USD, totals.usageCost.cost.USD);
    comparator(totals.overview.cost.production.EUR, totals.usageCost.cost.EUR);
    comparator(totals.overview.cost.production.USD, totals.commodityVsTransport.cost);

    comparator(totals.overview.usage.calendar, totals.benchmarking.usage);
    comparator(totals.overview.usage.calendar, totals.facilitySummary.usage);
    comparator(totals.overview.usage.calendar, totals.annualEnergySummary.usage);
    comparator(totals.overview.usage.calendar, totals.businessMetrics.usage);
    comparator(totals.overview.usage.production, totals.usageCost.usage);
    comparator(totals.overview.usage.production, totals.commodityVsTransport.usage);

    comparator(totals.benchmarking.emission, totals.sustainability.monthlyValues.CO2e);
    comparator(totals.benchmarking.emission, totals.facilitySummary.emission);
    comparator(totals.sustainability.annualValues.CH4, totals.facilities.annualValues.CH4);
    comparator(totals.sustainability.annualValues.CO2, totals.facilities.annualValues.CO2);
    comparator(totals.sustainability.annualValues.CO2e, totals.facilities.annualValues.CO2e);
    comparator(totals.sustainability.annualValues.N2O, totals.facilities.annualValues.N2O);
  });
});
