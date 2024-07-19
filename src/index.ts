import { CSSResultGroup, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { styles } from './style';
import { DataDto, InverterModel, InverterSettings, sunsynkPowerFlowCardConfig } from './types';
import defaultConfig from './defaults';
import {
    CARD_VERSION,
    EDITOR_NAME,
    MAIN_NAME,
    valid3phase,
    validaux,
    validauxLoads,
    validGridConnected,
    validGridDisconnected,
    validLoadValues,
    validnonLoadValues,
} from './const';
import { localize } from './localize/localize';
import merge from 'lodash.merge';
import { Utils } from './helpers/utils';
import { compactCard } from './cards/compact-card';
import { globalData } from './helpers/globals';
import { InverterFactory } from './inverters/inverter-factory';
import { BatteryIconManager } from './helpers/battery-icon-manager';
import { convertToCustomEntity, CustomEntity } from './inverters/dto/custom-entity';
import { icons } from './helpers/icons';

console.groupCollapsed(
    `%c ⚡ POWER-FLOW-CARD by Molikk %c ${localize('common.version')}: ${CARD_VERSION} `,
    'color: orange; font-weight: bold; background: black',
    'color: white; font-weight: bold; background: dimgray',
);
console.log('Readme:', 'https://github.com/molikk/mlk-power-flow-card');
console.groupEnd();

@customElement(MAIN_NAME)
export class SunsynkPowerFlowCard extends LitElement {
    @property() public hass!: HomeAssistant;
    @property() private _config!: sunsynkPowerFlowCardConfig;
    @query('#grid-flow') gridFlow?: SVGSVGElement;
    @query('#grid1-flow') grid1Flow?: SVGSVGElement;
    @query('#solar-flow') solarFlow?: SVGSVGElement;
    @query('#pv1-flow') pv1Flow?: SVGSVGElement;
    @query('#pv2-flow') pv2Flow?: SVGSVGElement;
    @query('#pv3-flow') pv3Flow?: SVGSVGElement;
    @query('#pv4-flow') pv4Flow?: SVGSVGElement;
    @query('#pv5-flow') pv5Flow?: SVGSVGElement;
    @query('#battery-flow') batteryFlow?: SVGSVGElement;
    @query('#load-flow') loadFlow?: SVGSVGElement;
    @query('#aux-flow') auxFlow?: SVGSVGElement;
    @query('#ne-flow') neFlow?: SVGSVGElement;
    @query('#ne1-flow') ne1Flow?: SVGSVGElement;

    private durationPrev: { [name: string]: number } = {};
    private durationCur: { [name: string]: number } = {};

    static get styles(): CSSResultGroup {
        return styles;
    }

    public static async getConfigElement() {
        await import("./editor");
        return document.createElement(EDITOR_NAME) as LovelaceCardEditor;
    }

    static getStubConfig() {
        return {
            show_solar: true,
            battery: {
                energy: 0,
                shutdown_soc: 20,
                show_daily: true,
            },
            solar: {
                mppts: 2,
            },
            load: {
                show_daily: true,
            },
            grid: {
                show_daily_buy: true,
                show_daily_sell: false,
                show_nonessential: true,
            },
            entities: {
                use_timer_248: 'switch.sunsynk_toggle_system_timer',
                priority_load_243: 'switch.sunsynk_toggle_priority_load',
                inverter_voltage_154: 'sensor.sunsynk_inverter_voltage',
                load_frequency_192: 'sensor.sunsynk_load_frequency',
                inverter_current_164: 'sensor.sunsynk_inverter_current',
                inverter_power_175: 'sensor.sunsynk_inverter_power',
                grid_connected_status_194: 'binary_sensor.sunsynk_grid_connected_status',
                inverter_status_59: 'sensor.sunsynk_overall_state',
                day_battery_charge_70: 'sensor.sunsynk_day_battery_charge',
                day_battery_discharge_71: 'sensor.sunsynk_day_battery_discharge',
                battery_voltage_183: 'sensor.sunsynk_battery_voltage',
                battery_soc_184: 'sensor.sunsynk_battery_soc',
                battery_power_190: 'sensor.sunsynk_battery_power',
                battery_current_191: 'sensor.sunsynk_battery_current',
                grid_power_169: 'sensor.sunsynk_grid_power',
                day_grid_import_76: 'sensor.sunsynk_day_grid_import',
                day_grid_export_77: 'sensor.sunsynk_day_grid_export',
                grid_ct_power_172: 'sensor.sunsynk_grid_ct_power',
                day_load_energy_84: 'sensor.sunsynk_day_load_energy',
                essential_power: 'none',
                nonessential_power: 'none',
                aux_power_166: 'sensor.sunsynk_aux_power',
                day_pv_energy_108: 'sensor.sunsynk_day_pv_energy',
                pv1_power_186: 'sensor.sunsynk_pv1_power',
                pv2_power_187: 'sensor.sunsynk_pv2_power',
                pv1_voltage_109: 'sensor.sunsynk_pv1_voltage',
                pv1_current_110: 'sensor.sunsynk_pv1_current',
                pv2_voltage_111: 'sensor.sunsynk_pv2_voltage',
                pv2_current_112: 'sensor.sunsynk_pv2_current',
            },
        } as unknown as sunsynkPowerFlowCardConfig;
    }

    render() {
        globalData.hass = this.hass;
        const config = this._config;
        //Energy
        const stateDayBatteryDischarge = this.getEntity('entities.day_battery_discharge_71');
        const stateDayBatteryCharge = this.getEntity('entities.day_battery_charge_70');
        const stateDayLoadEnergy = this.getEntity('entities.day_load_energy_84');
        const stateDayGridImport = this.getEntity('entities.day_grid_import_76');

        const stateDayGridExport = this.getEntity('entities.day_grid_export_77');
        const stateDayAuxEnergy = this.getEntity('entities.day_aux_energy');

        //Inverter
        const stateInverterVoltage = this.getEntity('entities.inverter_voltage_154');
        const stateLoadFrequency = this.getEntity('entities.load_frequency_192');
        const stateInverterCurrent = this.getEntity('entities.inverter_current_164');
        const stateInverterStatus = this.getEntity('entities.inverter_status_59', {state: ''});
        const stateInverterPower = this.getEntity('entities.inverter_power_175');
        const statePriorityLoad = this.getEntity('entities.priority_load_243', {state: config.entities.priority_load_243?.toString() ?? 'false'});
        const stateUseTimer = this.getEntity('entities.use_timer_248', {state: config.entities.use_timer_248?.toString() ?? 'false'});
        const stateDCTransformerTemp = this.getEntity('entities.dc_transformer_temp_90', {state: ''});
        const stateRadiatorTemp = this.getEntity('entities.radiator_temp_91', {state: ''});
        const stateInverterVoltageL2 = this.getEntity('entities.inverter_voltage_L2', {state: ''});
        const stateInverterVoltageL3 = this.getEntity('entities.inverter_voltage_L3', {state: ''});
        const stateInverterCurrentL2 = this.getEntity('entities.inverter_current_L2', {state: ''});
        const stateInverterCurrentL3 = this.getEntity('entities.inverter_current_L3', {state: ''});
        const stateEnvironmentTemp = this.getEntity('entities.environment_temp', {state: ''});

        //Battery
        const stateBatteryVoltage = this.getEntity('entities.battery_voltage_183');
        const stateBatterySoc = this.getEntity('entities.battery_soc_184');
        const stateBatteryPower = this.getEntity('entities.battery_power_190');
        const stateBatteryCurrent = this.getEntity('entities.battery_current_191');
        const stateBatteryTemp = this.getEntity('entities.battery_temp_182', {state: ''});
        const stateBatteryStatus = this.getEntity('entities.battery_status', {state: ''});
        const stateBatteryCurrentDirection = this.getEntity('entities.battery_current_direction', {state: ''});
        const stateBatteryRatedCapacity = this.getEntity('entities.battery_rated_capacity', {state: ''});
        const stateShutdownSOC = this.getEntity('battery.shutdown_soc', {state: config.battery.shutdown_soc?.toString() ?? ''});
        const stateShutdownSOCOffGrid = this.getEntity('battery.shutdown_soc_offgrid', {state: config.battery.shutdown_soc_offgrid?.toString() ?? ''});
        const stateBatterySOH = this.getEntity('entities.battery_soh', {state: ''});

        //Load
        const stateEssentialPower = this.getEntity('entities.essential_power');
        const stateAuxPower = this.getEntity('entities.aux_power_166');
        const stateNonessentialPower = this.getEntity('entities.nonessential_power');
        const stateNonessentialLoad1 = this.getEntity('entities.non_essential_load1');
        const stateNonessentialLoad2 = this.getEntity('entities.non_essential_load2');
        const stateNonessentialLoad3 = this.getEntity('entities.non_essential_load3');
        const stateNonEssentialLoad1Extra = this.getEntity('entities.non_essential_load1_extra');
        const stateNonEssentialLoad2Extra = this.getEntity('entities.non_essential_load2_extra');
        const stateEssentialLoad1 = this.getEntity('entities.essential_load1');
        const stateEssentialLoad2 = this.getEntity('entities.essential_load2');
        const stateEssentialLoad3 = this.getEntity('entities.essential_load3');
        const stateEssentialLoad4 = this.getEntity('entities.essential_load4');
        const stateEssentialLoad5 = this.getEntity('entities.essential_load5');
        const stateEssentialLoad6 = this.getEntity('entities.essential_load6');
        const stateEssentialLoad7 = this.getEntity('entities.essential_load7');
        const stateEssentialLoad8 = this.getEntity('entities.essential_load8');
        const stateAuxConnectedStatus = this.getEntity('entities.aux_connected_status', {state: 'on'});
        const stateAuxLoad1 = this.getEntity('entities.aux_load1');
        const stateAuxLoad2 = this.getEntity('entities.aux_load2');
        const stateEssentialLoad1Extra = this.getEntity('entities.essential_load1_extra');
        const stateEssentialLoad2Extra = this.getEntity('entities.essential_load2_extra');
        const stateEssentialLoad3Extra = this.getEntity('entities.essential_load3_extra');
        const stateEssentialLoad4Extra = this.getEntity('entities.essential_load4_extra');
        const stateEssentialLoad5Extra = this.getEntity('entities.essential_load5_extra');
        const stateEssentialLoad6Extra = this.getEntity('entities.essential_load6_extra');
        const stateEssentialLoad7Extra = this.getEntity('entities.essential_load7_extra');
        const stateEssentialLoad8Extra = this.getEntity('entities.essential_load8_extra');
        const stateLoadPowerL1 = this.getEntity('entities.load_power_L1');
        const stateLoadPowerL2 = this.getEntity('entities.load_power_L2');
        const stateLoadPowerL3 = this.getEntity('entities.load_power_L3');
        const stateAuxLoad1Extra = this.getEntity('entities.aux_load1_extra');
        const stateAuxLoad2Extra = this.getEntity('entities.aux_load2_extra');

        //Grid
        const stateGridCTPower = this.getEntity('entities.grid_ct_power_172');
        const stateGridCTPowerL2 = this.getEntity('entities.grid_ct_power_L2');
        const stateGridCTPowerL3 = this.getEntity('entities.grid_ct_power_L3');
        const stateGridCTPowerTotal = this.getEntity('entities.grid_ct_power_total');
        const stateGridConnectedStatus = this.getEntity('entities.grid_connected_status_194', {state: 'on'});
        const stateGridPower = this.getEntity('entities.grid_power_169');
        const stateEnergyCostBuy = this.getEntity('entities.energy_cost_buy', {
            state: '',
            attributes: {unit_of_measurement: ''},
        });
        const stateEnergyCostSell = this.getEntity('entities.energy_cost_sell', {
            state: '',
            attributes: {unit_of_measurement: ''},
        });
        const stateGridVoltage = this.getEntity('entities.grid_voltage', null);
        const statePrepaidUnits = this.getEntity('entities.prepaid_units');
        const stateMaxSellPower = this.getEntity('entities.max_sell_power');

        //Solar
        const statePV1Voltage = this.getEntity('entities.pv1_voltage_109');
        const statePV1Current = this.getEntity('entities.pv1_current_110');
        const statePV2Voltage = this.getEntity('entities.pv2_voltage_111');
        const statePV2Current = this.getEntity('entities.pv2_current_112');
        const statePV3Voltage = this.getEntity('entities.pv3_voltage_113');
        const statePV3Current = this.getEntity('entities.pv3_current_114');
        const statePV4Voltage = this.getEntity('entities.pv4_voltage_115');
        const statePV4Current = this.getEntity('entities.pv4_current_116');
        const statePV5Voltage = this.getEntity('entities.pv5_voltage');
        const statePV5Current = this.getEntity('entities.pv5_current');
        const statePV1Power = this.getEntity('entities.pv1_power_186');
        const statePV2Power = this.getEntity('entities.pv2_power_187');
        const statePV3Power = this.getEntity('entities.pv3_power_188');
        const statePV4Power = this.getEntity('entities.pv4_power_189');
        const statePV5Power = this.getEntity('entities.pv5_power');
        const statePV1Energy = this.getEntity('entities.pv1_production');
        const statePV2Energy = this.getEntity('entities.pv2_production');
        const statePV3Energy = this.getEntity('entities.pv3_production');
        const statePV4Energy = this.getEntity('entities.pv4_production');
        const statePV5Energy = this.getEntity('entities.pv5_production');
        const stateSolarSell = this.getEntity('entities.solar_sell_247', {state: 'undefined'});
        const statePVTotal = this.getEntity('entities.pv_total');
        const stateDailyPVEnergy = this.getEntity('entities.day_pv_energy_108');
        const stateMonthlyPVEnergy = this.getEntity('entities.monthly_pv_generation');
        const stateYearlyPVEnergy = this.getEntity('entities.yearly_pv_generation');
        const stateTotalSolarGeneration = this.getEntity('entities.total_pv_generation');
        const stateRemainingSolar = this.getEntity('entities.remaining_solar');

        //Set defaults
        const {invert_aux} = config.load;
        const auxPower = stateAuxPower.toPower(invert_aux);

        const {invert_grid} = config.grid;
        const gridPower = stateGridCTPower.toPower(invert_grid);
        const gridPowerL2 = stateGridCTPowerL2.toPower(invert_grid);
        const gridPowerL3 = stateGridCTPowerL3.toPower(invert_grid);
        const gridPowerTotal = config.entities?.grid_ct_power_total
            ? stateGridCTPowerTotal.toPower(invert_grid)
            : gridPower + gridPowerL2 + gridPowerL3;

        const totalGridPower = config.inverter.three_phase ? gridPowerTotal : gridPower;

        const gridVoltage = !stateGridVoltage.isNaN() ? stateGridVoltage.toNum(0) : null;
        const batteryCurrentDirection = !stateBatteryCurrentDirection.isNaN() ? stateBatteryCurrentDirection.toNum(0) : null;
        const genericInverterImage = config.inverter?.modern;

        const decimalPlaces = config.decimal_places;
        const decimalPlacesEnergy = config.decimal_places_energy;

        const loadColour = this.colourConvert(config.load?.colour);
        const auxDynamicColour = this.calculateAuxLoadColour(stateAuxPower.toPower(false), Utils.toNum(config.load?.off_threshold, 0)) || loadColour;
        const auxOffColour = this.colourConvert(config.load?.aux_off_colour || auxDynamicColour);
        const auxDynamicColourLoad1 = this.calculateAuxLoadColour(stateAuxLoad1.toPower(false), Utils.toNum(config.load?.off_threshold, 0)) || loadColour;
        const auxDynamicColourLoad2 = this.calculateAuxLoadColour(stateAuxLoad2.toPower(false), Utils.toNum(config.load?.off_threshold, 0)) || loadColour;
        const dynamicColourEssentialLoad1 = this.calculateEssentialLoadColour(stateEssentialLoad1.toPower(false), Utils.toNum(config.load?.off_threshold, 0)) || loadColour;
        const dynamicColourEssentialLoad2 = this.calculateEssentialLoadColour(stateEssentialLoad2.toPower(false), Utils.toNum(config.load?.off_threshold, 0)) || loadColour;
        const dynamicColourEssentialLoad3 = this.calculateEssentialLoadColour(stateEssentialLoad3.toPower(false), Utils.toNum(config.load?.off_threshold, 0)) || loadColour;
        const dynamicColourEssentialLoad4 = this.calculateEssentialLoadColour(stateEssentialLoad4.toPower(false), Utils.toNum(config.load?.off_threshold, 0)) || loadColour;
        const dynamicColourEssentialLoad5 = this.calculateEssentialLoadColour(stateEssentialLoad5.toPower(false), Utils.toNum(config.load?.off_threshold, 0)) || loadColour;
        const dynamicColourEssentialLoad6 = this.calculateEssentialLoadColour(stateEssentialLoad6.toPower(false), Utils.toNum(config.load?.off_threshold, 0)) || loadColour;
        const dynamicColourEssentialLoad7 = this.calculateEssentialLoadColour(stateEssentialLoad7.toPower(false), Utils.toNum(config.load?.off_threshold, 0)) || loadColour;
        const dynamicColourEssentialLoad8 = this.calculateEssentialLoadColour(stateEssentialLoad8.toPower(false), Utils.toNum(config.load?.off_threshold, 0)) || loadColour;

        config.title_colour = this.colourConvert(config.title_colour);

        const loadShowDaily = config.load?.show_daily;
        const showNonessential = config.grid?.show_nonessential;
        let gridStatus = config.entities?.grid_connected_status_194 ? stateGridConnectedStatus.state : 'on';
        if (!validGridConnected.includes(gridStatus.toLowerCase()) && !validGridDisconnected.includes(gridStatus.toLowerCase())) {
            gridStatus = 'on';
        }

        const auxStatus = config.entities?.aux_connected_status ? stateAuxConnectedStatus.state : 'on';
        const loadFrequency = config.entities?.load_frequency_192 ? stateLoadFrequency.toNum(2) : 0;
        const inverterVoltage = config.entities?.inverter_voltage_154
            ? config.inverter.three_phase && (this.isLiteCard || this.isCompactCard)
                ? stateInverterVoltage.toNum(0)
                : stateInverterVoltage.toNum(1)
            : 0;
        const inverterVoltageL2 = config.entities?.inverter_voltage_L2
            ? config.inverter.three_phase && (this.isLiteCard || this.isCompactCard)
                ? stateInverterVoltageL2.toNum(0)
                : stateInverterVoltageL2.toNum(1)
            : '';
        const inverterVoltageL3 = config.entities?.inverter_voltage_L3
            ? config.inverter.three_phase && (this.isLiteCard || this.isCompactCard)
                ? stateInverterVoltageL3.toNum(0)
                : stateInverterVoltageL3.toNum(1)
            : '';
        const inverterCurrent = config.entities?.inverter_current_164
            ? stateInverterCurrent.toNum(1)
            : 0;
        const inverterCurrentL2 = config.entities?.inverter_current_L2
            ? stateInverterCurrentL2.toNum(1)
            : '';
        const inverterCurrentL3 = config.entities?.inverter_current_L3
            ? stateInverterCurrentL3.toNum(1)
            : '';
        const batteryVoltage = config.entities?.battery_voltage_183 ? stateBatteryVoltage.toNum(1) : 0;
        const autoScaledInverterPower = config.entities?.inverter_power_175
            ? stateInverterPower.toPower()
            : 0;
        const autoScaledGridPower = config.entities?.grid_power_169
            ? stateGridPower.toPower()
            : 0;

        const {invert_load} = config.load;
        const loadPowerL1 = config.entities?.load_power_L1
            ? stateLoadPowerL1.toPower(invert_load)
            : '';
        const loadPowerL2 = config.entities?.load_power_L2
            ? stateLoadPowerL2.toPower(invert_load)
            : '';
        const loadPowerL3 = config.entities?.load_power_L3
            ? stateLoadPowerL3.toPower(invert_load)
            : '';

        const gridImportColour = this.colourConvert(config.grid?.colour);
        const gridExportColour = this.colourConvert(config.grid?.export_colour || gridImportColour);
        const noGridColour = this.colourConvert(config.grid?.no_grid_colour || gridImportColour);

        let gridColour: string;
        switch (true) {
            case totalGridPower < 0:
                gridColour = gridExportColour;
                break;
            case totalGridPower >= 0 && totalGridPower <= Utils.toNum(config.grid?.off_threshold, 0):
                gridColour = noGridColour;
                break;
            default:
                gridColour = gridImportColour;
                break;
        }

        const dynamicColourNonEssentialLoad1 = Math.abs(stateNonessentialLoad1.toPower(false)) > Utils.toNum(config.grid?.off_threshold, 0)
            ? gridColour
            : 'grey';
        const dynamicColourNonEssentialLoad2 = Math.abs(stateNonessentialLoad2.toPower(false)) > Utils.toNum(config.grid?.off_threshold, 0)
            ? gridColour
            : 'grey';
        const dynamicColourNonEssentialLoad3 = Math.abs(stateNonessentialLoad3.toPower(false)) > Utils.toNum(config.grid?.off_threshold, 0)
            ? gridColour
            : 'grey';

        const gridOffColour = this.colourConvert(config.grid?.grid_off_colour || gridColour);

        let nonessentialLoads = config.grid?.additional_loads;
        if (!validnonLoadValues.includes(nonessentialLoads)) {
            nonessentialLoads = 0;
        }

        const gridShowDailyBuy = config.grid?.show_daily_buy;
        const gridShowDailySell = config.grid?.show_daily_sell;

        const batteryColourConfig = this.colourConvert(config.battery?.colour);
        const batteryChargeColour = this.colourConvert(config.battery?.charge_colour || batteryColourConfig);
        const batteryShowDaily = config.battery?.show_daily;

        let showAux = config.load?.show_aux;
        if (!validaux.includes(showAux)) {
            showAux = false;
        }

        const showDailyAux = config.load?.show_daily_aux;

        let additionalLoad = config.load?.additional_loads;
        if (!validLoadValues.includes(additionalLoad)) {
            additionalLoad = 0;
        }

        let additionalAuxLoad = config.load?.aux_loads;
        if (!validauxLoads.includes(additionalAuxLoad)) {
            additionalAuxLoad = 0;
        }

        const auxType = config.load?.aux_type; //valid options are gen,inverter, default, gen, boiler, pump, aircon

        //Icons
        const iconEssentialLoad1 = this.getEntity('load.load1_icon', {state: config.load?.load1_icon?.toString() ?? ''}).state;
        const iconEssentialLoad2 = this.getEntity('load.load2_icon', {state: config.load?.load2_icon?.toString() ?? ''}).state;
        const iconEssentialLoad3 = this.getEntity('load.load3_icon', {state: config.load?.load3_icon?.toString() ?? ''}).state;
        const iconEssentialLoad4 = this.getEntity('load.load4_icon', {state: config.load?.load4_icon?.toString() ?? ''}).state;
        const iconEssentialLoad5 = this.getEntity('load.load5_icon', {state: config.load?.load5_icon?.toString() ?? ''}).state;
        const iconEssentialLoad6 = this.getEntity('load.load6_icon', {state: config.load?.load6_icon?.toString() ?? ''}).state;
        const iconEssentialLoad7 = this.getEntity('load.load7_icon', {state: config.load?.load7_icon?.toString() ?? ''}).state;
        const iconEssentialLoad8 = this.getEntity('load.load8_icon', {state: config.load?.load8_icon?.toString() ?? ''}).state;
        const iconAuxLoad1 = this.getEntity('load.aux_load1_icon', {state: config.load?.aux_load1_icon?.toString() ?? ''}).state;
        const iconAuxLoad2 = this.getEntity('load.aux_load2_icon', {state: config.load?.aux_load2_icon?.toString() ?? ''}).state;
        const nonessentialIcon = this.getEntity('grid.nonessential_icon', {state: config.grid?.nonessential_icon?.toString() ?? ''}).state;
        const iconNonessentialLoad1 = this.getEntity('grid.load1_icon', {state: config.grid?.load1_icon?.toString() ?? ''}).state;
        const iconNonessentialLoad2 = this.getEntity('grid.load2_icon', {state: config.grid?.load2_icon?.toString() ?? ''}).state;
        const iconNonessentialLoad3 = this.getEntity('grid.load3_icon', {state: config.grid?.load3_icon?.toString() ?? ''}).state;
        const iconGridImport = this.getEntity('grid.import_icon', {state: config.grid?.import_icon?.toString() ?? ''}).state;
        const iconGridDisconnected = this.getEntity('grid.disconnected_icon', {state: config.grid?.disconnected_icon?.toString() ?? ''}).state;
        const iconGridExport = this.getEntity('grid.export_icon', {state: config.grid?.export_icon?.toString() ?? ''}).state;

        const largeFont = config.large_font;
        const panelMode = config.panel_mode;
        const inverterColour = this.colourConvert(config.inverter?.colour);
        const enableAutarky = config.inverter?.autarky;
        const enableTimer = !config.entities.use_timer_248 ? false : stateUseTimer.state;
        const priorityLoad = !config.entities.priority_load_243 ? false : statePriorityLoad.state;
        let batteryPower = stateBatteryPower.toPower(config.battery?.invert_power);

        const cardHeight = this.getEntity('card_height', {state: config.card_height?.toString() ?? ''}).state;
        const cardWidth = this.getEntity('card_width', {state: config.card_width?.toString() ?? ''}).state;

        const energy_cost_decimals = config.grid?.energy_cost_decimals === 0 ? 0 : config.grid?.energy_cost_decimals || 2;
        const energyCost =
            totalGridPower >= 0
                ? stateEnergyCostBuy.toNum(energy_cost_decimals)
                : stateEnergyCostSell.toNum(energy_cost_decimals);

        let inverterModel = InverterModel.Sunsynk;

        // Check if the userInputModel is a valid inverter model
        if (Object.values(InverterModel).includes(config.inverter.model)) {
            inverterModel = config.inverter.model as InverterModel;
        }

        let inverterImg = '';
        const inverterSettings = InverterFactory.getInstance(inverterModel);
        if (!genericInverterImage) {
            inverterImg = inverterSettings.image;
        }


        let compactMode = false;
        if (this.isCompactCard) {
            compactMode = true;
        }
        //totalSolar = pv1_power_186 + pv2_power_187 + pv3_power_188 + pv4_power_189 + pv5_power

        const pv1PowerWatts = statePV1Power.toPower();
        const pv2PowerWatts = statePV2Power.toPower();
        const pv3PowerWatts = statePV3Power.toPower();
        const pv4PowerWatts = statePV4Power.toPower();
        const pv5PowerWatts = statePV5Power.toPower();

        const totalSolar = pv1PowerWatts + pv2PowerWatts + pv3PowerWatts + pv4PowerWatts + pv5PowerWatts;
        const totalPV = config.entities?.pv_total ? statePVTotal.toNum() : totalSolar;

        const solarColour =
            !config.solar.dynamic_colour
                ? this.colourConvert(config.solar?.colour)
                : Utils.toNum(totalPV, 0) > Utils.toNum(config.solar?.off_threshold, 0)
                    ? this.colourConvert(config.solar?.colour)
                    : 'grey';

        //nonessentialPower = grid_ct_power_172 - grid_power_169

        let threePhase = config.inverter?.three_phase;
        if (!valid3phase.includes(threePhase)) {
            threePhase = false;
        }

        let essentialPower: number;
        let nonessentialPower: number;
        const {essential_power, nonessential_power} = config.entities;

        if (threePhase === false) {
            nonessentialPower =
                nonessential_power === 'none' || !nonessential_power
                    ? gridPower - autoScaledGridPower
                    : stateNonessentialPower.toPower();
        } else {
            nonessentialPower =
                nonessential_power === 'none' || !nonessential_power
                    ? gridPower
                    + gridPowerL2
                    + gridPowerL3
                    - autoScaledGridPower
                    : stateNonessentialPower.toPower();
        }

        //essentialPower = inverter_power_175 + grid_power_169 - aux_power_166 or  totalPV + battery_power_190 + grid_power_169 - aux_power_166
        essentialPower =
            essential_power === 'none' || !essential_power
                ? threePhase === true && config.entities.load_power_L1 && config.entities.load_power_L2 && config.entities.load_power_L3
                    ? Number(loadPowerL1) + Number(loadPowerL2) + Number(loadPowerL3)
                    : (config.entities.inverter_power_175 ? autoScaledInverterPower + autoScaledGridPower - auxPower : totalPV + batteryPower + autoScaledGridPower - auxPower)
                : stateEssentialPower.toPower(invert_load);

        //Timer entities
        const prog1 = {
            time: this.getEntity('entities.prog1_time', {state: config.entities.prog1_time ?? ''}),
            capacity: this.getEntity('entities.prog1_capacity', {state: config.entities.prog1_capacity ?? ''}),
            charge: this.getEntity('entities.prog1_charge', {state: config.entities.prog1_charge ?? ''}),
        };
        const prog2 = {
            time: this.getEntity('entities.prog2_time', {state: config.entities.prog2_time ?? ''}),
            capacity: this.getEntity('entities.prog2_capacity', {state: config.entities.prog2_capacity ?? ''}),
            charge: this.getEntity('entities.prog2_charge', {state: config.entities.prog2_charge ?? ''}),
        };
        const prog3 = {
            time: this.getEntity('entities.prog3_time', {state: config.entities.prog3_time ?? ''}),
            capacity: this.getEntity('entities.prog3_capacity', {state: config.entities.prog3_capacity ?? ''}),
            charge: this.getEntity('entities.prog3_charge', {state: config.entities.prog3_charge ?? ''}),
        };
        const prog4 = {
            time: this.getEntity('entities.prog4_time', {state: config.entities.prog4_time ?? ''}),
            capacity: this.getEntity('entities.prog4_capacity', {state: config.entities.prog4_capacity ?? ''}),
            charge: this.getEntity('entities.prog4_charge', {state: config.entities.prog4_charge ?? ''}),
        };
        const prog5 = {
            time: this.getEntity('entities.prog5_time', {state: config.entities.prog5_time ?? ''}),
            capacity: this.getEntity('entities.prog5_capacity', {state: config.entities.prog5_capacity ?? ''}),
            charge: this.getEntity('entities.prog5_charge', {state: config.entities.prog5_charge ?? ''}),
        };
        const prog6 = {
            time: this.getEntity('entities.prog6_time', {state: config.entities.prog6_time ?? ''}),
            capacity: this.getEntity('entities.prog6_capacity', {state: config.entities.prog6_capacity ?? ''}),
            charge: this.getEntity('entities.prog6_charge', {state: config.entities.prog6_charge ?? ''}),
        };


        const shutdownOffGrid = stateShutdownSOCOffGrid.toNum();
        const batteryShutdown = stateShutdownSOC.toNum();

        const inverterProg: InverterSettings = {
            capacity: batteryShutdown,
            entityID: '',
        };


        switch (true) {
            case stateUseTimer.state === 'off':
            case !enableTimer:
            case !config.entities.prog1_time:
            case !config.entities.prog2_time:
            case !config.entities.prog3_time:
            case !config.entities.prog4_time:
            case !config.entities.prog5_time:
            case !config.entities.prog6_time:
                inverterProg.show = false;
                break;
            default:
                inverterProg.show = true;

                const timer_now = new Date(); // Create a new Date object representing the current time

                const progTimes: Date[] = [];

                [prog1, prog2, prog3, prog4, prog5, prog6].forEach((prog, index) => {
                    const [hours, minutes] = prog.time.state.split(':').map(item => parseInt(item, 10));
                    progTimes[index] = new Date(timer_now.getTime());
                    progTimes[index].setHours(hours);
                    progTimes[index].setMinutes(minutes);
                });

                const [prog_time1, prog_time2, prog_time3, prog_time4, prog_time5, prog_time6] = progTimes;

                if (timer_now >= prog_time6 || timer_now < prog_time1) {
                    assignInverterProgValues(prog6, config.entities.prog6_charge);
                } else if (timer_now >= prog_time1 && timer_now < prog_time2) {
                    assignInverterProgValues(prog1, config.entities.prog1_charge);
                } else if (timer_now >= prog_time2 && timer_now < prog_time3) {
                    assignInverterProgValues(prog2, config.entities.prog2_charge);
                } else if (timer_now >= prog_time3 && timer_now < prog_time4) {
                    assignInverterProgValues(prog3, config.entities.prog3_charge);
                } else if (timer_now >= prog_time4 && timer_now < prog_time5) {
                    assignInverterProgValues(prog4, config.entities.prog4_charge);
                } else if (timer_now >= prog_time5 && timer_now < prog_time6) {
                    assignInverterProgValues(prog5, config.entities.prog5_charge);
                }

            function assignInverterProgValues(prog, entityID) {
                if (prog.charge.state === 'No Grid or Gen' || prog.charge.state === '0' || prog.charge.state === 'off') {
                    inverterProg.charge = 'none';
                } else {
                    inverterProg.charge = 'both';
                }
                inverterProg.capacity = parseInt(prog.capacity.state);
                inverterProg.entityID = entityID;
            }

                break;
        }

        if (gridVoltage != null && !Number.isNaN(gridVoltage) && inverterModel == InverterModel.Solis) {
            // the grid voltage can sometimes read decimals like 0.1, in cases where there is power trickled back.
            gridStatus = gridVoltage > 50 ? 'on' : 'off';
        }

        if (batteryCurrentDirection != null) {
            if (inverterModel == InverterModel.Solis && batteryCurrentDirection === 0) {
                batteryPower = -batteryPower;
            }
        }

        //calculate battery capacity
        let batteryCapacity: number = 0;
        if (config.show_battery) {
            switch (true) {
                case !inverterProg.show:
                    if (batteryPower > 0) {
                        if (
                            (gridStatus === 'on' || gridStatus === '1' || gridStatus.toLowerCase() === 'on-grid') &&
                            !inverterProg.show
                        ) {
                            batteryCapacity = batteryShutdown;
                        } else if (
                            (gridStatus === 'off' || gridStatus === '0' || gridStatus.toLowerCase() === 'off-grid') &&
                            stateShutdownSOCOffGrid.notEmpty() &&
                            !inverterProg.show
                        ) {
                            batteryCapacity = shutdownOffGrid;
                        } else {
                            batteryCapacity = batteryShutdown;
                        }
                    } else if (batteryPower < 0) {
                        batteryCapacity = 100;
                    }
                    break;

                default:
                    batteryCapacity = inverterSettings.getBatteryCapacity(batteryPower, gridStatus, batteryShutdown, inverterProg, stateBatterySoc);
            }
        }

        //calculate remaining battery time to charge or discharge
        let totalSeconds = 0;
        let formattedResultTime = '';
        let batteryDuration = '';

        const battenergy = this.getEntity('battery.energy', {state: config.battery.energy?.toString() ?? ''});
        let batteryEnergy = battenergy.toPower(false);
        if (batteryVoltage && stateBatteryRatedCapacity.notEmpty()) {
            batteryEnergy = Utils.toNum(batteryVoltage * stateBatteryRatedCapacity.toNum(0), 0)
        }

        if (config.show_battery || batteryEnergy !== 0) {
            if (batteryPower === 0) {
                totalSeconds = ((stateBatterySoc.toNum() - batteryShutdown) / 100) * batteryEnergy * 60 * 60;
            } else if (batteryPower > 0) {
                totalSeconds =
                    ((((stateBatterySoc.toNum() - batteryCapacity) / 100) * batteryEnergy) / batteryPower) * 60 * 60;
            } else if (batteryPower < 0) {
                totalSeconds =
                    ((((batteryCapacity - stateBatterySoc.toNum(0)) / 100) * batteryEnergy) / batteryPower) * 60 * 60 * -1;
            }
            const currentTime = new Date(); // Create a new Date object representing the current time
            const durationMilliseconds = totalSeconds * 1000; // Convert the duration to milliseconds
            const resultTime = new Date(currentTime.getTime() + durationMilliseconds); // Add the duration in milliseconds
            const resultHours = resultTime.getHours(); // Get the hours component of the resulting time
            const resultMinutes = resultTime.getMinutes(); // Get the minutes component of the resulting time
            const formattedMinutes = resultMinutes.toString().padStart(2, '0');
            const formattedHours = resultHours.toString().padStart(2, '0');
            formattedResultTime = `${formattedHours}:${formattedMinutes}`;

            const days = Math.floor(totalSeconds / (60 * 60 * 24));
            const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
            const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
            if (days > 0) {
                batteryDuration += `${days}${localize('common.days')} `;
            }
            if (hours > 0) {
                const formattedHours = (days > 0 && hours < 10) ? `0${hours}` : `${hours}`;
                batteryDuration += `${formattedHours}${localize('common.hrs')} `;
            }
            batteryDuration += `${minutes}${localize('common.min')}`;
        }

        const isFloating =
            -2 <= stateBatteryCurrent.toNum(0) && stateBatteryCurrent.toNum(0) <= 2 && stateBatterySoc.toNum(0) >= 99;

        // Determine battery colours
        let batteryColour: string;
        if (batteryPower < 0 && !isFloating) {
            batteryColour = batteryChargeColour;
        } else {
            batteryColour = batteryColourConfig;
        }

        //Set Inverter Status Message and dot
        let inverterStateColour = '';
        let inverterStateMsg = '';
        let inverterState = stateInverterStatus.state as any;

        let found = false;

        /**
         * Status can be returned as decimals "3.0", so this is just to change it to an int
         */
        if (inverterModel == InverterModel.Solis) {
            inverterState = !stateInverterStatus.isNaN() ? stateInverterStatus.toNum(0).toString() : stateInverterStatus.toString();
        }

        const typeStatusGroups = inverterSettings.statusGroups;
        if (typeStatusGroups)
            for (const groupKey of Object.keys(typeStatusGroups)) {
                const info = typeStatusGroups[groupKey];
                const {states, color, message} = info;
                if (states.includes(inverterState.toLowerCase())) {
                    inverterStateColour = color;
                    inverterStateMsg = message;
                    found = true;
                    break;
                }
            }

        if (!found) {
            if (config.entities?.inverter_status_59 === 'none' || !config.entities?.inverter_status_59) {
                inverterStateColour = 'transparent';
                inverterStateMsg = '';
            } else {
                inverterStateColour = 'transparent';
                inverterStateMsg = 'Status';
            }
        }

        //Set Battery Status Message and dot for goodwe
        let batteryStateColour = 'transparent';
        let batteryStateMsg = '';
        if ([InverterModel.GoodweGridMode, InverterModel.Goodwe, InverterModel.Huawei]
            .includes(inverterModel)) {
            const batStatusGroups = inverterSettings.batteryStatusGroups;

            if (batStatusGroups)
                for (const groupKey of Object.keys(batStatusGroups)) {
                    const info = batStatusGroups[groupKey];
                    const {states, color, message} = info;
                    if (states.includes(stateBatteryStatus.state.toLowerCase())) {
                        batteryStateColour = color;
                        batteryStateMsg = message;
                        found = true;
                        break;
                    }
                }
            if (!found) {
                if (config.entities?.battery_status === 'none' || !config.entities?.battery_status) {
                    batteryStateColour = 'transparent';
                    batteryStateMsg = '';
                } else {
                    batteryStateColour = 'transparent';
                    batteryStateMsg = 'Status';
                }
            }
        }

        //Autarky in Percent = Home Production / Home Consumption
        //Ratio in Percent = Home Consumption / Home Production
        const productionEnergy = stateDailyPVEnergy.toNum() + stateDayBatteryDischarge.toNum();
        const consumptionEnergy = stateDayLoadEnergy.toNum() + stateDayBatteryCharge.toNum();
        const autarkyEnergy = consumptionEnergy != 0 ? Math.max(Math.min(Math.round((productionEnergy * 100) / consumptionEnergy), 100), 0) : 0;
        const ratioEnergy = productionEnergy != 0 ? Math.max(Math.min(Math.round((consumptionEnergy * 100) / productionEnergy), 100), 0) : 0;

        const productionPower =
            totalPV +
            Utils.toNum(`${batteryPower > 0 ? batteryPower : 0}`) +
            Utils.toNum(`${auxPower < 0 ? auxPower * -1 : 0}`);
        //console.log(`Production Data`);
        //console.log(`P_Solar Power:${totalPV}`);
        //console.log(`P_Battery Power:${Utils.toNum(`${batteryPower > 0 ? batteryPower : 0}`)}`);
        //console.log(`P_Aux Power:${Utils.toNum(`${auxPower < 0 ? auxPower * -1 : 0}`)}`);
        //console.log(`Production Total:${productionPower}`);

        const consumptionPower =
            essentialPower +
            Math.max(nonessentialPower, 0) +
            Utils.toNum(`${auxPower > 0 ? auxPower : 0}`) +
            Utils.toNum(`${batteryPower < 0 ? batteryPower * -1 : 0}`);
        //console.log(`Consumption Data`);
        //console.log(`C_Essential Power:${essentialPower}`);
        //console.log(`C_NonEssential Power:${nonessentialPower}`);
        //console.log(`C_Battery Power:${Utils.toNum(`${batteryPower < 0 ? batteryPower * -1 : 0}`)}`);
        //console.log(`C_Aux Power:${Utils.toNum(`${auxPower > 0 ? auxPower : 0}`)}`);
        //console.log(`C_Consumption Total:${consumptionPower}`);

        const autarkyPower = consumptionPower != 0 ? Math.max(Math.min(Math.round((productionPower * 100) / consumptionPower), 100), 0) : 0;
        const ratioPower = productionPower != 0 ? Math.max(Math.min(Math.round((consumptionPower * 100) / productionPower), 100), 0) : 0;

        const maxLineWidth = (Utils.toNum(config.max_line_width) < 1 ? 1 : config.max_line_width) - 1;
        const minLineWidth = Utils.toNum(config.min_line_width) || 1;

        const fullProductionEnergy = stateDailyPVEnergy.toNum() + stateDayBatteryDischarge.toNum() + stateDayGridImport.toNum();
        const autarkyAuto = productionEnergy != 0 ? Math.max(Math.min(Math.round(( 1000 * consumptionEnergy) / productionEnergy) / 10, 100), 0) : 0;
        const autarkySelf = fullProductionEnergy != 0 ? Math.max(Math.min(Math.round(( 1000 * productionEnergy) / fullProductionEnergy) / 10, 100), 0) : 0;

        const batteryMaxPower = this.getEntity('battery.max_power', {state: config.battery.max_power?.toString() ?? ''});
        const BattMaxPower = batteryMaxPower.toNum(0);
        const solarMaxPower = this.getEntity('solar.max_power', {state: config.solar.max_power?.toString() ?? ''});
        const loadMaxPower = this.getEntity('load.max_power', {state: config.load.max_power?.toString() ?? ''});
        const gridMaxPower = this.getEntity('grid.max_power', {state: config.grid.max_power?.toString() ?? ''});

        //Calculate line width depending on power usage
        const pv1LineWidth = !config.solar.max_power ? minLineWidth : this.dynamicLineWidth(pv1PowerWatts, (solarMaxPower.toNum() || pv1PowerWatts), maxLineWidth, minLineWidth);
        const pv2LineWidth = !config.solar.max_power ? minLineWidth : this.dynamicLineWidth(pv2PowerWatts, (solarMaxPower.toNum() || pv2PowerWatts), maxLineWidth, minLineWidth);
        const pv3LineWidth = !config.solar.max_power ? minLineWidth : this.dynamicLineWidth(pv3PowerWatts, (solarMaxPower.toNum() || pv3PowerWatts), maxLineWidth, minLineWidth);
        const pv4LineWidth = !config.solar.max_power ? minLineWidth : this.dynamicLineWidth(pv4PowerWatts, (solarMaxPower.toNum() || pv4PowerWatts), maxLineWidth, minLineWidth);
        const pv5LineWidth = !config.solar.max_power ? minLineWidth : this.dynamicLineWidth(pv5PowerWatts, (solarMaxPower.toNum() || pv5PowerWatts), maxLineWidth, minLineWidth);
        const batLineWidth = !config.battery.max_power ? minLineWidth : this.dynamicLineWidth(Math.abs(batteryPower), (BattMaxPower || Math.abs(batteryPower)), maxLineWidth, minLineWidth);
        const loadLineWidth = !config.load.max_power ? minLineWidth : this.dynamicLineWidth(Math.abs(essentialPower), (loadMaxPower.toNum() || Math.abs(essentialPower)), maxLineWidth, minLineWidth);
        const auxLineWidth = !config.load.max_power ? minLineWidth : this.dynamicLineWidth(Math.abs(auxPower), (loadMaxPower.toNum() || Math.abs(auxPower)), maxLineWidth, minLineWidth);
        const gridLineWidth = !config.grid.max_power ? minLineWidth : this.dynamicLineWidth(Math.abs(totalGridPower), (gridMaxPower.toNum() || Math.abs(totalGridPower)), maxLineWidth, minLineWidth);
        const grid169LineWidth = !config.grid.max_power ? minLineWidth : this.dynamicLineWidth(Math.abs(autoScaledGridPower), (gridMaxPower.toNum() || Math.abs(autoScaledGridPower)), maxLineWidth, minLineWidth);
        const nonessLineWidth = !config.grid.max_power ? minLineWidth : this.dynamicLineWidth(Math.abs(nonessentialPower), (gridMaxPower.toNum() || Math.abs(nonessentialPower)), maxLineWidth, minLineWidth);
        const solarLineWidth = !config.solar.max_power ? minLineWidth : this.dynamicLineWidth(totalPV, (solarMaxPower.toNum() || totalPV), maxLineWidth, minLineWidth);

        //Calculate power use animation speeds depending on Inverter size
        if (config && config.solar && config.solar.animation_speed) {
            const speed =
                config.solar.animation_speed -
                (config.solar.animation_speed - 1) * (totalPV / (solarMaxPower.toNum() || totalPV));
            this.changeAnimationSpeed(`solar`, speed);
        }

        if (config && config.solar && config.solar.animation_speed) {
            const speed =
                config.solar.animation_speed -
                (config.solar.animation_speed - 1) *
                (pv1PowerWatts / (solarMaxPower.toNum() || pv1PowerWatts));
            this.changeAnimationSpeed(`pv1`, speed);
        }

        if (config && config.solar && config.solar.animation_speed) {
            const speed =
                config.solar.animation_speed -
                (config.solar.animation_speed - 1) *
                (pv2PowerWatts / (solarMaxPower.toNum() || pv2PowerWatts));
            this.changeAnimationSpeed(`pv2`, speed);
        }

        if (config && config.solar && config.solar.animation_speed) {
            const speed =
                config.solar.animation_speed -
                (config.solar.animation_speed - 1) *
                (pv3PowerWatts / (solarMaxPower.toNum() || pv3PowerWatts));
            this.changeAnimationSpeed(`pv3`, speed);
        }

        if (config && config.solar && config.solar.animation_speed) {
            const speed =
                config.solar.animation_speed -
                (config.solar.animation_speed - 1) *
                (pv4PowerWatts / (solarMaxPower.toNum() || pv4PowerWatts));
            this.changeAnimationSpeed(`pv4`, speed);
        }

        if (config && config.solar && config.solar.animation_speed) {
            const speed =
                config.solar.animation_speed -
                (config.solar.animation_speed - 1) *
                (pv5PowerWatts / (solarMaxPower.toNum() || pv5PowerWatts));
            this.changeAnimationSpeed(`pv5`, speed);
        }

        if (config && config.battery && config.battery.animation_speed) {
            const speed =
                config.battery.animation_speed -
                (config.battery.animation_speed - 1) *
                (Math.abs(batteryPower) / (BattMaxPower || Math.abs(batteryPower)));
            this.changeAnimationSpeed(`battery`, speed);
        }

        if (config && config.load && config.load.animation_speed) {
            const speed =
                config.load.animation_speed -
                (config.load.animation_speed - 1) * (Math.abs(essentialPower) / (loadMaxPower.toNum() || Math.abs(essentialPower)));
            this.changeAnimationSpeed(`load`, speed);
            this.changeAnimationSpeed(`load1`, speed);
        }

        if (config && config.load && config.load.animation_speed) {
            const speed =
                config.load.animation_speed -
                (config.load.animation_speed - 1) * (Math.abs(auxPower) / (loadMaxPower.toNum() || Math.abs(auxPower)));
            this.changeAnimationSpeed(`aux`, speed);
            this.changeAnimationSpeed(`aux1`, speed);
        }

        if (config && config.grid && config.grid.animation_speed) {
            const speed =
                config.grid.animation_speed -
                (config.grid.animation_speed - 1) *
                (Math.abs(totalGridPower) / (gridMaxPower.toNum() || Math.abs(totalGridPower)));
            this.changeAnimationSpeed(`grid1`, speed);
            this.changeAnimationSpeed(`grid`, speed);
            this.changeAnimationSpeed(`grid2`, speed);
        }

        if (config && config.grid && config.grid.animation_speed) {
            const speed =
                config.grid.animation_speed -
                (config.grid.animation_speed - 1) *
                (Math.abs(nonessentialPower) / (gridMaxPower.toNum() || Math.abs(nonessentialPower)));
            this.changeAnimationSpeed(`ne`, speed);
        }

        //Calculate dynamic colour for load icon based on the contribution of the power source (battery, grid, solar) supplying the load
        const pvPercentageRaw = totalPV === 0
            ? 0
            : priorityLoad === 'off' || !priorityLoad
                ? batteryPower > 0
                    ? (totalPV / (threePhase ? essentialPower + Math.max(auxPower, 0) : essentialPower)) * 100
                    : ((totalPV - Math.abs(batteryPower)) / (threePhase ? essentialPower + Math.max(auxPower, 0) : essentialPower)) * 100
                : (totalPV / (threePhase ? essentialPower + Math.max(auxPower, 0) : essentialPower)) * 100;
        const batteryPercentageRaw = batteryPower <= 0 ? 0 : (Math.abs(batteryPower) / (threePhase ? essentialPower + Math.max(auxPower, 0) : essentialPower)) * 100;

        //console.log(`${pvPercentageRaw} % RAW PV to load, ${batteryPercentageRaw} % RAW Bat to load`);

        // Normalize percentages
        const totalPercentage = pvPercentageRaw + batteryPercentageRaw;
        const normalizedPvPercentage = totalPercentage === 0 ? 0 : (pvPercentageRaw / totalPercentage) * 100;
        const normalizedBatteryPercentage = totalPercentage === 0 ? 0 : (batteryPercentageRaw / totalPercentage) * 100;

        //console.log(`${normalizedPvPercentage} % normalizedPVPercentage to load, ${normalizedBatteryPercentage} % normalizedBatteryPercentage to load`);

        let pvPercentage = 0;
        let batteryPercentage = 0;
        let gridPercentage = 0;
        if (totalPercentage > 100) {
            pvPercentage = Utils.toNum(normalizedPvPercentage, 0);
            batteryPercentage = Utils.toNum(normalizedBatteryPercentage, 0);
        } else {
            pvPercentage = Utils.toNum(Math.min(pvPercentageRaw, 100), 0);
            batteryPercentage = Utils.toNum(Math.min(batteryPercentageRaw, 100), 0);
            gridPercentage = 100 - (pvPercentage + batteryPercentage);
        }

        //console.log(`${pvPercentage} % PVPercentage, ${batteryPercentage} % BatteryPercentage, ${gridPercentage} % GridPercentage`);

        //Calculate dynamic colour for battery icon based on the contribution of the power source (grid, solar) supplying the battery
        const pvPercentageRawBat = (totalPV === 0 || batteryPower >= 0)
            ? 0
            : priorityLoad === 'off' || !priorityLoad
                ? (totalPV / Math.abs(batteryPower)) * 100
                : ((totalPV - essentialPower) / Math.abs(batteryPower)) * 100;
        const gridPercentageRawBat = (batteryPower >= 0 || totalGridPower <= 0)
            ? 0
            : priorityLoad === 'on'
                ? (totalPV - essentialPower) >= Math.abs(batteryPower)
                    ? 0
                    : ((totalGridPower - (Math.max((essentialPower - totalPV), 0))) / Math.abs(batteryPower)) * 100
                : totalPV >= Math.abs(batteryPower)
                    ? 0
                    : ((Math.abs(batteryPower) - totalPV) / Math.abs(batteryPower)) * 100;

        //console.log(`${pvPercentageRawBat} % RAW PV to charge battery, ${gridPercentageRawBat} % RAW Grid to charge battery`);
        // Normalize percentages
        const totalPercentageBat = pvPercentageRawBat + gridPercentageRawBat;
        const normalizedPvPercentage_bat = totalPercentageBat === 0 ? 0 : (pvPercentageRawBat / totalPercentageBat) * 100;
        const normalizedGridPercentage = totalPercentageBat === 0 ? 0 : (gridPercentageRawBat / totalPercentageBat) * 100;

        let pvPercentageBat = 0;
        let gridPercentageBat = 0;
        if (totalPercentageBat > 100) {
            pvPercentageBat = Utils.toNum(normalizedPvPercentage_bat, 0);
            gridPercentageBat = Utils.toNum(normalizedGridPercentage, 0);
        } else {
            pvPercentageBat = Utils.toNum(Math.min(pvPercentageRawBat, 100), 0);
            gridPercentageBat = Utils.toNum(Math.min(gridPercentageRawBat, 100), 0);
        }

        let flowBatColour: string;
        switch (true) {
            case pvPercentageBat >= Utils.toNum(config.battery?.path_threshold, 0):
                flowBatColour = solarColour;
                break;
            case gridPercentageBat >= Utils.toNum(config.battery?.path_threshold, 0):
                flowBatColour = gridColour;
                break;
            default:
                flowBatColour = batteryColour;
                break;
        }

        let flowColour: string;
        switch (true) {
            case pvPercentage >= Utils.toNum(config.load?.path_threshold, 0):
                flowColour = solarColour;
                break;
            case batteryPercentage >= Utils.toNum(config.load?.path_threshold, 0):
                flowColour = batteryColour;
                break;
            case gridPercentage >= Utils.toNum(config.load?.path_threshold, 0):
                flowColour = gridColour;
                break;
            default:
                flowColour = loadColour;
                break;
        }

        let flowInvColour: string;
        switch (true) {
            case pvPercentage >= Utils.toNum(config.load?.path_threshold, 0):
                flowInvColour = solarColour;
                break;
            case batteryPercentage >= Utils.toNum(config.load?.path_threshold, 0):
                flowInvColour = batteryColour;
                break;
            case gridPercentage >= Utils.toNum(config.load?.path_threshold, 0):
                flowInvColour = gridColour;
                break;
            case gridPercentageBat >= Utils.toNum(config.battery?.path_threshold, 0):
                flowInvColour = gridColour;
                break;
            default:
                flowInvColour = inverterColour;
                break;
        }

        //console.log(`${pvPercentageBat} % PV to charge battery, ${gridPercentageBat} % Grid to charge battery`);

        let essIcon: string;
        let essIconSize: number;

        switch (true) {
            case pvPercentageRaw >= 100 && batteryPercentageRaw <= 5 && (totalGridPower - nonessentialPower) < 50 && config.load.dynamic_icon:
                essIcon = icons.essPv;
                essIconSize = 1;
                break;
            case batteryPercentageRaw >= 100 && pvPercentageRaw <= 5 && (totalGridPower - nonessentialPower) < 50 && config.load.dynamic_icon:
                essIcon = icons.essBat;
                essIconSize = 0;
                break;
            case pvPercentageRaw < 5 && batteryPercentageRaw < 5 && gridPercentage > 0 && config.load.dynamic_icon:
                essIcon = icons.essGrid;
                essIconSize = 0;
                break;
            default:
                essIcon = icons.ess;
                essIconSize = 0;
                break;
        }

        const {batteryIcon, batteryCharge, stopColour, battery0} = BatteryIconManager.convert(stateBatterySoc)

        //Calculate pv efficiency
        const pv1MaxPower = this.getEntity('solar.pv1_max_power', {state: config.solar.pv1_max_power?.toString() ?? ''});
        const pv2MaxPower = this.getEntity('solar.pv2_max_power', {state: config.solar.pv2_max_power?.toString() ?? ''});
        const pv3MaxPower = this.getEntity('solar.pv3_max_power', {state: config.solar.pv3_max_power?.toString() ?? ''});
        const pv4MaxPower = this.getEntity('solar.pv4_max_power', {state: config.solar.pv4_max_power?.toString() ?? ''});
        const pv5MaxPower = this.getEntity('solar.pv5_max_power', {state: config.solar.pv5_max_power?.toString() ?? ''});

        const totalPVEfficiency = (config.solar.max_power && (config.solar.show_mppt_efficiency || config.solar.visualize_efficiency)) ? Utils.toNum(Math.min((totalPV / solarMaxPower.toNum()) * 100, 200), 0) : 100;
        const PV1Efficiency = (config.solar.pv1_max_power && (config.solar.show_mppt_efficiency || config.solar.visualize_efficiency)) ? Utils.toNum(Math.min((pv1PowerWatts / pv1MaxPower.toNum()) * 100, 200), 0) : 100;
        const PV2Efficiency = (config.solar.pv2_max_power && (config.solar.show_mppt_efficiency || config.solar.visualize_efficiency)) ? Utils.toNum(Math.min((pv2PowerWatts / pv2MaxPower.toNum()) * 100, 200), 0) : 100;
        const PV3Efficiency = (config.solar.pv3_max_power && (config.solar.show_mppt_efficiency || config.solar.visualize_efficiency)) ? Utils.toNum(Math.min((pv3PowerWatts / pv3MaxPower.toNum()) * 100, 200), 0) : 100;
        const PV4Efficiency = (config.solar.pv4_max_power && (config.solar.show_mppt_efficiency || config.solar.visualize_efficiency)) ? Utils.toNum(Math.min((pv4PowerWatts / pv4MaxPower.toNum()) * 100, 200), 0) : 100;
        const PV5Efficiency = (config.solar.pv5_max_power && (config.solar.show_mppt_efficiency || config.solar.visualize_efficiency)) ? Utils.toNum(Math.min((pv5PowerWatts / pv5MaxPower.toNum()) * 100, 200), 0) : 100;

        let customGridIcon: string;
        let customGridIconColour: string;
        switch (true) {
            case totalGridPower < 0 && validGridConnected.includes(gridStatus.toLowerCase()):
                customGridIcon = iconGridExport;
                customGridIconColour = gridColour;
                break;
            case totalGridPower >= 0 && validGridConnected.includes(gridStatus.toLowerCase()):
                customGridIcon = iconGridImport;
                customGridIconColour = gridColour;
                break;
            case totalGridPower === 0 && validGridDisconnected.includes(gridStatus.toLowerCase()):
                customGridIcon = iconGridDisconnected;
                customGridIconColour = gridOffColour;
                break;
            default:
                customGridIcon = iconGridImport;
                customGridIconColour = gridColour;
                break;
        }

        /**
         * The current structure of this data object is intentional, but it is considered temporary.
         * There is a need to evaluate the data being passed, as there might be duplication.
         * Future improvements should focus on optimizing the data structure and ensuring a unified naming standard.
         */
        const data: DataDto = {
            config,
            panelMode,
            compactMode,
            cardHeight,
            cardWidth,
            loadColour,
            batteryColour,
            gridColour,
            isFloating,
            inverterColour,
            solarColour,
            auxOffColour,
            batteryEnergy,
            largeFont,
            batteryPower,
            batteryDuration,
            batteryCapacity,
            additionalLoad,
            essIconSize,
            essIcon,
            stateUseTimer,
            batteryStateMsg,
            stateBatterySoc,
            inverterProg,
            batteryPercentage,
            pvPercentage,
            loadShowDaily,
            stateEnergyCostSell,
            stateEnergyCostBuy,
            loadPowerL1,
            loadPowerL2,
            loadPowerL3,
            durationCur: this.durationCur,
            stateEssentialLoad1,
            stateEssentialLoad2,
            stateEssentialLoad3,
            stateEssentialLoad4,
            stateEssentialLoad5,
            stateEssentialLoad6,
            stateEssentialLoad7,
            stateEssentialLoad8,
            gridPower,
            gridPowerL2,
            gridPowerL3,
            decimalPlaces,
            decimalPlacesEnergy,
            stateEssentialLoad1Extra,
            stateEssentialLoad2Extra,
            stateEssentialLoad3Extra,
            stateEssentialLoad4Extra,
            stateEssentialLoad5Extra,
            stateEssentialLoad6Extra,
            stateEssentialLoad7Extra,
            stateEssentialLoad8Extra,
            stateNonEssentialLoad1Extra,
            stateNonEssentialLoad2Extra,
            loadFrequency,
            gridShowDailyBuy,
            gridShowDailySell,
            batteryShowDaily,
            inverterModel,
            batteryShutdown,
            enableAutarky,
            autarkyPower,
            ratioPower,
            ratioEnergy,
            autarkyEnergy,
            autarkyAuto,
            autarkySelf,
            shutdownOffGrid,
            statePV1Current,
            statePV2Current,
            statePV3Current,
            statePV4Current,
            statePV5Current,
            energyCost,
            inverterCurrent,
            inverterCurrentL2,
            inverterCurrentL3,
            stateRadiatorTemp,
            inverterVoltage,
            inverterVoltageL2,
            inverterVoltageL3,
            batteryVoltage,
            stateBatteryCurrent,
            batLineWidth,
            totalGridPower,
            solarLineWidth,
            totalPV,
            loadLineWidth,
            pvPercentageBat,
            gridPercentageBat,
            genericInverterImage,
            battery0,
            essentialPower,
            pv1LineWidth,
            pv2LineWidth,
            pv3LineWidth,
            pv4LineWidth,
            pv5LineWidth,
            gridLineWidth,
            stateEnvironmentTemp,
            statePV1Voltage,
            statePV2Voltage,
            statePV3Voltage,
            statePV4Voltage,
            statePV5Voltage,
            batteryStateColour,
            inverterStateColour,
            stateBatteryTemp,
            statePrepaidUnits,
            stateDCTransformerTemp,
            iconEssentialLoad1,
            iconEssentialLoad2,
            iconEssentialLoad3,
            iconEssentialLoad4,
            iconEssentialLoad5,
            iconEssentialLoad6,
            iconEssentialLoad7,
            iconEssentialLoad8,
            enableTimer,
            stateSolarSell,
            priorityLoad,
            inverterImg,
            stateDailyPVEnergy,
            stateMonthlyPVEnergy,
            stateYearlyPVEnergy,
            stateTotalSolarGeneration,
            stateRemainingSolar,
            statePV2Power,
            statePV3Power,
            statePV4Power,
            statePV5Power,
            statePV1Energy,
            statePV2Energy,
            statePV3Energy,
            statePV4Energy,
            statePV5Energy,
            stateDayLoadEnergy,
            stateDayBatteryDischarge,
            stateDayGridImport,
            stateDayBatteryCharge,
            stateDayGridExport,
            statePVTotal,
            statePV1Power,
            minLineWidth,
            stopColour,
            gridStatus,
            batteryCharge,
            gridOffColour,
            batteryIcon,
            formattedResultTime,
            showAux,
            nonessentialIcon,
            showNonessential,
            auxStatus,
            nonessentialLoads,
            additionalAuxLoad,
            stateAuxLoad1Extra,
            stateAuxLoad2Extra,
            iconNonessentialLoad1,
            iconNonessentialLoad2,
            iconNonessentialLoad3,
            inverterStateMsg,
            auxType,
            showDailyAux,
            nonessentialPower,
            auxPower,
            nonessLineWidth,
            grid169LineWidth,
            auxLineWidth,
            iconAuxLoad1,
            iconAuxLoad2,
            stateDayAuxEnergy,
            stateAuxLoad1,
            stateAuxLoad2,
            stateNonessentialLoad1,
            stateNonessentialLoad2,
            stateNonessentialLoad3,
            autoScaledInverterPower,
            autoScaledGridPower,
            auxDynamicColour,
            auxDynamicColourLoad1,
            auxDynamicColourLoad2,
            stateMaxSellPower,
            totalPVEfficiency,
            PV1Efficiency,
            PV2Efficiency,
            PV3Efficiency,
            PV4Efficiency,
            PV5Efficiency,
            gridPercentage,
            flowColour,
            flowBatColour,
            flowInvColour,
            dynamicColourEssentialLoad1,
            dynamicColourEssentialLoad2,
            dynamicColourEssentialLoad3,
            dynamicColourEssentialLoad4,
            dynamicColourEssentialLoad5,
            dynamicColourEssentialLoad6,
            dynamicColourEssentialLoad7,
            dynamicColourEssentialLoad8,
            dynamicColourNonEssentialLoad1,
            dynamicColourNonEssentialLoad2,
            dynamicColourNonEssentialLoad3,
            stateBatterySOH,
            customGridIcon,
            customGridIconColour
        };

        return compactCard(config, inverterImg, data)
    }

    /**
     * Fetches the entity object, returned the defaultValue when the entity is not found. Pass null for no default.
     * @param entity
     * @param defaultValue
     */
    getEntity(entity: keyof sunsynkPowerFlowCardConfig,
              defaultValue: Partial<CustomEntity> | null = {
                  state: '0', attributes: {unit_of_measurement: ''},
              }): CustomEntity {

        let entityString;

        const props = String(entity).split(".");

        if (props.length > 1) {
            entityString = this._config[props[0]][props[1]]
        } else if (props.length > 0) {
            entityString = this._config[props[0]]
        }

        const state = entityString ? this.hass.states[entityString] : undefined;
        return (state !== undefined ? convertToCustomEntity(state)
            : defaultValue ? convertToCustomEntity(defaultValue)
                : convertToCustomEntity({state: undefined})) as CustomEntity;
    }

    changeAnimationSpeed(el: string, speedRaw: number) {
        const speed = speedRaw >= 1 ? Utils.toNum(speedRaw, 3) : 1;
        const flow = this[`${el}Flow`] as SVGSVGElement;
        this.durationCur[el] = speed;
        if (flow && this.durationPrev[el] != speed) {
            // console.log(`${el} found, duration change ${this.durationPrev[el]} -> ${this.durationCur[el]}`);
            // this.gridFlow.pauseAnimations();
            flow.setCurrentTime(flow.getCurrentTime() * (speed / this.durationPrev[el]));
            // this.gridFlow.unpauseAnimations();
        }
        this.durationPrev[el] = this.durationCur[el];
    }

    get isCompactCard() {
        return true;
    }

    get isLiteCard() {
        return false;
    }

    colourConvert(colour) {
        return colour && Array.isArray(colour) ? `rgb(${colour})` : colour;
    }

    dynamicLineWidth(power: number, maxpower: number, width: number, defaultLineWidth: number = 1) {
        let lineWidth: number;
        // Check if dynamic_line_width is disabled in the config
        if (!this._config.dynamic_line_width) {
            lineWidth = Math.min(defaultLineWidth, 8);
        } else {
            lineWidth = Math.min((defaultLineWidth + Math.min(power / maxpower, 1) * width), 8);
        }

        return lineWidth;
    }

    calculateAuxLoadColour(state, threshold) {
        return !this._config.load.aux_dynamic_colour
            ? this.colourConvert(this._config.load?.aux_colour)
            : Math.abs(state) > threshold
                ? this.colourConvert(this._config.load?.aux_colour)
                : 'grey';
    }

    calculateEssentialLoadColour(state, threshold) {
        return !this._config.load.dynamic_colour
            ? this.colourConvert(this._config.load?.colour)
            : Math.abs(state) > threshold
                ? this.colourConvert(this._config.load?.colour)
                : 'grey';
    }

    setConfig(config) {
        if (config.show_battery && !config.battery) {
            throw Error(localize('errors.battery.bat'));
        } else {
            if (config.show_battery && !config.battery.shutdown_soc) {
                throw new Error(localize('errors.battery.shutdown_soc'));
            }
            if (
                config.show_battery &&
                config.battery.show_daily &&
                (!config.entities.day_battery_charge_70 || !config.entities.day_battery_discharge_71)
            ) {
                throw Error(localize('errors.battery.show_daily'));
            }
        }
        if (config.show_solar && !config.solar) {
            throw Error(localize('errors.solar.sol'));
        } else {
            if (config.show_solar && !config.solar.mppts) {
                throw Error(localize('errors.solar.mppts'));
            }
        }

        if (
            (config && config.grid && config.grid.show_daily_buy && !config.entities.day_grid_import_76) ||
            (config && config.grid && config.grid.show_daily_sell && !config.entities.day_grid_export_77)
        ) {
            throw Error(localize('errors.grid.show_daily'));
        }

        if (
            (config &&
                config.entities &&
                config.entities.essential_power === 'none' &&
                !config.entities.inverter_power_175) ||
            (config &&
                config.entities &&
                config.entities.essential_power === 'none' &&
                config.entities.inverter_power_175 === 'none')
        ) {
            throw Error(localize('errors.essential_power'));
        }

        if (config && config.entities && config.entities.nonessential_power === 'none' && !config.entities.grid_power_169) {
            throw Error(localize('errors.nonessential_power'));
        }

        const all_attributes = [
            'battery_soc_184',
            'battery_power_190',
            'battery_current_191',
            'grid_ct_power_172',
            'pv1_power_186',
        ];

        for (const attr of all_attributes) {
            if (attr === 'pv1_power_186' && config.show_solar && !config.entities[attr] && !config.entities[attr]) {
                throw new Error(`${localize('errors.missing_entity')} e.g: ${attr}: sensor.example`);
            }
        }

        const customConfig: sunsynkPowerFlowCardConfig = config;

        this._config = merge({}, defaultConfig, customConfig);
    }

    getCardSize() {
        return 2;
    }
}

(window as any).customCards.push({
    type: 'mlk-power-flow-card',
    name: 'Power Flow Card by Molikk',
    preview: true,
    description: localize('common.description'),
    configurable: true
});
