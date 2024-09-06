import { DataDto, InverterModel, PowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { icons } from '../../helpers/icons';
import { Utils } from '../../helpers/utils';
import { localize } from '../../localize/localize';
import { LoadUtils } from './loadUtils';

export class Inverter {

	static generateInverterImage(data: DataDto, inverterImg: string) {
		return svg`
			${data.genericInverterImage ?
			svg`<svg xmlns="http://www.w3.org/2000/svg" x="213.5" y="179.5" width="54"
					 height="79" viewBox="0 0 74 91" preserveAspectRatio="xMidYMid meet"
					 opacity="$1">
					<g transform="translate(0.000000,91.000000) scale(0.100000,-0.100000)"
					   fill="${data.inverterColour}" stroke="none">
						<path d="${icons.inverter}"/>
					</g>
				</svg>`
			: svg`<image x="214" y="180" width="50" height="72" preserveAspectRatio="none" href="${inverterImg}" />`
		}`;
	}

	static generateTimerInfo(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.use_timer_248)}>
				<svg xmlns="http://www.w3.org/2000/svg" id="timer" x="267.7" y="233.3" width="18"
					 height="18" viewBox="0 0 24 24">
					<path display="${data.stateUseTimer.state == 'on' && data.enableTimer !== 'no' ? '' : 'none'}"
						  fill="${data.inverterColour}"
						  d="${icons.timerOn}"/>
				</svg>
				<svg xmlns="http://www.w3.org/2000/svg" id="timer_off" x="267.7" y="233.3" width="18"
					 height="18" viewBox="0 0 24 24">
					<path display="${data.stateUseTimer.state == 'off' && data.enableTimer !== 'no' ? '' : 'none'}"
						  fill="${data.inverterColour}"
						  d="${icons.timerOff}"/>
				</svg>
				<text id="timer_text_off" x="287" y="244.7" class="st3 left-align"
					  display="${data.stateUseTimer.state == 'off' && data.enableTimer !== 'no' ? '' : 'none'}"
					  fill="${data.inverterColour}">${localize('common.timer_off')}
				</text>
				<text id="timer_text_on" x="287" y="244.7" class="st3 left-align"
					  display="${data.stateUseTimer.state == 'on' && data.enableTimer !== 'no' ? '' : 'none'}"
					  fill="${data.inverterColour}">${localize('common.timer_on')}
				</text>
			</a>
		`;
	}

	static generateFrequency(data: DataDto) {
		return svg`${LoadUtils.generateFrequency(data.stateLoadFrequency, data.inverterColour, 'load_frequency_192', 301, 208, 'right-align')}`;
	}

	static generatePhases(data: DataDto, config: PowerFlowCardConfig) {
		let Y = [195, 182, 169];

		if (config.load.show_aux || (!data.stateInverterVoltageL3.isValid() && !data.stateInverterCurrentL3.isValid())) {
			Y = [198, 188, 178];
		}

		return svg`
				${LoadUtils.generatePhaseVoltage('L1', data.stateInverterVoltageL1, 301.7, Y[0], data.inverterColour)}
				${LoadUtils.generatePhaseVoltage('L2', data.stateInverterVoltageL2, 301.7, Y[1], data.inverterColour)}
				${LoadUtils.generatePhaseVoltage('L3', data.stateInverterVoltageL3, 301.7, Y[2], data.inverterColour)}
				
				${LoadUtils.generatePhaseAmperage('L1', data.stateInverterCurrentL1, 305.7, Y[0], data.inverterColour)}
				${LoadUtils.generatePhaseAmperage('L2', data.stateInverterCurrentL2, 305.7, Y[1], data.inverterColour)}
				${LoadUtils.generatePhaseAmperage('L3', data.stateInverterCurrentL3, 305.7, Y[2], data.inverterColour)}
			`;
	}

	static generatePriorityLoad(data: DataDto, config: PowerFlowCardConfig) {
		return svg`${data.priorityLoad === 'on' ?
			svg`
						<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.priority_load_243)}>
                <svg xmlns="http://www.w3.org/2000/svg" id="pload" x="267.7" y="252.5" width="18"
                     height="18" viewBox="0 0 24 24">
                    <path display="${data.priorityLoad === 'on' && (data.priorityLoad !== 'no' || !data.priorityLoad) ? '' : 'none'}"
                          fill="${data.inverterColour}"
                          d="${icons.priorityLoadOn}"/>
                </svg>
                <text id="priority_text_load" x="287" y="263" class="st3 left-align"
                      display="${data.priorityLoad === 'on' && (data.priorityLoad !== 'no' || !data.priorityLoad) ? '' : 'none'}"
                      fill="${data.inverterColour}">${localize('common.priority_load')}
                </text>
            </a>`
			: svg`
						<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.priority_load_243)}>
                <svg xmlns="http://www.w3.org/2000/svg" id="pbat" x="267.7" y="252.5" width="18"
                     height="18" viewBox="0 0 24 24">
                    <path display="${data.priorityLoad === 'off' && (data.priorityLoad !== 'no' || !data.priorityLoad) ? '' : 'none'}"
                          fill="${data.inverterColour}"
                          d="${icons.priorityLoadOff}"/>
                </svg>
                <text id="priority_text_batt" x="287" y="263" class="st3 left-align"
                      display="${data.priorityLoad === 'off' && (data.priorityLoad !== 'no' || !data.priorityLoad) ? '' : 'none'}"
                      fill="${data.inverterColour}">${localize('common.priority_bat')}
                </text>
            </a>`
		}`;
	}

	static generateInverterProgram(data: DataDto) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, data.inverterProg.entityID)}>
                <svg xmlns="http://www.w3.org/2000/svg" id="prog_grid_on" x="323" y="233" width="20"
                     height="18" viewBox="0 0 24 24">
                    <path display="${data.inverterProg.show === false || data.enableTimer === 'no' ? 'none' : ''}"
                          class="${data.inverterProg.charge === 'none' || (data.stateUseTimer.state != 'off' && data.stateUseTimer.state != 'on') ? 'st12' : ''}"
                          fill="${data.inverterColour}"
                          d="${icons.progGridOn}"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" id="prog_grid_off" x="323" y="233" width="20"
                     height="18" viewBox="0 0 24 24">
                    <path display="${data.inverterProg.show === false || data.enableTimer === 'no' ? 'none' : ''}"
                          class="${data.inverterProg.charge === 'none' && (data.stateUseTimer.state === 'off' || data.stateUseTimer.state === 'on') ? '' : 'st12'}"
                          fill="${data.inverterColour}"
                          d="${icons.progGridOff}"/>
                </svg>
            </a>
		`;
	}

	static generateTemperatures(data: DataDto, config: PowerFlowCardConfig) {
		let ac = config.inverter?.ac_icon
			? LoadUtils.getIcon(178, 218, config.inverter.ac_icon, 'small_ac_dc_icon', 16)
			: svg`
				<text id="ac_temp" x="190" y="229" class="st3 right-align" fill="${data.inverterColour}"
                      display="${config.entities?.radiator_temp_91 && data.stateRadiatorTemp.isValid() ? '' : 'none'}">
                    AC:
                </text>`;
		let dc = config.inverter?.dc_icon
			? LoadUtils.getIcon(178, 230, config.inverter.dc_icon, 'small_ac_dc_icon', 16)
			: svg`
			<text id="dc_temp" x="190" y="241" class="st3 right-align" fill="${data.inverterColour}"
                  display="${config.entities?.dc_transformer_temp_90 && data.stateDCTransformerTemp.isValid() ? '' : 'none'}">
                DC:
            </text>`;
		return svg`
            <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.radiator_temp_91)}>
                ${ac}
                <text id="ac_temp" x="192" y="229" class="st3 left-align" fill="${data.inverterColour}"
                      display="${config.entities?.radiator_temp_91 && data.stateRadiatorTemp.isValid() ? '' : 'none'}">
                    ${data.stateRadiatorTemp.toStr(1, false)}
                </text>
            </a>
            <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.dc_transformer_temp_90)}>
                ${dc}
                <text id="dc_temp" x="192" y="241" class="st3 left-align" fill="${data.inverterColour}"
                      display="${config.entities?.dc_transformer_temp_90 && data.stateDCTransformerTemp.isValid() ? '' : 'none'}">
                    ${data.stateDCTransformerTemp.toStr(1, false)}
                </text>
            </a>
		`;
	}

	static buildGradientStops(lvl: number) {
		let result = svg`<stop offset="0%" stop-color="green" />`;
		if (lvl < 2) {
			result = svg`${result}<stop offset="2%" stop-color="green" /><stop offset="2%" stop-opacity="0" />`;
			return result;
		}
		if (lvl <= 30) {
			result = svg`${result}<stop offset="${lvl}%" stop-color="#9ACD32" />`;
		} else {
			result = svg`${result}<stop offset="30%" stop-color="#9ACD32" />`;
		}
		if (lvl <= 40) {
			result = svg`${result}<stop offset="${lvl}%" stop-color="gold" />`;
		} else {
			result = svg`${result}<stop offset="40%" stop-color="gold" />`;
		}
		if (lvl <= 60) {
			result = svg`${result}<stop offset="${lvl}%" stop-color="orange" />`;
		} else {
			result = svg`${result}<stop offset="60%" stop-color="orange" />`;
		}
		if (lvl <= 90) {
			result = svg`${result}<stop offset="${lvl}%" stop-color="red" />`;
		} else {
			result = svg`${result}<stop offset="90%" stop-color="red" />`;
		}
		if (lvl <= 100) {
			result = svg`${result}<stop offset="${lvl}%" stop-color="red" />`;
		} else {
			result = svg`${result}<stop offset="100%" stop-color="red" />`;
			return result;
		}

		return svg`${result}<stop offset="${lvl}%" stop-opacity="0" />`;
	}

	static generateInverterLoad(data: DataDto, config: PowerFlowCardConfig) {
		let inverterModel = InverterModel.Sunsynk;

		if (!data.stateInverterLoadPercentage.isValid()) {
			return ``;
		}

		if (Object.values(InverterModel).includes(config.inverter.model)) {
			inverterModel = config.inverter.model as InverterModel;
		}
		let X: number[];
		if (config.inverter.modern) {
			return svg`<svg xmlns="http://www.w3.org/2000/svg" id="inverter" x="214" y="185" width="52" height="67" 
					preserveAspectRatio="none" >
						<defs>
							<linearGradient id="invG" x1="0%" x2="0%" y1="100%" y2="-2%">
						      ${this.buildGradientStops(data.stateInverterLoadPercentage.toNum(0))}
							</linearGradient>
						</defs>
						<rect x="1" y="1" width="50" height="65" rx="5" ry="5" stroke="url(#invG)" fill="none" stroke-width="3" 
							pointer-events="stroke" />
					</svg>`;
		}
		switch (inverterModel) {
			case InverterModel.Azzurro:
				X = [213.5, 179.5, 51, 67, 3];
				break;
			case InverterModel.Fronius:
				X = [213.5, 179.5, 51, 73, 10];
				break;
			case InverterModel.Huawei:
			case InverterModel.SolarEdge:
				X = [213.5, 179.5, 51, 73, 5];
				break;
			default:
				X = [213.5, 179.5, 51, 73, 2];
		}
		return svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="inverter" x="${X[0]}" y="${X[1]}" width="${X[2]}" height="${X[3]}"
				preserveAspectRatio="none" >
				<defs>
					<linearGradient id="invG" x1="0%" x2="0%" y1="100%" y2="-2%">
				      ${this.buildGradientStops(data.stateInverterLoadPercentage.toNum(0))}
					</linearGradient>
				</defs>
				<rect x="1" y="1" width="${X[2] - 2}" height="${X[3] - 2}" rx="${X[4]}" ry="${X[4]}" stroke="url(#invG)" fill="none" stroke-width="3" 
					pointer-events="stroke" />
			</svg>`;
	}

	static generateInverterState(data: DataDto, config: PowerFlowCardConfig) {
		let inverterModel = InverterModel.Sunsynk;

		if (Object.values(InverterModel).includes(config.inverter.model)) {
			inverterModel = config.inverter.model as InverterModel;
		}
		let X: number[];
		if (config.inverter.modern) {
			return svg`
				<rect x="221.5" y="193" width="37.5" height="12" rx="1" ry="1" fill="${data.inverterStateColour}" stroke="${data.inverterStateColour}" pointer-events="all"
				  display="${config.entities.inverter_status_59 && data.inverterStateMsg ? '' : 'none'}" />
				<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.inverter_status_59)}>
	                <text id="standby" x=240 y="200" class="st15" fill="white"
	                      display="${config.entities.inverter_status_59 && data.inverterStateMsg ? '' : 'none'}">
	                    ${data.inverterStateMsg}
	                </text>
	            </a>
			`;
		}
		switch (inverterModel) {
			case InverterModel.Azzurro:
				X = [235, 222, 7, 6, 239, 240];
				break;
			case InverterModel.Deye:
				X = [233.5, 205.5, 12, 6, 239, 225];
				break;
			case InverterModel.Fronius:
				X = [222, 230, 11, 9, 239, 246];
				break;
			case InverterModel.Goodwe:
			case InverterModel.GoodweGridMode:
				X = [222, 236, 31, 3, 239, 225];
				break;
			case InverterModel.Growatt:
				X = [250, 224, 11, 6, 239, 247];
				break;
			case InverterModel.EasunSMW8_SA:
			case InverterModel.MPPSolar:
				X = [233, 242, 11, 5, 239, 234];
				break;
			case InverterModel.PowMr:
				X = [233, 190, 12, 5, 239, 230];
				break;
			case InverterModel.Sunsynk:
				X = [234, 208, 10, 6, 239, 225];
				break;
			case InverterModel.SolarEdge:
				X = [234, 206, 22, 5, 2, 239, 225];
				break;
			case InverterModel.Sofar:
				X = [233, 230, 12, 4, 239, 245];
				break;
			case InverterModel.Solis:
				X = [249, 198, 8, 17, 239, 232];
				break;
			case InverterModel.Victron:
				X = [218, 217, 18, 7.5, 239, 231];
				break;
			default:
				return svg`
					<circle id="standby" cx="252" cy="260" r="3.5" fill="${data.inverterStateColour}"/>
				`;
		}

		return svg`
			<rect x="${X[0]}" y="${X[1]}" width="${X[2]}" height="${X[3]}" rx="1" ry="1" fill="${data.inverterStateColour}" stroke="${data.inverterStateColour}" pointer-events="all" 
			 display="${config.entities.inverter_status_59 && data.inverterStateMsg ? '' : 'none'}" />
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.inverter_status_59)}>
                <text id="standby" x="${X[4]}" y="${X[5]}" class="st15" fill="${data.inverterStateColour}"
                      display="${config.entities.inverter_status_59 && data.inverterStateMsg ? '' : 'none'}">
                    ${data.inverterStateMsg}
                </text>
            </a>
		`;
	}
}