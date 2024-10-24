import { html, LitElement, TemplateResult } from 'lit';
import { fireEvent, HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { AutarkyType, BatteryBanksViewMode, InverterModel, PowerFlowCardConfig } from './types';
import { customElement, property } from 'lit/decorators.js';
import { capitalize } from 'lodash';
import { EDITOR_NAME, SensorDeviceClass } from './const';
import { LovelaceConfig } from 'custom-card-helpers/src/types';
import { localize } from './localize/localize';

@customElement(EDITOR_NAME)
export class ConfigurationCardEditor extends LitElement implements LovelaceCardEditor {
	@property() public hass!: HomeAssistant;
	@property() private _config!: PowerFlowCardConfig;
	@property() lovelace?: LovelaceConfig;

	public setConfig(config: PowerFlowCardConfig): void {
		this._config = { ...this._config, ...config };
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
											{ name: 'panel_mode', selector: { boolean: {} } },
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
											{
												name: 'model',
												selector: {
													select: {
														options: Object.values(InverterModel).map(x => ({
															label: capitalize(x),
															value: x,
														})),
													},
												},
											},
											{ name: 'modern', selector: { boolean: {} } },
											{
												name: 'autarky',
												selector: {
													select: {
														options: Object.values(AutarkyType).map(x => ({
															label: capitalize(x),
															value: x,
														})),
													},
												},
											},
											{ name: 'colour', selector: { color_rgb: {} } },
											{ name: 'navigate', selector: { text: {} } },
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
													{ name: 'prog1_time', selector: { entity: {} } },
													{ name: 'prog1_capacity', selector: { entity: {} } },
													{ name: 'prog1_charge', selector: { entity: {} } },
													{ name: 'prog2_time', selector: { entity: {} } },
													{ name: 'prog2_capacity', selector: { entity: {} } },
													{ name: 'prog2_charge', selector: { entity: {} } },
													{ name: 'prog3_time', selector: { entity: {} } },
													{ name: 'prog3_capacity', selector: { entity: {} } },
													{ name: 'prog3_charge', selector: { entity: {} } },
													{ name: 'prog4_time', selector: { entity: {} } },
													{ name: 'prog4_capacity', selector: { entity: {} } },
													{ name: 'prog4_charge', selector: { entity: {} } },
													{ name: 'prog5_time', selector: { entity: {} } },
													{ name: 'prog5_capacity', selector: { entity: {} } },
													{ name: 'prog5_charge', selector: { entity: {} } },
													{ name: 'prog6_time', selector: { entity: {} } },
													{ name: 'prog6_capacity', selector: { entity: {} } },
													{ name: 'prog6_charge', selector: { entity: {} } },
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
											{ name: 'dynamic_colour', selector: { boolean: {} } },
											{ name: 'animation_speed', selector: { number: {} } },
											{ name: 'off_threshold', selector: { number: {} } },
										],
									},
									{
										type: 'expandable',
										title: this._title('solar_production'),
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
										title: this._title('solar_production_ent'),
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
													{ name: 'visualize_efficiency', selector: { boolean: {} } },
													{ name: 'show_mppt_efficiency', selector: { boolean: {} } },
													{ name: 'show_mppt_production', selector: { boolean: {} } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('pv_1_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'pv1_power_186', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'pv1_production', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'pv1_voltage_109', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'pv1_current_110', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('pv_2_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'pv2_power_187', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'pv2_production', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'pv2_voltage_111', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'pv2_current_112', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('pv_3_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'pv3_power_188', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'pv3_production', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'pv3_voltage_113', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'pv3_current_114', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('pv_4_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'pv4_power_189', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'pv4_production', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'pv4_voltage_115', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'pv4_current_116', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('pv_5_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'pv5_power', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'pv5_production', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'pv5_voltage', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'pv5_current', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
												],
											},
										],
									},
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
											{ name: 'soc_end_of_charge', selector: { number: { mode: 'box', min: 80, max: 100 } } },
											{ name: 'show_daily', selector: { boolean: {} } },
											{ name: 'auto_scale', selector: { boolean: {} } },
											{ name: 'invert_power', selector: { boolean: {} } },
											{ name: 'show_absolute', selector: { boolean: {} } },
											{ name: 'colour', selector: { color_rgb: {} } },
											{ name: 'navigate', selector: { text: {} } },
											{ name: 'charge_colour', selector: { color_rgb: {} } },
											{ name: 'dynamic_colour', selector: { boolean: {} } },
											{ name: 'linear_gradient', selector: { boolean: {} } },
											{ name: 'animate', selector: { boolean: {} } },
											{ name: 'animation_speed', selector: { number: {} } },
											{ name: 'hide_soc', selector: { boolean: {} } },
											{ name: 'show_remaining_energy', selector: { boolean: {} } },
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
										],
									},
									{
										type: 'expandable',
										title: this._title('battery_bank_1_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'battery_bank_1_power', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'battery_bank_1_voltage', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'battery_bank_1_current', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
													{ name: 'battery_bank_1_delta', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'battery_bank_1_temp', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{
														name: 'battery_bank_1_remaining_storage',
														selector: { entity: { device_class: [SensorDeviceClass.ENERGY, SensorDeviceClass.ENERGY_STORAGE] } },
													},
													{ name: 'battery_bank_1_soc', selector: { entity: { device_class: SensorDeviceClass.BATTERY } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('battery_bank_2_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'battery_bank_2_power', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'battery_bank_2_voltage', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'battery_bank_2_current', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
													{ name: 'battery_bank_2_delta', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'battery_bank_2_temp', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{
														name: 'battery_bank_2_remaining_storage',
														selector: { entity: { device_class: [SensorDeviceClass.ENERGY, SensorDeviceClass.ENERGY_STORAGE] } },
													},
													{ name: 'battery_bank_2_soc', selector: { entity: { device_class: SensorDeviceClass.BATTERY } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('battery_bank_3_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'battery_bank_3_power', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'battery_bank_3_voltage', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'battery_bank_3_current', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
													{ name: 'battery_bank_3_delta', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'battery_bank_3_temp', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{
														name: 'battery_bank_3_remaining_storage',
														selector: { entity: { device_class: [SensorDeviceClass.ENERGY, SensorDeviceClass.ENERGY_STORAGE] } },
													},
													{ name: 'battery_bank_3_soc', selector: { entity: { device_class: SensorDeviceClass.BATTERY } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('battery_bank_4_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'battery_bank_4_power', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'battery_bank_4_voltage', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'battery_bank_4_current', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
													{ name: 'battery_bank_4_delta', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'battery_bank_4_temp', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{
														name: 'battery_bank_4_remaining_storage',
														selector: { entity: { device_class: [SensorDeviceClass.ENERGY, SensorDeviceClass.ENERGY_STORAGE] } },
													},
													{ name: 'battery_bank_4_soc', selector: { entity: { device_class: SensorDeviceClass.BATTERY } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('battery_bank_5_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'battery_bank_5_power', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'battery_bank_5_voltage', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'battery_bank_5_current', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
													{ name: 'battery_bank_5_delta', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'battery_bank_5_temp', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{
														name: 'battery_bank_5_remaining_storage',
														selector: { entity: { device_class: [SensorDeviceClass.ENERGY, SensorDeviceClass.ENERGY_STORAGE] } },
													},
													{ name: 'battery_bank_5_soc', selector: { entity: { device_class: SensorDeviceClass.BATTERY } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('battery_bank_6_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'battery_bank_6_power', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'battery_bank_6_voltage', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'battery_bank_6_current', selector: { entity: { device_class: SensorDeviceClass.CURRENT } } },
													{ name: 'battery_bank_6_delta', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{ name: 'battery_bank_6_temp', selector: { entity: { device_class: SensorDeviceClass.VOLTAGE } } },
													{
														name: 'battery_bank_6_remaining_storage',
														selector: { entity: { device_class: [SensorDeviceClass.ENERGY, SensorDeviceClass.ENERGY_STORAGE] } },
													},
													{ name: 'battery_bank_6_soc', selector: { entity: { device_class: SensorDeviceClass.BATTERY } } },
												],
											},
										],
									},
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
											{ name: 'auto_scale', selector: { boolean: {} } },
											{ name: 'colour', selector: { color_rgb: {} } },
											{ name: 'navigate', selector: { text: {} } },
											{ name: 'dynamic_colour', selector: { boolean: {} } },
											{ name: 'dynamic_icon', selector: { boolean: {} } },
											{ name: 'invert_load', selector: { boolean: {} } },
											{ name: 'essential_name', selector: { text: {} } },
											{ name: 'additional_loads', selector: { number: { mode: 'box', min: 0, max: 23 } } },
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
									{
										type: 'expandable',
										title: this._title('additional_loads_1'),
										schema: [
											{
												name: 'load',
												type: 'grid',
												schema: [
													{ name: 'load1_name', selector: { text: {} } },
													{ name: 'load1_icon', selector: { icon: {} } },
													{ name: 'load2_name', selector: { text: {} } },
													{ name: 'load2_icon', selector: { icon: {} } },
													{ name: 'load3_name', selector: { text: {} } },
													{ name: 'load3_icon', selector: { icon: {} } },
													{ name: 'load4_name', selector: { text: {} } },
													{ name: 'load4_icon', selector: { icon: {} } },
													{ name: 'load5_name', selector: { text: {} } },
													{ name: 'load5_icon', selector: { icon: {} } },
													{ name: 'load6_name', selector: { text: {} } },
													{ name: 'load6_icon', selector: { icon: {} } },
													{ name: 'load7_name', selector: { text: {} } },
													{ name: 'load7_icon', selector: { icon: {} } },
													{ name: 'load8_name', selector: { text: {} } },
													{ name: 'load8_icon', selector: { icon: {} } },
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
													{ name: 'essential_load1', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load1_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load1_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load2', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load2_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load2_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load3', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load3_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load3_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load4', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load4_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load4_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load5', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load5_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load5_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load6', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load6_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load6_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load7', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load7_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load7_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load8', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load8_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load8_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
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
													{ name: 'load9_name', selector: { text: {} } },
													{ name: 'load9_icon', selector: { icon: {} } },
													{ name: 'load10_name', selector: { text: {} } },
													{ name: 'load10_icon', selector: { icon: {} } },
													{ name: 'load11_name', selector: { text: {} } },
													{ name: 'load11_icon', selector: { icon: {} } },
													{ name: 'load12_name', selector: { text: {} } },
													{ name: 'load12_icon', selector: { icon: {} } },
													{ name: 'load13_name', selector: { text: {} } },
													{ name: 'load13_icon', selector: { icon: {} } },
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
													{ name: 'essential_load9', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load9_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load9_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load10', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load10_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load10_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load11', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load11_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load11_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load12', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load12_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load12_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load13', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load13_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load13_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
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
													{ name: 'load14_name', selector: { text: {} } },
													{ name: 'load14_icon', selector: { icon: {} } },
													{ name: 'load15_name', selector: { text: {} } },
													{ name: 'load15_icon', selector: { icon: {} } },
													{ name: 'load16_name', selector: { text: {} } },
													{ name: 'load16_icon', selector: { icon: {} } },
													{ name: 'load17_name', selector: { text: {} } },
													{ name: 'load17_icon', selector: { icon: {} } },
													{ name: 'load18_name', selector: { text: {} } },
													{ name: 'load18_icon', selector: { icon: {} } },
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
													{ name: 'essential_load14', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load14_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load14_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load15', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load15_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load15_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load16', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load16_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load16_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load17', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load17_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load17_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load18', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load18_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load18_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
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
													{ name: 'load19_name', selector: { text: {} } },
													{ name: 'load19_icon', selector: { icon: {} } },
													{ name: 'load20_name', selector: { text: {} } },
													{ name: 'load20_icon', selector: { icon: {} } },
													{ name: 'load21_name', selector: { text: {} } },
													{ name: 'load21_icon', selector: { icon: {} } },
													{ name: 'load22_name', selector: { text: {} } },
													{ name: 'load22_icon', selector: { icon: {} } },
													{ name: 'load23_name', selector: { text: {} } },
													{ name: 'load23_icon', selector: { icon: {} } },
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
													{ name: 'essential_load19', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load19_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load19_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load20', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load20_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load20_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load21', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load21_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load21_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load22', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load22_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load22_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'essential_load23', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'essential_load23_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'essential_load23_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
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
													{ name: 'aux_name', selector: { text: {} } },
													{ name: 'aux_daily_name', selector: { text: {} } },
													{ name: 'aux_type', selector: { icon: {} } },
													{ name: 'invert_aux', selector: { boolean: {} } },
													{ name: 'show_absolute_aux', selector: { boolean: {} } },
													{ name: 'aux_dynamic_colour', selector: { boolean: {} } },
													{ name: 'aux_colour', selector: { color_rgb: {} } },
													{ name: 'aux_off_colour', selector: { color_rgb: {} } },
													{ name: 'aux_loads', selector: { number: { mode: 'box', min: 0, max: 4 } } },
													{ name: 'show_daily_aux', selector: { boolean: {} } },
												],
											},
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
													{ name: 'aux_load1_name', selector: { text: {} } },
													{ name: 'aux_load1_icon', selector: { icon: {} } },
													{ name: 'aux_load2_name', selector: { text: {} } },
													{ name: 'aux_load2_icon', selector: { icon: {} } },
													{ name: 'aux_load3_name', selector: { text: {} } },
													{ name: 'aux_load3_icon', selector: { icon: {} } },
													{ name: 'aux_load4_name', selector: { text: {} } },
													{ name: 'aux_load4_icon', selector: { icon: {} } },
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
													{ name: 'aux_load1', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'aux_load1_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'aux_load1_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'aux_load2', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'aux_load2_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'aux_load2_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'aux_load3', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'aux_load3_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'aux_load3_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'aux_load4', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'aux_load4_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'aux_load4_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
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
									{
										type: 'expandable',
										title: this._title('ness_load'),
										schema: [
											{
												name: 'grid',
												type: 'grid',
												schema: [
													{ name: 'show_nonessential', selector: { boolean: {} } },
													{ name: 'additional_loads', selector: { number: { mode: 'box', min: 0, max: 6 } } },
													{ name: 'nonessential_name', selector: { text: {} } },
													{ name: 'nonessential_icon', selector: { icon: {} } },
													{ name: 'nonessential_power', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('ness_load_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'nonessential_power', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('ness_load_row_1'),
										schema: [
											{
												name: 'grid',
												type: 'grid',
												schema: [
													{ name: 'load1_name', selector: { text: {} } },
													{ name: 'load1_icon', selector: { icon: {} } },
													{ name: 'load2_name', selector: { text: {} } },
													{ name: 'load2_icon', selector: { icon: {} } },
													{ name: 'load3_name', selector: { text: {} } },
													{ name: 'load3_icon', selector: { icon: {} } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('ness_load_row_1_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'non_essential_load1', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'non_essential_load1_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'non_essential_load1_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'non_essential_load2', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'non_essential_load2_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'non_essential_load2_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'non_essential_load3', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'non_essential_load3_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'non_essential_load3_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('ness_load_row_2'),
										schema: [
											{
												name: 'grid',
												type: 'grid',
												schema: [
													{ name: 'load4_name', selector: { text: {} } },
													{ name: 'load4_icon', selector: { icon: {} } },
													{ name: 'load5_name', selector: { text: {} } },
													{ name: 'load5_icon', selector: { icon: {} } },
													{ name: 'load6_name', selector: { text: {} } },
													{ name: 'load6_icon', selector: { icon: {} } },
												],
											},
										],
									},
									{
										type: 'expandable',
										title: this._title('ness_load_row_2_ent'),
										schema: [
											{
												name: 'entities',
												type: 'grid',
												schema: [
													{ name: 'non_essential_load4', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'non_essential_load4_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'non_essential_load4_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'non_essential_load5', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'non_essential_load5_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'non_essential_load5_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
													{ name: 'non_essential_load6', selector: { entity: { device_class: SensorDeviceClass.POWER } } },
													{ name: 'non_essential_load6_extra', selector: { entity: { device_class: SensorDeviceClass.ENERGY } } },
													{ name: 'non_essential_load6_toggle', selector: { entity: { domain: ['input_boolean', 'switch'] } } },
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

	private _computeLabelCallback = (data) => localize(`config.${data.name}`) ?? data.name;

	private _title(opt) {
		return localize(`config.cat_title.${opt}`) ?? opt;
	}

	private _valueChanged(ev: CustomEvent): void {
		fireEvent(this, 'config-changed', { config: ev.detail.value });
	}
}
