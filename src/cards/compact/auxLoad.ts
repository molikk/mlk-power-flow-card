import { svg } from 'lit';
import { DataDto, PowerFlowCardConfig } from '../../types';
import { Load } from './load';
import { LoadUtils } from './loadUtils';
import { Utils } from '../../helpers/utils';
import { UnitOfPower } from '../../const';
import { localize } from '../../localize/localize';

export class AuxLoad {

	private static readonly mainX = Load.LOAD_X;

	static generateShapes(data: DataDto, config: PowerFlowCardConfig) {
		const x = 400 + (Load.LOAD_X - 400) / 2 - 101.3;

		return svg`
			<rect x="${x}" y="139" width="70" height="30" rx="4.5" ry="4.5" fill="none"
					  stroke="${data.auxLoadMainDynamicColour}" pointer-events="all"/>
			<text id="ess_load_name" class="st16 left-align" x="${x + 3}" y="144" fill="${data.auxLoadMainDynamicColour}">
				${config.load.aux_name}
			</text>
		`;
	}

	static generateLines(data: DataDto, config: PowerFlowCardConfig) {
		let lineWidth = data.auxLineWidth;
		let keyPoints = data.auxPower > 0 ? '0;1' : '1;0';
		keyPoints = config.load.aux_invert_flow ? Utils.invertKeyPoints(keyPoints) : keyPoints;
		const x = 400 + (Load.LOAD_X - 400) / 2 - 101.3;
		return svg`
			<svg id="aux-flow">
				<path id="aux-line1" d="M 260 190 L 260 180 Q 260 153 287 153 L ${x} 153"
					  fill="none" stroke="${data.auxLoadMainDynamicColour}" stroke-width="${lineWidth}"
					  stroke-miterlimit="10"
					  pointer-events="stroke"/>
				<circle id="aux-dot1" cx="0" cy="0"
						r="${Math.min(2 + lineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${Math.round(data.auxPower) == 0 ? 'transparent' : `${data.auxLoadMainDynamicColour}`}">
					<animateMotion dur="${data.durationCur['aux']}s" repeatCount="indefinite"
								   keyPoints=${keyPoints}
								   keyTimes="0;1" 
								   calcMode="linear">
						<mpath href='#aux-line1'/>
					</animateMotion>
				</circle>
				<path id="aux-line2" d="M ${x + 70} 153 L ${x + 70 } 153 Q ${x + 70 + 27} 153 ${x + 70 + 27} 126 L ${x + 70 +  27} 46 Q ${x + 70 + 27} 39 ${x + 70 + 27 + 5} 39 L ${Load.column1 + Load.xGaps[1]} 39 "
					  fill="none" stroke="${data.auxLoadMainDynamicColour}" stroke-width="${lineWidth}"
					  stroke-miterlimit="10"
					  pointer-events="stroke"/>
				<circle id="aux-dot2" cx="0" cy="0"
						r="${Math.min(2 + lineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${Math.round(data.auxPower) == 0 ? 'transparent' : `${data.auxLoadMainDynamicColour}`}">
					<animateMotion dur="${data.durationCur['aux'] * 2}s" repeatCount="indefinite"
								   keyPoints=${keyPoints}
								   keyTimes="0;1" 
								   calcMode="linear">
						<mpath href='#aux-line2'/>
					</animateMotion>
				</circle>
			</svg>`;
	}


	static generateLoad(data: DataDto, config: PowerFlowCardConfig, id: number) {
		return svg`${config.load.aux_loads >= id ?
			svg`
				${LoadUtils.generateAuxLoad(id, data.auxLoadIcon,
				data.auxLoadDynamicColour,
				AuxLoad.auxLoadName(config),
				data.auxLoadState,
				data.auxLoadExtraState,
				data.auxLoadToggleState,
				config.load.auto_scale, data.decimalPlaces,
				Load.columns, Load.rowAux,
			)}`
			: svg``
		}`;
	}

	static auxLoadName(config: PowerFlowCardConfig){
		return [
			config.load?.aux_load1_name,
			config.load?.aux_load2_name,
			config.load?.aux_load3_name,
			config.load?.aux_load4_name
		];
	}

	static generateTotalLoad(data: DataDto, config: PowerFlowCardConfig) {
		const x = 400 + (this.mainX - 400) / 2 - 65.3;
		const value = config.grid.auto_scale
			? Utils.convertValue(data.auxPower, data.decimalPlaces) || 0
			: `${data.auxPower || 0} ${UnitOfPower.WATT}`;

		return svg`
			${data.stateAuxPower.isValid() ?
			svg`
					<a href="#" @click=${(e) => Utils.handlePopup(e, config.stateAuxPower.entity_id)}>
						<text id="aux_power" x="${x}" y="155.5" class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
							  fill="${data.auxLoadMainDynamicColour}">
							  ${value}
						</text>
					</a>`
			: svg`
					<text id="aux_power" x="${x}" y="155.5" class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
						  fill="${data.auxLoadMainDynamicColour}">
						  ${value}
					</text>`
		}
		`;
	}

	static generateDailyLoad(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.day_aux_energy)}>
				<text id="daily_load_value" x="${this.mainX + 10}" y="87"
					  class="st10 left-align" display="${!data.showDailyAux || !data.stateDayAuxEnergy.isValid() ? 'none' : ''}"
					  fill="${data.auxLoadMainDynamicColour}">
					${data.stateDayAuxEnergy?.toPowerString(true, data.decimalPlacesEnergy)}
				</text>
			</a>
			<text id="daily_load" 
					x="${this.mainX + 10}"
				    y="100"
				    class="st3 left-align"
				    fill="${!data.showDailyAux ? 'transparent' : `${data.auxLoadMainDynamicColour}`}">
				${config.load?.aux_daily_name ? config.load?.aux_daily_name : localize('common.daily_aux')}
			</text>
		`;

	}
}