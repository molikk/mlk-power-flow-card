import { html, svg } from 'lit';
import { Utils } from '../helpers/utils';
import { DataDto, PowerFlowCardConfig } from '../types';
import { UnitOfElectricalCurrent, UnitOfElectricPotential, UnitOfPower } from '../const';
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
            	${config.title ? html`<h1 style="text-align: center; color: ${config.title_colour || 'inherit'}; data.largeFont-size: ${config.title_size || '32px'};"> ${config.title}</h1>` : ''}
                <svg viewBox="0 ${config.show_solar || data.additionalLoad > 6 ? 0 : (data.additionalLoad > 0 || !config.show_battery ? 80 : 146)} 500 ${config.show_solar ? (config.show_battery ? 408 : ([2, 3, 4, 5, 6, 7, 8].includes(data.additionalLoad) ? 400 : 300)) : (config.show_battery ? (data.additionalLoad > 0 ? 350 : 271) : 271)}"
                	preserveAspectRatio="xMidYMid meet"
                    height="${data.panelMode === false ? `${!config.show_solar && !config.show_battery ? '270px' : !config.show_solar ? (data.additionalLoad !== 0 ? '330px' : '246px') : config.show_solar && !config.show_battery ? ([2, 3, 4, 5, 6, 7, 8].includes(data.additionalLoad) ? '400px' : '300px') : `${data.cardHeight}`}` : `${!config.show_solar ? '75%' : '100%'}`}"
                    width="${data.panelMode === true ? `${data.cardWidth}` : '100%'}"
                    xmlns:xlink="http://www.w3.org/1999/xlink">

                    ${Battery.generateShapes(data, config)}
                    ${Battery.generateDuration(data, config)}
                    ${Battery.generateDailyCharge(data, config)}
                    ${Battery.generateDailyDischarge(data, config)}
                    ${Battery.generateState(data, config)}
                    ${Battery.generateCapacity(data, config)}
                    ${Battery.generateShutdownSOC(data, config)}
                    ${Battery.generateFlowLines(data, config)}
                    ${Battery.generateBatteryGradient(data, config)}
                  
                    ${config.show_grid ?
                        svg`
                            ${Grid.generateShapes(data, config)}
                            ${Grid.generateDailyImport(data, config)}
                            ${Grid.generateDailyExport(data, config)}
                            ${Grid.generateGridName(data, config)}
                            ${Grid.generateFlowLines(data)}
                            ${Grid.generateIcon(data, config)}
                            ${Grid.generateEnergyCost(data, config)}
                            ${Grid.generatePhases(data, config)}
                            ${Grid.generatePrepaidUnits(data, config)}
                            ${Grid.generateLimit(data, config)}
                            ${Grid.generateTotalGridPower(data, config)}
                            ${Grid.generateFrequency(data)}
                        `:``
                    }
                    ${config.show_grid && config.grid.show_nonessential?
                        svg`
                            ${GridLoad.generateLoad1(data, config)}
                            ${GridLoad.generateLoad2(data, config)}
                            ${GridLoad.generateLoad3(data, config)}
                            ${GridLoad.generateLines(data, config)}
                            ${GridLoad.generateFlowLine(data, config)}
                            ${GridLoad.generateShapes(data)}
                            ${GridLoad.generateTotalPower(data, config)}
                            ${GridLoad.generateIcon(data)}
                        `:``
                    }

                    ${Load.generateShapes(data)}
                    ${Load.generateDailyLoadName(data)}
                    ${Load.generateFlowLines(data, config)}
                    ${Load.generateIcon(data, config)}
                    ${Load.generatePowers(data, config)}
                    ${Load.generateTotalLoad(data, config)}
                    ${Load.generateDailyLoadValue(data, config)}
	    
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
                        `
                        : ``
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
                        `
					    : ``
				    }
                    ${Autarky.getTexts(data)}
                    ${Inverter.generateTimerInfo(data, config)}
                    ${Inverter.generatePriorityLoad(data, config)}
                    ${Inverter.generateInverterImage(data, inverterImg)}
                    ${Inverter.generateInverterState(data, config)}
					${Inverter.generateInverterProgram(data)}
					${Inverter.generatePhases(data)}
					${Inverter.generateFrequency(data)}
					${Inverter.generateTemps(data, config)}
                  
                    <circle id="bat" cx="238.5"
                            cy="326" r="3.5"
                            display="${config.entities?.battery_status === 'none' || !config.entities?.battery_status || !config.show_battery ? 'none' : ''}"
                            fill="${data.batteryStateColour}"/>
                  
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_voltage_183)}>
                        <text id="battery_voltage_183" x="193" y="346"
                              display="${config.entities.battery_voltage_183 === 'none'
                              || !config.entities.battery_voltage_183 || !config.show_battery || data.compactMode ? 'none' : ''}"
                              fill=${data.batteryColour} class="${data.largeFont !== true ? 'st14' : 'st4'} st8">
                            ${data.batteryVoltage} ${UnitOfElectricPotential.VOLT}
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_voltage_183)}>
                        <text id="battery_voltage_183" x="281" y="299"
                              display="${config.entities.battery_voltage_183 === 'none'
                              || !config.entities.battery_voltage_183 || !config.show_battery || !data.compactMode ? 'none' : ''}"
                              fill=${data.batteryColour} class="${data.compactMode ? 'st3 left-align' : 'st12'}">
                            ${data.batteryVoltage} ${UnitOfElectricPotential.VOLT}
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_soc_184)}>
                        <text id="battery_soc_184" x="${data.compactMode ? '270' : '290'}" y="358"
                              display="${config.entities.battery_soc_184 === 'none' || !config.show_battery || !data.stateBatterySoc.isValid() ? 'none' : ''}"
                              fill=${data.batteryColour} class="st13 st8 left-align">
                            ${data.stateBatterySoc.toNum(0)}%
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_soc_184)}>
                        <text id="battery_soc_184" x="${data.compactMode ? '330' : '350'}" y="358"
                              fill=${data.batteryColour}
                              class="st13 st8 left-align"
                              display="${!data.inverterProg.show
                              || config.entities.battery_soc_184 === 'none'
                              || !config.show_battery
                              || config.battery.hide_soc ? 'none' : ''}">
                            | ${data.inverterProg.capacity || 0}%
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_soc_184)}>
                        <text id="battery_soc_184" x="${data.compactMode ? '330' : '350'}" y="358"
                              fill=${data.batteryColour}
                              class="${config.battery.hide_soc || !config.show_battery ? 'st12' : 'st13 st8 left-align'}"
                              display="${!data.inverterProg.show && config.battery?.shutdown_soc && !config.battery?.shutdown_soc_offgrid
                                      ? '' : 'none'}">
                            | ${data.batteryShutdown || 0}%
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_soc_184)}>
                        <text id="battery_soc_184" x="${data.compactMode ? '330' : '350'}" y="358"
                              fill=${data.batteryColour}
                              class="${config.battery.hide_soc || !config.show_battery ? 'st12' : 'st13 st8 left-align'}"
                              display="${!data.inverterProg.show && config.battery.shutdown_soc_offgrid ? '' : 'none'}">
                            |
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_power_190)}>
                        <text id="data.batteryPower_190" x="${data.compactMode ? '239' : '193'}"
                              y="${data.compactMode ? '307' : '386'}"
                              display="${config.entities.battery_power_190 === 'none' || !config.show_battery ? 'none' : ''}"
                              fill=${data.batteryColour} class="${data.largeFont !== true ? 'st14' : 'st4'} st8">
                            ${config.battery.auto_scale
                                    ? `${config.battery.show_absolute
                                            ? `${Math.abs(parseFloat(Utils.convertValue(data.batteryPower, data.decimalPlaces)))} ${Utils.convertValue(data.batteryPower, data.decimalPlaces).split(' ')[1]}`
                                            : Utils.convertValue(data.batteryPower, data.decimalPlaces) || '0'}`
                                    : `${config.battery.show_absolute
                                            ? `${Math.abs(data.batteryPower)} ${UnitOfPower.WATT}`
                                            : `${data.batteryPower || 0} ${UnitOfPower.WATT}`
                                    }`
                            }
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_current_191)}>
                        <text id="battery_current_191" x="193" y="365.3"
                              display="${!config.entities.battery_current_191 || config.entities.battery_current_191 === 'none' || !config.show_battery || data.compactMode || !data.stateBatteryCurrent.isValid() ? 'none' : ''}"
                              fill=${data.batteryColour} class="${data.largeFont !== true ? 'st14' : 'st4'} st8">
                            ${config.battery.show_absolute ? Math.abs(data.stateBatteryCurrent.toNum(1)) : data.stateBatteryCurrent.toNum(1)}
                            ${UnitOfElectricalCurrent.AMPERE}
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_current_191)}>
                        <text id="battery_current_191" x="281" y="312"
                              display="${!config.entities.battery_current_191 || config.entities.battery_current_191 === 'none' || !config.show_battery || !data.compactMode || !data.stateBatteryCurrent.isValid() ? 'none' : ''}"
                              fill=${data.batteryColour} class="${data.compactMode ? 'st3 left-align' : 'st12'}">
                            ${config.battery.show_absolute ? Math.abs(data.stateBatteryCurrent.toNum(1)) : data.stateBatteryCurrent.toNum(1)}
                            ${UnitOfElectricalCurrent.AMPERE}
                        </text>
                    </a>
                    

                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_temp_182)}>
                        <text id="battery_temp_182" x="${data.compactMode ? '205' : '250'}"
                              y="${data.compactMode ? '332' : '324.5'}"
                              class="${config.entities?.battery_temp_182 ? 'st3 left-align' : 'st12'}"
                              fill="${data.batteryColour}"
                              display="${!config.show_battery || !data.stateBatteryTemp.isValid() ? 'none' : ''}">
                            ${data.stateBatteryTemp.toNum(1)}°
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_soh)}>
                        <text id="battery_soh" x="${data.compactMode ? '205' : '250'}"
                              y="${data.compactMode ? '332' : '324.5'}"
                              class="${config.entities?.battery_soh ? 'st3 left-align' : 'st12'}"
                              fill="${data.batteryColour}"
                              display="${!config.show_battery || !data.stateBatterySOH.isValid() || config.entities?.battery_temp_182 ? 'none' : ''}">
                            ${data.stateBatterySOH.toNum(0)}%
                        </text>
                    </a>
                    
                    


                </svg>
            </div>
        </ha-card>
    `
}
