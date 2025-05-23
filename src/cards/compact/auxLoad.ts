import { svg, TemplateResult } from 'lit';
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

	static generateFlowLines(data: DataDto, config: PowerFlowCardConfig, xTransform: number, mainXTransform: number) {
		const lineWidth = data.auxLineWidth;
		let keyPoints = data.auxPower > 0 ? '0;1' : '1;0';
		keyPoints = config.load.aux_invert_flow ? Utils.invertKeyPoints(keyPoints) : keyPoints;

		const x = 400 + (Load.LOAD_X - 400) / 2 - 101.3;
		const lineBegin = 260 + mainXTransform;
		const lineEnd = x + xTransform;

		const animationSpeed = (lineEnd - lineBegin) / (x - 260) * data.durationCur['aux'];
		const duration = data.durationCur['aux'] * 2;

		const line1 = `M ${lineBegin} 190 L ${lineBegin} 180 Q ${lineBegin} 153 ${lineBegin + 27} 153 L ${lineEnd} 153`;
		const line2 = `M ${lineEnd + 70} 153 L ${lineEnd + 70} 153 Q ${lineEnd + 70 + 27} 153 ${lineEnd + 70 + 27} 126 L ${lineEnd + 70 + 27} 46 Q ${lineEnd + 70 + 27} 39 ${lineEnd + 70 + 27 + 5} 39 L ${lineEnd - x + Load.column1 + Load.xGaps[1]} 39`;

		const circle2 = this.getCircle(Math.round(data.auxPower) > 0 && config.low_resources.animations, 'aux-dot2', '#aux-line2', lineWidth, data, duration, keyPoints);
		const path2 = this.getPath(config.load.aux_loads > 0, 'aux-flow2', 'aux-line2', line2, data, lineWidth, circle2);

		const circle1 = this.getCircle(Math.round(data.auxPower) > 0 && config.low_resources.animations, 'aux-dot1', '#aux-line1', lineWidth, data, animationSpeed, keyPoints);
		const path1 = this.getPath(true, 'aux-flow1', 'aux-line1', line1, data, lineWidth, circle1);

		return svg`
			${path1}
			${path2}
		`;
	}

	private static getPath(condition: boolean, svgId: string, pathId: string, line: string, data: DataDto, lineWidth: number, circle: TemplateResult<2>) {
		return condition ? svg`
				<svg id="${svgId}" style="overflow: visible">
					<path id="${pathId}" d="${line}"
						fill="none" stroke="${data.auxLoadMainDynamicColour}" stroke-width="${lineWidth}"
					  	stroke-miterlimit="10"
					  	pointer-events="stroke"/>
					${circle}
				</svg>` : svg``;
	}

	private static getCircle(condition: boolean, circleId: string, lineId: string, lineWidth: number, data: DataDto, duration: number, keyPoints: string) {
		return condition ? svg`
				<circle id="${circleId}" cx="0" cy="0"
						r="${Math.min(2 + lineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${data.auxLoadMainDynamicColour}">
					<animateMotion dur="${duration}s" repeatCount="indefinite"
								   keyPoints=${keyPoints}
								   keyTimes="0;1" 
								   calcMode="linear">
						<mpath href='${lineId}'/>
					</animateMotion>
				</circle>` : svg``;
	}

	static generateLoad(data: DataDto, config: PowerFlowCardConfig, id: number) {
		return svg`${config.load.aux_loads >= id ?
			svg`
				${LoadUtils.generateAuxLoad(id, data.auxLoadIcon,
				data.auxLoadDynamicColour,
				AuxLoad.auxLoadName(config),
				data.auxLoadState,
				LoadUtils.extraMode2(config) ? data.auxLoadExtra2State : data.auxLoadExtraState,
				data.auxLoadToggleState,
				config.load.auto_scale, data.decimalPlaces,
				Load.columns, Load.rowAux,
			)}`
			: svg``
		}`;
	}

	static auxLoadName(config: PowerFlowCardConfig) {
		return [
			config.load?.aux_load1_name,
			config.load?.aux_load2_name,
			config.load?.aux_load3_name,
			config.load?.aux_load4_name,
			config.load?.aux_load5_name,
			config.load?.aux_load6_name,
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
				<a href="#" @click=${(e: Event) => Utils.handlePopup(e, config.stateAuxPower.entity_id)}>
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
		const dailyLoadValue = config.load?.show_daily_aux && data.stateDayAuxEnergy.isValid() ? svg`
			<a href="#" @click=${(e: Event) => Utils.handlePopup(e, config.entities.day_aux_energy)}>
				<text id="daily_load_value" x="${this.mainX + 10}" y="87"
						class="st10 left-align"
					  	fill="${data.auxLoadMainDynamicColour}">
					${data.stateDayAuxEnergy?.toPowerString(true, data.decimalPlacesEnergy)}
				</text>
			</a>`
			: svg``;
		const dailyLoadName = svg`
			<text id="daily_load" 
					x="${this.mainX + 10}" y="100"
				    class="st3 left-align"
				    fill="${(config.load?.show_daily_aux ? `${data.auxLoadMainDynamicColour}` : 'transparent')}">
				${config.load?.aux_daily_name ? config.load?.aux_daily_name : localize('common.daily_aux')}
			</text>`;

		return svg`
			${dailyLoadValue}
			${dailyLoadName}
		`;
	}
}