import {html, svg} from 'lit';
import {localize} from '../localize/localize';
import {Utils} from '../helpers/utils';
import {DataDto, sunsynkPowerFlowCardConfig} from '../types';
import {UnitOfElectricalCurrent, UnitOfElectricPotential, UnitOfPower} from '../const';
import {icons} from '../helpers/icons';
import {EssentialLoad} from './compact/essentialLoad';
import {Autarky} from './compact/autarky';
import {Style} from './compact/style';
import {Load} from './compact/load';
import {Solar} from './compact/solar';
import {Battery} from './compact/battery';
import {Grid} from './compact/grid';
import {Inverter} from './compact/inverter';


export const compactCard = (config: sunsynkPowerFlowCardConfig, inverterImg: string, data: DataDto) => {
    Solar.solarColour = data.solarColour;
    Solar.decimalPlacesEnergy = data.decimalPlacesEnergy; //should be config
    Solar.decimalPlaces = data.decimalPlaces;

    return html`
        <ha-card>
            ${Style.getStyle(data)}
            <div class="container card">
                ${config.title ? html`<h1
                        style="text-align: center; color: ${config.title_colour || 'inherit'}; data.largeFont-size: ${config.title_size || '32px'};">
                    ${config.title}</h1>` : ''}
                <svg viewBox="0 ${!config.show_solar ? (data.additionalLoad !== 0 || !config.show_battery ? 80 : 145.33) : 1} 483 ${!config.show_solar ? (config.show_battery ? (data.additionalLoad !== 0 ? 350 : 270.67) : 270.67) : (!config.show_battery ? ([2, 3, 4, 5, 6, 7, 8].includes(data.additionalLoad) ? 400 : 300) : 408)}"
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
                    ${Grid.generateShapes(data, config)}
                    ${Grid.generateDailyBuy(data, config)}
                    ${Grid.generateDailySell(data, config)}
                    ${Grid.generateGridName(data, config)}
                    ${Grid.generateFlowLines(data, config)}
                    ${Grid.generateIcon(data, config)}
                    ${Grid.generateTotalPower(data, config)}
                    ${Grid.generatePowers(data, config)}
                    ${Grid.generatePrepaidUnits(data, config)}
                    ${Load.generateShapes(data)}
                    ${Load.generateDailyLoadName(data)}
                    ${Load.generateFlowLines(data, config)}
                    ${Load.generateIcon(data, config)}
                    ${Load.generatePowers(data, config)}
                    ${Load.generateTotalLoad(data, config)}
                    ${Load.generateDailyLoadValue(data, config)}
                    ${EssentialLoad.generateLines(data)}
                    ${EssentialLoad.generateLoad1(data, config)}
                    ${EssentialLoad.generateLoad2(data, config)}
                    ${EssentialLoad.generateLoad3(data, config)}
                    ${EssentialLoad.generateLoad4(data, config)}
                    ${EssentialLoad.generateLoad5(data, config)}
                    ${EssentialLoad.generateLoad6(data, config)}
                    ${EssentialLoad.generateLoad7(data, config)}
                    ${EssentialLoad.generateLoad8(data, config)}
                    ${config.show_solar ?
                            svg`
                            ${Solar.generateSolarHeader(data, config)}
                            ${Solar.generateMppt1(data, config)}
                            ${Solar.generateMppt2(data, config)}
                            ${Solar.generateMppt3(data, config)}
                            ${Solar.generateMppt4(data, config)}
                            ${Solar.generateMppt5(data, config)}
                            ${Solar.generateSolarPower(data, config)}
                        `
                            : svg``
                    }
                    ${Autarky.getTexts(data)}
                    ${Inverter.generateIcon(data)}
                    ${Inverter.generateTimerInfo(data, config)}
                    <circle id="standby" cx="220" cy="260" r="3.5" fill="${data.inverterStateColour}"/>
                    <circle id="bat" cx="${data.compactMode ? '238.5' : '162'}"
                            cy="${data.compactMode
                                    ? '326'
                                    : !config.battery.show_remaining_energy
                                            ? '319'
                                            : '310'
                            }"
                            r="3.5"
                            display="${config.entities?.battery_status === 'none' || !config.entities?.battery_status || !config.show_battery ? 'none' : ''}"
                            fill="${data.batteryStateColour}"/>

                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.priority_load_243)}>
                        <svg xmlns="http://www.w3.org/2000/svg" id="pbat" x="267.7" y="262.5" width="18"
                             height="18" viewBox="0 0 24 24">
                            <path display="${data.priorityLoad === 'off' && (data.priorityLoad !== 'no' || !data.priorityLoad) ? '' : 'none'}"
                                  fill="${data.inverterColour}"
                                  d="${icons.priorityLoadOff}"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" id="pload" x="267.7" y="262.5" width="18"
                             height="18" viewBox="0 0 24 24">
                            <path display="${data.priorityLoad === 'on' && (data.priorityLoad !== 'no' || !data.priorityLoad) ? '' : 'none'}"
                                  fill="${data.inverterColour}"
                                  d="${icons.priorityLoadOn}"/>
                        </svg>
                        <text id="priority_text_batt" x="287" y="273" class="st3 left-align"
                              display="${data.priorityLoad === 'off' && (data.priorityLoad !== 'no' || !data.priorityLoad) ? '' : 'none'}"
                              fill="${data.inverterColour}">X${localize('common.priority_batt')}
                        </text>
                        <text id="priority_text_load" x="287" y="273" class="st3 left-align"
                              display="${data.priorityLoad === 'on' && (data.priorityLoad !== 'no' || !data.priorityLoad) ? '' : 'none'}"
                              fill="${data.inverterColour}">Y${localize('common.priority_load')}
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.solar_sell_247)}>
                        <svg xmlns="http://www.w3.org/2000/svg" id="solar_sell_on" x="245" y="150" width="18"
                             height="18" viewBox="0 0 30 30">
                            <path display="${!config.entities.solar_sell_247 || data.stateSolarSell.state === 'off' || data.stateSolarSell.state === '0' || !config.show_solar || !['1', 'on'].includes(data.stateSolarSell.state) ? 'none' : ''}"
                                  fill="${data.solarColour}"
                                  d="${icons.solarSellOn}"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" id="solar_sell_off" x="245" y="150" width="18"
                             height="18" viewBox="0 0 30 30">
                            <path display="${!config.entities.solar_sell_247 || data.stateSolarSell.state === 'on' || data.stateSolarSell.state === '1' || !config.show_solar || !['0', 'off'].includes(data.stateSolarSell.state) ? 'none' : ''}"
                                  fill="${data.solarColour}"
                                  d="${icons.solarSellOff}"/>
                        </svg>
                    </a>
                    <image x="212" y="180" width="54" height="72"
                           class="${!data.genericInverterImage ? '' : 'st12'}"
                           href="${inverterImg}"
                           preserveAspectRatio="none"/>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, data.inverterProg.entityID)}>
                        <svg xmlns="http://www.w3.org/2000/svg" id="prog_grid_on" x="323" y="243" width="20"
                             height="18" viewBox="0 0 24 24">
                            <path display="${data.inverterProg.show === false || data.enableTimer === 'no' ? 'none' : ''}"
                                  class="${data.inverterProg.charge === 'none' || (data.stateUseTimer.state != 'off' && data.stateUseTimer.state != 'on') ? 'st12' : ''}"
                                  fill="${data.inverterColour}"
                                  d="${icons.progGridOn}"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" id="prog_grid_off" x="323" y="243" width="20"
                             height="18" viewBox="0 0 24 24">
                            <path display="${data.inverterProg.show === false || data.enableTimer === 'no' ? 'none' : ''}"
                                  class="${data.inverterProg.charge === 'none' && (data.stateUseTimer.state === 'off' || data.stateUseTimer.state === 'on') ? '' : 'st12'}"
                                  fill="${data.inverterColour}"
                                  d="${icons.progGridOff}"/>
                        </svg>
                    </a>


                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.day_grid_import_76)}>
                        <text id="daily_grid_buy_value" x="5" y="267.9" class="st10 left-align"
                              display="${!config.show_grid || data.gridShowDailyBuy !== true || !data.stateDayGridImport.isValid() ? 'none' : ''}"
                              fill="${data.gridColour}">
                            ${data.stateDayGridImport?.toPowerString(true, data.decimalPlacesEnergy)}
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.day_grid_export_77)}>
                        <text id="daily_grid_sell_value" x="5" y="165" class="st10 left-align"
                              display="${!config.show_grid || data.gridShowDailySell !== true || !data.stateDayGridExport.isValid() ? 'none' : ''}"
                              fill="${data.gridColour}">
                            ${data.stateDayGridExport?.toPowerString(true, data.decimalPlacesEnergy)}
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.max_sell_power)}>
                        <text id="max_sell_power" x="5" y="150" class="st3 left-align"
                              fill="${['off', '0'].includes(data.stateSolarSell.state) ? 'grey' : data.gridColour}"
                              display="${!config.show_grid || !data.stateMaxSellPower.isValid || !config.entities?.max_sell_power ? 'none' : ''}">
                            ${localize('common.limit')}: ${data.stateMaxSellPower.toPowerString(config.grid.auto_scale, data.decimalPlaces)}
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.inverter_voltage_154)}>
                        <text id="inverter_voltage_154" x="270.2" y="168.2"
                              display="${config.entities.inverter_voltage_154 === 'none' || !config.entities.inverter_voltage_154 ? 'none' : ''}"
                              class="st3 left-align" fill="${data.inverterColour}">${data.inverterVoltage}
                            ${config.inverter.three_phase && config.entities?.inverter_voltage_L2 ? '| ' + data.inverterVoltageL2 : ''}
                            ${config.inverter.three_phase && config.entities?.inverter_voltage_L3 ? '| ' + data.inverterVoltageL3 : ''}
                            ${UnitOfElectricPotential.VOLT}
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.load_frequency_192)}>
                        <text id="load_frequency_192" x="270.2" y="192.6"
                              display="${config.entities.load_frequency_192 === 'none' || !config.entities.load_frequency_192 ? 'none' : ''}"
                              class="st3 left-align" fill="${data.inverterColour}">${data.loadFrequency} Hz
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.inverter_current_164)}>
                        <text id="inverter_current_164" x="270.2" y="180.4"
                              display="${config.entities.inverter_current_164 === 'none' || !config.entities.inverter_current_164 ? 'none' : ''}"
                              class="st3 left-align" fill="${data.inverterColour}">${data.inverterCurrent}
                            ${config.inverter.three_phase && config.entities?.inverter_current_L2 ? '| ' + data.inverterCurrentL2 : ''}
                            ${config.inverter.three_phase && config.entities?.inverter_current_L3 ? '| ' + data.inverterCurrentL3 : ''}
                            ${UnitOfElectricalCurrent.AMPERE}
                        </text>
                    </a>
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
                    ${config.inverter.three_phase
                            ? config.entities?.grid_ct_power_total
                                    ? svg`
                                        <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.grid_ct_power_total)}>
                                        <text id="data.totalGridPower" x="135" y="219.2"
                                              display="${!config.show_grid || config.entities.grid_ct_power_172 === 'none' ? 'none' : ''}"
                                              class="${data.largeFont !== true ? 'st14' : 'st4'} st8" fill="${data.gridColour}">
                                            ${config.grid.auto_scale
                                            ? `${config.grid.show_absolute
                                                    ? `${Math.abs(parseFloat(Utils.convertValue(data.totalGridPower, data.decimalPlaces)))} ${Utils.convertValue(data.totalGridPower, data.decimalPlaces).split(' ')[1]}`
                                                    : Utils.convertValue(data.totalGridPower, data.decimalPlaces) || 0}`
                                            : `${config.grid.show_absolute
                                                    ? `${Math.abs(data.totalGridPower)} ${UnitOfPower.WATT}`
                                                    : `${data.totalGridPower || 0} ${UnitOfPower.WATT}`
                                            }`
                                    }
                                        </text>
                                    </a>`
                                    : svg`
                                        <text id="grid_total_power" x="135" y="219.2"
                                              display="${!config.show_grid || config.entities.grid_ct_power_172 === 'none' ? 'none' : ''}"
                                              class="${data.largeFont !== true ? 'st14' : 'st4'} st8" fill="${data.gridColour}">
                                              ${config.grid.auto_scale
                                            ? `${config.grid.show_absolute
                                                    ? `${Math.abs(parseFloat(Utils.convertValue(data.totalGridPower, data.decimalPlaces)))} ${Utils.convertValue(data.totalGridPower, data.decimalPlaces).split(' ')[1]}`
                                                    : Utils.convertValue(data.totalGridPower, data.decimalPlaces) || 0}`
                                            : `${config.grid.show_absolute
                                                    ? `${Math.abs(data.totalGridPower)} ${UnitOfPower.WATT}`
                                                    : `${data.totalGridPower || 0} ${UnitOfPower.WATT}`
                                            }`
                                    }
                                        </text>`
                            : svg`
                                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.grid_ct_power_172)}>
                                        <text id="grid_total_power" x="135" y="219.2"
                                              display="${!config.show_grid || config.entities.grid_ct_power_172 === 'none' ? 'none' : ''}"
                                              class="${data.largeFont !== true ? 'st14' : 'st4'} st8" fill="${data.gridColour}">
                                            ${config.grid.auto_scale
                                    ? `${config.grid.show_absolute
                                            ? `${Math.abs(parseFloat(Utils.convertValue(data.totalGridPower, data.decimalPlaces)))} ${Utils.convertValue(data.totalGridPower, data.decimalPlaces).split(' ')[1]}`
                                            : Utils.convertValue(data.totalGridPower, data.decimalPlaces) || 0}`
                                    : `${config.grid.show_absolute
                                            ? `${Math.abs(data.totalGridPower)} ${UnitOfPower.WATT}`
                                            : `${data.totalGridPower || 0} ${UnitOfPower.WATT}`
                                    }`
                            }
                                        </text>
                                    </a>`
                    }

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
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.radiator_temp_91)}>
                        <text id="ac_temp" x="173" y="168.2" class="st3 left-align" fill="${data.inverterColour}"
                              display="${config.entities?.radiator_temp_91 && data.stateRadiatorTemp.isValid() ? '' : 'none'}">
                            AC:
                            ${data.stateRadiatorTemp.toNum(1)}°
                        </text>
                    </a>
                    <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.dc_transformer_temp_90)}>
                        <text id="dc_temp" x="173" y="180.4" class="st3 left-align" fill="${data.inverterColour}"
                              display="${config.entities?.dc_transformer_temp_90 && data.stateDCTransformerTemp.isValid() ? '' : 'none'}">
                            DC:
                            ${data.stateDCTransformerTemp.toNum(1)}°
                        </text>
                    </a>


                </svg>
            </div>
        </ha-card>
    `
}
