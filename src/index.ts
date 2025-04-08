import { CSSResultGroup, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { styles } from './style';
import { AdditionalLoadsViewMode, PowerFlowCardConfig, RefreshCardConfig } from './types';
import defaultConfig from './defaults';
import { CARD_VERSION, EDITOR_NAME, MAIN_NAME } from './const';
import { localize } from './localize/localize';
import merge from 'lodash.merge';
import { compactCard } from './cards/compact-card';
import { globalData } from './helpers/globals';
import { DataProvider } from './dataProvider';

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



	private lastRenderTime: number;
	private lastRenderLoopTime: number;
	private renderInterval: number;
	private rafId: number;

	constructor() {
		super();
		this.rafId = 0;
		this.lastRenderTime = 0;
		this.lastRenderLoopTime = 0;
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
			if (timestamp - this.lastRenderLoopTime >= this.renderInterval) {
				this.requestUpdate();
				this.lastRenderLoopTime = timestamp;

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

	// this is initial
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
				additional_loads_view_mode: AdditionalLoadsViewMode.none,
			},
			grid: {
				show_daily_buy: false,
				show_daily_sell: false,
				show_nonessential: false,
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
			schema_version: 4,
		} as unknown as PowerFlowCardConfig;
	}

	render() {
		globalData.hass = this.hass;
		const config = this._config;

		let { inverterImg, data } = new DataProvider(this.hass, config).calculateData();

		return compactCard(config, inverterImg, data);
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

		this.validatePv1PowerAttribute(all_attributes, config);

		const refresh_time: string = DataProvider.getNowTime();
		const conf2: RefreshCardConfig = {
			type: config.type,
			refresh_time,
		};

		this._config = merge({}, defaultConfig, config, conf2);
		this.renderInterval = this._config?.low_resources?.refresh_interval || 500;
		this.requestUpdate();
	}

	private validatePv1PowerAttribute(all_attributes: string[], config: PowerFlowCardConfig) {
		for (const attr of all_attributes) {
			if (attr === 'pv1_power_186' && config.show_solar && !config.entities[attr]) {
				throw new Error(`${localize('errors.missing_entity')} e.g: ${attr}: sensor.example`);
			}
		}
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
