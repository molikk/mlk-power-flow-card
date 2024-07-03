import {LovelaceCard, LovelaceCardConfig} from "custom-card-helpers";
import {CustomEntity} from './inverters/dto/custom-entity';

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
}

export enum AutarkyType {
    Energy = 'energy',
    Power = 'power',
    AutoSelf = 'auto&self',
    No = 'no'
}

export interface sunsynkPowerFlowCardConfig extends LovelaceCardConfig {
    type: string;
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
    inverter: {
        modern: boolean;
        colour: string;
        autarky: AutarkyType;
        model: InverterModel;
        auto_scale: boolean;
        three_phase: boolean;
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
        path_threshold: number,
    }
    solar: {
        colour: string;
        mppts: number;
        animation_speed: number;
        max_power: number;
        pv1_name: string;
        pv1_max_power: number,
        pv2_name: string;
        pv2_max_power: number,
        pv3_name: string;
        pv3_max_power: number,
        pv4_name: string;
        pv4_max_power: number,
        pv5_name: string;
        pv5_max_power: number,
        auto_scale: boolean;
        //display_mode: number; //deprecated
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
        load1_icon: string;
        load2_icon: string;
        load3_icon: string;
        load4_icon: string;
        load5_icon: string;
        load6_icon: string;
        load7_icon: string;
        load8_icon: string;
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
    entities: CardConfigEntities
}

export interface CardConfigEntities {
    use_timer_248: any,
    priority_load_243: any,
    inverter_voltage_154: string,
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
    battery_temp_182: string,
    dc_transformer_temp_90: string,
    environment_temp: string,
    radiator_temp_91: string,
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
    essential_load1_toggle: string
    essential_load2_toggle: string,
    essential_load3_toggle: string,
    essential_load4_toggle: string,
    essential_load5_toggle: string,
    essential_load6_toggle: string,
    essential_load7_toggle: string,
    essential_load8_toggle: string,
    essential_load1: string
    essential_load2: string,
    essential_load3: string,
    essential_load4: string,
    essential_load5: string,
    essential_load6: string,
    essential_load7: string,
    essential_load8: string,
    battery_status: string,
    aux_load1_extra: string,
    aux_load2_extra: string,
    pv_total: string,
    aux_connected_status: string,
    aux_load1: string,
    aux_load2: string,
    day_aux_energy: string,
    energy_cost_sell: string,
    essential_load1_extra: string,
    essential_load2_extra: string,
    essential_load3_extra: string,
    essential_load4_extra: string,
    essential_load5_extra: string,
    essential_load6_extra: string,
    essential_load7_extra: string,
    essential_load8_extra: string,
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
    config: sunsynkPowerFlowCardConfig,
    panelMode,
    compactMode,
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
    batteryPower,
    batteryDuration,
    batteryCapacity,
    additionalLoad,
    essIconSize,
    essIcon,
    batteryStateMsg,
    batteryPercentage,
    pvPercentage,
    loadShowDaily,
    loadPowerL1,
    loadPowerL2,
    loadPowerL3,
    durationCur,
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
    energyCost,
    inverterCurrent,
    inverterCurrentL2,
    inverterCurrentL3,
    inverterVoltage,
    inverterVoltageL2,
    inverterVoltageL3,
    batteryVoltage, 
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
    batteryStateColour,
    inverterStateColour,
    iconEssentialLoad1,
    iconEssentialLoad2,
    iconEssentialLoad3,
    iconEssentialLoad4,
    iconEssentialLoad5,
    iconEssentialLoad6,
    iconEssentialLoad7,
    iconEssentialLoad8,
    enableTimer,
    priorityLoad,
    inverterImg,
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
    autoScaledInverterPower,
    autoScaledGridPower,
    auxDynamicColour,
    auxDynamicColourLoad1,
    auxDynamicColourLoad2,
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
    stateEssentialLoad1Extra: CustomEntity,
    stateEssentialLoad2Extra: CustomEntity,
    stateEssentialLoad3Extra: CustomEntity,
    stateEssentialLoad4Extra: CustomEntity,
    stateEssentialLoad5Extra: CustomEntity,
    stateEssentialLoad6Extra: CustomEntity,
    stateEssentialLoad7Extra: CustomEntity,
    stateEssentialLoad8Extra: CustomEntity,
    stateNonEssentialLoad1Extra: CustomEntity,
    stateNonEssentialLoad2Extra: CustomEntity,
    stateNonEssentialLoad3Extra: CustomEntity,
    stateRadiatorTemp: CustomEntity,
    stateBatteryCurrent: CustomEntity,
    stateEnvironmentTemp: CustomEntity,
    stateBatteryTemp: CustomEntity,
    statePrepaidUnits: CustomEntity,
    stateDCTransformerTemp: CustomEntity,
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
    stateAuxLoad1: CustomEntity,
    stateAuxLoad2: CustomEntity,
    stateNonessentialLoad1: CustomEntity,
    stateNonessentialLoad2: CustomEntity,
    stateNonessentialLoad3: CustomEntity,
    stateMaxSellPower: CustomEntity,
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
    dynamicColourNonEssentialLoad,
    dynamicColourNonEssentialLoad1,
    dynamicColourNonEssentialLoad2,
    dynamicColourNonEssentialLoad3,
    stateBatterySOH: CustomEntity,
    customGridIcon,
    customGridIconColour
}
