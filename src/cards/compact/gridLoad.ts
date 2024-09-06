import { DataDto, PowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { LoadUtils } from './loadUtils';
import { Utils } from '../../helpers/utils';
import { UnitOfPower } from '../../const';
import { Load } from './load';

export class GridLoad {

	private static getPositions(no: number, max: number): number {
		switch (no) {
			case 1:
				switch (max) {
					case 1:
						return 86;
					case 2:
						return 43;
					case 3:
						return 0;
				}
				break;
			case 2:
				switch (max) {
					case 2:
						return 86;
					case 3:
						return 43;
				}
				break;
			case 3:
				return 86;

		}
		return 0;
	}


	static generateLoad1(data: DataDto, config: PowerFlowCardConfig) {
		const X = this.getPositions(1, config.grid.additional_loads);

		return svg`${data.nonessentialLoads >= 1 ?
			svg`
				${LoadUtils.generateGridLoad(1, data.iconNonessentialLoad1,
				data.dynamicColourNonEssentialLoad1,
				config.grid?.load1_name,
				data.stateNonessentialLoad1,
				data.stateNonEssentialLoad1Extra,
				data.stateNonEssentialLoad1Toggle,
				config.grid.auto_scale, data.decimalPlaces,
				X, Load.row5, [11, 0, 20.5],
			)}`
			: svg``
		}`;

	}

	static generateLoad2(data: DataDto, config: PowerFlowCardConfig) {
		const X = this.getPositions(2, config.grid.additional_loads);

		return svg`${data.nonessentialLoads >= 2 ?
			svg`
				${LoadUtils.generateGridLoad(2, data.iconNonessentialLoad2,
				data.dynamicColourNonEssentialLoad2,
				config.grid?.load2_name,
				data.stateNonessentialLoad2,
				data.stateNonEssentialLoad2Extra,
				data.stateNonEssentialLoad2Toggle,
				config.grid.auto_scale, data.decimalPlaces,
				X, Load.row5, [11, 0, 20.5],
			)}`
			: svg``
		}`;
	}


	static generateLoad3(data: DataDto, config: PowerFlowCardConfig) {
		const X = this.getPositions(3, config.grid.additional_loads);

		return svg`${data.nonessentialLoads >= 3 ?
			svg`
				${LoadUtils.generateGridLoad(3, data.iconNonessentialLoad3,
				data.dynamicColourNonEssentialLoad3,
				config.grid?.load3_name,
				data.stateNonessentialLoad3,
				data.stateNonEssentialLoad3Extra,
				data.stateNonEssentialLoad3Toggle,
				config.grid.auto_scale, data.decimalPlaces,
				X, Load.row5, [11, 0, 20.5],
			)}`
			: svg``
		}`;
	}

	private static getLines(no: number, max: number) {
		switch (no) {
			case 1:
				switch (max) {
					case 1:
						return `M 109 328L 109 333`;
					case 2:
						return `M 66 328 L 66 333`;
					case 3:
						return `M 23 328 L 23 333`;
				}
				break;
			case 2:
				switch (max) {
					case 2:
						return `M 109 328L 109 333`;
					case 3:
						return `M 66 328 L 66 333`;
				}
				break;
			case 3:
				return `M 109 328L 109 333`;

		}
		return ``;
	}

	static generateIcon(data: DataDto, config: PowerFlowCardConfig) {
		const icon = LoadUtils.getIconWithCondition(data.nonessentialLoads >= 1, config.battery.show_battery_banks?53:68, 290, data.nonessentialIcon, 'nes-load-icon', 32);

		return svg`${icon}`;

	}

	static generateLines(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<path id="nes-load1" d="${this.getLines(1, config.grid.additional_loads)}"
				class="${config.grid.additional_loads >= 1 ? '' : 'st12'}" fill="none"
				stroke="${data.dynamicColourNonEssentialLoad1}" stroke-width="1" stroke-miterlimit="10"
				pointer-events="stroke" />
			<path id="nes-load2" d="${this.getLines(2, config.grid.additional_loads)}"
				class="${config.grid.additional_loads >= 2 ? '' : 'st12'}" fill="none"
				stroke="${data.dynamicColourNonEssentialLoad2}" stroke-width="1" stroke-miterlimit="10"
				pointer-events="stroke" />
			<path id="nes-load3" d="${this.getLines(3, config.grid.additional_loads)}"
				class="${config.grid.additional_loads >= 3 ? '' : 'st12'}" fill="none"
				stroke="${data.dynamicColourNonEssentialLoad3}" stroke-width="1" stroke-miterlimit="10"
				pointer-events="stroke" />
		`;
	}

	static generateFlowLine(data: DataDto, config: PowerFlowCardConfig) {
		const startX = (() => {
			switch (config.grid.additional_loads) {
				case 1:
					return 109;
				case 2:
					return 66;
				case 3:
					return 23;
				default:
					return 135
			}
		})();

		const line1 = `M ${startX} 328 L 135 328 Q 140 328 140 323 L 140 320`;
		return svg`
			 <svg id="nes-flow1">
				<path id="nes-line1" d="${line1}" fill="none" stroke="${data.dynamicColourNonEssentialLoad}"
					  stroke-width="${data.nonessLineWidth}" stroke-miterlimit="10" pointer-events="stroke"/>
				<circle id="nes-dot1" cx="0" cy="0"
						r="${Math.min(2 + data.nonessLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${data.nonessentialLoads === 0 ? 'transparent' : `${data.dynamicColourNonEssentialLoad}`}">
					<animateMotion dur="${data.durationCur['ne']}s" repeatCount="indefinite"
								   keyPoints="0;1"
								   keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#nes-line1"/>
					</animateMotion>
				</circle>
			 </svg>
			 <svg id="nes-flow2">
				<path id="nes-line2" d="M 140 290 L 140 234" fill="none" stroke="${data.dynamicColourNonEssentialLoad}"
					  stroke-width="${data.nonessLineWidth}" stroke-miterlimit="10" pointer-events="stroke"/>
				<circle id="nes-dot2" cx="0" cy="0"
						r="${Math.min(2 + data.nonessLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${data.nonessentialLoads === 0 ? 'transparent' : `${data.dynamicColourNonEssentialLoad}`}">
					<animateMotion dur="${data.durationCur['ne']}s" repeatCount="indefinite"
								   keyPoints="0;1"
								   keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#nes-line2"/>
					</animateMotion>
				</circle>
			</svg>
	`;
	}

	static generateShapeAndName(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<rect x="${config.battery.show_battery_banks?'90':'105'}" y="290" width="70" height="30" rx="4.5" ry="4.5" fill="none"
				stroke="${data.dynamicColourNonEssentialLoad}" pointer-events="all"
				display="${data.nonessentialLoads === 0 ? 'none' : ''}"/>
			<text id="ess_load_name" class="st16 left-align" x="${config.battery.show_battery_banks?'93':'108'}" y="295" fill="${data.dynamicColourNonEssentialLoad}">
				${config.grid.nonessential_name}
			</text>
		`;
	}

	static generateTotalPower(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<text id="nonessential_load_power" x="${config.battery.show_battery_banks?'125':'140'}" y="307"
				  display="${data.nonessentialLoads === 0 ? 'none' : ''}"
				  class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
				  fill="${data.dynamicColourNonEssentialLoad}">
				${config.grid.auto_scale
			? Utils.convertValue(data.nonessentialPower, data.decimalPlaces) || 0
			: `${data.nonessentialPower || 0} ${UnitOfPower.WATT}`
		}
			</text>`;
	}
}