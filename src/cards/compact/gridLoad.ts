import { DataDto, sunsynkPowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { LoadUtils } from './loadUtils';
import { Utils } from '../../helpers/utils';
import { UnitOfPower } from '../../const';

export class GridLoad {

	private static getPositions(no: number, max: number) {
		switch (no) {
			case 1:
				switch (max) {
					case 1:
						return [86, 97, 106.5];
					case 2:
						return [43, 54, 63.5];
					case 3:
						return [0, 11, 20.5];
				}
				break;
			case 2:
				switch (max) {
					case 2:
						return [86, 97, 106.5];
					case 3:
						return [43, 54, 63.5];
				}
				break;
			case 3:
				return [86, 97, 106.5];

		}
		return[];
	}


	static generateLoad1(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const X = this.getPositions(1, config.grid.additional_loads)


		const icon = LoadUtils.getIcon(X[1], 335, data.iconNonessentialLoad1, 'nes-load1_small-icon');
		const icon_link = LoadUtils.getIconLink(config.entities.non_essential_load1_toggle, icon);

		return svg`${data.nonessentialLoads >= 1 ?
			svg`
			${LoadUtils.generateLoad(
				'nes', 1, icon_link,
				data.dynamicColourNonEssentialLoad1, X[0], 362,
				config.grid?.load1_name, X[2], 390,
				data.stateNonessentialLoad1, X[2], 372,
				data.stateNonEssentialLoad1Extra, X[2], 402,
				data.stateNonEssentialLoad1Toggle, config.grid.auto_scale, data.decimalPlaces,
			)}`
			: svg``
		}`;
	}

	static generateLoad2(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const X = this.getPositions(2, config.grid.additional_loads)


		const icon = LoadUtils.getIcon(X[1], 335, data.iconNonessentialLoad2, 'nes-load2_small-icon');
		const icon_link = LoadUtils.getIconLink(config.entities.non_essential_load2_toggle, icon);

		return svg`${data.nonessentialLoads >= 2 ?
			svg`
			${LoadUtils.generateLoad(
				'nes', 2, icon_link,
				data.dynamicColourNonEssentialLoad2, X[0], 362,
				config.grid?.load2_name, X[2], 390,
				data.stateNonessentialLoad2, X[2], 372,
				data.stateNonEssentialLoad2Extra, X[2], 402,
				data.stateNonEssentialLoad2Toggle, config.grid.auto_scale, data.decimalPlaces,
			)}`
			: svg``
		}`;
	}


	static generateLoad3(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const X = this.getPositions(3, config.grid.additional_loads)


		const icon = LoadUtils.getIcon(X[1], 335, data.iconNonessentialLoad3, 'nes-load3_small-icon');
		const icon_link = LoadUtils.getIconLink(config.entities.non_essential_load3_toggle, icon);

		return svg`${data.nonessentialLoads >= 3 ?
			svg`
			${LoadUtils.generateLoad(
				'nes', 3, icon_link,
				data.dynamicColourNonEssentialLoad3, X[0], 362,
				config.grid?.load3_name, X[2], 390,
				data.stateNonessentialLoad3, X[2], 372,
				data.stateNonEssentialLoad3Extra, X[2], 402,
				data.stateNonEssentialLoad3Toggle, config.grid.auto_scale, data.decimalPlaces,
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

	static generateIcon(data: DataDto){
		const icon = LoadUtils.getIconWithCondition(data.nonessentialLoads >= 1, 68, 290, data.nonessentialIcon, 'nes-load-icon', 32);

		return svg`${icon}`;

	}

	static generateLines(data: DataDto, config: sunsynkPowerFlowCardConfig) {
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

	static generateFlowLine(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const startX = (() => {
			switch (config.grid.additional_loads) {
				case 1:
					return 109;
				case 2:
					return 66;
				case 3:
					return 23;
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

	static generateShapes(data: DataDto) {
		return svg`
			<rect x="105" y="290" width="70" height="30" rx="4.5" ry="4.5" fill="none"
				stroke="${data.dynamicColourNonEssentialLoad}" pointer-events="all"
				display="${data.nonessentialLoads === 0 ? 'none' : ''}"/>
		`;
	}

	static generateTotalPower(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			<text id="nonessential_load_power" x="140" y="306"
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