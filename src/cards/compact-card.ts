import { html, svg } from 'lit';
import { BatteryBanksViewMode, DataDto, PowerFlowCardConfig } from '../types';
import { EssentialLoad } from './compact/essentialLoad';
import { Autarky } from './compact/autarky';
import { Style } from './compact/style';
import { Load } from './compact/load';
import { Solar } from './compact/solar';
import { Battery } from './compact/battery';
import { Grid } from './compact/grid';
import { Inverter } from './compact/inverter';
import { GridLoad } from './compact/gridLoad';
import { AuxLoad } from './compact/auxLoad';
import { BatteryBank } from './compact/batteryBank';
import { DevMode } from './compact/devMode';

export const compactCard = (config: PowerFlowCardConfig, inverterImg: string, data: DataDto) => {
	Solar.solarColour = data.solarColour;
	Solar.decimalPlacesEnergy = data.decimalPlacesEnergy;
	Solar.decimalPlaces = data.decimalPlaces;
	Grid.gridColour = data.gridColour;
	Grid.decimalPlaces = data.decimalPlaces;

	let minx = config.viewbox?.viewbox_min_x ? config.viewbox.viewbox_min_x : 0;
	let miny = config.viewbox?.viewbox_min_y ? config.viewbox.viewbox_min_y : ((config.show_solar || data.additionalLoad > 6) ? 0 : (data.additionalLoad > 0 || !config.show_battery ? 80 : 146));
	let width = config.viewbox?.viewbox_width
		? config.viewbox.viewbox_width
		: (config.load.aux_loads > 4 || data.additionalLoad > 18) ? 648
			: (config.load.aux_loads > 3 || data.additionalLoad > 13) ? 600
				: (config.load.aux_loads > 2 || data.additionalLoad > 8) ? 552 : 505;
	let batteryBanksHeight = config.battery.show_battery_banks && config.battery.battery_banks_view_mode == BatteryBanksViewMode.outer ? 80 : 0;
	let height = config.viewbox?.viewbox_height ? config.viewbox.viewbox_height :
		(config.show_battery ? 408 + batteryBanksHeight : (data.additionalLoad >= 2 ? 400 : 300));

	return html`
			<ha-card>
				${Style.getStyle(data)}
				<div class="container card">
					${config.title ? html`<h1
						style="text-align: center; color: ${config.title_colour || 'inherit'}; data.largeFont-size: ${config.title_size || '32px'};">
						${config.title}</h1>` : ''}
					<svg
						viewBox="${minx} ${miny} ${width} ${height}"
						preserveAspectRatio="xMidYMid meet"
						height="${data.panelMode === false ? `${!config.show_solar && !config.show_battery ? '270px' : !config.show_solar ? (data.additionalLoad !== 0 ? '330px' : '246px') : config.show_solar && !config.show_battery ? (data.additionalLoad >= 2 ? '400px' : '300px') : `${data.cardHeight}`}` : `${!config.show_solar ? '75%' : '100%'}`}"
						width="${data.panelMode === true ? `${data.cardWidth}` : '100%'}">

						${config.dev_mode ?
							svg`
								${DevMode.generateLoadTimes(data, config)}
							` : ``
						}

						${config.show_grid ?
							svg`
	                            ${Grid.generateShapeAndName(data, config)}
	                            ${Grid.generateDailyImport(data, config)}
	                            ${Grid.generateDailyExport(data, config)}
	                            ${Grid.generateFlowLines(data)}
	                            ${Grid.generateIcon(data, config)}
	                            ${Grid.generateEnergyCost(data, config)}
	                            ${Grid.generatePhases(data, config)}
	                            ${Grid.generatePrepaidUnits(data, config)}
	                            ${Grid.generateLimit(data, config)}
	                            ${Grid.generateTotalGridPower(data, config)}
	                            ${Grid.generateFrequency(data)}
	                        ` : ``
						}
						${config.show_grid && config.grid.show_nonessential ?
							svg`
	                            ${GridLoad.generateShapeAndName(data, config)}
	                            ${GridLoad.generateLoad1(data, config)}
	                            ${GridLoad.generateLoad2(data, config)}
	                            ${GridLoad.generateLoad3(data, config)}
	                            ${GridLoad.generateLines(data, config)}
	                            ${GridLoad.generateFlowLine(data, config)}
	                            ${GridLoad.generateTotalPower(data, config)}
	                            ${GridLoad.generateIcon(data, config)}
	                        ` : ``
						}

						${config.show_solar ?
							svg`
	                            ${Solar.generateSolarHeader(data, config)}
	                            ${Solar.generateMppt1(data, config)}
	                            ${Solar.generateMppt2(data, config)}
	                            ${Solar.generateMppt3(data, config)}
	                            ${Solar.generateMppt4(data, config)}
	                            ${Solar.generateMppt5(data, config)}
	                            ${Solar.generateSolarPower(data, config)}
	                            ${Solar.generateSolarSellIcon(data, config)}
	                        ` : ``
						}
						${Autarky.getTexts(data)}


						${config.show_battery ?
							svg`
	                            ${Battery.generateShapes(data)}
	                            ${Battery.generatePower(data, config)}
	                            ${Battery.generateDuration(data)}
	                            ${Battery.generateDailyCharge(data, config)}
	                            ${Battery.generateDailyDischarge(data, config)}
	                            ${Battery.generateSOC(data, config)}
	                            ${Battery.generateSOH(data)}
	                            ${Battery.generateCapacity(data, config)}
	                            ${Battery.generateShutdownSOC(data, config)}
	                            ${Battery.generateFlowLines(data, config)}
	                            ${Battery.generateBatteryGradient(data, config)}  
	                            ${Battery.generateVoltage(data, config)} 
	                            ${Battery.generateCurrent(data, config)}   
	                            ${Battery.generateTemp(data)}
	                        ` : ``
						}
						${config.show_battery && config.battery.show_battery_banks ?
							svg`
								${BatteryBank.getBatteryBanksDetailsInnerMode(data, config)}
								${BatteryBank.getBatteryBanksDetailsOuterMode(data, config)}
             ` : ``
						}

						${(data.additionalLoad > 0) ?
							svg`
			                    ${EssentialLoad.generateLines(data, config)}
			                    ${EssentialLoad.generateLoad1(data, config)}
			                    ${EssentialLoad.generateLoad2(data, config)}
			                    ${EssentialLoad.generateLoad3(data, config)}
			                    ${EssentialLoad.generateLoad4(data, config)}
			                    ${EssentialLoad.generateLoad5(data, config)}
			                    ${EssentialLoad.generateLoad6(data, config)}
			                    ${EssentialLoad.generateLoad7(data, config)}
			                    ${EssentialLoad.generateLoad8(data, config)}
			                    ${EssentialLoad.generateLoad9(data, config)}
			                    ${EssentialLoad.generateLoad10(data, config)}
			                    ${EssentialLoad.generateLoad11(data, config)}
			                    ${EssentialLoad.generateLoad12(data, config)}
			                    ${EssentialLoad.generateLoad13(data, config)}
			                    ${EssentialLoad.generateLoad14(data, config)}
			                    ${EssentialLoad.generateLoad15(data, config)}
			                    ${EssentialLoad.generateLoad16(data, config)}
			                    ${EssentialLoad.generateLoad17(data, config)}
			                    ${EssentialLoad.generateLoad18(data, config)}
			                    ${EssentialLoad.generateLoad19(data, config)}
			                    ${EssentialLoad.generateLoad20(data, config)}
			                    ${EssentialLoad.generateLoad21(data, config)}
			                    ${EssentialLoad.generateLoad22(data, config)}
			                    ${EssentialLoad.generateLoad23(data, config)}
			                ` : ``
						}

						${data.showAux ?
							svg`
								${AuxLoad.generateShapes(data, config)}
								${AuxLoad.generateLines(data)}
								${AuxLoad.generateLoad(data, config, 1)}
								${AuxLoad.generateLoad(data, config, 2)}
								${AuxLoad.generateLoad(data, config, 3)}
								${AuxLoad.generateLoad(data, config, 4)}
								${AuxLoad.generateTotalLoad(data, config)}
								${AuxLoad.generateDailyLoad(data, config)}
							` : ``
						}

						${Load.generateShapeAndName(data, config)}
						${Load.generateFlowLines(data, config)}
						${Load.generateIcon(data, config)}
						${Load.generatePowers(data, config)}
						${Load.generateTotalLoad(data, config)}
						${Load.generateDailyLoad(data, config)}

						${Inverter.generateTimerInfo(data, config)}
						${Inverter.generatePriorityLoad(data, config)}
						${Inverter.generateInverterImage(data, inverterImg)}
						${Inverter.generateInverterState(data, config)}
						${Inverter.generateInverterLoad(data, config)}
						${Inverter.generateInverterProgram(data)}
						${Inverter.generatePhases(data, config)}
						${Inverter.generateFrequency(data)}
						${Inverter.generateTemperatures(data, config)}

					</svg>
				</div>
			</ha-card>
	`;
};
