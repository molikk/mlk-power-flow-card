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
	//outer = 'Outside view'
}


export interface RefreshCardConfig extends LovelaceCardConfig {
	refresh_time?: string;
}

export interface PowerFlowCardConfig extends LovelaceCardConfig {
	type: string;
	dev_mode: boolean;
	refresh_time?: string;
	panel_mode?: boolean;
	large_font?: boolean;
	show_solar: boolean;
	show_battery: boolean;
	show_grid: boolean;
	card_height?: string;
	card_width?: string;
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
	inverter: {
		modern: boolean;
		colour: string;
		autarky: AutarkyType;
		model: InverterModel;
		auto_scale: boolean;
		three_phase: boolean;
		ac_icon: string;
		dc_icon: string;
	}
	battery: {
		energy: any;
		shutdown_soc: any;
		shutdown_soc_offgrid: any;
		hide_soc: boolean;
		invert_power: boolean;
		colour: string;
		charge_colour: string;
		show_daily: boolean;
		animation_speed: number;
		max_power: any;
		full_capacity: number;
		empty_capacity: number;
		show_absolute: boolean;
		auto_scale: boolean;
		show_remaining_energy: boolean;
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
	}
	solar: {
		colour: string;
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
		show_mppt_production: boolean;
		show_mppt_efficiency: boolean;
	}
	load: {
		colour: string;
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
		off_threshold: number;
		additional_loads: number;
		aux_loads: number;
		aux_load1_name: string;
		aux_load2_name: string;
		aux_load1_icon: string;
		aux_load2_icon: string;
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
		show_aux: boolean;
		show_daily_aux: boolean;
		auto_scale: boolean;
		essential_name: string,
		path_threshold: number,
	}
	grid: {
		colour: string;
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
		additional_loads: number;
		load1_name: string;
		load2_name: string;
		load3_name: string;
		load1_icon: string;
		load2_icon: string;
		load3_icon: string;
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
	}
	entities: ConfigCardEntities
}

export interface ConfigCardEntities {
	use_timer_248: any,
	priority_load_243: any,
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
	day_pv_energy_108: string,
	monthly_pv_energy: string,
	yearly_pv_energy: string,
	pv1_power_186: string,
	pv2_power_187: string,
	pv1_voltage_109: string,
	pv1_current_110: string,
	pv2_voltage_111: string,
	pv2_current_112: string,
	pv3_voltage_113: string,
	pv3_current_114: string,
	pv3_power_188: string,
	pv4_voltage_115: string,
	pv4_current_116: string,
	pv4_power_189: string,
	pv5_voltage: string,
	pv5_current: string,
	pv5_power: string,
	remaining_solar: string,
	tomorrow_solar: string,
	battery_temp_182: string,
	dc_transformer_temp_90: string,
	environment_temp: string,
	radiator_temp_91: string,
	inverter_load_percentage: string,
	non_essential_load1: string,
	non_essential_load2: string,
	non_essential_load3: string,
	non_essential_load1_extra: string,
	non_essential_load2_extra: string,
	non_essential_load3_extra: string,
	non_essential_load1_toggle: string,
	non_essential_load2_toggle: string,
	non_essential_load3_toggle: string,
	energy_cost_buy: string,
	solar_sell_247: string,
	battery_status: string,
	pv_total: string,
	aux_load1: string,
	aux_load2: string,
	aux_load1_extra: string,
	aux_load2_extra: string,
	aux_load1_toggle: string,
	aux_load2_toggle: string,
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
	refreshTime: string,
	panelMode?: boolean,
	compactMode,
	cardHeight,
	cardWidth,
	loadColour: string,
	batteryColour: string,
	gridColour: string,
	gridImportColour: string,
	gridExportColour: string,
	isFloating: boolean,
	inverterColour: string,
	solarColour: string,
	auxOffColour: string,
	batteryEnergy,
	largeFont,
	batteryPower,
	stateBatteryPower: CustomEntity,
	batteryDuration,
	batteryCapacity,
	stateBatteryBank1Power: CustomEntity,
	stateBatteryBank2Power: CustomEntity,
	stateBatteryBank3Power: CustomEntity,
	stateBatteryBank4Power: CustomEntity,
	stateBatteryBank1Voltage: CustomEntity,
	stateBatteryBank2Voltage: CustomEntity,
	stateBatteryBank3Voltage: CustomEntity,
	stateBatteryBank4Voltage: CustomEntity,
	stateBatteryBank1Current: CustomEntity,
	stateBatteryBank2Current: CustomEntity,
	stateBatteryBank3Current: CustomEntity,
	stateBatteryBank4Current: CustomEntity,
	stateBatteryBank1Delta: CustomEntity,
	stateBatteryBank2Delta: CustomEntity,
	stateBatteryBank3Delta: CustomEntity,
	stateBatteryBank4Delta: CustomEntity,
	stateBatteryBank1RemainingStorage: CustomEntity,
	stateBatteryBank2RemainingStorage: CustomEntity,
	stateBatteryBank3RemainingStorage: CustomEntity,
	stateBatteryBank4RemainingStorage: CustomEntity,
	stateBatteryBank1Soc: CustomEntity,
	stateBatteryBank2Soc: CustomEntity,
	stateBatteryBank3Soc: CustomEntity,
	stateBatteryBank4Soc: CustomEntity,
	dynamicBatteryBatteryBank1Colour: string,
	dynamicBatteryBatteryBank2Colour: string,
	dynamicBatteryBatteryBank3Colour: string,
	dynamicBatteryBatteryBank4Colour: string,
	additionalLoad,
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
	iconEssentialLoad1: string,
	iconEssentialLoad2: string,
	iconEssentialLoad3: string,
	iconEssentialLoad4: string,
	iconEssentialLoad5: string,
	iconEssentialLoad6: string,
	iconEssentialLoad7: string,
	iconEssentialLoad8: string,
	iconEssentialLoad9: string,
	iconEssentialLoad10: string,
	iconEssentialLoad11: string,
	iconEssentialLoad12: string,
	iconEssentialLoad13: string,
	iconEssentialLoad14: string,
	iconEssentialLoad15: string,
	iconEssentialLoad16: string,
	iconEssentialLoad17: string,
	iconEssentialLoad18: string,
	iconEssentialLoad19: string,
	iconEssentialLoad20: string,
	iconEssentialLoad21: string,
	iconEssentialLoad22: string,
	iconEssentialLoad23: string,
	enableTimer,
	priorityLoad,
	inverterImg,
	minLineWidth,
	stopColour: string,
	gridStatus,
	batteryCharge,
	gridOffColour: string,
	batteryIcon: string,
	formattedResultTime,
	showAux,
	nonessentialIcon: string,
	showNonessential,
	nonessentialLoads,
	additionalAuxLoad,
	iconNonessentialLoad1: string,
	iconNonessentialLoad2: string,
	iconNonessentialLoad3: string,
	inverterStateMsg,
	auxType,
	showDailyAux,
	auxPower,
	stateAuxPower: CustomEntity,
	nonessentialPower,
	nonessLineWidth,
	grid169LineWidth,
	auxLineWidth,
	iconAuxLoad1: string,
	iconAuxLoad2: string,
	autoScaledInverterPower,
	autoScaledGridPower,
	auxDynamicColour: string,
	auxDynamicColourLoad1: string,
	auxDynamicColourLoad2: string,
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
	stateDayAuxEnergy: CustomEntity,
	inverterProg,
	stateUseTimer: CustomEntity,
	stateBatterySoc: CustomEntity,
	stateEnergyCostSell: CustomEntity,
	stateEnergyCostBuy: CustomEntity,
	stateEssentialLoad1: CustomEntity,
	stateEssentialLoad2: CustomEntity,
	stateEssentialLoad3: CustomEntity,
	stateEssentialLoad4: CustomEntity,
	stateEssentialLoad5: CustomEntity,
	stateEssentialLoad6: CustomEntity,
	stateEssentialLoad7: CustomEntity,
	stateEssentialLoad8: CustomEntity,
	stateEssentialLoad9: CustomEntity,
	stateEssentialLoad10: CustomEntity,
	stateEssentialLoad11: CustomEntity,
	stateEssentialLoad12: CustomEntity,
	stateEssentialLoad13: CustomEntity,
	stateEssentialLoad14: CustomEntity,
	stateEssentialLoad15: CustomEntity,
	stateEssentialLoad16: CustomEntity,
	stateEssentialLoad17: CustomEntity,
	stateEssentialLoad18: CustomEntity,
	stateEssentialLoad19: CustomEntity,
	stateEssentialLoad20: CustomEntity,
	stateEssentialLoad21: CustomEntity,
	stateEssentialLoad22: CustomEntity,
	stateEssentialLoad23: CustomEntity,
	stateEssentialLoad1Extra: CustomEntity,
	stateEssentialLoad2Extra: CustomEntity,
	stateEssentialLoad3Extra: CustomEntity,
	stateEssentialLoad4Extra: CustomEntity,
	stateEssentialLoad5Extra: CustomEntity,
	stateEssentialLoad6Extra: CustomEntity,
	stateEssentialLoad7Extra: CustomEntity,
	stateEssentialLoad8Extra: CustomEntity,
	stateEssentialLoad9Extra: CustomEntity,
	stateEssentialLoad10Extra: CustomEntity,
	stateEssentialLoad11Extra: CustomEntity,
	stateEssentialLoad12Extra: CustomEntity,
	stateEssentialLoad13Extra: CustomEntity,
	stateEssentialLoad14Extra: CustomEntity,
	stateEssentialLoad15Extra: CustomEntity,
	stateEssentialLoad16Extra: CustomEntity,
	stateEssentialLoad17Extra: CustomEntity,
	stateEssentialLoad18Extra: CustomEntity,
	stateEssentialLoad19Extra: CustomEntity,
	stateEssentialLoad20Extra: CustomEntity,
	stateEssentialLoad21Extra: CustomEntity,
	stateEssentialLoad22Extra: CustomEntity,
	stateEssentialLoad23Extra: CustomEntity,
	stateEssentialLoad1Toggle: CustomEntity,
	stateEssentialLoad2Toggle: CustomEntity,
	stateEssentialLoad3Toggle: CustomEntity,
	stateEssentialLoad4Toggle: CustomEntity,
	stateEssentialLoad5Toggle: CustomEntity,
	stateEssentialLoad6Toggle: CustomEntity,
	stateEssentialLoad7Toggle: CustomEntity,
	stateEssentialLoad8Toggle: CustomEntity,
	stateEssentialLoad9Toggle: CustomEntity,
	stateEssentialLoad10Toggle: CustomEntity,
	stateEssentialLoad11Toggle: CustomEntity,
	stateEssentialLoad12Toggle: CustomEntity,
	stateEssentialLoad13Toggle: CustomEntity,
	stateEssentialLoad14Toggle: CustomEntity,
	stateEssentialLoad15Toggle: CustomEntity,
	stateEssentialLoad16Toggle: CustomEntity,
	stateEssentialLoad17Toggle: CustomEntity,
	stateEssentialLoad18Toggle: CustomEntity,
	stateEssentialLoad19Toggle: CustomEntity,
	stateEssentialLoad20Toggle: CustomEntity,
	stateEssentialLoad21Toggle: CustomEntity,
	stateEssentialLoad22Toggle: CustomEntity,
	stateEssentialLoad23Toggle: CustomEntity,
	stateNonessentialLoad1: CustomEntity,
	stateNonessentialLoad2: CustomEntity,
	stateNonessentialLoad3: CustomEntity,
	stateNonEssentialLoad1Extra: CustomEntity,
	stateNonEssentialLoad2Extra: CustomEntity,
	stateNonEssentialLoad3Extra: CustomEntity,
	stateNonEssentialLoad1Toggle: CustomEntity,
	stateNonEssentialLoad2Toggle: CustomEntity,
	stateNonEssentialLoad3Toggle: CustomEntity,
	stateRadiatorTemp: CustomEntity,
	stateBatteryCurrent: CustomEntity,
	stateEnvironmentTemp: CustomEntity,
	stateBatteryTemp: CustomEntity,
	statePrepaidUnits: CustomEntity,
	stateDCTransformerTemp: CustomEntity,
	stateInverterLoadPercentage: CustomEntity,
	stateSolarSell: CustomEntity,
	statePV1Current: CustomEntity,
	statePV2Current: CustomEntity,
	statePV3Current: CustomEntity,
	statePV4Current: CustomEntity,
	statePV5Current: CustomEntity,
	statePV1Voltage: CustomEntity,
	statePV2Voltage: CustomEntity,
	statePV3Voltage: CustomEntity,
	statePV4Voltage: CustomEntity,
	statePV5Voltage: CustomEntity,
	statePV1Power: CustomEntity,
	statePV2Power: CustomEntity,
	statePV3Power: CustomEntity,
	statePV4Power: CustomEntity,
	statePV5Power: CustomEntity,
	statePVTotal: CustomEntity,
	statePV1Energy: CustomEntity,
	statePV2Energy: CustomEntity,
	statePV3Energy: CustomEntity,
	statePV4Energy: CustomEntity,
	statePV5Energy: CustomEntity,
	stateAuxLoad1Extra: CustomEntity,
	stateAuxLoad2Extra: CustomEntity,
	stateAuxLoad1Toggle: CustomEntity,
	stateAuxLoad2Toggle: CustomEntity,
	stateAuxLoad1: CustomEntity,
	stateAuxLoad2: CustomEntity,
	stateMaxSellPower: CustomEntity,
	totalPVEfficiency,
	PV1Efficiency,
	PV2Efficiency,
	PV3Efficiency,
	PV4Efficiency,
	PV5Efficiency,
	gridPercentage,
	flowColour: string,
	flowBatColour: string,
	flowInvColour: string,
	dynamicColourEssentialLoad1: string,
	dynamicColourEssentialLoad2: string,
	dynamicColourEssentialLoad3: string,
	dynamicColourEssentialLoad4: string,
	dynamicColourEssentialLoad5: string,
	dynamicColourEssentialLoad6: string,
	dynamicColourEssentialLoad7: string,
	dynamicColourEssentialLoad8: string,
	dynamicColourEssentialLoad9: string,
	dynamicColourEssentialLoad10: string,
	dynamicColourEssentialLoad11: string,
	dynamicColourEssentialLoad12: string,
	dynamicColourEssentialLoad13: string,
	dynamicColourEssentialLoad14: string,
	dynamicColourEssentialLoad15: string,
	dynamicColourEssentialLoad16: string,
	dynamicColourEssentialLoad17: string,
	dynamicColourEssentialLoad18: string,
	dynamicColourEssentialLoad19: string,
	dynamicColourEssentialLoad20: string,
	dynamicColourEssentialLoad21: string,
	dynamicColourEssentialLoad22: string,
	dynamicColourEssentialLoad23: string,
	dynamicColourNonEssentialLoad: string,
	dynamicColourNonEssentialLoad1: string,
	dynamicColourNonEssentialLoad2: string,
	dynamicColourNonEssentialLoad3: string,
	stateBatteryRemainingStorage: CustomEntity,
	stateBatterySOH: CustomEntity,
	customGridIcon: string,
	customGridIconColour: string,
	stateLoadFrequency: CustomEntity,
	stateGridFrequency: CustomEntity;
}
