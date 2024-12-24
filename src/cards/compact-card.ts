import { html, svg } from 'lit';
import { AdditionalLoadsViewMode, BatteryBanksViewMode, DataDto, PowerFlowCardConfig } from '../types';
import { EssentialLoad } from './compact/essentialLoad';
import { Autarky } from './compact/autarky';
import { Load } from './compact/load';
import { Solar } from './compact/solar';
import { Battery } from './compact/battery';
import { Grid } from './compact/grid';
import { Inverter } from './compact/inverter';
import { GridLoad } from './compact/gridLoad';
import { AuxLoad } from './compact/auxLoad';
import { BatteryBank } from './compact/batteryBank';
import { DevMode } from './compact/devMode';
import { ConfigurationCardEditor } from '../editor';

export const compactCard = (config: PowerFlowCardConfig, inverterImg: string, data: DataDto) => {
	Solar.solarColour = data.solarColour;
	Solar.decimalPlacesEnergy = data.decimalPlacesEnergy;
	Solar.decimalPlaces = data.decimalPlaces;
	Grid.gridColour = data.gridColour;
	Grid.decimalPlaces = data.decimalPlaces;

	let additionalLoadVisible = config.load.additional_loads_view_mode != AdditionalLoadsViewMode.none;
	let batteryBanksHeight = config.battery.show_battery_banks && config.battery.battery_banks_view_mode == BatteryBanksViewMode.outer ? 80 : 0;

	let calculated_minX = 0;
	let calculated_minY = config.show_solar || additionalLoadVisible ? 0 : additionalLoadVisible || !config.show_battery ? 80 : 146;
	let calculated_width =
		(config.load.aux_loads > 4 || EssentialLoad.isColumnDisplayable(config, 5)) ? 648
			: (config.load.aux_loads > 3 || EssentialLoad.isColumnDisplayable(config, 4)) ? 600
				: (config.load.aux_loads > 2 || EssentialLoad.isColumnDisplayable(config, 3)) ? 552 : 505;
	let calculated_height = config.show_battery ? 408 + batteryBanksHeight : (additionalLoadVisible ? 400 : 300);

	let minX = config.viewbox?.viewbox_min_x ? config.viewbox.viewbox_min_x : config.wide_view_mode ? 0 : calculated_minX;
	let minY = config.viewbox?.viewbox_min_y ? config.viewbox.viewbox_min_y : calculated_minY;
	let width = config.viewbox?.viewbox_width ? config.viewbox.viewbox_width : config.wide_view_mode ? 720 : calculated_width;
	let height = config.viewbox?.viewbox_height ? config.viewbox.viewbox_height : calculated_height;

	let cardHeight = data.panelMode === true ?
		config.show_solar ? '100%' : '75%'
		: !config.show_solar && !config.show_battery ? '270px'
			: !config.show_solar
				? additionalLoadVisible ? '330px' : '246px'
				: config.show_solar && !config.show_battery
					? additionalLoadVisible ? '400px' : '300px'
					: data.cardHeight;
	let cardWidth = data.panelMode === true ? data.cardWidth : '100%';

	function gridXTransform() {
		return config.align_grid || config.wide_view_mode ? calculated_minX - minX : 0;
	}

	function loadXTransform() {
		return config.align_load || config.wide_view_mode ? width - calculated_width : 0;
	}

	function mainXTransform() {
		return config.wide_view_mode ? (width - calculated_width) / 2 : 0;
	}

	return html`
			<ha-card>
				<div class="container card">
					${config.title ? html`<h1
						style="text-align: center; color: ${config.title_colour || 'inherit'}; data.largeFont-size: ${config.title_size || '32px'};">
						${config.title}</h1>` : ''}
					<svg
						viewBox="${minX} ${minY} ${width} ${height}"
						preserveAspectRatio="xMidYMid meet"
						height="${cardHeight}"
						width="${cardWidth}">

						${ConfigurationCardEditor.isConfigUpgradeable(config) ?
							svg`${DevMode.generateUpdateMsg()}`
							: config.dev_mode ? svg`${DevMode.generateLoadTimes(data, config)}` : ``
						}

						${config.show_grid ?
							svg`<g id="grid-group" transform="translate(-${gridXTransform()}, 0)">
	                            ${Grid.generateShapeAndName(data, config)}
	                            ${Grid.generateDailyImport(data, config)}
	                            ${Grid.generateDailyExport(data, config)}
	                            ${Grid.generateFlowLines(data, config, gridXTransform() + mainXTransform())}
	                            ${Grid.generateIcon(data, config)}
	                            ${Grid.generateEnergyCost(data, config)}
	                            ${Grid.generatePhases(data, config)}
	                            ${Grid.generatePrepaidUnits(data, config)}
	                            ${Grid.generateLimit(data, config)}
	                            ${Grid.generateTotalGridPower(data, config)}
	                            ${Grid.generateFrequency(data)}
	                            
	                            ${config.grid.show_nonessential ?
								svg`<g id="grid-load">
									    ${GridLoad.generateShapeAndName(data, config)}
			                            ${GridLoad.generateLoad(data, config, 1)}
			                            ${GridLoad.generateLoad(data, config, 2)}
			                            ${GridLoad.generateLoad(data, config, 3)}
			                            ${GridLoad.generateLoad(data, config, 4)}
			                            ${GridLoad.generateLoad(data, config, 5)}
										${GridLoad.generateLoad(data, config, 6)}
			                            ${GridLoad.generateLines(data, config)}
			                            ${GridLoad.generateFlowLine(data, config)}
			                            ${GridLoad.generateTotalPower(data, config)}
			                            ${GridLoad.generateIcon(data, config)}
		                            </g>` : ``
							}
                            </g>` : ``
						}

						${config.show_solar ?
							svg`<g id="solar-group" transform="translate(${mainXTransform()}, 0)">
		                            ${Solar.generateSolarHeader(data, config)}
		                            ${Solar.generateMppt1(data, config)}
		                            ${Solar.generateMppt2(data, config)}
		                            ${Solar.generateMppt3(data, config)}
		                            ${Solar.generateMppt4(data, config)}
		                            ${Solar.generateMppt5(data, config)}
		                            ${Solar.generateSolarPower(data, config)}
		                            ${Solar.generateSolarSellIcon(data, config)}
	                            </g>
	                        ` : ``
						}
						<g id="autarky-group" transform="translate(${mainXTransform()}, 0)">
							${Autarky.getTexts(data)}
						</g>

						${config.show_battery ?
							svg`<g id="battery-group" transform="translate(${mainXTransform()}, 0)">
		                            ${Battery.generateShapes(data, config)}
		                            ${Battery.generatePower(data, config)}
		                            ${Battery.generateDuration(data, config)}
		                            ${Battery.generateDailyCharge(data, config)}
		                            ${Battery.generateDailyDischarge(data, config)}
		                            ${Battery.generateSOC(data, config)}
		                            ${Battery.generateSOH(data)}
		                            ${Battery.generateCapacity(data, config)}
		                            ${Battery.generateFlowLines(data, config)}
		                            ${Battery.generateBatteryGradient(data, config)}  
		                            ${Battery.generateVoltage(data, config)} 
		                            ${Battery.generateCurrent(data, config)}   
		                            ${Battery.generateTemp(data, config)}
		                            
		                           ${config.battery.show_battery_banks ?
								svg`<g id="battery-bank-group">
												${BatteryBank.getBatteryBanksDetailsInnerMode(data, config)}
												${BatteryBank.getBatteryBanksDetailsOuterMode(data, config)}
											</g>
			                            ` : ``
							}
	                           </g> 
	                        ` : ``
						}

						<g id="load-group" transform="translate(${loadXTransform()}, 0)">
							${(EssentialLoad.isColumnDisplayable(config, 1)) ?
								svg`
			                    ${EssentialLoad.generateLoadCol1(data, config, 1)}
			                    ${EssentialLoad.generateLoadCol1(data, config, 2)}
			                    ${EssentialLoad.generateLoadCol1(data, config, 4)}
			                    ${EssentialLoad.generateLoadCol1(data, config, 5)}
			                ` : ``
							}
							${(EssentialLoad.isColumnDisplayable(config, 2)) ?
								svg`
			                    ${EssentialLoad.generateLoadCol2(data, config, 1)}
			                    ${EssentialLoad.generateLoadCol2(data, config, 2)}
			                    ${EssentialLoad.generateLoadCol2(data, config, 4)}
			                    ${EssentialLoad.generateLoadCol2(data, config, 5)}
			                ` : ``
							}
							${(EssentialLoad.isColumnDisplayable(config, 3)) ?
								svg`
			                    ${EssentialLoad.generateLoadCol3(data, config, 1)}
			                    ${EssentialLoad.generateLoadCol3(data, config, 2)}
			                    ${EssentialLoad.generateLoadCol3(data, config, 3)}
			                    ${EssentialLoad.generateLoadCol3(data, config, 4)}
			                    ${EssentialLoad.generateLoadCol3(data, config, 5)}
			                ` : ``
							}
							${(EssentialLoad.isColumnDisplayable(config, 4)) ?
								svg`
			                    ${EssentialLoad.generateLoadCol4(data, config, 1)}
			                    ${EssentialLoad.generateLoadCol4(data, config, 2)}
			                    ${EssentialLoad.generateLoadCol4(data, config, 3)}
			                    ${EssentialLoad.generateLoadCol4(data, config, 4)}
			                    ${EssentialLoad.generateLoadCol4(data, config, 5)}
			                ` : ``
							}
							${(EssentialLoad.isColumnDisplayable(config, 5)) ?
								svg`
			                    ${EssentialLoad.generateLoadCol5(data, config, 1)}
			                    ${EssentialLoad.generateLoadCol5(data, config, 2)}
			                    ${EssentialLoad.generateLoadCol5(data, config, 3)}
			                    ${EssentialLoad.generateLoadCol5(data, config, 4)}
			                    ${EssentialLoad.generateLoadCol5(data, config, 5)}
			                ` : ``
							}

							${([AdditionalLoadsViewMode.old].includes(config.load.additional_loads_view_mode)) ?
								svg`
			                    ${EssentialLoad.generateLines(data, config)}
			                    ${EssentialLoad.generateLoad1(data, config)}
			                    ${EssentialLoad.generateLoad2(data, config)}
			                    ${EssentialLoad.generateLoad3(data, config)}
			                    ${EssentialLoad.generateLoad4(data, config)}
			                ` : ``
							}

							${Load.generateShapeAndName(data, config)}
							${Load.generateFlowLines(data, config, loadXTransform() - mainXTransform())}
							${Load.generateIcon(data, config)}
							${Load.generatePowers(data, config)}
							${Load.generateTotalLoad(data, config)}
							${Load.generateDailyLoad(data, config)}
						</g>

						${config.load?.show_aux ?
							svg`
								${AuxLoad.generateFlowLines(data, config, loadXTransform(), mainXTransform())}
								<g id="aux-load-group" transform="translate(${loadXTransform()}, 0)">
									${AuxLoad.generateShapes(data, config)}
									${AuxLoad.generateLoad(data, config, 1)}
									${AuxLoad.generateLoad(data, config, 2)}
									${AuxLoad.generateLoad(data, config, 3)}
									${AuxLoad.generateLoad(data, config, 4)}
									${AuxLoad.generateLoad(data, config, 5)}
									${AuxLoad.generateTotalLoad(data, config)}
									${AuxLoad.generateDailyLoad(data, config)}
								</g>
							` : ``
						}
						<g id="inverter-group" transform="translate(${mainXTransform()}, 0)">
							${Inverter.generateTimerInfo(data, config)}
							${Inverter.generatePriorityLoad(data, config)}
							${Inverter.generateInverterImage(data, config, inverterImg)}
							${Inverter.generateInverterState(data, config)}
							${Inverter.generateInverterLoad(data, config)}
							${Inverter.generateInverterProgram(data)}
							${Inverter.generatePhases(data, config)}
							${Inverter.generateFrequency(data)}
							${Inverter.generateTemperatures(data, config)}
						</g>
					</svg>
				</div>
			</ha-card>
	`;
};
