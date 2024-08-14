const PageName = 'BENCHMARKING';

import { env } from '../../../../env';
import { AutotestsCustomer } from '../../../constants/global/customers';
import { todaysDateMMDDYYYY } from '../../../constants/global/dayjs';
import { UsnSeventh } from '../../../constants/global/usns';
import { PortalTimeoutValue } from '../../../constants/global/timeoutValue';
import { chartCheck } from '../../../helpers/BenchmarkingPage/functions';
import * as pageElements from '../../../constants/high-zone/BenchmarkingPage/pageElements';
import * as globalPageElements from '../../../constants/global/pageElements';

describe('Benchmarking page @S4d535257', { tags: ['portal', 'high'] }, () => {
  it('BR-1: Verify the page is available for Admin user @Tf79a572c', () => {
    cy.login(env.userNameAdmin, env.userPassword);
    cy.intercept('/api/InternetSpeed').as('InternetSpeed');
    cy.intercept('/GetEnergyEfficiencyProjects').as('GetEnergyEfficiencyProjects');
    cy.intercept('/GetNewBenchmarkingDataReportForMonthUsageCostJson').as('GetBenchmarkingData');
    cy.pageAvailable(PageName);
    cy.selectCustomer(AutotestsCustomer);
    cy.wait('@GetEnergyEfficiencyProjects', {
      timeout: PortalTimeoutValue
    });
    cy.wait('@GetBenchmarkingData', {
      timeout: PortalTimeoutValue
    });
    cy.wait('@InternetSpeed', {
      timeout: PortalTimeoutValue
    });
    cy.waitElementBecomesVisible(pageElements.Chart);
    cy.selectCustomTimeline('#inputDate', '2022', 'Jan', '2022', 'Dec');
    cy.get('#CO2e').click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);

    chartCheck(pageElements.Chart, pageElements.ChartPoint);
    cy.get(pageElements.BarView).click();
    chartCheck(pageElements.Bar, pageElements.BarColumn);
    cy.get(pageElements.TableView).click();
    chartCheck(pageElements.Grid, globalPageElements.TableRow);

    cy.wait('@GetBenchmarkingData').should(({ response }) => {
      expect(response).not.to.be.undefined;
      expect(response).not.to.be.null;
      const firstEntry = response?.body.Data[0];

      expect(firstEntry.CO2e).to.be.a('number');
      expect(firstEntry.CO2e.toString()).to.be.not.empty;

      expect(firstEntry.SqFootage).to.be.a('number');
      expect(firstEntry.SqFootage.toString()).to.be.not.empty;

      expect(firstEntry.OptionName).to.be.a('string').and.not.empty;
      expect(firstEntry.Units).to.be.a('string').and.not.empty;
    });
  });

  it('BR-2: Verify data in graph, bar graph and table @Ta200b0ac', () => {
    cy.get('#Average').click();
    cy.get('#CostPerUsage').click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.intercept('/GetNewBenchmarkingDataReportForCostJson').as('GetBenchmarkingData');
    cy.get('#AccToAcc').click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);

    cy.get(pageElements.Bar).should('exist');
    cy.get(pageElements.ExportPDF).click({ force: true });

    cy.get(pageElements.LineView).click();
    cy.get(pageElements.Chart).should('exist');
    cy.get(pageElements.ExportPDF).click({ force: true });

    cy.get(pageElements.TableView).click();
    cy.get(pageElements.Grid).should('exist');
    cy.get(pageElements.ExportPDF).click({ force: true });
    cy.get(pageElements.ExportEXCEL).click({ force: true });

    cy.wait('@GetBenchmarkingData').should(({ response }) => {
      expect(response).not.to.be.undefined;
      expect(response).not.to.be.null;
      const firstEntry = response?.body.Data[0];

      expect(firstEntry.CurrentChargePerUsage).to.be.a('number');
      expect(firstEntry.CurrentChargePerUsage.toString()).to.be.not.empty;

      expect(firstEntry.ReportPreviousUsage).to.be.a('number');
      expect(firstEntry.ReportPreviousUsage.toString()).to.be.not.empty;

      expect(firstEntry.ReportCurrentAverageUsage).to.be.a('number');
      expect(firstEntry.ReportCurrentAverageUsage.toString()).to.be.not.empty;

      expect(firstEntry.SqFt).to.be.a('number');
      expect(firstEntry.SqFt.toString()).to.be.not.empty;

      expect(firstEntry.FacilityName).to.be.a('string').and.not.empty;
      expect(firstEntry.OptionName).to.be.a('string').and.not.empty;
      expect(firstEntry.Uom).to.be.a('string').and.not.empty;
    });
  });

  it('BR-3: Verify Presets and download files @T0d15bf24', () => {
    const PresetNameValue = 'Test';

    cy.get(pageElements.PresetBlock).contains('Save a Preset').click();
    cy.get(pageElements.PresetName).click().type(PresetNameValue, { force: true });
    cy.get(pageElements.SavePreset).click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.get(pageElements.Message).contains('Preset saved successfully.').should('exist');

    cy.get(pageElements.PresetBlock).contains('Load Preset').click();
    cy.get(pageElements.PresetList).contains(PresetNameValue).click();
    cy.get(pageElements.DeletePreset).click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);

    cy.get(pageElements.PresetBlock).contains('Load Preset').click();
    cy.get(pageElements.PresetList).contains('Autotest Preset').click();
    cy.get(pageElements.LoadPreset).click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);

    cy.readFile('./cypress/downloads/my-pdf.pdf');
    cy.readFile(`./cypress/downloads/${AutotestsCustomer}_Benchmarking_${todaysDateMMDDYYYY}.xlsx`);
    cy.readFile('./cypress/downloads/Export.pdf');
    cy.deleteDownloadsFolder();
  });

  it('BR-4: Verify Filter and Legend @Te962299c', () => {
    cy.get(pageElements.CommodityDropdown).click();
    cy.get(globalPageElements.CommodityFilterList).contains('Natural Gas + Electric').click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);
    cy.get(pageElements.SelectButton).click();
    cy.get(pageElements.GoButton).click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);

    cy.get(pageElements.Bar).contains('Total: Jan 22 - Dec 22').click();
    cy.get(pageElements.Bar).contains('Base Year').click();
    cy.get(pageElements.Bar).contains('No data to display').should('exist');
  });

  it('BR-5: Verify Comparison Function and Multicurrency @T6281c25f', () => {
    cy.get(pageElements.AddMeter).click({ force: true });
    cy.get(pageElements.MeterGridSearch).click().type(UsnSeventh, { force: true });
    cy.get('.selectAll').click();
    cy.get(pageElements.MeterSelectButton).click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);
    chartCheck(pageElements.Bar, pageElements.BarLine);

    cy.get(pageElements.CurrencyDropdown).click();
    cy.get(pageElements.CurrencyList).contains('Euro (EUR)').click({ force: true });
    cy.intercept('/GetNewBenchmarkingDataReportForCostJson').as('GetBenchmarkingData');
    cy.get(pageElements.GoButton).click();
    cy.waitElementBecomesVisible(globalPageElements.PageLoader);

    cy.wait('@GetBenchmarkingData').should(({ response }) => {
      expect(response).not.to.be.undefined;
      expect(response).not.to.be.null;
      const firstEntry = response?.body.Data[0];

      expect(firstEntry.ReportCurrentUsage).to.be.a('number');
      expect(firstEntry.ReportCurrentUsage.toString()).to.be.not.empty;
    });

    cy.get(pageElements.Bar).contains('Cost (€)').should('be.visible');
  });
});
