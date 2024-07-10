import { DataDto, PowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { icons } from '../../helpers/icons';
import { Utils } from '../../helpers/utils';
import { localize } from '../../localize/localize';
import { LoadUtils } from './loadUtils';

export class Inverter {

	static generateIcon(data: DataDto) {
		return svg`
			<svg xmlns="http://www.w3.org/2000/svg" x="213.5" y="179.5" width="54"
				 height="79" viewBox="0 0 74 91" preserveAspectRatio="xMidYMid meet"
				 opacity="${!data.genericInverterImage ? 0 : 1}">
				<g transform="translate(0.000000,91.000000) scale(0.100000,-0.100000)"
				   fill="${data.inverterColour}" stroke="none">
					<path d="${icons.inverter}"/>
				</g>
			</svg>
		`;
	}

	static generateTimerInfo(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.use_timer_248)}>
				<svg xmlns="http://www.w3.org/2000/svg" id="timer" x="267.7" y="243.3" width="18"
					 height="18" viewBox="0 0 24 24">
					<path display="${data.stateUseTimer.state == 'on' && data.enableTimer !== 'no' ? '' : 'none'}"
						  fill="${data.inverterColour}"
						  d="${icons.timerOn}"/>
				</svg>
				<svg xmlns="http://www.w3.org/2000/svg" id="timer_off" x="267.7" y="243.3" width="18"
					 height="18" viewBox="0 0 24 24">
					<path display="${data.stateUseTimer.state == 'off' && data.enableTimer !== 'no' ? '' : 'none'}"
						  fill="${data.inverterColour}"
						  d="${icons.timerOff}"/>
				</svg>
				<text id="timer_text_off" x="287" y="254.7" class="st3 left-align"
					  display="${data.stateUseTimer.state == 'off' && data.enableTimer !== 'no' ? '' : 'none'}"
					  fill="${data.inverterColour}">${localize('common.timer_off')}
				</text>
				<text id="timer_text_on" x="287" y="254.7" class="st3 left-align"
					  display="${data.stateUseTimer.state == 'on' && data.enableTimer !== 'no' ? '' : 'none'}"
					  fill="${data.inverterColour}">${localize('common.timer_on')}
				</text>
			</a>
		`;
	}

	static generateFrequency(data: DataDto) {
		return svg`${LoadUtils.generateFrequency(data.stateLoadFrequency, data.inverterColour, 'load_frequency_192', 301.7, 208, 'right-align')}`;
	}

	static generatePhases(data: DataDto) {
		return svg`
			${LoadUtils.generatePhaseVoltage('L1', data.stateInverterVoltageL1, 301.7, 195, data.inverterColour)}
			${LoadUtils.generatePhaseVoltage('L2', data.stateInverterVoltageL2, 301.7, 182, data.inverterColour)}
			${LoadUtils.generatePhaseVoltage('L3', data.stateInverterVoltageL3, 301.7, 169, data.inverterColour)}
			
			${LoadUtils.generatePhaseAmperage('L1', data.stateInverterCurrentL1, 305.7, 195, data.inverterColour)}
			${LoadUtils.generatePhaseAmperage('L2', data.stateInverterCurrentL2, 305.7, 182, data.inverterColour)}
			${LoadUtils.generatePhaseAmperage('L3', data.stateInverterCurrentL3, 305.7, 169, data.inverterColour)}
		`;
	}

	static generatePriorityLoad(data: DataDto, config: PowerFlowCardConfig){
		return svg`
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
                      fill="${data.inverterColour}">${localize('common.priority_batt')}
                </text>
                <text id="priority_text_load" x="287" y="273" class="st3 left-align"
                      display="${data.priorityLoad === 'on' && (data.priorityLoad !== 'no' || !data.priorityLoad) ? '' : 'none'}"
                      fill="${data.inverterColour}">${localize('common.priority_load')}
                </text>
            </a>
		`;
	}

	static generateInverterImage(data: DataDto, inverterImg: string){
		return svg`
			<image x="212" y="180" width="54" height="72"
                   class="${!data.genericInverterImage ? '' : 'st12'}"
                   href="${inverterImg}"
                   preserveAspectRatio="none"/>
		`;
	}

	static generateInverterProgram(data: DataDto){
		return svg`
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
		`;
	}

	static generateTemps(data: DataDto, config: PowerFlowCardConfig){
		let ac=config.inverter?.ac_icon
			?LoadUtils.getIcon(180, 219, config.inverter.ac_icon, 'small_ac_dc_icon', 14)
			:svg`
				<text id="ac_temp" x="193" y="229" class="st3 right-align" fill="${data.inverterColour}"
                      display="${config.entities?.radiator_temp_91 && data.stateRadiatorTemp.isValid() ? '' : 'none'}">
                    AC:
                </text>`;
		let dc= config.inverter?.dc_icon
			?LoadUtils.getIcon(180, 231, config.inverter.dc_icon, 'small_ac_dc_icon', 14)
			:svg`
			<text id="dc_temp" x="193" y="241" class="st3 right-align" fill="${data.inverterColour}"
                  display="${config.entities?.dc_transformer_temp_90 && data.stateDCTransformerTemp.isValid() ? '' : 'none'}">
                DC:
            </text>`;
		return svg`
            <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.radiator_temp_91)}>
                ${ac}
                <text id="ac_temp" x="195" y="229" class="st3 left-align" fill="${data.inverterColour}"
                      display="${config.entities?.radiator_temp_91 && data.stateRadiatorTemp.isValid() ? '' : 'none'}">
                    ${data.stateRadiatorTemp.toNum(1)}°
                </text>
            </a>
            <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.dc_transformer_temp_90)}>
                ${dc}
                <text id="dc_temp" x="195" y="241" class="st3 left-align" fill="${data.inverterColour}"
                      display="${config.entities?.dc_transformer_temp_90 && data.stateDCTransformerTemp.isValid() ? '' : 'none'}">
                    ${data.stateDCTransformerTemp.toNum(1)}°
                </text>
            </a>
		`;
	}

}