import { LovelaceCard, LovelaceCardConfig } from 'custom-card-helpers';
import { CustomEntity } from './inverters/dto/custom-entity';

declare global {
	interface HTMLElementTagNameMap {
		'mlk-power-flow-card': LovelaceCard;
	}
}

export enum InverterModel {
	Azzurro = 'azzurro',
	CESBatteryBox = 'ces-battery-box',
	Deye = 'deye',
	E3dc = 'e3dc',
	FoxESS = 'foxess',
	Fronius = 'fronius',
	Goodwe = 'goodwe',
	GoodweGridMode = 'goodwe_gridmode',
	Growatt = 'growatt',
	Huawei = 'huawei',
	Lux = 'lux',
	MPPSolar = 'mppsolar',
	PowMr = 'powmr',
	SMASolar = 'smasolar',
	Solax = 'solax',
	SolarEdge = 'solaredge',
	Sofar = 'sofar',
	Solis = 'solis',
	Sungrow = 'sungrow',
	Sunsynk = 'sunsynk',
	Victron = 'victron',
	EasunSMW8_SA = 'Easun SMW8kW SA',
}

export enum AutarkyType {
	Energy = 'energy',
	Power = 'power',
	AutoSelf = 'auto&self',
	No = 'no'
}

export enum BatteryBanksViewMode {
	none = 'none',
	inner = 'Minimal inner view',
	outer = 'Outside view'
}

export enum AdditionalLoadsViewMode {
	none = 'none',
	old = 'Minimal view (4 loads)',
	col2 = '2 Columns',
	col3 = '3 Columns',
	col4 = '4 Columns',
	col5 = '5 Columns',
	col6 = '6 Columns',
}

export interface RefreshCardConfig extends LovelaceCardConfig {
	refresh_time?: string;
}

export interface PowerFlowCardConfig extends LovelaceCardConfig {
	type: string;
	schema_version: number;
	dev_mode: boolean;
	refresh_time?: string;
	wide_view_mode: boolean,
	large_font?: boolean;
	show_solar: boolean;
	show_battery: boolean;
	show_grid: boolean;
	card_height: string;
	card_width: string;
	decimal_places?: number;
	decimal_places_energy?: number;
	dynamic_line_width?: boolean;
	max_line_width: number;
	min_line_width: number;
	viewbox: {
		viewbox_min_x: number,
		viewbox_min_y: number,
		viewbox_width: number,
		viewbox_height: number,
	},
	low_resources: {
		refresh_interval: number,
		animations: boolean,
	},
	adv_options: {
		loads_extra_2_enabled: boolean
		loads_extra_2: boolean
		loads_extra_2_circle: boolean
	}
	inverter: {
		modern: boolean;
		colour: string;
		navigate: string;
		invert_flow: boolean;
		autarky: AutarkyType;
		model: InverterModel;
		auto_scale: boolean;
		three_phase: boolean;
		ac_icon: string;
		dc_icon: string;
	}
	battery: {
		energy;
		shutdown_soc;
		shutdown_soc_offgrid;
		soc_end_of_charge;
		hide_soc: boolean;
		invert_power: boolean;
		colour: string;
		navigate: string;
		invert_flow: boolean;
		charge_colour: string;
		show_daily: boolean;
		animation_speed: number;
		max_power;
		full_capacity: number;
		empty_capacity: number;
		show_absolute: boolean;
		auto_scale: boolean;
		show_remaining_energy: boolean;
		remaining_energy_to_shutdown: boolean;
		runtime_in_kwh: boolean;
		dynamic_colour: boolean;
		linear_gradient: boolean;
		animate: boolean;
		path_threshold: number;
		show_battery_banks: boolean;
		battery_banks_view_mode: BatteryBanksViewMode;
		battery_banks: number;
		battery_bank_1_energy: number;
		battery_bank_2_energy: number;
		battery_bank_3_energy: number;
		battery_bank_4_energy: number;
		battery_bank_5_energy: number;
		battery_bank_6_energy: number;
	}
	solar: {
		colour: string;
		navigate: string;
		invert_flow: boolean;
		mppts: number;
		animation_speed: number;
		max_power: number;
		pv1_name: string;
		pv1_max_power: number;
		pv2_name: string;
		pv2_max_power: number;
		pv3_name: string;
		pv3_max_power: number;
		pv4_name: string;
		pv4_max_power: number;
		pv5_name: string;
		pv5_max_power: number;
		auto_scale: boolean;
		dynamic_colour: boolean;
		efficiency: number;
		visualize_efficiency: boolean;
		off_threshold: number;
		show_mppt_efficiency: boolean;
		show_mppt_efficiency_kwhp: boolean;
		show_mppt_production: boolean;
		hide_header_units: boolean;
		fixed_header_item_width: number;
	}
	load: {
		colour: string;
		navigate: string;
		invert_flow: boolean;
		label_daily_load: string;
		dynamic_colour: boolean;
		aux_dynamic_colour: boolean;
		dynamic_icon: boolean;
		show_daily: boolean;
		invert_aux: boolean;
		invert_load: boolean;
		show_absolute_aux: boolean,
		animation_speed: number;
		max_power: number;
		aux_name: string;
		aux_daily_name: string;
		aux_type: string;
		aux_colour: string;
		aux_off_colour: string;
		aux_invert_flow: boolean;
		off_threshold: number;
		aux_loads: number;
		aux_load1_name: string;
		aux_load2_name: string;
		aux_load3_name: string;
		aux_load4_name: string;
		aux_load5_name: string;
		aux_load6_name: string;
		aux_load1_icon: string;
		aux_load2_icon: string;
		aux_load3_icon: string;
		aux_load4_icon: string;
		aux_load5_icon: string;
		aux_load6_icon: string;
		aux_load1_color: string;
		aux_load2_color: string;
		aux_load3_color: string;
		aux_load4_color: string;
		aux_load5_color: string;
		aux_load6_color: string;
		aux_load1_off_color: string;
		aux_load2_off_color: string;
		aux_load3_off_color: string;
		aux_load4_off_color: string;
		aux_load5_off_color: string;
		aux_load6_off_color: string;
		additional_loads: number;
		additional_loads_view_mode: AdditionalLoadsViewMode;

		load_1_1_name: string;
		load_1_2_name: string;
		load_1_3_name: string;
		load_1_4_name: string;
		load_1_5_name: string;
		load_1_6_name: string;
		load_2_1_name: string;
		load_2_2_name: string;
		load_2_3_name: string;
		load_2_4_name: string;
		load_2_5_name: string;
		load_2_6_name: string;
		load_3_1_name: string;
		load_3_2_name: string;
		load_3_3_name: string;
		load_3_4_name: string;
		load_3_5_name: string;
		load_3_6_name: string;
		load_4_1_name: string;
		load_4_2_name: string;
		load_4_3_name: string;
		load_4_4_name: string;
		load_4_5_name: string;
		load_4_6_name: string;
		load_5_1_name: string;
		load_5_2_name: string;
		load_5_3_name: string;
		load_5_4_name: string;
		load_5_5_name: string;
		load_5_6_name: string;
		load_6_1_name: string;
		load_6_2_name: string;
		load_6_3_name: string;
		load_6_4_name: string;
		load_6_5_name: string;
		load_6_6_name: string;

		load_1_1_icon: string;
		load_1_2_icon: string;
		load_1_3_icon: string;
		load_1_4_icon: string;
		load_1_5_icon: string;
		load_1_6_icon: string;
		load_2_1_icon: string;
		load_2_2_icon: string;
		load_2_3_icon: string;
		load_2_4_icon: string;
		load_2_5_icon: string;
		load_2_6_icon: string;
		load_3_1_icon: string;
		load_3_2_icon: string;
		load_3_3_icon: string;
		load_3_4_icon: string;
		load_3_5_icon: string;
		load_3_6_icon: string;
		load_4_1_icon: string;
		load_4_2_icon: string;
		load_4_3_icon: string;
		load_4_4_icon: string;
		load_4_5_icon: string;
		load_4_6_icon: string;
		load_5_1_icon: string;
		load_5_2_icon: string;
		load_5_3_icon: string;
		load_5_4_icon: string;
		load_5_5_icon: string;
		load_5_6_icon: string;
		load_6_1_icon: string;
		load_6_2_icon: string;
		load_6_3_icon: string;
		load_6_4_icon: string;
		load_6_5_icon: string;
		load_6_6_icon: string;

		load_1_1_color: string;
		load_1_2_color: string;
		load_1_3_color: string;
		load_1_4_color: string;
		load_1_5_color: string;
		load_1_6_color: string;
		load_2_1_color: string;
		load_2_2_color: string;
		load_2_3_color: string;
		load_2_4_color: string;
		load_2_5_color: string;
		load_2_6_color: string;
		load_3_1_color: string;
		load_3_2_color: string;
		load_3_3_color: string;
		load_3_4_color: string;
		load_3_5_color: string;
		load_3_6_color: string;
		load_4_1_color: string;
		load_4_2_color: string;
		load_4_3_color: string;
		load_4_4_color: string;
		load_4_5_color: string;
		load_4_6_color: string;
		load_5_1_color: string;
		load_5_2_color: string;
		load_5_3_color: string;
		load_5_4_color: string;
		load_5_5_color: string;
		load_5_6_color: string;
		load_6_1_color: string;
		load_6_2_color: string;
		load_6_3_color: string;
		load_6_4_color: string;
		load_6_5_color: string;
		load_6_6_color: string;

		load_1_1_off_color: string;
		load_1_2_off_color: string;
		load_1_3_off_color: string;
		load_1_4_off_color: string;
		load_1_5_off_color: string;
		load_1_6_off_color: string;
		load_2_1_off_color: string;
		load_2_2_off_color: string;
		load_2_3_off_color: string;
		load_2_4_off_color: string;
		load_2_5_off_color: string;
		load_2_6_off_color: string;
		load_3_1_off_color: string;
		load_3_2_off_color: string;
		load_3_3_off_color: string;
		load_3_4_off_color: string;
		load_3_5_off_color: string;
		load_3_6_off_color: string;
		load_4_1_off_color: string;
		load_4_2_off_color: string;
		load_4_3_off_color: string;
		load_4_4_off_color: string;
		load_4_5_off_color: string;
		load_4_6_off_color: string;
		load_5_1_off_color: string;
		load_5_2_off_color: string;
		load_5_3_off_color: string;
		load_5_4_off_color: string;
		load_5_5_off_color: string;
		load_5_6_off_color: string;
		load_6_1_off_color: string;
		load_6_2_off_color: string;
		load_6_3_off_color: string;
		load_6_4_off_color: string;
		load_6_5_off_color: string;
		load_6_6_off_color: string;

		load_1_1_max_color: string;
		load_1_2_max_color: string;
		load_1_3_max_color: string;
		load_1_4_max_color: string;
		load_1_5_max_color: string;
		load_1_6_max_color: string;
		load_2_1_max_color: string;
		load_2_2_max_color: string;
		load_2_3_max_color: string;
		load_2_4_max_color: string;
		load_2_5_max_color: string;
		load_2_6_max_color: string;
		load_3_1_max_color: string;
		load_3_2_max_color: string;
		load_3_3_max_color: string;
		load_3_4_max_color: string;
		load_3_5_max_color: string;
		load_3_6_max_color: string;
		load_4_1_max_color: string;
		load_4_2_max_color: string;
		load_4_3_max_color: string;
		load_4_4_max_color: string;
		load_4_5_max_color: string;
		load_4_6_max_color: string;
		load_5_1_max_color: string;
		load_5_2_max_color: string;
		load_5_3_max_color: string;
		load_5_4_max_color: string;
		load_5_5_max_color: string;
		load_5_6_max_color: string;
		load_6_1_max_color: string;
		load_6_2_max_color: string;
		load_6_3_max_color: string;
		load_6_4_max_color: string;
		load_6_5_max_color: string;
		load_6_6_max_color: string;

		load_1_1_max_threshold: number;
		load_1_2_max_threshold: number;
		load_1_3_max_threshold: number;
		load_1_4_max_threshold: number;
		load_1_5_max_threshold: number;
		load_1_6_max_threshold: number;
		load_2_1_max_threshold: number;
		load_2_2_max_threshold: number;
		load_2_3_max_threshold: number;
		load_2_4_max_threshold: number;
		load_2_5_max_threshold: number;
		load_2_6_max_threshold: number;
		load_3_1_max_threshold: number;
		load_3_2_max_threshold: number;
		load_3_3_max_threshold: number;
		load_3_4_max_threshold: number;
		load_3_5_max_threshold: number;
		load_3_6_max_threshold: number;
		load_4_1_max_threshold: number;
		load_4_2_max_threshold: number;
		load_4_3_max_threshold: number;
		load_4_4_max_threshold: number;
		load_4_5_max_threshold: number;
		load_4_6_max_threshold: number;
		load_5_1_max_threshold: number;
		load_5_2_max_threshold: number;
		load_5_3_max_threshold: number;
		load_5_4_max_threshold: number;
		load_5_5_max_threshold: number;
		load_5_6_max_threshold: number;
		load_6_1_max_threshold: number;
		load_6_2_max_threshold: number;
		load_6_3_max_threshold: number;
		load_6_4_max_threshold: number;
		load_6_5_max_threshold: number;
		load_6_6_max_threshold: number;


		show_aux: boolean;
		show_daily_aux: boolean;
		auto_scale: boolean;
		essential_name: string,
		path_threshold: number,

		//deprecated
		load1_name: string;
		load2_name: string;
		load3_name: string;
		load4_name: string;
		load5_name: string;
		load6_name: string;
		load7_name: string;
		load8_name: string;
		load9_name: string;
		load10_name: string;
		load11_name: string;
		load12_name: string;
		load13_name: string;
		load14_name: string;
		load15_name: string;
		load16_name: string;
		load17_name: string;
		load18_name: string;
		load19_name: string;
		load20_name: string;
		load21_name: string;
		load22_name: string;
		load23_name: string;
		load1_icon: string;
		load2_icon: string;
		load3_icon: string;
		load4_icon: string;
		load5_icon: string;
		load6_icon: string;
		load7_icon: string;
		load8_icon: string;
		load9_icon: string;
		load10_icon: string;
		load11_icon: string;
		load12_icon: string;
		load13_icon: string;
		load14_icon: string;
		load15_icon: string;
		load16_icon: string;
		load17_icon: string;
		load18_icon: string;
		load19_icon: string;
		load20_icon: string;
		load21_icon: string;
		load22_icon: string;
		load23_icon: string;
	}
	grid: {
		colour: string;
		navigate: string;
		invert_flow: boolean;
		grid_name: string;
		label_daily_grid_buy: string;
		label_daily_grid_sell: string;
		export_colour: string;
		no_grid_colour: string;
		grid_off_colour: string;
		show_daily_buy: boolean;
		show_daily_sell: boolean;
		show_nonessential: boolean;
		nonessential_icon: string;
		nonessential_name: string;
		ness_invert_flow: boolean;
		additional_loads: number;
		load1_name: string;
		load1_icon: string;
		load2_name: string;
		load2_icon: string;
		load3_name: string;
		load3_icon: string;
		load4_name: string;
		load4_icon: string;
		load5_name: string;
		load5_icon: string;
		load6_name: string;
		load6_icon: string;

		load1_import_color: string;
		load1_export_color: string;
		load1_off_color: string;
		load2_import_color: string;
		load2_export_color: string;
		load2_off_color: string;
		load3_import_color: string;
		load3_export_color: string;
		load3_off_color: string;
		load4_import_color: string;
		load4_export_color: string;
		load4_off_color: string;
		load5_import_color: string;
		load5_export_color: string;
		load5_off_color: string;
		load6_import_color: string;
		load6_export_color: string;
		load6_off_color: string;

		invert_grid: boolean;
		animation_speed: number;
		max_power: number;
		auto_scale: boolean;
		energy_cost_decimals: number;
		show_absolute: boolean;
		off_threshold: number;
		import_icon: string;
		export_icon: string;
		disconnected_icon: string;
		prepaid_unit_name: string;
		show_nonessential_daily: boolean;
		nonessential_daily_name: string;
	}
	entities: ConfigCardEntities
}

export interface ConfigCardEntities {
	use_timer_248,
	priority_load_243,
	inverter_voltage_154: string,
	grid_frequency: string,
	load_frequency_192: string,
	inverter_current_164: string,
	inverter_power_175: string,
	grid_connected_status_194: string,
	inverter_status_59: string,
	day_battery_charge_70: string,
	day_battery_discharge_71: string,
	battery_voltage_183: string,
	battery_soc_184: string,
	battery_power_190: string,
	battery_current_191: string,
	battery_rated_capacity: string;
	battery_soh: string;
	grid_power_169: string,
	grid_voltage: string,
	day_grid_import_76: string,
	day_grid_export_77: string,
	grid_ct_power_172: string,
	grid_ct_power_total: string,
	day_load_energy_84: string,
	essential_power: string,
	nonessential_power: string,
	aux_power_166: string,
	remaining_solar: string,
	tomorrow_solar: string,
	battery_temp_182: string,
	dc_transformer_temp_90: string,
	environment_temp: string,
	radiator_temp_91: string,
	inverter_load_percentage: string,
	energy_cost_buy: string,
	solar_sell_247: string,
	battery_status: string,
	pv_total: string,
	day_aux_energy: string,
	energy_cost_sell: string,
	inverter_voltage_L2: string,
	inverter_voltage_L3: string,
	inverter_current_L2: string,
	inverter_current_L3: string,
	grid_ct_power_L2: string,
	grid_ct_power_L3: string,
	load_power_L1: string,
	load_power_L2: string,
	load_power_L3: string,
	total_pv_generation: string,
	battery_current_direction: string,
	prepaid_units: string,
	prepaid_unit_name: string,
	prog1_time: string,
	prog2_time: string,
	prog3_time: string,
	prog4_time: string,
	prog5_time: string,
	prog6_time: string,
	prog1_capacity: string,
	prog2_capacity: string,
	prog3_capacity: string,
	prog4_capacity: string,
	prog5_capacity: string,
	prog6_capacity: string,
	prog1_charge: string,
	prog2_charge: string,
	prog3_charge: string,
	prog4_charge: string,
	prog5_charge: string,
	prog6_charge: string,
	max_sell_power: string,
}

export interface InverterSettings {
	entityID: string;
	show?: boolean;
	charge?: string;
	capacity: number;
}

export interface DataDto {
	config: PowerFlowCardConfig,
	timestamp_id: number;
	refreshTime: string,
	compactMode,
	cardHeight: string,
	cardWidth: string,
	loadColour: string,
	batteryColour: string,
	gridColour: string,
	gridImportColour: string,
	gridExportColour: string,
	inverterColour: string,
	solarColour: string,
	auxOffColour: string,
	batteryEnergy,
	largeFont,
	batteryPower,
	batteryDuration,
	batteryCapacity,
	batteryBankPowerState: CustomEntity[],
	batteryBankVoltageState: CustomEntity[],
	batteryBankCurrentState: CustomEntity[],
	batteryBankDeltaState: CustomEntity[],
	batteryBankRemainingStorageState: CustomEntity[],
	batteryBankSocState: CustomEntity[],
	batteryBankTempState: CustomEntity[],
	batteryBankEnergy: number[],
	batteryBatteryBankColour: string[],
	maximumSOC,
	essIconSize,
	essIcon: string,
	batteryStateMsg,
	batteryPercentage,
	pvPercentage,
	loadShowDaily,
	loadPowerL1,
	loadPowerL2,
	loadPowerL3,
	durationCur,
	stateGridPowerL1: CustomEntity,
	stateGridPowerL2: CustomEntity,
	stateGridPowerL3: CustomEntity,
	stateGridVoltageL1: CustomEntity,
	stateGridVoltageL2: CustomEntity,
	stateGridVoltageL3: CustomEntity,
	stateGridCurrentL1: CustomEntity,
	stateGridCurrentL2: CustomEntity,
	stateGridCurrentL3: CustomEntity,
	decimalPlaces,
	decimalPlacesEnergy,
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
	stateInverterCurrentL1: CustomEntity,
	stateInverterCurrentL2: CustomEntity,
	stateInverterCurrentL3: CustomEntity,
	stateInverterVoltageL1: CustomEntity,
	stateInverterVoltageL2: CustomEntity,
	stateInverterVoltageL3: CustomEntity,
	stateBatteryVoltage: CustomEntity,
	batLineWidth,
	totalGridPower,
	solarLineWidth,
	totalPV,
	loadLineWidth,
	pvPercentageBat,
	gridPercentageBat,
	genericInverterImage,
	battery0,
	essentialPower: number,
	pv1LineWidth,
	pv2LineWidth,
	pv3LineWidth,
	pv4LineWidth,
	pv5LineWidth,
	gridLineWidth,
	batteryStateColour: string,
	inverterStateColour: string,

	//old essential loads
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

	//new essential loads
	additionalLoads: number,
	essentialLoadCol1Icon: string[],
	essentialLoadCol2Icon: string[],
	essentialLoadCol3Icon: string[],
	essentialLoadCol4Icon: string[],
	essentialLoadCol5Icon: string[],
	essentialLoadCol6Icon: string[],
	essentialLoadCol1State: CustomEntity[],
	essentialLoadCol2State: CustomEntity[],
	essentialLoadCol3State: CustomEntity[],
	essentialLoadCol4State: CustomEntity[],
	essentialLoadCol5State: CustomEntity[],
	essentialLoadCol6State: CustomEntity[],
	essentialLoadCol1ExtraState: CustomEntity[],
	essentialLoadCol2ExtraState: CustomEntity[],
	essentialLoadCol3ExtraState: CustomEntity[],
	essentialLoadCol4ExtraState: CustomEntity[],
	essentialLoadCol5ExtraState: CustomEntity[],
	essentialLoadCol6ExtraState: CustomEntity[],
	essentialLoadCol1Extra2State: CustomEntity[],
	essentialLoadCol2Extra2State: CustomEntity[],
	essentialLoadCol3Extra2State: CustomEntity[],
	essentialLoadCol4Extra2State: CustomEntity[],
	essentialLoadCol5Extra2State: CustomEntity[],
	essentialLoadCol6Extra2State: CustomEntity[],
	essentialLoadCol1ToggleState: CustomEntity[],
	essentialLoadCol2ToggleState: CustomEntity[],
	essentialLoadCol3ToggleState: CustomEntity[],
	essentialLoadCol4ToggleState: CustomEntity[],
	essentialLoadCol5ToggleState: CustomEntity[],
	essentialLoadCol6ToggleState: CustomEntity[],
	essentialLoadCol1DynamicColour: string[],
	essentialLoadCol2DynamicColour: string[],
	essentialLoadCol3DynamicColour: string[],
	essentialLoadCol4DynamicColour: string[],
	essentialLoadCol5DynamicColour: string[],
	essentialLoadCol6DynamicColour: string[],

	enableTimer,
	priorityLoad,
	inverterImg,
	minLineWidth,
	stopColour: string,
	gridStatus,
	batteryCharge,
	gridOffColour: string,
	batteryIcon: string,
	formattedResultTime: string,
	formattedResultCapacity: string,
	showNonessential: boolean,
	nonessentialLoads: number,
	nonessentialIcon: string,
	nonessentialLoadIcon: string[],
	nonessentialLoadState: CustomEntity[],
	nonEssentialLoadExtraState: CustomEntity[],
	nonEssentialLoadExtra2State: CustomEntity[],
	nonEssentialLoadToggleState: CustomEntity[],
	nonEssentialLoadMainDynamicColour: string,
	nonEssentialLoadDynamicColour: string[],

	inverterStateMsg,
	nonessentialPower,
	stateNonessentialDailyEnergy,
	nonessLineWidth,
	grid169LineWidth,
	autoScaledInverterPower,
	autoScaledGridPower,
	stateDayLoadEnergy: CustomEntity,
	stateDayBatteryDischarge: CustomEntity,
	stateDayGridImport: CustomEntity,
	stateDayBatteryCharge: CustomEntity,
	stateDayGridExport: CustomEntity,
	stateDailyPVEnergy: CustomEntity,
	stateMonthlyPVEnergy: CustomEntity,
	stateYearlyPVEnergy: CustomEntity,
	stateTotalSolarGeneration: CustomEntity,
	stateRemainingSolar: CustomEntity,
	stateTomorrowSolar: CustomEntity,
	inverterProg,
	stateUseTimer: CustomEntity,
	stateBatterySoc: CustomEntity,
	stateEnergyCostSell: CustomEntity,
	stateEnergyCostBuy: CustomEntity,
	stateRadiatorTemp: CustomEntity,
	stateBatteryCurrent: CustomEntity,
	stateEnvironmentTemp: CustomEntity,
	stateBatteryTemp: CustomEntity,
	statePrepaidUnits: CustomEntity,
	stateDCTransformerTemp: CustomEntity,
	stateInverterLoadPercentage: CustomEntity,
	stateSolarSell: CustomEntity,
	stateMaxSellPower: CustomEntity,
	statePVTotal: CustomEntity,
	statePvCurrent: CustomEntity[],
	statePvVoltage: CustomEntity[],
	statePvPower: CustomEntity[],
	statePvEnergy: CustomEntity[],
	pvEfficiencyPerc: number[],
	pvEfficiencyKwhp: number[],
	gridPercentage,

	auxType,
	auxPower,
	additionalAuxLoad,
	stateAuxPower: CustomEntity,
	stateDayAuxEnergy: CustomEntity,
	auxLineWidth: number,
	auxLoadMainDynamicColour: string,
	auxLoadIcon: string[],
	auxLoadDynamicColour: string[],
	auxLoadState: CustomEntity[],
	auxLoadExtraState: CustomEntity[],
	auxLoadExtra2State: CustomEntity[],
	auxLoadToggleState: CustomEntity[],

	flowColour: string,
	flowBatColour: string,
	flowInvColour: string,
	stateBatteryRemainingStorage: CustomEntity,
	stateBatterySOH: CustomEntity,
	customGridIcon: string,
	customGridIconColour: string,
	stateLoadFrequency: CustomEntity,
	stateGridFrequency: CustomEntity;
}
