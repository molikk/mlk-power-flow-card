import { CSSResultGroup, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { styles } from './style';
import { DataDto, InverterModel, InverterSettings, PowerFlowCardConfig, RefreshCardConfig } from './types';
import defaultConfig from './defaults';
import {
	CARD_VERSION,
	EDITOR_NAME,
	MAIN_NAME,
	valid3phase,
	validAuxLoads,
	validGridConnected,
	validGridDisconnected,
	validLoadValues,
	validNonLoadValues,
} from './const';
import { localize } from './localize/localize';
import merge from 'lodash.merge';
import { Utils } from './helpers/utils';
import { compactCard } from './cards/compact-card';
import { globalData } from './helpers/globals';
import { InverterFactory } from './inverters/inverter-factory';
import { BatteryIconManager } from './helpers/battery-icon-manager';
import { convertToCustomEntity, CustomEntity, getEntity } from './inverters/dto/custom-entity';
import { icons } from './helpers/icons';

console.groupCollapsed(
	`%c ⚡ POWER-FLOW-CARD by Molikk %c ${localize('common.version')}: ${CARD_VERSION} `,
	'color: orange; font-weight: bold; background: black',
	'color: white; font-weight: bold; background: dimgray',
);
console.log('Readme:', 'https://github.com/molikk/mlk-power-flow-card');
console.groupEnd();

@customElement(MAIN_NAME)
export class PowerFlowCard extends LitElement {
	@property() public hass!: HomeAssistant;
	@property() private _config!: PowerFlowCardConfig;

	private readonly GREY_COLOUR = 'grey';

	private durationPrev: { [name: string]: number } = {};
	private durationCur: { [name: string]: number } = {};
	private lastRenderTime: number;
	private renderInterval: number;
	private rafId: number;

	constructor() {
		super();
		this.rafId = 0;
		this.lastRenderTime = 0;
		this.renderInterval = this._config?.low_resources?.refresh_interval || 500; // 100ms for 10Hz
	}

	connectedCallback() {
		super.connectedCallback();
		this.startRenderLoop();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		cancelAnimationFrame(this.rafId);
	}

	startRenderLoop() {
		const renderLoop = (timestamp: DOMHighResTimeStamp) => {
			if (timestamp - this.lastRenderTime >= this.renderInterval) {
				this.requestUpdate();
				this.lastRenderTime = timestamp;

				/*const elem = this.shadowRoot?.getElementById('aux_load_power-1');
				if (elem != null)
					elem.style.fill = 'grey';
				 */
			}
			this.rafId = requestAnimationFrame(renderLoop);
		};
		this.rafId = requestAnimationFrame(renderLoop);
	}

	shouldUpdate() {
		const now = performance.now();
		if (now - this.lastRenderTime >= this.renderInterval) {
			this.lastRenderTime = now;
			return true;
		}
		return false;
	}

	static get styles(): CSSResultGroup {
		return styles;
	}

	public static async getConfigElement() {
		await import('./editor');
		return document.createElement(EDITOR_NAME) as LovelaceCardEditor;
	}

	static getStubConfig() {
		return {
			show_solar: true,
			low_resources: {
				refresh_interval: 500,
				animations: true,
			},
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
		} as unknown as PowerFlowCardConfig;
	}

	render() {
		globalData.hass = this.hass;
		const config = this._config;

		const refreshTime = this.getNowTime();

		//Energy
		const stateDayBatteryDischarge = this.getEntity('entities.day_battery_discharge_71');
		const stateDayBatteryCharge = this.getEntity('entities.day_battery_charge_70');
		const stateDayLoadEnergy = this.getEntity('entities.day_load_energy_84');
		const stateDayGridImport = this.getEntity('entities.day_grid_import_76');

		const stateDayGridExport = this.getEntity('entities.day_grid_export_77');

		//Inverter
		const stateLoadFrequency = this.getEntity('entities.load_frequency_192');
		const stateInverterStatus = this.getEntity('entities.inverter_status_59', { state: '' });
		const stateInverterPower = this.getEntity('entities.inverter_power_175');
		const statePriorityLoad = this.getEntity('entities.priority_load_243', { state: config.entities.priority_load_243?.toString() ?? 'false' });
		const stateUseTimer = this.getEntity('entities.use_timer_248', { state: config.entities.use_timer_248?.toString() ?? 'false' });
		const stateDCTransformerTemp = this.getEntity('entities.dc_transformer_temp_90', { state: '' });
		const stateRadiatorTemp = this.getEntity('entities.radiator_temp_91', { state: '' });
		const stateInverterVoltageL1 = this.getEntity('entities.inverter_voltage_154');
		const stateInverterVoltageL2 = this.getEntity('entities.inverter_voltage_L2', { state: '' });
		const stateInverterVoltageL3 = this.getEntity('entities.inverter_voltage_L3', { state: '' });
		const stateInverterCurrentL1 = this.getEntity('entities.inverter_current_164');
		const stateInverterCurrentL2 = this.getEntity('entities.inverter_current_L2', { state: '' });
		const stateInverterCurrentL3 = this.getEntity('entities.inverter_current_L3', { state: '' });
		const stateEnvironmentTemp = this.getEntity('entities.environment_temp', { state: '' });
		const stateInverterLoadPercentage = this.getEntity('entities.inverter_load_percentage');

		//Battery
		const stateBatteryVoltage = this.getEntity('entities.battery_voltage_183');
		const stateBatterySoc = this.getEntity('entities.battery_soc_184');
		const stateBatteryPower = this.getEntity('entities.battery_power_190');
		const stateBatteryCurrent = this.getEntity('entities.battery_current_191');
		const stateBatteryTemp = this.getEntity('entities.battery_temp_182', { state: '' });
		const stateBatteryStatus = this.getEntity('entities.battery_status', { state: '' });
		const stateBatteryCurrentDirection = this.getEntity('entities.battery_current_direction', { state: '' });
		const stateBatteryRatedCapacity = this.getEntity('entities.battery_rated_capacity', { state: '' });
		const stateShutdownSOC = this.getEntity('battery.shutdown_soc', { state: config.battery.shutdown_soc?.toString() ?? '' });
		const stateShutdownSOCOffGrid = this.getEntity('battery.shutdown_soc_offgrid', { state: config.battery.shutdown_soc_offgrid?.toString() ?? '' });
		const stateBatterySOH = this.getEntity('entities.battery_soh', { state: '' });
		const stateSOCEndOfCharge = this.getEntity('battery.soc_end_of_charge', { state: config.battery.soc_end_of_charge?.toString() ?? '' });
		const stateBatteryRemainingStorage = this.getEntity('entities.battery_remaining_storage', { state: '' });

		//BatteryBanks
		const batteryBankPowerState = [
			this.getEntity('entities.battery_bank_1_power'),
			this.getEntity('entities.battery_bank_2_power'),
			this.getEntity('entities.battery_bank_3_power'),
			this.getEntity('entities.battery_bank_4_power'),
			this.getEntity('entities.battery_bank_5_power'),
			this.getEntity('entities.battery_bank_6_power'),
		];
		const batteryBankVoltageState = [
			this.getEntity('entities.battery_bank_1_voltage'),
			this.getEntity('entities.battery_bank_2_voltage'),
			this.getEntity('entities.battery_bank_3_voltage'),
			this.getEntity('entities.battery_bank_4_voltage'),
			this.getEntity('entities.battery_bank_5_voltage'),
			this.getEntity('entities.battery_bank_6_voltage'),
		];
		const batteryBankCurrentState = [
			this.getEntity('entities.battery_bank_1_current'),
			this.getEntity('entities.battery_bank_2_current'),
			this.getEntity('entities.battery_bank_3_current'),
			this.getEntity('entities.battery_bank_4_current'),
			this.getEntity('entities.battery_bank_5_current'),
			this.getEntity('entities.battery_bank_6_current'),
		];
		const batteryBankDeltaState = [
			this.getEntity('entities.battery_bank_1_delta'),
			this.getEntity('entities.battery_bank_2_delta'),
			this.getEntity('entities.battery_bank_3_delta'),
			this.getEntity('entities.battery_bank_4_delta'),
			this.getEntity('entities.battery_bank_5_delta'),
			this.getEntity('entities.battery_bank_6_delta'),
		];
		const batteryBankRemainingStorageState = [
			this.getEntity('entities.battery_bank_1_remaining_storage'),
			this.getEntity('entities.battery_bank_2_remaining_storage'),
			this.getEntity('entities.battery_bank_3_remaining_storage'),
			this.getEntity('entities.battery_bank_4_remaining_storage'),
			this.getEntity('entities.battery_bank_5_remaining_storage'),
			this.getEntity('entities.battery_bank_6_remaining_storage'),
		];
		const batteryBankSocState = [
			this.getEntity('entities.battery_bank_1_soc'),
			this.getEntity('entities.battery_bank_2_soc'),
			this.getEntity('entities.battery_bank_3_soc'),
			this.getEntity('entities.battery_bank_4_soc'),
			this.getEntity('entities.battery_bank_5_soc'),
			this.getEntity('entities.battery_bank_6_soc'),
		];
		const batteryBankTempState = [
			this.getEntity('entities.battery_bank_1_temp'),
			this.getEntity('entities.battery_bank_2_temp'),
			this.getEntity('entities.battery_bank_3_temp'),
			this.getEntity('entities.battery_bank_4_temp'),
			this.getEntity('entities.battery_bank_5_temp'),
			this.getEntity('entities.battery_bank_6_temp'),
		];

		const batteryBankEnergy = [
			config.battery.battery_bank_1_energy,
			config.battery.battery_bank_2_energy,
			config.battery.battery_bank_3_energy,
			config.battery.battery_bank_4_energy,
			config.battery.battery_bank_5_energy,
			config.battery.battery_bank_6_energy,
		];

		//Load
		const stateEssentialPower = this.getEntity('entities.essential_power');
		const stateEssentialLoad1 = this.getEntity('entities.essential_load1');
		const stateEssentialLoad2 = this.getEntity('entities.essential_load2');
		const stateEssentialLoad3 = this.getEntity('entities.essential_load3');
		const stateEssentialLoad4 = this.getEntity('entities.essential_load4');
		const stateEssentialLoad1Extra = this.getEntity('entities.essential_load1_extra');
		const stateEssentialLoad2Extra = this.getEntity('entities.essential_load2_extra');
		const stateEssentialLoad3Extra = this.getEntity('entities.essential_load3_extra');
		const stateEssentialLoad4Extra = this.getEntity('entities.essential_load4_extra');
		const stateEssentialLoad1Toggle = this.getEntity('entities.essential_load1_toggle');
		const stateEssentialLoad2Toggle = this.getEntity('entities.essential_load2_toggle');
		const stateEssentialLoad3Toggle = this.getEntity('entities.essential_load3_toggle');
		const stateEssentialLoad4Toggle = this.getEntity('entities.essential_load4_toggle');

		const essentialLoadCol1State = [
			this.getEntity('entities.essential_load_1_1'),
			this.getEntity('entities.essential_load_1_2'),
			this.getEntity('entities.essential_load_1_3'),
			this.getEntity('entities.essential_load_1_4'),
			this.getEntity('entities.essential_load_1_5'),
			this.getEntity('entities.essential_load_1_6'),
		];
		const essentialLoadCol2State = [
			this.getEntity('entities.essential_load_2_1'),
			this.getEntity('entities.essential_load_2_2'),
			this.getEntity('entities.essential_load_2_3'),
			this.getEntity('entities.essential_load_2_4'),
			this.getEntity('entities.essential_load_2_5'),
			this.getEntity('entities.essential_load_2_6'),
		];
		const essentialLoadCol3State = [
			this.getEntity('entities.essential_load_3_1'),
			this.getEntity('entities.essential_load_3_2'),
			this.getEntity('entities.essential_load_3_3'),
			this.getEntity('entities.essential_load_3_4'),
			this.getEntity('entities.essential_load_3_5'),
			this.getEntity('entities.essential_load_3_6'),
		];
		const essentialLoadCol4State = [
			this.getEntity('entities.essential_load_4_1'),
			this.getEntity('entities.essential_load_4_2'),
			this.getEntity('entities.essential_load_4_3'),
			this.getEntity('entities.essential_load_4_4'),
			this.getEntity('entities.essential_load_4_5'),
			this.getEntity('entities.essential_load_4_6'),
		];
		const essentialLoadCol5State = [
			this.getEntity('entities.essential_load_5_1'),
			this.getEntity('entities.essential_load_5_2'),
			this.getEntity('entities.essential_load_5_3'),
			this.getEntity('entities.essential_load_5_4'),
			this.getEntity('entities.essential_load_5_5'),
			this.getEntity('entities.essential_load_5_6'),
		];
		const essentialLoadCol6State = [
			this.getEntity('entities.essential_load_6_1'),
			this.getEntity('entities.essential_load_6_2'),
			this.getEntity('entities.essential_load_6_3'),
			this.getEntity('entities.essential_load_6_4'),
			this.getEntity('entities.essential_load_6_5'),
			this.getEntity('entities.essential_load_6_6'),
		];
		const essentialLoadCol1ExtraState = [
			this.getEntity('entities.essential_load_1_1_extra'),
			this.getEntity('entities.essential_load_1_2_extra'),
			this.getEntity('entities.essential_load_1_3_extra'),
			this.getEntity('entities.essential_load_1_4_extra'),
			this.getEntity('entities.essential_load_1_5_extra'),
			this.getEntity('entities.essential_load_1_6_extra'),
		];
		const essentialLoadCol2ExtraState = [
			this.getEntity('entities.essential_load_2_1_extra'),
			this.getEntity('entities.essential_load_2_2_extra'),
			this.getEntity('entities.essential_load_2_3_extra'),
			this.getEntity('entities.essential_load_2_4_extra'),
			this.getEntity('entities.essential_load_2_5_extra'),
			this.getEntity('entities.essential_load_2_6_extra'),
		];
		const essentialLoadCol3ExtraState = [
			this.getEntity('entities.essential_load_3_1_extra'),
			this.getEntity('entities.essential_load_3_2_extra'),
			this.getEntity('entities.essential_load_3_3_extra'),
			this.getEntity('entities.essential_load_3_4_extra'),
			this.getEntity('entities.essential_load_3_5_extra'),
			this.getEntity('entities.essential_load_3_6_extra'),
		];
		const essentialLoadCol4ExtraState = [
			this.getEntity('entities.essential_load_4_1_extra'),
			this.getEntity('entities.essential_load_4_2_extra'),
			this.getEntity('entities.essential_load_4_3_extra'),
			this.getEntity('entities.essential_load_4_4_extra'),
			this.getEntity('entities.essential_load_4_5_extra'),
			this.getEntity('entities.essential_load_4_6_extra'),
		];
		const essentialLoadCol5ExtraState = [
			this.getEntity('entities.essential_load_5_1_extra'),
			this.getEntity('entities.essential_load_5_2_extra'),
			this.getEntity('entities.essential_load_5_3_extra'),
			this.getEntity('entities.essential_load_5_4_extra'),
			this.getEntity('entities.essential_load_5_5_extra'),
			this.getEntity('entities.essential_load_5_6_extra'),
		];
		const essentialLoadCol6ExtraState = [
			this.getEntity('entities.essential_load_6_1_extra'),
			this.getEntity('entities.essential_load_6_2_extra'),
			this.getEntity('entities.essential_load_6_3_extra'),
			this.getEntity('entities.essential_load_6_4_extra'),
			this.getEntity('entities.essential_load_6_5_extra'),
			this.getEntity('entities.essential_load_6_6_extra'),
		];
		const essentialLoadCol1ToggleState = [
			this.getEntity('entities.essential_load_1_1_toggle'),
			this.getEntity('entities.essential_load_1_2_toggle'),
			this.getEntity('entities.essential_load_1_3_toggle'),
			this.getEntity('entities.essential_load_1_4_toggle'),
			this.getEntity('entities.essential_load_1_5_toggle'),
			this.getEntity('entities.essential_load_1_6_toggle'),
		];
		const essentialLoadCol2ToggleState = [
			this.getEntity('entities.essential_load_2_1_toggle'),
			this.getEntity('entities.essential_load_2_2_toggle'),
			this.getEntity('entities.essential_load_2_3_toggle'),
			this.getEntity('entities.essential_load_2_4_toggle'),
			this.getEntity('entities.essential_load_2_5_toggle'),
			this.getEntity('entities.essential_load_2_6_toggle'),
		];
		const essentialLoadCol3ToggleState = [
			this.getEntity('entities.essential_load_3_1_toggle'),
			this.getEntity('entities.essential_load_3_2_toggle'),
			this.getEntity('entities.essential_load_3_3_toggle'),
			this.getEntity('entities.essential_load_3_4_toggle'),
			this.getEntity('entities.essential_load_3_5_toggle'),
			this.getEntity('entities.essential_load_3_6_toggle'),
		];
		const essentialLoadCol4ToggleState = [
			this.getEntity('entities.essential_load_4_1_toggle'),
			this.getEntity('entities.essential_load_4_2_toggle'),
			this.getEntity('entities.essential_load_4_3_toggle'),
			this.getEntity('entities.essential_load_4_4_toggle'),
			this.getEntity('entities.essential_load_4_5_toggle'),
			this.getEntity('entities.essential_load_4_6_toggle'),
		];
		const essentialLoadCol5ToggleState = [
			this.getEntity('entities.essential_load_5_1_toggle'),
			this.getEntity('entities.essential_load_5_2_toggle'),
			this.getEntity('entities.essential_load_5_3_toggle'),
			this.getEntity('entities.essential_load_5_4_toggle'),
			this.getEntity('entities.essential_load_5_5_toggle'),
			this.getEntity('entities.essential_load_5_6_toggle'),
		];
		const essentialLoadCol6ToggleState = [
			this.getEntity('entities.essential_load_6_1_toggle'),
			this.getEntity('entities.essential_load_6_2_toggle'),
			this.getEntity('entities.essential_load_6_3_toggle'),
			this.getEntity('entities.essential_load_6_4_toggle'),
			this.getEntity('entities.essential_load_6_5_toggle'),
			this.getEntity('entities.essential_load_6_6_toggle'),
		];

		const stateLoadPowerL1 = this.getEntity('entities.load_power_L1');
		const stateLoadPowerL2 = this.getEntity('entities.load_power_L2');
		const stateLoadPowerL3 = this.getEntity('entities.load_power_L3');

		//Grid Load non-essential

		const stateNonessentialPower = this.getEntity('entities.nonessential_power');
		const stateNonessentialDailyEnergy = this.getEntity('entities.nonessential_energy');

		const nonessentialLoadState = [
			this.getEntity('entities.non_essential_load1'),
			this.getEntity('entities.non_essential_load2'),
			this.getEntity('entities.non_essential_load3'),
			this.getEntity('entities.non_essential_load4'),
			this.getEntity('entities.non_essential_load5'),
			this.getEntity('entities.non_essential_load6'),
		];
		const nonEssentialLoadExtraState = [
			this.getEntity('entities.non_essential_load1_extra'),
			this.getEntity('entities.non_essential_load2_extra'),
			this.getEntity('entities.non_essential_load3_extra'),
			this.getEntity('entities.non_essential_load4_extra'),
			this.getEntity('entities.non_essential_load5_extra'),
			this.getEntity('entities.non_essential_load6_extra'),
		];
		const nonEssentialLoadToggleState = [
			this.getEntity('entities.non_essential_load1_toggle'),
			this.getEntity('entities.non_essential_load2_toggle'),
			this.getEntity('entities.non_essential_load3_toggle'),
			this.getEntity('entities.non_essential_load4_toggle'),
			this.getEntity('entities.non_essential_load5_toggle'),
			this.getEntity('entities.non_essential_load6_toggle'),
		];

		//Load aux
		const stateAuxPower = this.getEntity('entities.aux_power_166');
		const stateDayAuxEnergy = this.getEntity('entities.day_aux_energy');
		const auxLoadState = [
			this.getEntity('entities.aux_load1'),
			this.getEntity('entities.aux_load2'),
			this.getEntity('entities.aux_load3'),
			this.getEntity('entities.aux_load4'),
			this.getEntity('entities.aux_load5'),
			this.getEntity('entities.aux_load6'),
		];
		const auxLoadExtraState = [
			this.getEntity('entities.aux_load1_extra'),
			this.getEntity('entities.aux_load2_extra'),
			this.getEntity('entities.aux_load3_extra'),
			this.getEntity('entities.aux_load4_extra'),
			this.getEntity('entities.aux_load5_extra'),
			this.getEntity('entities.aux_load6_extra'),
		];
		const auxLoadToggleState = [
			this.getEntity('entities.aux_load1_toggle'),
			this.getEntity('entities.aux_load2_toggle'),
			this.getEntity('entities.aux_load3_toggle'),
			this.getEntity('entities.aux_load4_toggle'),
			this.getEntity('entities.aux_load5_toggle'),
			this.getEntity('entities.aux_load6_toggle'),
		];

		//Grid
		const stateGridFrequency = this.getEntity('entities.grid_frequency');
		const stateGridPowerL1 = this.getEntity('entities.grid_ct_power_172');
		const stateGridPowerL2 = this.getEntity('entities.grid_ct_power_L2');
		const stateGridPowerL3 = this.getEntity('entities.grid_ct_power_L3');
		const stateGridVoltageL1 = this.getEntity('entities.grid_voltage_L1');
		const stateGridVoltageL2 = this.getEntity('entities.grid_voltage_L2');
		const stateGridVoltageL3 = this.getEntity('entities.grid_voltage_L3');
		const stateGridCurrentL1 = this.getEntity('entities.grid_current_L1');
		const stateGridCurrentL2 = this.getEntity('entities.grid_current_L2');
		const stateGridCurrentL3 = this.getEntity('entities.grid_current_L3');
		const stateGridCTPowerTotal = this.getEntity('entities.grid_ct_power_total');
		const stateGridConnectedStatus = this.getEntity('entities.grid_connected_status_194', { state: 'on' });
		const stateGridPower = this.getEntity('entities.grid_power_169');
		const stateEnergyCostBuy = this.getEntity('entities.energy_cost_buy', {
			state: '',
			attributes: { unit_of_measurement: '' },
		});
		const stateEnergyCostSell = this.getEntity('entities.energy_cost_sell', {
			state: '',
			attributes: { unit_of_measurement: '' },
		});
		const stateGridVoltage = this.getEntity('entities.grid_voltage', null);
		const statePrepaidUnits = this.getEntity('entities.prepaid_units');
		const stateMaxSellPower = this.getEntity('entities.max_sell_power');

		const emptyEntity = convertToCustomEntity({ state: undefined });
		//Solar
		const statePvVoltage = [
			emptyEntity,
			this.getEntity('entities.pv1_voltage_109'),
			this.getEntity('entities.pv2_voltage_111'),
			this.getEntity('entities.pv3_voltage_113'),
			this.getEntity('entities.pv4_voltage_115'),
			this.getEntity('entities.pv5_voltage'),
		];
		const statePvCurrent = [
			emptyEntity,
			this.getEntity('entities.pv1_current_110'),
			this.getEntity('entities.pv2_current_112'),
			this.getEntity('entities.pv3_current_114'),
			this.getEntity('entities.pv4_current_116'),
			this.getEntity('entities.pv5_current'),
		];
		const statePvPower = [
			this.getEntity('entities.pv_total'),
			this.getEntity('entities.pv1_power_186'),
			this.getEntity('entities.pv2_power_187'),
			this.getEntity('entities.pv3_power_188'),
			this.getEntity('entities.pv4_power_189'),
			this.getEntity('entities.pv5_power'),
		];
		const statePvEnergy = [
			this.getEntity('entities.day_pv_energy_108'),
			this.getEntity('entities.pv1_production'),
			this.getEntity('entities.pv2_production'),
			this.getEntity('entities.pv3_production'),
			this.getEntity('entities.pv4_production'),
			this.getEntity('entities.pv5_production'),
		];
		const stateSolarSell = this.getEntity('entities.solar_sell_247', { state: 'undefined' });
		const statePVTotal = this.getEntity('entities.pv_total');
		const stateDailyPVEnergy = this.getEntity('entities.day_pv_energy_108');
		const stateMonthlyPVEnergy = this.getEntity('entities.monthly_pv_generation');
		const stateYearlyPVEnergy = this.getEntity('entities.yearly_pv_generation');
		const stateTotalSolarGeneration = this.getEntity('entities.total_pv_generation');
		const stateRemainingSolar = this.getEntity('entities.remaining_solar');
		const stateTomorrowSolar = this.getEntity('entities.tomorrow_solar');

		//Set defaults
		const { invert_aux } = config.load;

		const auxPower = stateAuxPower?.isValid() ? stateAuxPower.toPower(invert_aux) :
			(auxLoadState[0]?.toPower(invert_aux) || 0)
			+ (auxLoadState[1]?.toPower(invert_aux) || 0)
			+ (auxLoadState[2]?.toPower(invert_aux) || 0)
			+ (auxLoadState[3]?.toPower(invert_aux) || 0)
			+ (auxLoadState[4]?.toPower(invert_aux) || 0)
			+ (auxLoadState[5]?.toPower(invert_aux) || 0);

		const { invert_grid } = config.grid;
		const gridPowerL1 = stateGridPowerL1.toPower(invert_grid);
		const gridPowerL2 = stateGridPowerL2.toPower(invert_grid);
		const gridPowerL3 = stateGridPowerL3.toPower(invert_grid);
		const gridPowerTotal = config.entities?.grid_ct_power_total
			? stateGridCTPowerTotal.toPower(invert_grid)
			: gridPowerL1 + gridPowerL2 + gridPowerL3;

		const totalGridPower = gridPowerTotal;

		const gridVoltage = !stateGridVoltage.isNaN() ? stateGridVoltage.toNum(0) : null;
		const batteryCurrentDirection = !stateBatteryCurrentDirection.isNaN() ? stateBatteryCurrentDirection.toNum(0) : null;
		const genericInverterImage = config.inverter?.modern;

		const decimalPlaces = config.decimal_places;
		const decimalPlacesEnergy = config.decimal_places_energy;

		const loadShowDaily = config.load?.show_daily;
		const showNonessential = config.grid?.show_nonessential;
		let gridStatus = config.entities?.grid_connected_status_194 ? stateGridConnectedStatus.state : 'on';
		if (!validGridConnected.includes(gridStatus.toLowerCase()) && !validGridDisconnected.includes(gridStatus.toLowerCase())) {
			gridStatus = 'on';
		}

		const batteryVoltage = config.entities?.battery_voltage_183 ? stateBatteryVoltage.toNum(1) : 0;
		const autoScaledInverterPower = config.entities?.inverter_power_175
			? stateInverterPower.toPower()
			: 0;
		const autoScaledGridPower = config.entities?.grid_power_169
			? stateGridPower.toPower()
			: gridPowerTotal;

		const { invert_load } = config.load;
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

		let nonessentialLoads = config.grid?.additional_loads;
		if (!validNonLoadValues.includes(nonessentialLoads)) {
			nonessentialLoads = 0;
		}

		const gridShowDailyBuy = config.grid?.show_daily_buy;
		const gridShowDailySell = config.grid?.show_daily_sell;

		const batteryColourConfig = this.colourConvert(config.battery?.colour);
		const batteryChargeColour = this.colourConvert(config.battery?.charge_colour || batteryColourConfig);
		const batteryShowDaily = config.battery?.show_daily;

		let additionalLoads = config.load?.additional_loads;
		if (!validLoadValues.includes(additionalLoads)) {
			additionalLoads = 0;
		}

		let additionalAuxLoad = config.load?.aux_loads;
		if (!validAuxLoads.includes(additionalAuxLoad)) {
			additionalAuxLoad = 0;
		}

		const auxType = config.load?.aux_type; //valid options are gen,inverter, default, gen, boiler, pump, aircon


		const largeFont = config.large_font;
		const inverterColour = this.colourConvert(config.inverter?.colour);
		const enableAutarky = config.inverter?.autarky;
		const enableTimer = !config.entities.use_timer_248 ? false : stateUseTimer.state;
		const priorityLoad = !config.entities.priority_load_243 ? false : statePriorityLoad.state;
		let batteryPower = stateBatteryPower.toPower(config.battery?.invert_power);

		const cardHeight = this.getEntity('card_height', { state: config.card_height?.toString() ?? '' }).state;
		const cardWidth = this.getEntity('card_width', { state: config.card_width?.toString() ?? '' }).state;

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

		//totalSolar = pv1_power_186 + pv2_power_187 + pv3_power_188 + pv4_power_189 + pv5_power

		const pv1PowerWatts = statePvPower[1].toPower();
		const pv2PowerWatts = statePvPower[2].toPower();
		const pv3PowerWatts = statePvPower[3].toPower();
		const pv4PowerWatts = statePvPower[4].toPower();
		const pv5PowerWatts = statePvPower[5].toPower();

		const totalSolar = pv1PowerWatts + pv2PowerWatts + pv3PowerWatts + pv4PowerWatts + pv5PowerWatts;
		const totalPV = config.entities?.pv_total ? statePVTotal.toNum() : totalSolar;

		const solarColour =
			!config.solar.dynamic_colour
				? this.colourConvert(config.solar?.colour)
				: Utils.toNum(totalPV, 0) > Utils.toNum(config.solar?.off_threshold, 0)
					? this.colourConvert(config.solar?.colour)
					: this.GREY_COLOUR;

		//nonessentialPower = grid_ct_power_172 - grid_power_169

		let threePhase = config.inverter?.three_phase;
		if (!valid3phase.includes(threePhase)) {
			threePhase = false;
		}

		let nonessentialPower: number;
		const { essential_power, nonessential_power } = config.entities;


		if (config.entities?.grid_power_169) {
			if (threePhase === false) {
				nonessentialPower =
					nonessential_power === 'none' || !nonessential_power
						? gridPowerL1 - autoScaledGridPower
						: stateNonessentialPower.toPower();
			} else {
				nonessentialPower =
					nonessential_power === 'none' || !nonessential_power
						? gridPowerL1
						+ gridPowerL2
						+ gridPowerL3
						- autoScaledGridPower
						: stateNonessentialPower.toPower();
			}
		} else {
			nonessentialPower =
				nonessential_power === 'none' || !nonessential_power
					? this.sumPowers(nonessentialLoadState)
					: stateNonessentialPower.toPower();
		}

		//console.log('ESS POWER', essential_power, threePhase, config.entities.load_power_L1, config.entities.inverter_power_175, "with_inv_power",  autoScaledInverterPower, autoScaledGridPower, auxPower, autoScaledInverterPower + autoScaledGridPower - auxPower, "without_inv_power", totalPV, batteryPower, autoScaledGridPower, auxPower, totalPV + batteryPower + autoScaledGridPower - auxPower);
		//essentialPower = inverter_power_175 + grid_power_169 - aux_power_166 or  totalPV + battery_power_190 + grid_power_169 - aux_power_166
		const essentialPower:number =
			essential_power === 'none' || !essential_power
				? threePhase === true && config.entities.load_power_L1 && config.entities.load_power_L2 && config.entities.load_power_L3
					? Number(loadPowerL1) + Number(loadPowerL2) + Number(loadPowerL3)
					: (
						config.entities.inverter_power_175
							? autoScaledInverterPower + autoScaledGridPower - auxPower
							: totalPV + batteryPower + autoScaledGridPower - auxPower
					)
				: stateEssentialPower.toPower(invert_load);

		//Timer entities
		const prog1 = {
			time: this.getEntity('entities.prog1_time', { state: config.entities.prog1_time ?? '' }),
			capacity: this.getEntity('entities.prog1_capacity', { state: config.entities.prog1_capacity ?? '' }),
			charge: this.getEntity('entities.prog1_charge', { state: config.entities.prog1_charge ?? '' }),
		};
		const prog2 = {
			time: this.getEntity('entities.prog2_time', { state: config.entities.prog2_time ?? '' }),
			capacity: this.getEntity('entities.prog2_capacity', { state: config.entities.prog2_capacity ?? '' }),
			charge: this.getEntity('entities.prog2_charge', { state: config.entities.prog2_charge ?? '' }),
		};
		const prog3 = {
			time: this.getEntity('entities.prog3_time', { state: config.entities.prog3_time ?? '' }),
			capacity: this.getEntity('entities.prog3_capacity', { state: config.entities.prog3_capacity ?? '' }),
			charge: this.getEntity('entities.prog3_charge', { state: config.entities.prog3_charge ?? '' }),
		};
		const prog4 = {
			time: this.getEntity('entities.prog4_time', { state: config.entities.prog4_time ?? '' }),
			capacity: this.getEntity('entities.prog4_capacity', { state: config.entities.prog4_capacity ?? '' }),
			charge: this.getEntity('entities.prog4_charge', { state: config.entities.prog4_charge ?? '' }),
		};
		const prog5 = {
			time: this.getEntity('entities.prog5_time', { state: config.entities.prog5_time ?? '' }),
			capacity: this.getEntity('entities.prog5_capacity', { state: config.entities.prog5_capacity ?? '' }),
			charge: this.getEntity('entities.prog5_charge', { state: config.entities.prog5_charge ?? '' }),
		};
		const prog6 = {
			time: this.getEntity('entities.prog6_time', { state: config.entities.prog6_time ?? '' }),
			capacity: this.getEntity('entities.prog6_capacity', { state: config.entities.prog6_capacity ?? '' }),
			charge: this.getEntity('entities.prog6_charge', { state: config.entities.prog6_charge ?? '' }),
		};

		const shutdownOffGrid = stateShutdownSOCOffGrid.toNum();
		const batteryShutdown = stateShutdownSOC.toNum();

		const inverterProg: InverterSettings = {
			capacity: batteryShutdown,
			entityID: '',
		};


		//sunsynk-power-flow-card/v5.0.1  #522 by slipx06
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
			default: {
				inverterProg.show = true;

				const timer_now = new Date(); // Create a new Date object representing the current time
				//console.log(`Current date and time: ${timer_now.toLocaleString()}`);

				assignInverterProgramBasedOnTime(timer_now);

			function assignInverterProgramBasedOnTime(timer_now: Date) {
				const progTimes: { start: Date; end: Date }[] = [];

				// Populate the progTimes array with Date objects based on the current time
				[prog1, prog2, prog3, prog4, prog5, prog6].forEach((prog, index) => {
					if (!prog || !prog.time || !prog.time.state) {
						console.error(`Program ${index + 1} is not defined or has no valid time.`);
						return; // Skip this program
					}

					const [hours, minutes] = prog.time.state.split(':').map(item => parseInt(item, 10));
					const progStartTime = new Date(timer_now.getTime());
					progStartTime.setHours(hours);
					progStartTime.setMinutes(minutes);

					// Determine the end time for each program (next program's start time)
					const nextIndex = (index + 1) % [prog1, prog2, prog3, prog4, prog5, prog6].length;
					const nextProg = [prog1, prog2, prog3, prog4, prog5, prog6][nextIndex];
					const progEndTime = nextProg && nextProg.time && nextProg.time.state ?
						new Date(timer_now.getTime()) :
						new Date(timer_now.getTime());

					if (nextProg && nextProg.time && nextProg.time.state) {
						const [nextHours, nextMinutes] = nextProg.time.state.split(':').map(item => parseInt(item, 10));
						progEndTime.setHours(nextHours);
						progEndTime.setMinutes(nextMinutes);
					} else {
						console.warn(`Next program ${nextIndex + 1} is not defined or has no valid time.`);
					}

					//console.log(`Program ${index + 1} time (before adjustment): Start: ${progStartTime.toLocaleString()}, End: ${progEndTime.toLocaleString()}`);

					// Add to the progTimes array
					progTimes[index] = { start: progStartTime, end: progEndTime };
				});

				// Adjust times for the next day if necessary
				adjustProgramTimes(progTimes, timer_now);

				// Time comparison logic to determine the active program
				for (let i = 0; i < progTimes.length; i++) {
					const { start: currentProgStartTime, end: currentProgEndTime } = progTimes[i];

					// Check for normal case (start < end)
					if (currentProgStartTime <= timer_now && timer_now < currentProgEndTime) {
						//console.log(`Assigning Program ${i + 1}`);
						assignInverterProgValues([prog1, prog2, prog3, prog4, prog5, prog6][i], config.entities[`prog${i + 1}_charge`]);
						break; // Exit once the correct program is assigned
					}
					// Check for wrap-around case (start > end)
					else if (currentProgStartTime > currentProgEndTime) {
						if (timer_now >= currentProgStartTime || timer_now < currentProgEndTime) {
							assignInverterProgValues([prog1, prog2, prog3, prog4, prog5, prog6][i], config.entities[`prog${i + 1}_charge`]);
							break; // Exit once the correct program is assigned
						}
					}
				}
			}

			function adjustProgramTimes(progTimes: { start: Date; end: Date }[], timer_now: Date) {
				const currentTime = timer_now.getTime();
				progTimes.forEach((progTime) => {
					if (progTime.start.getTime() < currentTime && progTime.end.getTime() < currentTime) {
						progTime.start.setDate(progTime.start.getDate() + 1);
						progTime.end.setDate(progTime.end.getDate() + 1);
					}
				});
				return progTimes;
			}

			function assignInverterProgValues(prog: { time: CustomEntity; capacity: CustomEntity; charge: CustomEntity }, entityID: string) {
				if (prog.charge.state === 'No Grid or Gen' || prog.charge.state === '0' || prog.charge.state === 'off') {
					inverterProg.charge = 'none';
				} else {
					inverterProg.charge = 'both';
				}

				inverterProg.capacity = parseInt(prog.capacity.state);
				inverterProg.entityID = entityID;
			}

				break; }
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

		let maximumSOC = stateSOCEndOfCharge.toNum();
		maximumSOC = Math.max(50, Math.min(maximumSOC, 100));

		//calculate battery capacity
		let batteryCapacity: number = 0;
		if (config.show_battery) {
			switch (true) {
				case !inverterProg.show:
					if (config.battery.invert_flow ? batteryPower < 0 : batteryPower > 0) {
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
					} else if (config.battery.invert_flow ? batteryPower > 0 : batteryPower < 0) {
						batteryCapacity = maximumSOC;
					}
					break;

				default:
					batteryCapacity = inverterSettings.getBatteryCapacity(batteryPower, gridStatus, batteryShutdown, inverterProg, stateBatterySoc, maximumSOC, config.battery.invert_flow);
			}
		}

		//calculate remaining battery time to charge or discharge
		let totalSeconds = 0;
		let formattedResultTime = '';
		let batteryDuration = '';

		const battenergy = this.getEntity('battery.energy', { state: config.battery.energy?.toString() ?? '' });
		let batteryEnergy = battenergy.toPower(false);
		if (batteryVoltage && stateBatteryRatedCapacity.notEmpty()) {
			batteryEnergy = Utils.toNum(batteryVoltage * stateBatteryRatedCapacity.toNum(0), 0);
		}

		if (config.show_battery || batteryEnergy !== 0) {
			if (batteryPower === 0) {
				totalSeconds = ((stateBatterySoc.toNum() - batteryShutdown) / 100) * batteryEnergy * 60 * 60;
			} else if (config.battery.invert_flow ? batteryPower < 0 : batteryPower > 0) {
				totalSeconds =
					((((stateBatterySoc.toNum() - batteryCapacity) / 100) * batteryEnergy) / Math.abs(batteryPower)) * 60 * 60;
			} else if (config.battery.invert_flow ? batteryPower > 0 : batteryPower < 0) {
				totalSeconds =
					((((batteryCapacity - stateBatterySoc.toNum(0)) / 100) * batteryEnergy) / Math.abs(batteryPower)) * 60 * 60;
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

		const isFloating = this.isFloating(stateBatteryCurrent, stateBatterySoc);

		// Determine battery colours
		const batteryColour = this.batteryColour(config.battery.invert_flow, batteryPower, isFloating, batteryChargeColour, batteryColourConfig);
		const batteryBatteryBankColour = [
			this.batteryColour(config.battery.invert_flow, batteryBankPowerState[1 - 1].toPower(config.battery?.invert_power), this.isFloating(batteryBankCurrentState[1 - 1], batteryBankSocState[1 - 1]), batteryChargeColour, batteryColourConfig),
			this.batteryColour(config.battery.invert_flow, batteryBankPowerState[2 - 1].toPower(config.battery?.invert_power), this.isFloating(batteryBankCurrentState[2 - 1], batteryBankSocState[2 - 1]), batteryChargeColour, batteryColourConfig),
			this.batteryColour(config.battery.invert_flow, batteryBankPowerState[3 - 1].toPower(config.battery?.invert_power), this.isFloating(batteryBankCurrentState[3 - 1], batteryBankSocState[3 - 1]), batteryChargeColour, batteryColourConfig),
			this.batteryColour(config.battery.invert_flow, batteryBankPowerState[4 - 1].toPower(config.battery?.invert_power), this.isFloating(batteryBankCurrentState[4 - 1], batteryBankSocState[4 - 1]), batteryChargeColour, batteryColourConfig),
			this.batteryColour(config.battery.invert_flow, batteryBankPowerState[5 - 1].toPower(config.battery?.invert_power), this.isFloating(batteryBankCurrentState[5 - 1], batteryBankSocState[5 - 1]), batteryChargeColour, batteryColourConfig),
			this.batteryColour(config.battery.invert_flow, batteryBankPowerState[6 - 1].toPower(config.battery?.invert_power), this.isFloating(batteryBankCurrentState[6 - 1], batteryBankSocState[6 - 1]), batteryChargeColour, batteryColourConfig),
		];
		//Set Inverter Status Message and dot
		let inverterStateColour = '';
		let inverterStateMsg = '';
		let inverterState = stateInverterStatus.state;

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
				const { states, color, message } = info;
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
					const { states, color, message } = info;
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
			Utils.toNum(`${(config.battery.invert_flow ? batteryPower < 0 : batteryPower > 0) ? Math.abs(batteryPower) : 0}`) +
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
			Utils.toNum(`${(config.battery.invert_flow ? batteryPower > 0 : batteryPower < 0) ? Math.abs(batteryPower) : 0}`);
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
		const autarkyAuto = productionEnergy != 0 ? Math.max(Math.min(Math.round((1000 * consumptionEnergy) / productionEnergy) / 10, 100), 0) : 0;
		const autarkySelf = fullProductionEnergy != 0 ? Math.max(Math.min(Math.round((1000 * productionEnergy) / fullProductionEnergy) / 10, 100), 0) : 0;

		const batteryMaxPower = this.getEntity('battery.max_power', { state: config.battery.max_power?.toString() ?? '' });
		const solarMaxPower = this.getEntity('solar.max_power', { state: config.solar.max_power?.toString() ?? '' });
		const loadMaxPower = this.getEntity('load.max_power', { state: config.load.max_power?.toString() ?? '' });
		const gridMaxPower = this.getEntity('grid.max_power', { state: config.grid.max_power?.toString() ?? '' });

		//Calculate line width depending on power usage
		const pv1LineWidth = !config.solar.max_power ? minLineWidth : this.dynamicLineWidth(pv1PowerWatts, (solarMaxPower.toNum() || pv1PowerWatts), maxLineWidth, minLineWidth);
		const pv2LineWidth = !config.solar.max_power ? minLineWidth : this.dynamicLineWidth(pv2PowerWatts, (solarMaxPower.toNum() || pv2PowerWatts), maxLineWidth, minLineWidth);
		const pv3LineWidth = !config.solar.max_power ? minLineWidth : this.dynamicLineWidth(pv3PowerWatts, (solarMaxPower.toNum() || pv3PowerWatts), maxLineWidth, minLineWidth);
		const pv4LineWidth = !config.solar.max_power ? minLineWidth : this.dynamicLineWidth(pv4PowerWatts, (solarMaxPower.toNum() || pv4PowerWatts), maxLineWidth, minLineWidth);
		const pv5LineWidth = !config.solar.max_power ? minLineWidth : this.dynamicLineWidth(pv5PowerWatts, (solarMaxPower.toNum() || pv5PowerWatts), maxLineWidth, minLineWidth);
		const batLineWidth = !config.battery.max_power ? minLineWidth : this.dynamicLineWidth(Math.abs(batteryPower), (batteryMaxPower.toNum(0) || Math.abs(batteryPower)), maxLineWidth, minLineWidth);
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
				(Math.abs(batteryPower) / (batteryMaxPower.toNum(0) || Math.abs(batteryPower)));
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
		const allLoadPower = essentialPower + Math.max(auxPower, 0);

		const getPvPercentageRaw = (): number => {
			switch (true) {
				case totalPV === 0 :
					return 0;
				case (priorityLoad === 'off' || !priorityLoad) && config.battery.invert_flow && batteryPower >= 0:
				case (priorityLoad === 'off' || !priorityLoad) && !config.battery.invert_flow && batteryPower <= 0:
					return 100 * (totalPV - Math.abs(batteryPower)) / allLoadPower;
				case (priorityLoad === 'off' || !priorityLoad) && config.battery.invert_flow && batteryPower < 0:
				case (priorityLoad === 'off' || !priorityLoad) && !config.battery.invert_flow && batteryPower > 0:
				default:
					return 100 * totalPV / allLoadPower;
			}
		};
		const getBatteryPercentageRaw = (): number => {
			switch (true) {
				case config.battery.invert_flow && batteryPower >= 0:
				case !config.battery.invert_flow && batteryPower <= 0:
					return 0;
				case config.battery.invert_flow && batteryPower < 0:
				case !config.battery.invert_flow && batteryPower > 0:
				default:
					return 100 * Math.abs(batteryPower) / allLoadPower;
			}
		};

		const pvPercentageRaw = getPvPercentageRaw();

		const batteryPercentageRaw = getBatteryPercentageRaw();

		//console.log(`${pvPercentageRaw} % RAW PV to load, ${batteryPercentageRaw} % RAW Bat to load`);

		// Normalize percentages
		const totalPercentage = pvPercentageRaw + batteryPercentageRaw;
		const normalizedPvPercentage = totalPercentage === 0 ? 0 : (pvPercentageRaw / totalPercentage) * 100;
		const normalizedBatteryPercentage = totalPercentage === 0 ? 0 : (batteryPercentageRaw / totalPercentage) * 100;

		//console.log(`${normalizedPvPercentage} % normalizedPVPercentage to load, ${normalizedBatteryPercentage} % normalizedBatteryPercentage to load`);

		let pvPercentage: number;
		let batteryPercentage: number;
		let gridPercentage = 0;
		if (totalPercentage >= 100 || totalGridPower == 0) {
			pvPercentage = Utils.toNum(normalizedPvPercentage, 0);
			batteryPercentage = Utils.toNum(normalizedBatteryPercentage, 0);
		} else {
			pvPercentage = Utils.toNum(Math.min(pvPercentageRaw, 100), 0);
			batteryPercentage = Utils.toNum(Math.min(batteryPercentageRaw, 100), 0);
			gridPercentage = 100 - (pvPercentage + batteryPercentage);
		}

		//console.log(`${pvPercentage} % PVPercentage, ${batteryPercentage} % BatteryPercentage, ${gridPercentage} % GridPercentage`);

		//Calculate dynamic colour for battery icon based on the contribution of the power source (grid, solar) supplying the battery
		const pvPercentageRawBat = (totalPV === 0 || (config.battery.invert_flow ? batteryPower <= 0 : batteryPower >= 0))
			? 0
			: priorityLoad === 'off' || !priorityLoad
				? (totalPV / Math.abs(batteryPower)) * 100
				: ((totalPV - essentialPower) / Math.abs(batteryPower)) * 100;
		const gridPercentageRawBat = ((config.battery.invert_flow ? batteryPower <= 0 : batteryPower >= 0) || totalGridPower <= 0)
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

		let pvPercentageBat: number;
		let gridPercentageBat: number;
		if (totalPercentageBat >= 100 || totalGridPower == 0) {
			pvPercentageBat = Utils.toNum(normalizedPvPercentage_bat, 0);
			gridPercentageBat = Utils.toNum(normalizedGridPercentage, 0);
		} else {
			pvPercentageBat = Utils.toNum(Math.min(pvPercentageRawBat, 100), 0);
			gridPercentageBat = Utils.toNum(Math.min(gridPercentageRawBat, 100), 0);
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

		const { batteryIcon, batteryCharge, stopColour, battery0 } = BatteryIconManager.convert(stateBatterySoc);

		//Calculate pv efficiency
		const pv1MaxPower = this.getEntity('solar.pv1_max_power', { state: config.solar.pv1_max_power?.toString() ?? '' });
		const pv2MaxPower = this.getEntity('solar.pv2_max_power', { state: config.solar.pv2_max_power?.toString() ?? '' });
		const pv3MaxPower = this.getEntity('solar.pv3_max_power', { state: config.solar.pv3_max_power?.toString() ?? '' });
		const pv4MaxPower = this.getEntity('solar.pv4_max_power', { state: config.solar.pv4_max_power?.toString() ?? '' });
		const pv5MaxPower = this.getEntity('solar.pv5_max_power', { state: config.solar.pv5_max_power?.toString() ?? '' });

		let pvEfficiencyPerc = [100, 100, 100, 100, 100, 100];
		let pvEfficiencyKwhp = [NaN, NaN, NaN, NaN, NaN, NaN];

		if (config.solar.max_power && (config.solar.show_mppt_efficiency || config.solar.visualize_efficiency)) {
			pvEfficiencyPerc = [
				Utils.toNum(Math.min((totalPV / solarMaxPower.toNum()) * 100, 100), 0),
				Utils.toNum(Math.min((pv1PowerWatts / pv1MaxPower.toNum()) * 100, 100), 0),
				Utils.toNum(Math.min((pv2PowerWatts / pv2MaxPower.toNum()) * 100, 100), 0),
				Utils.toNum(Math.min((pv3PowerWatts / pv3MaxPower.toNum()) * 100, 100), 0),
				Utils.toNum(Math.min((pv4PowerWatts / pv4MaxPower.toNum()) * 100, 100), 0),
				Utils.toNum(Math.min((pv5PowerWatts / pv5MaxPower.toNum()) * 100, 100), 0),
			];
		}
		if (config.solar.max_power && config.solar.show_mppt_efficiency_kwhp) {
			pvEfficiencyKwhp = [
				stateDailyPVEnergy?.isValidElectric() ? Utils.toNum(stateDailyPVEnergy.toPower() / solarMaxPower.toNum(0), config.decimal_places) : NaN,
				statePvEnergy[1]?.isValidElectric() ? Utils.toNum(statePvEnergy[1].toPower() / pv1MaxPower.toNum(0), config.decimal_places) : NaN,
				statePvEnergy[2]?.isValidElectric() ? Utils.toNum(statePvEnergy[2].toPower() / pv2MaxPower.toNum(0), config.decimal_places) : NaN,
				statePvEnergy[3]?.isValidElectric() ? Utils.toNum(statePvEnergy[3].toPower() / pv3MaxPower.toNum(0), config.decimal_places) : NaN,
				statePvEnergy[4]?.isValidElectric() ? Utils.toNum(statePvEnergy[4].toPower() / pv4MaxPower.toNum(0), config.decimal_places) : NaN,
				statePvEnergy[5]?.isValidElectric() ? Utils.toNum(statePvEnergy[5].toPower() / pv5MaxPower.toNum(0), config.decimal_places) : NaN,
			];
		}

		//colors
		const loadColour = this.colourConvert(config.load?.colour);
		const dynamicColourEssentialLoad1 = this.calculateEssentialLoadColour(stateEssentialLoad1, stateEssentialLoad1Toggle, config.load?.off_threshold) || loadColour;
		const dynamicColourEssentialLoad2 = this.calculateEssentialLoadColour(stateEssentialLoad2, stateEssentialLoad2Toggle, config.load?.off_threshold) || loadColour;
		const dynamicColourEssentialLoad3 = this.calculateEssentialLoadColour(stateEssentialLoad3, stateEssentialLoad3Toggle, config.load?.off_threshold) || loadColour;
		const dynamicColourEssentialLoad4 = this.calculateEssentialLoadColour(stateEssentialLoad4, stateEssentialLoad4Toggle, config.load?.off_threshold) || loadColour;

		const essentialLoadCol1DynamicColour = [
			this.calculateEssentialLoadColour(essentialLoadCol1State[1 - 1], essentialLoadCol1ToggleState[1 - 1], config.load?.off_threshold, config.load?.load_1_1_color, config.load?.load_1_1_off_color, config.load?.load_1_1_max_color, config.load?.load_1_1_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol1State[2 - 1], essentialLoadCol1ToggleState[2 - 1], config.load?.off_threshold, config.load?.load_1_2_color, config.load?.load_1_2_off_color, config.load?.load_1_2_max_color, config.load?.load_1_2_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol1State[3 - 1], essentialLoadCol1ToggleState[3 - 1], config.load?.off_threshold, config.load?.load_1_3_color, config.load?.load_1_3_off_color, config.load?.load_1_3_max_color, config.load?.load_1_3_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol1State[4 - 1], essentialLoadCol1ToggleState[4 - 1], config.load?.off_threshold, config.load?.load_1_4_color, config.load?.load_1_4_off_color, config.load?.load_1_4_max_color, config.load?.load_1_4_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol1State[5 - 1], essentialLoadCol1ToggleState[5 - 1], config.load?.off_threshold, config.load?.load_1_5_color, config.load?.load_1_5_off_color, config.load?.load_1_5_max_color, config.load?.load_1_5_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol1State[6 - 1], essentialLoadCol1ToggleState[6 - 1], config.load?.off_threshold, config.load?.load_1_6_color, config.load?.load_1_6_off_color, config.load?.load_1_6_max_color, config.load?.load_1_6_max_threshold) || loadColour,
		];
		const essentialLoadCol2DynamicColour = [
			this.calculateEssentialLoadColour(essentialLoadCol2State[1 - 1], essentialLoadCol2ToggleState[1 - 1], config.load?.off_threshold, config.load?.load_2_1_color, config.load?.load_2_1_off_color, config.load?.load_2_1_max_color, config.load?.load_2_1_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol2State[2 - 1], essentialLoadCol2ToggleState[2 - 1], config.load?.off_threshold, config.load?.load_2_2_color, config.load?.load_2_2_off_color, config.load?.load_2_2_max_color, config.load?.load_2_2_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol2State[3 - 1], essentialLoadCol2ToggleState[3 - 1], config.load?.off_threshold, config.load?.load_2_3_color, config.load?.load_2_3_off_color, config.load?.load_2_3_max_color, config.load?.load_2_3_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol2State[4 - 1], essentialLoadCol2ToggleState[4 - 1], config.load?.off_threshold, config.load?.load_2_4_color, config.load?.load_2_4_off_color, config.load?.load_2_4_max_color, config.load?.load_2_4_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol2State[5 - 1], essentialLoadCol2ToggleState[5 - 1], config.load?.off_threshold, config.load?.load_2_5_color, config.load?.load_2_5_off_color, config.load?.load_2_5_max_color, config.load?.load_2_5_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol2State[6 - 1], essentialLoadCol2ToggleState[6 - 1], config.load?.off_threshold, config.load?.load_2_6_color, config.load?.load_2_6_off_color, config.load?.load_2_6_max_color, config.load?.load_2_6_max_threshold) || loadColour,
		];
		const essentialLoadCol3DynamicColour = [
			this.calculateEssentialLoadColour(essentialLoadCol3State[1 - 1], essentialLoadCol3ToggleState[1 - 1], config.load?.off_threshold, config.load?.load_3_1_color, config.load?.load_3_1_off_color, config.load?.load_3_1_max_color, config.load?.load_3_1_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol3State[2 - 1], essentialLoadCol3ToggleState[2 - 1], config.load?.off_threshold, config.load?.load_3_2_color, config.load?.load_3_2_off_color, config.load?.load_3_2_max_color, config.load?.load_3_2_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol3State[3 - 1], essentialLoadCol3ToggleState[3 - 1], config.load?.off_threshold, config.load?.load_3_3_color, config.load?.load_3_3_off_color, config.load?.load_3_3_max_color, config.load?.load_3_3_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol3State[4 - 1], essentialLoadCol3ToggleState[4 - 1], config.load?.off_threshold, config.load?.load_3_4_color, config.load?.load_3_4_off_color, config.load?.load_3_4_max_color, config.load?.load_3_4_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol3State[5 - 1], essentialLoadCol3ToggleState[5 - 1], config.load?.off_threshold, config.load?.load_3_5_color, config.load?.load_3_5_off_color, config.load?.load_3_5_max_color, config.load?.load_3_5_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol3State[6 - 1], essentialLoadCol3ToggleState[6 - 1], config.load?.off_threshold, config.load?.load_3_6_color, config.load?.load_3_6_off_color, config.load?.load_3_6_max_color, config.load?.load_3_6_max_threshold) || loadColour,
		];
		const essentialLoadCol4DynamicColour = [
			this.calculateEssentialLoadColour(essentialLoadCol4State[1 - 1], essentialLoadCol4ToggleState[1 - 1], config.load?.off_threshold, config.load?.load_4_1_color, config.load?.load_4_1_off_color, config.load?.load_4_1_max_color, config.load?.load_4_1_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol4State[2 - 1], essentialLoadCol4ToggleState[2 - 1], config.load?.off_threshold, config.load?.load_4_2_color, config.load?.load_4_2_off_color, config.load?.load_4_2_max_color, config.load?.load_4_2_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol4State[3 - 1], essentialLoadCol4ToggleState[3 - 1], config.load?.off_threshold, config.load?.load_4_3_color, config.load?.load_4_3_off_color, config.load?.load_4_3_max_color, config.load?.load_4_3_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol4State[4 - 1], essentialLoadCol4ToggleState[4 - 1], config.load?.off_threshold, config.load?.load_4_4_color, config.load?.load_4_4_off_color, config.load?.load_4_4_max_color, config.load?.load_4_4_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol4State[5 - 1], essentialLoadCol4ToggleState[5 - 1], config.load?.off_threshold, config.load?.load_4_5_color, config.load?.load_4_5_off_color, config.load?.load_4_5_max_color, config.load?.load_4_5_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol4State[6 - 1], essentialLoadCol4ToggleState[6 - 1], config.load?.off_threshold, config.load?.load_4_6_color, config.load?.load_4_6_off_color, config.load?.load_4_6_max_color, config.load?.load_4_6_max_threshold) || loadColour,
		];
		const essentialLoadCol5DynamicColour = [
			this.calculateEssentialLoadColour(essentialLoadCol5State[1 - 1], essentialLoadCol5ToggleState[1 - 1], config.load?.off_threshold, config.load?.load_5_1_color, config.load?.load_5_1_off_color, config.load?.load_5_1_max_color, config.load?.load_5_1_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol5State[2 - 1], essentialLoadCol5ToggleState[2 - 1], config.load?.off_threshold, config.load?.load_5_2_color, config.load?.load_5_2_off_color, config.load?.load_5_2_max_color, config.load?.load_5_2_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol5State[3 - 1], essentialLoadCol5ToggleState[3 - 1], config.load?.off_threshold, config.load?.load_5_3_color, config.load?.load_5_3_off_color, config.load?.load_5_3_max_color, config.load?.load_5_3_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol5State[4 - 1], essentialLoadCol5ToggleState[4 - 1], config.load?.off_threshold, config.load?.load_5_4_color, config.load?.load_5_4_off_color, config.load?.load_5_4_max_color, config.load?.load_5_4_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol5State[5 - 1], essentialLoadCol5ToggleState[5 - 1], config.load?.off_threshold, config.load?.load_5_5_color, config.load?.load_5_5_off_color, config.load?.load_5_5_max_color, config.load?.load_5_5_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol5State[6 - 1], essentialLoadCol5ToggleState[6 - 1], config.load?.off_threshold, config.load?.load_5_6_color, config.load?.load_5_6_off_color, config.load?.load_5_6_max_color, config.load?.load_5_6_max_threshold) || loadColour,
		];
		const essentialLoadCol6DynamicColour = [
			this.calculateEssentialLoadColour(essentialLoadCol6State[1 - 1], essentialLoadCol6ToggleState[1 - 1], config.load?.off_threshold, config.load?.load_6_1_color, config.load?.load_6_1_off_color, config.load?.load_6_1_max_color, config.load?.load_6_1_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol6State[2 - 1], essentialLoadCol6ToggleState[2 - 1], config.load?.off_threshold, config.load?.load_6_2_color, config.load?.load_6_2_off_color, config.load?.load_6_2_max_color, config.load?.load_6_2_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol6State[3 - 1], essentialLoadCol6ToggleState[3 - 1], config.load?.off_threshold, config.load?.load_6_3_color, config.load?.load_6_3_off_color, config.load?.load_6_3_max_color, config.load?.load_6_3_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol6State[4 - 1], essentialLoadCol6ToggleState[4 - 1], config.load?.off_threshold, config.load?.load_6_4_color, config.load?.load_6_4_off_color, config.load?.load_6_4_max_color, config.load?.load_6_4_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol6State[5 - 1], essentialLoadCol6ToggleState[5 - 1], config.load?.off_threshold, config.load?.load_6_5_color, config.load?.load_6_5_off_color, config.load?.load_6_5_max_color, config.load?.load_6_5_max_threshold) || loadColour,
			this.calculateEssentialLoadColour(essentialLoadCol6State[6 - 1], essentialLoadCol6ToggleState[6 - 1], config.load?.off_threshold, config.load?.load_6_6_color, config.load?.load_6_6_off_color, config.load?.load_6_6_max_color, config.load?.load_6_6_max_threshold) || loadColour,
		];

		config.title_colour = this.colourConvert(config.title_colour);


		const nonEssentialLoadMainDynamicColour = nonessentialPower > Utils.toNum(config.grid?.off_threshold, 0)
			? nonessentialPower > 0 ? gridImportColour : gridExportColour
			: this.GREY_COLOUR;

		const nonEssentialLoadDynamicColour = [
			this.getDynamicColorWithToggle(nonessentialLoadState[1 - 1], nonEssentialLoadToggleState[1 - 1], config.grid?.off_threshold, config.grid?.load1_import_color, config.grid?.load1_export_color, config.grid?.load1_off_color),
			this.getDynamicColorWithToggle(nonessentialLoadState[2 - 1], nonEssentialLoadToggleState[2 - 1], config.grid?.off_threshold, config.grid?.load2_import_color, config.grid?.load2_export_color, config.grid?.load2_off_color),
			this.getDynamicColorWithToggle(nonessentialLoadState[3 - 1], nonEssentialLoadToggleState[3 - 1], config.grid?.off_threshold, config.grid?.load3_import_color, config.grid?.load3_export_color, config.grid?.load3_off_color),
			this.getDynamicColorWithToggle(nonessentialLoadState[4 - 1], nonEssentialLoadToggleState[4 - 1], config.grid?.off_threshold, config.grid?.load4_import_color, config.grid?.load4_export_color, config.grid?.load4_off_color),
			this.getDynamicColorWithToggle(nonessentialLoadState[5 - 1], nonEssentialLoadToggleState[5 - 1], config.grid?.off_threshold, config.grid?.load5_import_color, config.grid?.load5_export_color, config.grid?.load5_off_color),
			this.getDynamicColorWithToggle(nonessentialLoadState[6 - 1], nonEssentialLoadToggleState[6 - 1], config.grid?.off_threshold, config.grid?.load6_import_color, config.grid?.load6_export_color, config.grid?.load6_off_color),
		];
		const gridOffColour = this.colourConvert(config.grid?.grid_off_colour || gridColour);

		const auxColour = this.colourConvert(config.load?.aux_colour);
		const auxOffColour = this.colourConvert(config.load?.aux_off_colour || this.GREY_COLOUR);
		const auxLoadDynamicColour = [
			this.calculateAuxLoadColour(auxLoadState[1 - 1], auxLoadToggleState[1 - 1], config.load?.off_threshold, config.load?.aux_load1_color, config.load?.aux_load1_off_color) || auxColour,
			this.calculateAuxLoadColour(auxLoadState[2 - 1], auxLoadToggleState[2 - 1], config.load?.off_threshold, config.load?.aux_load2_color, config.load?.aux_load2_off_color) || auxColour,
			this.calculateAuxLoadColour(auxLoadState[3 - 1], auxLoadToggleState[3 - 1], config.load?.off_threshold, config.load?.aux_load3_color, config.load?.aux_load3_off_color) || auxColour,
			this.calculateAuxLoadColour(auxLoadState[4 - 1], auxLoadToggleState[4 - 1], config.load?.off_threshold, config.load?.aux_load4_color, config.load?.aux_load4_off_color) || auxColour,
			this.calculateAuxLoadColour(auxLoadState[5 - 1], auxLoadToggleState[5 - 1], config.load?.off_threshold, config.load?.aux_load5_color, config.load?.aux_load5_off_color) || auxColour,
			this.calculateAuxLoadColour(auxLoadState[6 - 1], auxLoadToggleState[6 - 1], config.load?.off_threshold, config.load?.aux_load6_color, config.load?.aux_load6_off_color) || auxColour,
		];

		let auxDynamicColour = auxOffColour;
		auxDynamicColour = auxLoadDynamicColour[1 - 1] != auxOffColour ? auxLoadDynamicColour[1 - 1] : auxDynamicColour;
		auxDynamicColour = auxLoadDynamicColour[2 - 1] != auxOffColour ? auxLoadDynamicColour[2 - 1] : auxDynamicColour;
		auxDynamicColour = auxLoadDynamicColour[3 - 1] != auxOffColour ? auxLoadDynamicColour[3 - 1] : auxDynamicColour;
		auxDynamicColour = auxLoadDynamicColour[4 - 1] != auxOffColour ? auxLoadDynamicColour[4 - 1] : auxDynamicColour;
		auxDynamicColour = auxLoadDynamicColour[5 - 1] != auxOffColour ? auxLoadDynamicColour[5 - 1] : auxDynamicColour;
		auxDynamicColour = auxLoadDynamicColour[6 - 1] != auxOffColour ? auxLoadDynamicColour[6 - 1] : auxDynamicColour;
		auxDynamicColour = stateAuxPower.isValid() && Math.abs(stateAuxPower.toPower()) > Utils.toNum(config.load?.off_threshold, 0) ? auxColour : auxDynamicColour;

		let flowBatColour: string;
		switch (true) {
			case pvPercentageBat >= Utils.toNum(config.battery?.path_threshold, 0):
				flowBatColour = Utils.toHexColor(solarColour);
				break;
			case gridPercentageBat >= Utils.toNum(config.battery?.path_threshold, 0):
				flowBatColour = Utils.toHexColor(gridColour);
				break;
			default:
				flowBatColour = Utils.toHexColor(batteryColour);
				break;
		}

		let flowColour: string;
		switch (true) {
			case pvPercentage >= Utils.toNum(config.load?.path_threshold, 0):
				flowColour = Utils.toHexColor(solarColour);
				break;
			case batteryPercentage >= Utils.toNum(config.load?.path_threshold, 0):
				flowColour = Utils.toHexColor(batteryColour);
				break;
			case gridPercentage >= Utils.toNum(config.load?.path_threshold, 0):
				flowColour = Utils.toHexColor(gridColour);
				break;
			default:
				flowColour = Utils.toHexColor(loadColour);
				break;
		}

		let flowInvColour: string;
		switch (true) {
			case pvPercentage >= Utils.toNum(config.load?.path_threshold, 0):
				flowInvColour = Utils.toHexColor(solarColour);
				break;
			case batteryPercentage >= Utils.toNum(config.load?.path_threshold, 0):
				flowInvColour = Utils.toHexColor(batteryColour);
				break;
			case gridPercentage >= Utils.toNum(config.load?.path_threshold, 0):
				flowInvColour = Utils.toHexColor(gridColour);
				break;
			case gridPercentageBat >= Utils.toNum(config.battery?.path_threshold, 0):
				flowInvColour = Utils.toHexColor(gridColour);
				break;
			default:
				flowInvColour = Utils.toHexColor(inverterColour);
				break;
		}


		//Icons
		const iconEssentialLoad1 = this.getEntity('load.load1_icon', { state: config.load?.load1_icon?.toString() ?? '' }).state;
		const iconEssentialLoad2 = this.getEntity('load.load2_icon', { state: config.load?.load2_icon?.toString() ?? '' }).state;
		const iconEssentialLoad3 = this.getEntity('load.load3_icon', { state: config.load?.load3_icon?.toString() ?? '' }).state;
		const iconEssentialLoad4 = this.getEntity('load.load4_icon', { state: config.load?.load4_icon?.toString() ?? '' }).state;
		const essentialLoadCol1Icon = [
			this.getEntity('load.load_1_1_icon', { state: config.load?.load_1_1_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_1_2_icon', { state: config.load?.load_1_2_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_1_3_icon', { state: config.load?.load_1_3_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_1_4_icon', { state: config.load?.load_1_4_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_1_5_icon', { state: config.load?.load_1_5_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_1_6_icon', { state: config.load?.load_1_6_icon?.toString() ?? '' }).state,
		];
		const essentialLoadCol2Icon = [
			this.getEntity('load.load_2_1_icon', { state: config.load?.load_2_1_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_2_2_icon', { state: config.load?.load_2_2_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_2_3_icon', { state: config.load?.load_2_3_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_2_4_icon', { state: config.load?.load_2_4_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_2_5_icon', { state: config.load?.load_2_5_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_2_6_icon', { state: config.load?.load_2_6_icon?.toString() ?? '' }).state,
		];
		const essentialLoadCol3Icon = [
			this.getEntity('load.load_3_1_icon', { state: config.load?.load_3_1_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_3_2_icon', { state: config.load?.load_3_2_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_3_3_icon', { state: config.load?.load_3_3_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_3_4_icon', { state: config.load?.load_3_4_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_3_5_icon', { state: config.load?.load_3_5_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_3_6_icon', { state: config.load?.load_3_6_icon?.toString() ?? '' }).state,
		];
		const essentialLoadCol4Icon = [
			this.getEntity('load.load_4_1_icon', { state: config.load?.load_4_1_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_4_2_icon', { state: config.load?.load_4_2_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_4_3_icon', { state: config.load?.load_4_3_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_4_4_icon', { state: config.load?.load_4_4_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_4_5_icon', { state: config.load?.load_4_5_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_4_6_icon', { state: config.load?.load_4_6_icon?.toString() ?? '' }).state,
		];
		const essentialLoadCol5Icon = [
			this.getEntity('load.load_5_1_icon', { state: config.load?.load_5_1_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_5_2_icon', { state: config.load?.load_5_2_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_5_3_icon', { state: config.load?.load_5_3_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_5_4_icon', { state: config.load?.load_5_4_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_5_5_icon', { state: config.load?.load_5_5_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_5_6_icon', { state: config.load?.load_5_6_icon?.toString() ?? '' }).state,
		];
		const essentialLoadCol6Icon = [
			this.getEntity('load.load_6_1_icon', { state: config.load?.load_6_1_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_6_2_icon', { state: config.load?.load_6_2_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_6_3_icon', { state: config.load?.load_6_3_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_6_4_icon', { state: config.load?.load_6_4_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_6_5_icon', { state: config.load?.load_6_5_icon?.toString() ?? '' }).state,
			this.getEntity('load.load_6_6_icon', { state: config.load?.load_6_6_icon?.toString() ?? '' }).state,
		];

		const auxLoadIcon = [
			this.getEntity('load.aux_load1_icon', { state: config.load?.aux_load1_icon?.toString() ?? '' }).state,
			this.getEntity('load.aux_load2_icon', { state: config.load?.aux_load2_icon?.toString() ?? '' }).state,
			this.getEntity('load.aux_load3_icon', { state: config.load?.aux_load3_icon?.toString() ?? '' }).state,
			this.getEntity('load.aux_load4_icon', { state: config.load?.aux_load4_icon?.toString() ?? '' }).state,
			this.getEntity('load.aux_load5_icon', { state: config.load?.aux_load5_icon?.toString() ?? '' }).state,
			this.getEntity('load.aux_load6_icon', { state: config.load?.aux_load6_icon?.toString() ?? '' }).state,
		];
		const nonessentialIcon = this.getEntity('grid.nonessential_icon', { state: config.grid?.nonessential_icon?.toString() ?? '' }).state;

		const nonessentialLoadIcon = [
			this.getEntity('grid.load1_icon', { state: config.grid?.load1_icon?.toString() ?? '' }).state,
			this.getEntity('grid.load2_icon', { state: config.grid?.load2_icon?.toString() ?? '' }).state,
			this.getEntity('grid.load3_icon', { state: config.grid?.load3_icon?.toString() ?? '' }).state,
			this.getEntity('grid.load4_icon', { state: config.grid?.load4_icon?.toString() ?? '' }).state,
			this.getEntity('grid.load5_icon', { state: config.grid?.load5_icon?.toString() ?? '' }).state,
			this.getEntity('grid.load6_icon', { state: config.grid?.load6_icon?.toString() ?? '' }).state,
		];
		const iconGridImport = this.getEntity('grid.import_icon', { state: config.grid?.import_icon?.toString() ?? '' }).state;
		const iconGridDisconnected = this.getEntity('grid.disconnected_icon', { state: config.grid?.disconnected_icon?.toString() ?? '' }).state;
		const iconGridExport = this.getEntity('grid.export_icon', { state: config.grid?.export_icon?.toString() ?? '' }).state;


		let customGridIcon: string;
		let customGridIconColour: string;
		switch (true) {
			case totalGridPower < 0 && validGridConnected.includes(gridStatus.toLowerCase()):
				customGridIcon = iconGridExport;
				customGridIconColour = Utils.toHexColor(gridColour);
				break;
			case totalGridPower >= 0 && validGridConnected.includes(gridStatus.toLowerCase()):
				customGridIcon = iconGridImport;
				customGridIconColour = Utils.toHexColor(gridColour);
				break;
			case totalGridPower === 0 && validGridDisconnected.includes(gridStatus.toLowerCase()):
				customGridIcon = iconGridDisconnected;
				customGridIconColour = Utils.toHexColor(gridOffColour);
				break;
			default:
				customGridIcon = iconGridImport;
				customGridIconColour = Utils.toHexColor(gridColour);
				break;
		}


		const data: DataDto = {
			config,
			timestamp_id: new Date().getTime(),
			refreshTime,
			compactMode: true,
			cardHeight,
			cardWidth,
			loadColour,
			batteryColour,
			gridColour,
			gridImportColour,
			gridExportColour,
			isFloating,
			inverterColour,
			solarColour,
			auxOffColour,
			batteryEnergy,
			largeFont,
			batteryPower: batteryPower,
			stateBatteryPower,
			batteryDuration,
			batteryCapacity,
			additionalLoads,
			essIconSize,
			essIcon,
			stateUseTimer,
			batteryStateMsg,
			stateBatterySoc,
			inverterProg,

			batteryPercentage,
			batteryBankPowerState,
			batteryBankVoltageState,
			batteryBankCurrentState,
			batteryBankTempState,
			batteryBankDeltaState,
			batteryBankSocState,
			batteryBankRemainingStorageState,
			batteryBankEnergy,
			batteryBatteryBankColour,

			pvPercentage,
			loadShowDaily,
			stateEnergyCostSell,
			stateEnergyCostBuy,
			loadPowerL1,
			loadPowerL2,
			loadPowerL3,
			durationCur: this.durationCur,
			stateGridPowerL1,
			stateGridPowerL2,
			stateGridPowerL3,
			stateGridVoltageL1,
			stateGridVoltageL2,
			stateGridVoltageL3,
			stateGridCurrentL1,
			stateGridCurrentL2,
			stateGridCurrentL3,
			decimalPlaces,
			decimalPlacesEnergy,
			//old essential load
			stateEssentialLoad1,
			stateEssentialLoad2,
			stateEssentialLoad3,
			stateEssentialLoad4,
			stateEssentialLoad1Extra,
			stateEssentialLoad2Extra,
			stateEssentialLoad3Extra,
			stateEssentialLoad4Extra,
			stateEssentialLoad1Toggle,
			stateEssentialLoad2Toggle,
			stateEssentialLoad3Toggle,
			stateEssentialLoad4Toggle,
			iconEssentialLoad1,
			iconEssentialLoad2,
			iconEssentialLoad3,
			iconEssentialLoad4,
			dynamicColourEssentialLoad1,
			dynamicColourEssentialLoad2,
			dynamicColourEssentialLoad3,
			dynamicColourEssentialLoad4,
			//new essential load
			essentialLoadCol1State,
			essentialLoadCol2State,
			essentialLoadCol3State,
			essentialLoadCol4State,
			essentialLoadCol5State,
			essentialLoadCol6State,
			essentialLoadCol1ExtraState,
			essentialLoadCol2ExtraState,
			essentialLoadCol3ExtraState,
			essentialLoadCol4ExtraState,
			essentialLoadCol5ExtraState,
			essentialLoadCol6ExtraState,
			essentialLoadCol1ToggleState,
			essentialLoadCol2ToggleState,
			essentialLoadCol3ToggleState,
			essentialLoadCol4ToggleState,
			essentialLoadCol5ToggleState,
			essentialLoadCol6ToggleState,
			essentialLoadCol1DynamicColour,
			essentialLoadCol2DynamicColour,
			essentialLoadCol3DynamicColour,
			essentialLoadCol4DynamicColour,
			essentialLoadCol5DynamicColour,
			essentialLoadCol6DynamicColour,
			essentialLoadCol1Icon,
			essentialLoadCol2Icon,
			essentialLoadCol3Icon,
			essentialLoadCol4Icon,
			essentialLoadCol5Icon,
			essentialLoadCol6Icon,

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
			energyCost,
			stateInverterCurrentL1,
			stateInverterCurrentL2,
			stateInverterCurrentL3,
			stateRadiatorTemp,
			stateInverterVoltageL1,
			stateInverterVoltageL2,
			stateInverterVoltageL3,
			stateBatteryVoltage,
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
			batteryStateColour,
			inverterStateColour,
			stateBatteryTemp,
			statePrepaidUnits,
			stateDCTransformerTemp,
			stateInverterLoadPercentage,
			enableTimer,
			stateSolarSell,
			priorityLoad,
			inverterImg,
			stateDailyPVEnergy,
			stateMonthlyPVEnergy,
			stateYearlyPVEnergy,
			stateTotalSolarGeneration,
			stateRemainingSolar,
			stateTomorrowSolar,
			statePVTotal,
			statePvCurrent,
			statePvVoltage,
			statePvPower,
			statePvEnergy,
			stateDayLoadEnergy,
			stateDayBatteryDischarge,
			stateDayGridImport,
			stateDayBatteryCharge,
			stateDayGridExport,
			minLineWidth,
			stopColour,
			gridStatus,
			batteryCharge,
			gridOffColour,
			batteryIcon,
			formattedResultTime,

			showNonessential,
			nonessentialLoads,
			nonessentialIcon,
			nonessentialLoadIcon,
			nonessentialLoadState,
			nonEssentialLoadExtraState,
			nonEssentialLoadToggleState,
			nonEssentialLoadMainDynamicColour,
			nonEssentialLoadDynamicColour,

			inverterStateMsg,
			nonessentialPower,
			stateNonessentialDailyEnergy,
			nonessLineWidth,
			grid169LineWidth,

			auxType,
			auxPower,
			additionalAuxLoad,
			stateAuxPower,
			stateDayAuxEnergy,
			auxLineWidth,
			auxLoadMainDynamicColour: auxDynamicColour,
			auxLoadIcon,
			auxLoadDynamicColour,
			auxLoadState,
			auxLoadExtraState,
			auxLoadToggleState,

			autoScaledInverterPower,
			autoScaledGridPower,
			stateMaxSellPower,
			pvEfficiencyPerc,
			pvEfficiencyKwhp,
			gridPercentage,
			flowColour,
			flowBatColour,
			flowInvColour,
			stateBatteryRemainingStorage,
			stateBatterySOH,
			customGridIcon,
			customGridIconColour,
			maximumSOC,
			stateLoadFrequency,
			stateGridFrequency,
		};

		return compactCard(config, inverterImg, data);
	}

	private sumPowers(entities: CustomEntity[], abs: boolean = false) {
		let result = 0;
		for (let i = 0; i < entities.length; i++) {
			const value = entities[i].toPower(false);
			result += abs ? Math.abs(value) : value;
		}
		return result;
	}

	private getNowTime(): string {
		const currentTime = new Date();
		const formattedHours = currentTime.getHours().toString().padStart(2, '0');
		const formattedMinutes = currentTime.getMinutes().toString().padStart(2, '0');
		const formattedSeconds = currentTime.getSeconds().toString().padStart(2, '0');
		const formattedMilliSeconds = currentTime.getMilliseconds().toString().padStart(2, '0');
		return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliSeconds}`;
	}

	private batteryColour(invertFlow: boolean, batteryPower: number, isFloating: boolean, batteryChargeColour: string, batteryColourConfig: string) {
		if ((invertFlow ? batteryPower > 0 : batteryPower < 0) && !isFloating) {
			return batteryChargeColour;
		} else {
			return batteryColourConfig;
		}
	}

	private isFloating(stateBatteryCurrent: CustomEntity, stateBatterySoc: CustomEntity) {
		return -2 <= stateBatteryCurrent.toNum(0) && stateBatteryCurrent.toNum(0) <= 2 && stateBatterySoc.toNum(0) >= 99;
	}

	/**
	 * Fetches the entity object, returned the defaultValue when the entity is not found. Pass null for no default.
	 * @param entity
	 * @param defaultValue
	 */
	private getEntity(entity: keyof PowerFlowCardConfig,
	                  defaultValue: Partial<CustomEntity> | null = {
		                  state: '0', attributes: { unit_of_measurement: '' },
	                  }): CustomEntity {
		return getEntity(this._config, this.hass, entity, defaultValue);
	}

	changeAnimationSpeed(el: string, speedRaw: number) {
		const speed = speedRaw >= 1 ? Utils.toNum(speedRaw, 3) : 1;
		const flow = this[`${el}Flow`] as SVGSVGElement;
		this.durationCur[el] = speed;
		if (flow && this.durationPrev[el] != speed) {
			flow.setCurrentTime(flow.getCurrentTime() * (speed / this.durationPrev[el]));
		}
		this.durationPrev[el] = this.durationCur[el];
	}

	private colourConvert(colour: string) {
		return colour && Array.isArray(colour) ? Utils.toHexColor(`rgb(${colour})`) : Utils.toHexColor(colour);
	}

	private dynamicLineWidth(power: number, maxPower: number, width: number, defaultLineWidth: number = 1) {
		let lineWidth: number;
		if (!this._config.dynamic_line_width) {
			lineWidth = Math.min(defaultLineWidth, 8);
		} else {
			lineWidth = Math.min((defaultLineWidth + Math.min(power / maxPower, 1) * width), 8);
		}
		return lineWidth;
	}

	private calculateAuxLoadColour(
		powerEntity: CustomEntity, toggleEntity: CustomEntity,
		threshold: number,
		load_color: string, load_off_color: string,
		max_color?: string, max_threshold?: number,
	) {
		return this.calculateLoadColour(this._config.load.aux_dynamic_colour, this._config.load?.aux_colour,
			powerEntity, toggleEntity,
			threshold,
			load_color, load_off_color,
			max_color, max_threshold,
		);
	}

	private calculateEssentialLoadColour(
		powerEntity: CustomEntity, toggleEntity: CustomEntity,
		threshold: number,
		load_color?: string, load_off_color?: string,
		max_color?: string, max_threshold?: number,
	) {
		return this.calculateLoadColour(this._config.load.dynamic_colour, this._config.load?.colour,
			powerEntity, toggleEntity,
			threshold,
			load_color, load_off_color,
			max_color, max_threshold,
		);
	}

	private calculateLoadColour(
		dynamic_colour: boolean, default_colour: string,
		powerEntity: CustomEntity, toggleEntity: CustomEntity,
		threshold: number,
		load_color?: string, load_off_color?: string,
		max_color?: string, max_threshold?: number,
	) {
		const colour = this.colourConvert(load_color ? load_color : default_colour);
		const max_colour = this.colourConvert(max_color ? max_color : colour);
		const off_colour = this.colourConvert(load_off_color ? load_off_color : this.GREY_COLOUR);
		const max_th = (max_threshold ? Utils.toNum(max_threshold, 0) : Infinity) || Infinity;
		const isOverMaxThreshold = Math.abs(powerEntity.toPower(false)) > Utils.toNum(max_th, 0);
		const isOverThreshold = Math.abs(powerEntity.toPower(false)) > Utils.toNum(threshold, 0);

		const getColor = (): string => {
			switch (true) {
				case !dynamic_colour:
					return colour;
				case toggleEntity.isValidSwitch() && toggleEntity.toOnOff() === 'on' && isOverMaxThreshold :
					return max_colour;
				case toggleEntity.isValidSwitch() && toggleEntity.toOnOff() === 'on' :
					return colour;
				case toggleEntity.isValidSwitch() :
					return off_colour;
				case isOverMaxThreshold :
					return max_colour;
				case isOverThreshold :
					return colour;
				default:
					return off_colour;
			}
		};
		return getColor();
	}

	private getDynamicColorWithToggle(
		powerEntity: CustomEntity, toggleEntity: CustomEntity,
		threshold: number,
		import_color?: string, export_color?: string, off_color?: string,
	) {
		const gridImportColour = this.colourConvert(import_color ? import_color : this._config.grid?.colour);
		const gridExportColour = this.colourConvert(export_color ? export_color : (this._config.grid?.export_colour || gridImportColour));
		const noGridColour = this.colourConvert(off_color ? off_color : (this._config.grid?.no_grid_colour || this.GREY_COLOUR));

		return toggleEntity.isValidSwitch()
			? toggleEntity.toOnOff() === 'on' ? gridImportColour : noGridColour
			: Math.abs(powerEntity.toPower(false)) > Utils.toNum(threshold, 0)
				? powerEntity.toPower(false) > 0 ? gridImportColour : gridExportColour
				: noGridColour
			;
	}

	setConfig(config: PowerFlowCardConfig) {
		if (config.show_battery && !config.battery) {
			throw Error(localize('errors.battery.bat'));
		} else {
			if (config.show_battery && !config.battery.shutdown_soc) {
				throw new Error(localize('errors.battery.shutdown_soc'));
			}
			if (config.show_battery && config.battery.show_daily &&
				(!config.entities.day_battery_charge_70 || !config.entities.day_battery_discharge_71)
			) {
				throw Error(localize('errors.battery.show_daily'));
			}
		}
		if (config.show_solar && !config.solar) {
			throw Error(localize('errors.solar.sol'));
		} else if (config.show_solar && !config.solar.mppts) {
			throw Error(localize('errors.solar.mppts'));
		}

		if (config && config.grid && config.grid.show_daily_buy && !config.entities.day_grid_import_76 ||
			config && config.grid && config.grid.show_daily_sell && !config.entities.day_grid_export_77
		) {
			throw Error(localize('errors.grid.show_daily'));
		}

		if (config && config.entities && config.entities.essential_power === 'none' && !config.entities.inverter_power_175 ||
			config && config.entities && config.entities.essential_power === 'none' && config.entities.inverter_power_175 === 'none'
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

		const refresh_time: string = this.getNowTime();
		const conf2: RefreshCardConfig = {
			type: config.type,
			refresh_time,
		};

		this._config = merge({}, defaultConfig, config, conf2);
		this.renderInterval = this._config?.low_resources?.refresh_interval || 500;
		this.requestUpdate();
	}
}

(window as any).customCards.push({
	type: 'mlk-power-flow-card',
	name: 'Power Flow Card by Molikk',
	preview: true,
	description: localize('common.description'),
	configurable: true,
	element: PowerFlowCard,
});
