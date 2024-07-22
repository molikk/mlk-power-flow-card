import { html, svg } from 'lit';
import { DataDto, PowerFlowCardConfig } from '../types';
import { EssentialLoad } from './compact/essentialLoad';
import { Autarky } from './compact/autarky';
import { Style } from './compact/style';
import { Load } from './compact/load';
import { Solar } from './compact/solar';
import { Battery } from './compact/battery';
import { Grid } from './compact/grid';
import { Inverter } from './compact/inverter';
import { GridLoad } from './compact/gridLoad';

export const compactCard = (config: PowerFlowCardConfig, inverterImg: string, data: DataDto) => {
	Solar.solarColour = data.solarColour;
	Solar.decimalPlacesEnergy = data.decimalPlacesEnergy;
	Solar.decimalPlaces = data.decimalPlaces;
	Grid.gridColour = data.gridColour;
	Grid.decimalPlaces = data.decimalPlaces;

	return html`
			<ha-card>
				${Style.getStyle(data)}
				<div class="container card">
					${config.title ? html`<h1
						style="text-align: center; color: ${config.title_colour || 'inherit'}; data.largeFont-size: ${config.title_size || '32px'};">
						${config.title}</h1>` : ''}
					<svg
						viewBox="0 ${config.show_solar || data.additionalLoad > 6 ? 0 : (data.additionalLoad > 0 || !config.show_battery ? 80 : 146)} 500 ${config.show_solar ? (config.show_battery ? 408 : ([2, 3, 4, 5, 6, 7, 8].includes(data.additionalLoad) ? 400 : 300)) : (config.show_battery ? (data.additionalLoad > 0 ? 350 : 271) : 271)}"
						preserveAspectRatio="xMidYMid meet"
						height="${data.panelMode === false ? `${!config.show_solar && !config.show_battery ? '270px' : !config.show_solar ? (data.additionalLoad !== 0 ? '330px' : '246px') : config.show_solar && !config.show_battery ? ([2, 3, 4, 5, 6, 7, 8].includes(data.additionalLoad) ? '400px' : '300px') : `${data.cardHeight}`}` : `${!config.show_solar ? '75%' : '100%'}`}"
						width="${data.panelMode === true ? `${data.cardWidth}` : '100%'}"
						xmlns:xlink="http://www.w3.org/1999/xlink">

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
	                            ${GridLoad.generateIcon(data)}
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
	                            ${Battery.generateShapes(data, config)}
	                            ${Battery.generatePower(data, config)}
	                            ${Battery.generateDuration(data, config)}
	                            ${Battery.generateDailyCharge(data, config)}
	                            ${Battery.generateDailyDischarge(data, config)}
	                            ${Battery.generateSOC(data, config)}
	                            ${Battery.generateSOH(data)}
	                            ${Battery.generateCapacity(data, config)}
	                            ${Battery.generateShutdownSOC(data, config)}
	                            ${Battery.generateFlowLines(data, config)}
	                            ${Battery.generateBatteryGradient(data, config)}  
	                            ${Battery.generateVoltage(data)} 
	                            ${Battery.generateCurrent(data, config)}   
	                            ${Battery.generateTemp(data)}
	                        ` : ``
						}

						${Load.generateShapeAndName(data, config)}
						${Load.generateFlowLines(data, config)}
						${Load.generateIcon(data, config)}
						${Load.generatePowers(data, config)}
						${Load.generateTotalLoad(data, config)}
						${Load.generateDailyLoad(data, config)}

						${(data.additionalLoad > 0) ?
							svg`
			                    ${EssentialLoad.generateLines(data)}
			                    ${EssentialLoad.generateLoad1(data, config)}
			                    ${EssentialLoad.generateLoad2(data, config)}
			                    ${EssentialLoad.generateLoad3(data, config)}
			                    ${EssentialLoad.generateLoad4(data, config)}
			                    ${EssentialLoad.generateLoad5(data, config)}
			                    ${EssentialLoad.generateLoad6(data, config)}
			                    ${EssentialLoad.generateLoad7(data, config)}
			                    ${EssentialLoad.generateLoad8(data, config)}
			                ` : ``
						}

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
