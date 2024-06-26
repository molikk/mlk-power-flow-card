import { DataDto, sunsynkPowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { icons } from '../../helpers/icons';
import { Utils } from '../../helpers/utils';
import { localize } from '../../localize/localize';

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

	static generateTimerInfo(data: DataDto, config: sunsynkPowerFlowCardConfig) {
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
}