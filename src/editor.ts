import { html, LitElement, TemplateResult } from 'lit';
import { fireEvent, HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { AdditionalLoadsViewMode, AutarkyType, BatteryBanksViewMode, InverterModel, PowerFlowCardConfig } from './types';
import { customElement, property } from 'lit/decorators.js';
import { capitalize } from 'lodash';
import { EDITOR_NAME, SensorDeviceClass } from './const';
import { LovelaceConfig } from 'custom-card-helpers/src/types';
import { localize } from './localize/localize';
import { getEntity } from './inverters/dto/custom-entity';

@customElement(EDITOR_NAME)
export class ConfigurationCardEditor extends LitElement implements LovelaceCardEditor {
	@property() public hass!: HomeAssistant;
	@property() private _config!: PowerFlowCardConfig;
	@property() lovelace?: LovelaceConfig;

	public setConfig(config: PowerFlowCardConfig): void {
		this._config = { ...this._config, ...config };
		if (ConfigurationCardEditor.isUpgradeable(this._config, 2)) {
			console.log('Updating version to schema 2');

			this.rewriteConfig(this._config, 'entities', 'essential_load_1_2', 'essential_load1', false);
			this.rewriteConfig(this._config, 'entities', 'essential_load_2_2', 'essential_load2', false);
			this.rewriteConfig(this._config, 'entities', 'essential_load_1_4', 'essential_load3', false);
			this.rewriteConfig(this._config, 'entities', 'essential_load_2_4', 'essential_load4', false);
			this.rewriteConfig(this._config, 'entities', 'essential_load_1_5', 'essential_load5');
			this.rewriteConfig(this._config, 'entities', 'essential_load_2_5', 'essential_load6');
			this.rewriteConfig(this._config, 'entities', 'essential_load_1_1', 'essential_load7');
			this.rewriteConfig(this._config, 'entities', 'essential_load_2_1', 'essential_load8');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_1', 'essential_load9');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_2', 'essential_load10');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_3', 'essential_load11');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_4', 'essential_load12');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_5', 'essential_load13');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_1', 'essential_load14');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_2', 'essential_load15');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_3', 'essential_load16');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_4', 'essential_load17');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_5', 'essential_load18');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_1', 'essential_load19');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_2', 'essential_load20');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_3', 'essential_load21');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_4', 'essential_load22');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_5', 'essential_load23');

			this.rewriteConfig(this._config, 'entities', 'essential_load_1_2_extra', 'essential_load1_extra', false);
			this.rewriteConfig(this._config, 'entities', 'essential_load_2_2_extra', 'essential_load2_extra', false);
			this.rewriteConfig(this._config, 'entities', 'essential_load_1_4_extra', 'essential_load3_extra', false);
			this.rewriteConfig(this._config, 'entities', 'essential_load_2_4_extra', 'essential_load4_extra', false);
			this.rewriteConfig(this._config, 'entities', 'essential_load_1_5_extra', 'essential_load5_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_2_5_extra', 'essential_load6_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_1_1_extra', 'essential_load7_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_2_1_extra', 'essential_load8_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_1_extra', 'essential_load9_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_2_extra', 'essential_load10_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_3_extra', 'essential_load11_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_4_extra', 'essential_load12_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_5_extra', 'essential_load13_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_1_extra', 'essential_load14_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_2_extra', 'essential_load15_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_3_extra', 'essential_load16_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_4_extra', 'essential_load17_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_5_extra', 'essential_load18_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_1_extra', 'essential_load19_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_2_extra', 'essential_load20_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_3_extra', 'essential_load21_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_4_extra', 'essential_load22_extra');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_5_extra', 'essential_load23_extra');

			this.rewriteConfig(this._config, 'entities', 'essential_load_1_2_toggle', 'essential_load1_toggle', false);
			this.rewriteConfig(this._config, 'entities', 'essential_load_2_2_toggle', 'essential_load2_toggle', false);
			this.rewriteConfig(this._config, 'entities', 'essential_load_1_4_toggle', 'essential_load3_toggle', false);
			this.rewriteConfig(this._config, 'entities', 'essential_load_2_4_toggle', 'essential_load4_toggle', false);
			this.rewriteConfig(this._config, 'entities', 'essential_load_1_5_toggle', 'essential_load5_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_2_5_toggle', 'essential_load6_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_1_1_toggle', 'essential_load7_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_2_1_toggle', 'essential_load8_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_1_toggle', 'essential_load9_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_2_toggle', 'essential_load10_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_3_toggle', 'essential_load11_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_4_toggle', 'essential_load12_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_3_5_toggle', 'essential_load13_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_1_toggle', 'essential_load14_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_2_toggle', 'essential_load15_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_3_toggle', 'essential_load16_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_4_toggle', 'essential_load17_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_4_5_toggle', 'essential_load18_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_1_toggle', 'essential_load19_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_2_toggle', 'essential_load20_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_3_toggle', 'essential_load21_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_4_toggle', 'essential_load22_toggle');
			this.rewriteConfig(this._config, 'entities', 'essential_load_5_5_toggle', 'essential_load23_toggle');

			this.rewriteConfig(this._config, 'load', 'load_1_2_name', 'load1_name', false);
			this.rewriteConfig(this._config, 'load', 'load_2_2_name', 'load2_name', false);
			this.rewriteConfig(this._config, 'load', 'load_1_4_name', 'load3_name', false);
			this.rewriteConfig(this._config, 'load', 'load_2_4_name', 'load4_name', false);
			this.rewriteConfig(this._config, 'load', 'load_1_5_name', 'load5_name');
			this.rewriteConfig(this._config, 'load', 'load_2_5_name', 'load6_name');
			this.rewriteConfig(this._config, 'load', 'load_1_1_name', 'load7_name');
			this.rewriteConfig(this._config, 'load', 'load_2_1_name', 'load8_name');
			this.rewriteConfig(this._config, 'load', 'load_3_1_name', 'load9_name');
			this.rewriteConfig(this._config, 'load', 'load_3_2_name', 'load10_name');
			this.rewriteConfig(this._config, 'load', 'load_3_3_name', 'load11_name');
			this.rewriteConfig(this._config, 'load', 'load_3_4_name', 'load12_name');
			this.rewriteConfig(this._config, 'load', 'load_3_5_name', 'load13_name');
			this.rewriteConfig(this._config, 'load', 'load_4_1_name', 'load14_name');
			this.rewriteConfig(this._config, 'load', 'load_4_2_name', 'load15_name');
			this.rewriteConfig(this._config, 'load', 'load_4_3_name', 'load16_name');
			this.rewriteConfig(this._config, 'load', 'load_4_4_name', 'load17_name');
			this.rewriteConfig(this._config, 'load', 'load_4_5_name', 'load18_name');
			this.rewriteConfig(this._config, 'load', 'load_5_1_name', 'load19_name');
			this.rewriteConfig(this._config, 'load', 'load_5_2_name', 'load20_name');
			this.rewriteConfig(this._config, 'load', 'load_5_3_name', 'load21_name');
			this.rewriteConfig(this._config, 'load', 'load_5_4_name', 'load22_name');
			this.rewriteConfig(this._config, 'load', 'load_5_5_name', 'load23_name');

			this.rewriteConfig(this._config, 'load', 'load_1_2_icon', 'load1_icon', false);
			this.rewriteConfig(this._config, 'load', 'load_2_2_icon', 'load2_icon', false);
			this.rewriteConfig(this._config, 'load', 'load_1_4_icon', 'load3_icon', false);
			this.rewriteConfig(this._config, 'load', 'load_2_4_icon', 'load4_icon', false);
			this.rewriteConfig(this._config, 'load', 'load_1_5_icon', 'load5_icon');
			this.rewriteConfig(this._config, 'load', 'load_2_5_icon', 'load6_icon');
			this.rewriteConfig(this._config, 'load', 'load_1_1_icon', 'load7_icon');
			this.rewriteConfig(this._config, 'load', 'load_2_1_icon', 'load8_icon');
			this.rewriteConfig(this._config, 'load', 'load_3_1_icon', 'load9_icon');
			this.rewriteConfig(this._config, 'load', 'load_3_2_icon', 'load10_icon');
			this.rewriteConfig(this._config, 'load', 'load_3_3_icon', 'load11_icon');
			this.rewriteConfig(this._config, 'load', 'load_3_4_icon', 'load12_icon');
			this.rewriteConfig(this._config, 'load', 'load_3_5_icon', 'load13_icon');
			this.rewriteConfig(this._config, 'load', 'load_4_1_icon', 'load14_icon');
			this.rewriteConfig(this._config, 'load', 'load_4_2_icon', 'load15_icon');
			this.rewriteConfig(this._config, 'load', 'load_4_3_icon', 'load16_icon');
			this.rewriteConfig(this._config, 'load', 'load_4_4_icon', 'load17_icon');
			this.rewriteConfig(this._config, 'load', 'load_4_5_icon', 'load18_icon');
			this.rewriteConfig(this._config, 'load', 'load_5_1_icon', 'load19_icon');
			this.rewriteConfig(this._config, 'load', 'load_5_2_icon', 'load20_icon');
			this.rewriteConfig(this._config, 'load', 'load_5_3_icon', 'load21_icon');
			this.rewriteConfig(this._config, 'load', 'load_5_4_icon', 'load22_icon');
			this.rewriteConfig(this._config, 'load', 'load_5_5_icon', 'load23_icon');

			if (this._config['wide']) {
				this._config['wide_view_mode'] = this._config['wide'];
			}
			this._config['load']['additional_loads_view_mode'] = this.getAdditionalLoadsViewMode(this._config, this.hass);
			console.log("additional_loads_view_mode changed to: " + this._config['load']['additional_loads_view_mode']);

			this._config['schema_version'] = 2;

			fireEvent(this, 'config-changed', { config: this._config });
		}
		if (ConfigurationCardEditor.isUpgradeable(this._config, 3)) {
			console.log('Updating version to schema 3');

			this._config['load']['additional_loads_view_mode'] = this.getAdditionalLoadsViewMode(this._config, this.hass);
			console.log("additional_loads_view_mode changed to: " + this._config['load']['additional_loads_view_mode']);

			this._config['schema_version'] = 3;

			fireEvent(this, 'config-changed', { config: this._config });
		}
		if (ConfigurationCardEditor.isUpgradeable(this._config, 4)) {
			console.log('Updating version to schema 4');

			this._config['low_resources'] = { refresh_interval: 500, animations: true };
			this._config['schema_version'] = 4;

			fireEvent(this, 'config-changed', { config: this._config });
		}
	}

	private rewriteConfig(config: PowerFlowCardConfig, className: string, newName: string, oldName: string, clearOldValue: boolean = true) {
		if (config[className][oldName]) {
			config[className][newName] = config[className][oldName];
			if (clearOldValue) {
				config[className][oldName] = undefined;
			}
		}
	}

	public static isUpgradeable(config: PowerFlowCardConfig, version: number) {
		return !config.schema_version || config.schema_version < version;
	}

	public static isConfigUpgradeable(config: PowerFlowCardConfig) {
		return this.isUpgradeable(config, 4);
	}

	protected render(): TemplateResult | void {
		if (!this._config || !this.hass) {
			return html``;
		}

		return html`
					<ha-form
						.hass=${this.hass}
						.data=${this._config}
						.computeLabel=${this._computeLabelCallback.bind(this)}
						.schema=${[
							{
								type: 'expandable',
								title: this._title('title'),
								schema: [
									{
										type: 'grid',
										schema: [
											{ name: 'title', selector: { text: {} } },
											{ name: 'title_colour', selector: { color_rgb: {} } },
											{ name: 'title_size', selector: { text: {} } },
										],
									},
								],
							},
							{
								type: 'expandable',
								title: this._title('general'),
								schema: [
									{
										type: 'grid',
										schema: [
											{ name: 'large_font', selector: { boolean: {} } },
											{ name: 'wide_view_mode', selector: { boolean: {} } },
											{ name: 'card_height', selector: { text: {} } },
											{ name: 'card_width', selector: { text: {} } },
											{ name: 'show_solar', selector: { boolean: {} } },
											{ name: 'show_battery', selector: { boolean: {} } },
											{ name: 'show_grid', selector: { boolean: {} } },
											{ name: 'dynamic_line_width', selector: { boolean: {} } },
											{ name: 'max_line_width', selector: { number: {} } },
											{ name: 'min_line_width', selector: { number: {} } },
											{ name: 'decimal_places', selector: { number: {} } },
											{ name: 'decimal_places_energy', selector: { number: {} } },
										],
									},
									{
										type: 'expandable',
										title: this._title('adv_viewbox'),
										schema: [
											{
												name: 'viewbox',
												type: 'grid',
												schema: [
													{ name: 'viewbox_min_x', selector: { number: {} } },
													{ name: 'viewbox_min_y', selector: { number: {} } },
													{ name: 'viewbox_width', selector: { number: {} } },
													{ name: 'viewbox_height', selector: { number: {} } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('low_resources'),
										schema: [
											{
												name: 'low_resources',
												type: 'grid',
												schema: [
													{ name: 'refresh_interval', selector: { number: { mode: 'box', min: 1, max: 10000 } } },
													{ name: 'animations', selector: { boolean: {} } },
												],
											},
										],
									},
								],
							},
							{
								type: 'expandable',
								title: this._title('inverter'),
								schema: [
									{
										name: 'inverter',
										type: 'grid',
										schema: [
											{ name: 'three_phase', selector: { boolean: {} } },
											{ name: 'auto_scale', selector: { boolean: {} } },
											this.generateInverterModelItem(),
											{ name: 'modern', selector: { boolean: {} } },
											this.generateInverterAutarkyItem(),
											{ name: 'colour', selector: { color_rgb: {} } },
											{ name: 'navigate', selector: { text: {} } },
											{ name: 'invert_flow', selector: { boolean: {} } },
											{ name: 'ac_icon', selector: { icon: {} } },
											{ name: 'dc_icon', selector: { icon: {} } },
										],
									},
									{
										type: 'expandable',
										title: this._title('inv'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'inverter_status_59', selector: { entity: {} } },
													{ name: 'inverter_voltage_154', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'inverter_voltage_L2', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'inverter_voltage_L3', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'load_frequency_192', selector: { entity: { device_class: SensorDeviceClass.FREQUENCY } } },
													{ name: 'inverter_current_164', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
													{ name: 'inverter_current_L2', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
													{ name: 'inverter_current_L3', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
													{ name: 'inverter_power_175', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'grid_power_169', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'dc_transformer_temp_90', selector: { entity: { device_class: SensorDeviceClass.TEMPERATURE } } },
													{ name: 'radiator_temp_91', selector: { entity: { device_class: SensorDeviceClass.TEMPERATURE } } },
													{ name: 'inverter_load_percentage', selector: { entity: { domain: 'sensor', unit_of_measurement: '%' } } },
													{ name: 'use_timer_248', selector: { entity: {} } },
													{ name: 'priority_load_243', selector: { entity: {} } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('inv_prog'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													...this.generateInverterProg(1),
													...this.generateInverterProg(2),
													...this.generateInverterProg(3),
													...this.generateInverterProg(4),
													...this.generateInverterProg(5),
													...this.generateInverterProg(6),
												],
											},
										],
									},
								],
							},
							{
								type: 'expandable',
								title: this._title('solar'),
								schema: [
									{
										name: 'solar',
										type: 'grid',
										schema: [
											{ name: 'mppts', selector: { number: { min: 1, max: 5 } } },
											{ name: 'auto_scale', selector: { boolean: {} } },
											{ name: 'colour', selector: { color_rgb: {} } },
											{ name: 'navigate', selector: { text: {} } },
											{ name: 'invert_flow', selector: { boolean: {} } },
											{ name: 'dynamic_colour', selector: { boolean: {} } },
											{ name: 'animation_speed', selector: { number: {} } },
											{ name: 'off_threshold', selector: { number: {} } },
											{ name: 'visualize_efficiency', selector: { boolean: {} } },
											{ name: 'show_mppt_efficiency', selector: { boolean: {} } },
											{ name: 'show_mppt_efficiency_kwhp', selector: { boolean: {} } },
											{ name: 'show_mppt_production', selector: { boolean: {} } },
											{ name: 'hide_header_units', selector: { boolean: {} } },
											{ name: 'fixed_header_item_width', selector: { number: {} } },
										],
									},
									{
										type: 'expandable',
										title: this._title('solar_header'),
										schema: [
											{
												name: 'solar',
												type: 'grid',
												schema: [
													{ name: 'daily_solar_name', selector: { text: {} } },
													{ name: 'monthly_solar_name', selector: { text: {} } },
													{ name: 'yearly_solar_name', selector: { text: {} } },
													{ name: 'total_solar_generation_name', selector: { text: {} } },
													{ name: 'remaining_solar_name', selector: { text: {} } },
													{ name: 'tomorrow_solar_name', selector: { text: {} } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('solar_header_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'pv_total', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'day_pv_energy_108', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'monthly_pv_generation', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'yearly_pv_generation', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'total_pv_generation', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'remaining_solar', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'tomorrow_solar', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('max_power'),
										schema: [
											{
												name: 'solar',
												type: 'grid',
												schema: [
													{ name: 'max_power', selector: { number: {} } },
													{ name: 'pv1_max_power', selector: { number: {} } },
													{ name: 'pv2_max_power', selector: { number: {} } },
													{ name: 'pv3_max_power', selector: { number: {} } },
													{ name: 'pv4_max_power', selector: { number: {} } },
													{ name: 'pv5_max_power', selector: { number: {} } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('mppt_options'),
										schema: [
											{
												name: 'solar',
												type: 'grid',
												schema: [
													{ name: 'pv1_name', selector: { text: {} } },
													{ name: 'pv2_name', selector: { text: {} } },
													{ name: 'pv3_name', selector: { text: {} } },
													{ name: 'pv4_name', selector: { text: {} } },
													{ name: 'pv5_name', selector: { text: {} } },
												],
											},
										],
									},
									this.generatePVEntitiesGroup(1, 'power_186', 'voltage_109', 'current_110'),
									this.generatePVEntitiesGroup(2, 'power_187', 'voltage_111', 'current_112'),
									this.generatePVEntitiesGroup(3, 'power_188', 'voltage_113', 'current_114'),
									this.generatePVEntitiesGroup(4, 'power_189', 'voltage_115', 'current_116'),
									this.generatePVEntitiesGroup(5),
									{
										type: 'expandable',
										title: this._title('optional_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'solar_sell_247', selector: { entity: {} } },
													{ name: 'environment_temp', selector: { entity: { device_class: SensorDeviceClass.TEMPERATURE } } },
												],
											},
										],
									},
								],
							},
							{
								type: 'expandable',
								title: this._title('battery'),
								schema: [
									{
										name: 'battery',
										type: 'grid',
										schema: [
											{ name: 'energy', selector: { number: { min: 0 } } },
											{ name: 'shutdown_soc', selector: { number: { mode: 'box', min: 0, max: 100 } } },
											{ name: 'shutdown_soc_offgrid', selector: { number: { mode: 'box', min: 0, max: 100 } } },
											{ name: 'soc_end_of_charge', selector: { number: { mode: 'box', min: 50, max: 100 } } },
											{ name: 'show_daily', selector: { boolean: {} } },
											{ name: 'auto_scale', selector: { boolean: {} } },
											{ name: 'invert_power', selector: { boolean: {} } },
											{ name: 'show_absolute', selector: { boolean: {} } },
											{ name: 'colour', selector: { color_rgb: {} } },
											{ name: 'navigate', selector: { text: {} } },
											{ name: 'invert_flow', selector: { boolean: {} } },
											{ name: 'charge_colour', selector: { color_rgb: {} } },
											{ name: 'dynamic_colour', selector: { boolean: {} } },
											{ name: 'linear_gradient', selector: { boolean: {} } },
											{ name: 'animate', selector: { boolean: {} } },
											{ name: 'animation_speed', selector: { number: {} } },
											{ name: 'hide_soc', selector: { boolean: {} } },
											{ name: 'show_remaining_energy', selector: { boolean: {} } },
											{ name: 'remaining_energy_to_shutdown', selector: { boolean: {} } },
											{ name: 'runtime_in_kwh', selector: { boolean: {} } },
											{ name: 'max_power', selector: { number: {} } },
											{ name: 'path_threshold', selector: { number: {} } },
										],
									},
									{
										type: 'expandable',
										title: this._title('battery_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'battery_power_190', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'battery_soc_184', selector: { entity: { device_class: SensorDeviceClass.BATTERY } } },
													{ name: 'battery_current_191', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
													{ name: 'battery_voltage_183', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'battery_temp_182', selector: { entity: { device_class: SensorDeviceClass.TEMPERATURE } } },
													{ name: 'day_battery_charge_70', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'day_battery_discharge_71', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'battery_remaining_storage', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'battery_rated_capacity', selector: { entity: {} } },
													{ name: 'battery_soh', selector: { entity: {} } },
													{ name: 'battery_current_direction', selector: { entity: {} } },
													{ name: 'battery_status', selector: { entity: {} } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('optional_ent'),
										schema: [
											{
												name: 'battery',
												type: 'grid',
												schema: [
													{ name: 'energy', selector: { entity: {} } },
													{ name: 'shutdown_soc', selector: { entity: {} } },
													{ name: 'shutdown_soc_offgrid', selector: { entity: {} } },
													{ name: 'max_power', selector: { entity: {} } },
												],
											},
										],
									},
								],
							},
							{
								type: 'expandable',
								title: this._title('battery_bank'),
								schema: [
									{
										name: 'battery',
										type: 'grid',
										schema: [
											{ name: 'show_battery_banks', selector: { boolean: {} } },
											{
												name: 'battery_banks_view_mode',
												selector: {
													select: {
														options: Object.values(BatteryBanksViewMode).map(x => ({
															label: capitalize(x),
															value: x,
														})),
													},
												},
											},
											{ name: 'battery_banks', selector: { number: { mode: 'box', min: 0, max: 6 } } },
											{ name: 'battery_bank_1_energy', selector: { number: { min: 0 } } },
											{ name: 'battery_bank_2_energy', selector: { number: { min: 0 } } },
											{ name: 'battery_bank_3_energy', selector: { number: { min: 0 } } },
											{ name: 'battery_bank_4_energy', selector: { number: { min: 0 } } },
											{ name: 'battery_bank_5_energy', selector: { number: { min: 0 } } },
											{ name: 'battery_bank_6_energy', selector: { number: { min: 0 } } },

										],
									},
									this.generateBatteryBankEntities(1),
									this.generateBatteryBankEntities(2),
									this.generateBatteryBankEntities(3),
									this.generateBatteryBankEntities(4),
									this.generateBatteryBankEntities(5),
									this.generateBatteryBankEntities(6),
								],
							},
							{
								type: 'expandable',
								title: this._title('load'),
								schema: [
									{
										name: 'load',
										type: 'grid',
										schema: [
											{ name: 'show_daily', selector: { boolean: {} } },
											{ name: 'label_daily_load', selector: { text: {} } },
											{ name: 'auto_scale', selector: { boolean: {} } },
											{ name: 'colour', selector: { color_rgb: {} } },
											{ name: 'navigate', selector: { text: {} } },
											{ name: 'invert_flow', selector: { boolean: {} } },
											{ name: 'dynamic_colour', selector: { boolean: {} } },
											{ name: 'dynamic_icon', selector: { boolean: {} } },
											{ name: 'invert_load', selector: { boolean: {} } },
											{ name: 'essential_name', selector: { text: {} } },
											{ name: 'animation_speed', selector: { number: {} } },
											{ name: 'max_power', selector: { number: {} } },
											{ name: 'off_threshold', selector: { number: {} } },
											{ name: 'path_threshold', selector: { number: {} } },
										],
									},
									{
										type: 'expandable',
										title: this._title('load_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'day_load_energy_84', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_power', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'load_power_L1', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'load_power_L2', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'load_power_L3', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
												],
											},
										],
									},
								],
							},
							{
								type: 'expandable',
								title: this._title('additional_loads'),
								schema: [
									{
										name: 'load',
										type: 'grid',
										schema: [
											{
												name: 'additional_loads_view_mode',
												selector: {
													select: {
														options: Object.values(AdditionalLoadsViewMode).map(x => ({
															label: capitalize(x),
															value: x,
														})),
													},
												},
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('additional_loads_0'),
										schema: [
											{
												name: 'load',
												type: 'grid',
												schema: [
													{ name: 'additional_loads', selector: { number: { mode: 'box', min: 0, max: 4 } } },
													...this.generateOldLoadOptions('load', '1', ''),
													...this.generateOldLoadOptions('load', '2', ''),
													...this.generateOldLoadOptions('load', '3', ''),
													...this.generateOldLoadOptions('load', '4', ''),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('ess_ld_0'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													...this.generateLoadEntities('essential_load', '1', ''),
													...this.generateLoadEntities('essential_load', '2', ''),
													...this.generateLoadEntities('essential_load', '3', ''),
													...this.generateLoadEntities('essential_load', '4', ''),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('additional_loads_1'),
										schema: [
											{
												name: 'load',
												type: 'grid',
												schema: [
													...this.generateLoadOptions('load', '1_1'),
													...this.generateLoadOptions('load', '1_2'),
													...this.generateLoadOptions('load', '1_4'),
													...this.generateLoadOptions('load', '1_5'),
													...this.generateLoadOptions('load', '1_6'),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('ess_ld_1'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													...this.generateLoadEntities('essential_load', '1_1'),
													...this.generateLoadEntities('essential_load', '1_2'),
													...this.generateLoadEntities('essential_load', '1_4'),
													...this.generateLoadEntities('essential_load', '1_5'),
													...this.generateLoadEntities('essential_load', '1_6'),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('additional_loads_2'),
										schema: [
											{
												name: 'load',
												type: 'grid',
												schema: [
													...this.generateLoadOptions('load', '2_1'),
													...this.generateLoadOptions('load', '2_2'),
													...this.generateLoadOptions('load', '2_4'),
													...this.generateLoadOptions('load', '2_5'),
													...this.generateLoadOptions('load', '2_6'),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('ess_ld_2'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													...this.generateLoadEntities('essential_load', '2_1'),
													...this.generateLoadEntities('essential_load', '2_2'),
													...this.generateLoadEntities('essential_load', '2_4'),
													...this.generateLoadEntities('essential_load', '2_5'),
													...this.generateLoadEntities('essential_load', '2_6'),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('additional_loads_3'),
										schema: [
											{
												name: 'load',
												type: 'grid',
												schema: [
													...this.generateLoadOptions('load', '3_1'),
													...this.generateLoadOptions('load', '3_2'),
													...this.generateLoadOptions('load', '3_3'),
													...this.generateLoadOptions('load', '3_4'),
													...this.generateLoadOptions('load', '3_5'),
													...this.generateLoadOptions('load', '3_6'),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('ess_ld_3'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													...this.generateLoadEntities('essential_load', '3_1'),
													...this.generateLoadEntities('essential_load', '3_2'),
													...this.generateLoadEntities('essential_load', '3_3'),
													...this.generateLoadEntities('essential_load', '3_4'),
													...this.generateLoadEntities('essential_load', '3_5'),
													...this.generateLoadEntities('essential_load', '3_6'),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('additional_loads_4'),
										schema: [
											{
												name: 'load',
												type: 'grid',
												schema: [
													...this.generateLoadOptions('load', '4_1'),
													...this.generateLoadOptions('load', '4_2'),
													...this.generateLoadOptions('load', '4_3'),
													...this.generateLoadOptions('load', '4_4'),
													...this.generateLoadOptions('load', '4_5'),
													...this.generateLoadOptions('load', '4_6'),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('ess_ld_4'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													...this.generateLoadEntities('essential_load', '4_1'),
													...this.generateLoadEntities('essential_load', '4_2'),
													...this.generateLoadEntities('essential_load', '4_3'),
													...this.generateLoadEntities('essential_load', '4_4'),
													...this.generateLoadEntities('essential_load', '4_5'),
													...this.generateLoadEntities('essential_load', '4_6'),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('additional_loads_5'),
										schema: [
											{
												name: 'load',
												type: 'grid',
												schema: [
													...this.generateLoadOptions('load', '5_1'),
													...this.generateLoadOptions('load', '5_2'),
													...this.generateLoadOptions('load', '5_3'),
													...this.generateLoadOptions('load', '5_4'),
													...this.generateLoadOptions('load', '5_5'),
													...this.generateLoadOptions('load', '5_6'),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('ess_ld_5'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													...this.generateLoadEntities('essential_load', '5_1'),
													...this.generateLoadEntities('essential_load', '5_2'),
													...this.generateLoadEntities('essential_load', '5_3'),
													...this.generateLoadEntities('essential_load', '5_4'),
													...this.generateLoadEntities('essential_load', '5_5'),
													...this.generateLoadEntities('essential_load', '5_6'),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('additional_loads_6'),
										schema: [
											{
												name: 'load',
												type: 'grid',
												schema: [
													...this.generateLoadOptions('load', '6_1'),
													...this.generateLoadOptions('load', '6_2'),
													...this.generateLoadOptions('load', '6_3'),
													...this.generateLoadOptions('load', '6_4'),
													...this.generateLoadOptions('load', '6_5'),
													...this.generateLoadOptions('load', '6_6'),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('ess_ld_6'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													...this.generateLoadEntities('essential_load', '6_1'),
													...this.generateLoadEntities('essential_load', '6_2'),
													...this.generateLoadEntities('essential_load', '6_3'),
													...this.generateLoadEntities('essential_load', '6_4'),
													...this.generateLoadEntities('essential_load', '6_5'),
													...this.generateLoadEntities('essential_load', '6_6'),
												],
											},
										],
									},
								],
							},
							{
								type: 'expandable',
								title: this._title('aux_load'),
								schema: [
									{
										name: 'load',
										type: 'grid',
										schema: [
											{ name: 'show_aux', selector: { boolean: {} } },
											{ name: 'aux_loads', selector: { number: { mode: 'box', min: 0, max: 6 } } },
											{ name: 'aux_name', selector: { text: {} } },
											{ name: 'aux_daily_name', selector: { text: {} } },
											{ name: 'aux_type', selector: { icon: {} } },
											{ name: 'invert_aux', selector: { boolean: {} } },
											{ name: 'show_absolute_aux', selector: { boolean: {} } },
											{ name: 'aux_dynamic_colour', selector: { boolean: {} } },
											{ name: 'aux_colour', selector: { color_rgb: {} } },
											{ name: 'aux_off_colour', selector: { color_rgb: {} } },
											{ name: 'show_daily_aux', selector: { boolean: {} } },
											{ name: 'aux_invert_flow', selector: { boolean: {} } },
										],

									},
									{
										type: 'expandable',
										title: this._title('aux_load_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'day_aux_energy', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'aux_power_166', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('aux_load_row_1'),
										schema: [
											{
												name: 'load',
												type: 'grid',
												schema: [
													...this.generateLoadOptions('load', '1', ''),
													...this.generateLoadOptions('load', '2', ''),
													...this.generateLoadOptions('load', '3', ''),
													...this.generateLoadOptions('load', '4', ''),
													...this.generateLoadOptions('load', '5', ''),
													...this.generateLoadOptions('load', '6', ''),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('aux_load_row_1_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													...this.generateLoadEntities('non_essential_load', '1', ''),
													...this.generateLoadEntities('non_essential_load', '2', ''),
													...this.generateLoadEntities('non_essential_load', '3', ''),
													...this.generateLoadEntities('non_essential_load', '4', ''),
													...this.generateLoadEntities('non_essential_load', '5', ''),
													...this.generateLoadEntities('non_essential_load', '6', ''),
												],
											},
										],
									},
								],
							},
							{
								type: 'expandable',
								title: this._title('grid'),
								schema: [
									{
										name: 'grid',
										type: 'grid',
										schema: [
											{ name: 'grid_name', selector: { text: {} } },
											{ name: 'max_power', selector: { number: {} } },
											{ name: 'show_daily_buy', selector: { boolean: {} } },
											{ name: 'label_daily_grid_buy', selector: { text: {} } },
											{ name: 'show_daily_sell', selector: { boolean: {} } },
											{ name: 'label_daily_grid_sell', selector: { text: {} } },
											{ name: 'auto_scale', selector: { boolean: {} } },
											{ name: 'invert_grid', selector: { boolean: {} } },
											{ name: 'show_absolute', selector: { boolean: {} } },
											{ name: 'colour', selector: { color_rgb: {} } },
											{ name: 'navigate', selector: { text: {} } },
											{ name: 'invert_flow', selector: { boolean: {} } },
											{ name: 'no_grid_colour', selector: { color_rgb: {} } },
											{ name: 'export_colour', selector: { color_rgb: {} } },
											{ name: 'grid_off_colour', selector: { color_rgb: {} } },
											{ name: 'energy_cost_decimals', selector: { number: { mode: 'box', min: 0, max: 3 } } },
											{ name: 'animation_speed', selector: { number: {} } },
											{ name: 'off_threshold', selector: { number: {} } },
											{ name: 'import_icon', selector: { icon: {} } },
											{ name: 'export_icon', selector: { icon: {} } },
											{ name: 'disconnected_icon', selector: { icon: {} } },
											{ name: 'prepaid_unit_name', selector: { text: {} } },
										],
									},
									{
										type: 'expandable',
										title: this._title('gri_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'day_grid_import_76', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'day_grid_export_77', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'grid_frequency', selector: { entity: { device_class: SensorDeviceClass.FREQUENCY } } },
													{ name: 'grid_ct_power_172', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'grid_ct_power_L2', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'grid_ct_power_L3', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'grid_voltage_L1', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'grid_voltage_L2', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'grid_voltage_L3', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'grid_current_L1', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
													{ name: 'grid_current_L2', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
													{ name: 'grid_current_L3', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
													{ name: 'grid_ct_power_total', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'grid_voltage', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'grid_connected_status_194', selector: { entity: {} } },
													{ name: 'energy_cost_buy', selector: { entity: {} } },
													{ name: 'energy_cost_sell', selector: { entity: {} } },
													{ name: 'prepaid_units', selector: { entity: {} } },
													{ name: 'max_sell_power', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
												],
											},
										],
									},
								],
							},
							{
								type: 'expandable',
								title: this._title('grid_load'),
								schema: [
									{
										name: 'grid',
										type: 'grid',
										schema: [
											{ name: 'show_nonessential', selector: { boolean: {} } },
											{ name: 'ness_invert_flow', selector: { boolean: {} } },
											{ name: 'additional_loads', selector: { number: { mode: 'box', min: 0, max: 6 } } },
											{ name: 'nonessential_name', selector: { text: {} } },
											{ name: 'nonessential_icon', selector: { icon: {} } },
											{ name: 'show_nonessential_daily', selector: { boolean: {} } },
											{ name: 'nonessential_daily_name', selector: { text: {} } },
										],
									},
									{
										type: 'expandable',
										title: this._title('grid_load_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'nonessential_power', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'nonessential_energy', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('grid_load_row_1'),
										schema: [
											{
												name: 'grid',
												type: 'grid',
												schema: [
													...this.generateGridLoadOptions('load', '1', ''),
													...this.generateGridLoadOptions('load', '2', ''),
													...this.generateGridLoadOptions('load', '3', ''),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('grid_load_row_1_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													...this.generateLoadEntities('non_essential_load', '1', ''),
													...this.generateLoadEntities('non_essential_load', '2', ''),
													...this.generateLoadEntities('non_essential_load', '3', ''),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('grid_load_row_2'),
										schema: [
											{
												name: 'grid',
												type: 'grid',
												schema: [
													...this.generateGridLoadOptions('load', '4', ''),
													...this.generateGridLoadOptions('load', '5', ''),
													...this.generateGridLoadOptions('load', '6', ''),
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('grid_load_row_2_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													...this.generateLoadEntities('non_essential_load', '4', ''),
													...this.generateLoadEntities('non_essential_load', '5', ''),
													...this.generateLoadEntities('non_essential_load', '6', ''),
												],
											},
										],
									},

								],
							},
						]}
						@value-changed=${this._valueChanged.bind(this)}
					></ha-form>
		`;
	}

	private generateInverterModelItem() {
		return {
			name: 'model',
			selector: {
				select: {
					options: Object.values(InverterModel).map(x => ({
						label: capitalize(x),
						value: x,
					})),
				},
			},
		};
	}

	private generateInverterAutarkyItem() {
		return {
			name: 'autarky',
			selector: {
				select: {
					options: Object.values(AutarkyType).map(x => ({
						label: capitalize(x),
						value: x,
					})),
				},
			},
		};
	}

	private generateInverterProg(id: number) {
		return [
			{ name: 'prog' + id + '_time', selector: { entity: {} } },
			{ name: 'prog' + id + '_capacity', selector: { entity: {} } },
			{ name: 'prog' + id + '_charge', selector: { entity: {} } },
		];
	}

	private generatePVEntitiesGroup(id: number, powerName: string = 'power', voltageName: string = 'voltage', currentName: string = 'current_110', productionName: string = 'production') {
		return {
			type: 'expandable',
			title: this._title('pv_' + id + '_ent'),
			schema: [
				{
					name: 'entities',
					type: 'grid',
					schema: [
						{ name: 'pv' + id + '_' + powerName, selector: { entity: { device_class: SensorDeviceClass.POWER } } },
						{ name: 'pv' + id + '_' + productionName, selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
						{ name: 'pv' + id + '_' + voltageName, selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
						{ name: 'pv' + id + '_' + currentName, selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
					],
				},
			],
		};
	}

	private generateLoadEntities(name: string, id: string, separator: string = '_') {
		return [
			{ name: name + separator + id + '', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
			{ name: name + separator + id + '_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
			{ name: name + separator + id + '_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
		];
	}

	private generateOldLoadOptions(name: string, id: string, separator: string = '_') {
		return [
			{ name: name + separator + id + '_name', selector: { text: {} } },
			{ name: name + separator + id + '_icon', selector: { icon: {} } },
		];
	}

	private generateGridLoadOptions(name: string, id: string, separator: string = '_') {
		return [
			{ name: name + separator + id + '_name', selector: { text: {} } },
			{ name: name + separator + id + '_icon', selector: { icon: {} } },
			{ name: name + separator + id + '_color', selector: { color_rgb: {} } },
			{ name: name + separator + id + '_off_color', selector: { color_rgb: {} } },
		];
	}

	private generateLoadOptions(name: string, id: string, separator: string = '_') {
		return [
			{ name: name + separator + id + '_name', selector: { text: {} } },
			{ name: name + separator + id + '_icon', selector: { icon: {} } },
			{ name: name + separator + id + '_color', selector: { color_rgb: {} } },
			{ name: name + separator + id + '_off_color', selector: { color_rgb: {} } },
			{ name: name + separator + id + '_max_threshold', selector: { number: {} } },
			{ name: name + separator + id + '_max_color', selector: { color_rgb: {} } },

		];
	}

	private generateBatteryBankEntities(id: number) {
		return {
			type: 'expandable',
			title: this._title('battery_bank_' + id + '_ent'),
			schema: [
				{
					name: 'entities',
					type: 'grid',
					schema: [
						{ name: 'battery_bank_' + id + '_power', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
						{ name: 'battery_bank_' + id + '_voltage', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
						{ name: 'battery_bank_' + id + '_current', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
						{ name: 'battery_bank_' + id + '_delta', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
						{ name: 'battery_bank_' + id + '_temp', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
						{
							name: 'battery_bank_' + id + '_remaining_storage',
							selector: { entity: { device_class: [SensorDeviceClass.ENERGY, SensorDeviceClass.ENERGY_STORAGE] } },
						},
						{ name: 'battery_bank_' + id + '_soc', selector: { entity: { device_class: SensorDeviceClass.BATTERY } } },
					],
				},
			],
		};
	}

	private _computeLabelCallback = (data) => data.name ? this.localizeOrChange(data) ?? data.name : data;

	private localizeOrChange(opt) {
		let result = localize(`config.${opt.name}`) ?? opt.name;
		if (result === opt.name && opt?.selector?.entity === undefined) {
			result = opt.name.replace(/(\d)_(\d)|_/g, (_match: string, p1: string, p2: string) => {
				if (p1 && p2) {
					return `${p1}-${p2}`;
				}
				return ` `;
			})
			.toLowerCase()
			.replace(/([^a-zA-Z0-9]+)(.)/g, (_match: string, nonAlpha: string, chr: string) => {
				return nonAlpha + chr.toUpperCase();
			})
			.replace(/^./, (match: string) => match.toUpperCase());
		}
		return result;
	}

	private _title(opt: string) {
		return localize(`config.cat_title.${opt}`) ?? opt;
	}

	private _valueChanged(ev: CustomEvent): void {
		fireEvent(this, 'config-changed', { config: ev.detail.value });
	}


	private getAdditionalLoadsViewMode(config: PowerFlowCardConfig, hass: HomeAssistant) {
		if (!config.load.additional_loads_view_mode
			|| config.load.additional_loads_view_mode != AdditionalLoadsViewMode.none
		) {
			if (getEntity(config, hass, 'entities.essential_load_6_1')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_6_2')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_6_3')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_6_4')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_6_5')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_6_6')?.isValid()
			) {
				return AdditionalLoadsViewMode.col6;
			}
			if (getEntity(config, hass, 'entities.essential_load_5_1')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_5_2')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_5_3')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_5_4')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_5_5')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_5_6')?.isValid()
			) {
				return AdditionalLoadsViewMode.col5;
			}
			if (getEntity(config, hass, 'entities.essential_load_4_1')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_4_2')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_4_3')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_4_4')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_4_5')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_4_6')?.isValid()
			) {
				return AdditionalLoadsViewMode.col4;
			}
			if (getEntity(config, hass, 'entities.essential_load_3_1')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_3_2')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_3_3')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_3_4')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_3_5')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_3_6')?.isValid()
			) {
				return AdditionalLoadsViewMode.col3;
			}
			if (getEntity(config, hass, 'entities.essential_load_1_1')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_1_2')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_1_3')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_1_4')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_1_5')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_1_6')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_2_1')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_2_2')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_2_3')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_2_4')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_2_5')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load_2_6')?.isValid()
			) {
				return AdditionalLoadsViewMode.col2;
			}
			if (getEntity(config, hass, 'entities.essential_load1')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load2')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load3')?.isValid()
				|| getEntity(config, hass, 'entities.essential_load4')?.isValid()
			) {
				return AdditionalLoadsViewMode.old;
			}
			return AdditionalLoadsViewMode.none;
		}
		return config.load.additional_loads_view_mode;
	}

}
