import { DataDto, PowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { LoadUtils } from './loadUtils';
import { Utils } from '../../helpers/utils';
import { UnitOfPower } from '../../const';
import { Load } from './load';

export class GridLoad {

	private static getPositions(no: number, max: number): number {
		switch(max) {
			case 1:
				return 86;
			case 2:
				switch(no){
					case 1:
						return 43;
					case 2:
						return 86;
				}
				break;
			case 3:
				switch(no){
					case 1:
						return 0;
					case 2:
						return 43;
					case 3:
						return 86;
				}
				break;
			case 4:
				switch(no){
					case 1:
						return 0;
					case 2:
					case 4:
						return 43;
					case 3:
						return 86;
				}
				break;
			case 5:
			case 6:
				switch(no){
					case 1:
					case 4:
						return 0;
					case 2:
					case 5:
						return 43;
					case 3:
					case 6:
						return 86;
				}
				break;

		}
		return 0;
	}

	static generateLoad(data: DataDto, config: PowerFlowCardConfig, ID: number) {
		const id = ID-1;
		const X = this.getPositions(ID, config.grid.additional_loads);
		const row = id < 3 ? Load.row5 : Load.row6;
		return svg`${data.nonessentialLoads > id ?
			svg`
				${LoadUtils.generateGridLoad(
				id+1, data.nonessentialLoadIcon[id],
				data.nonEssentialLoadDynamicColour[id],
				GridLoad.nonessentialLoadName(config)[id],
				data.nonessentialLoadState[id],
				data.nonEssentialLoadExtraState[id],
				data.nonEssentialLoadToggleState[id],
				config.grid.auto_scale, data.decimalPlaces,
				X, row, [11, 0, 20.5],
			)}`
			: svg``
		}`;

	}

	static nonessentialLoadName(config: PowerFlowCardConfig){
		return [
			config.grid?.load1_name,
			config.grid?.load2_name,
			config.grid?.load3_name,
			config.grid?.load4_name,
			config.grid?.load5_name,
			config.grid?.load6_name
		];
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
					case 4:
					case 5:
					case 6:
						return `M 23 328 L 23 333`;
				}
				break;
			case 2:
				switch (max) {
					case 2:
						return `M 109 328L 109 333`;
					case 3:
					case 4:
					case 5:
					case 6:
						return `M 66 328 L 66 333`;
				}
				break;
			case 3:
				return `M 109 328L 109 333`;

		}
		return ``;
	}

	static generateIcon(data: DataDto, config: PowerFlowCardConfig) {
		const icon = LoadUtils.getIconWithCondition(data.nonessentialLoads >= 1, config.battery.show_battery_banks ? 53 : 68, 290, data.nonessentialIcon, 'nes-load-icon', 32);

		return svg`${icon}`;

	}

	static generateLines(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<path id="nes-load1" d="${this.getLines(1, config.grid.additional_loads)}"
				class="${config.grid.additional_loads >= 1 ? '' : 'st12'}" fill="none"
				stroke="${data.nonEssentialLoadDynamicColour[0]}" stroke-width="1" stroke-miterlimit="10"
				pointer-events="stroke" />
			<path id="nes-load2" d="${this.getLines(2, config.grid.additional_loads)}"
				class="${config.grid.additional_loads >= 2 ? '' : 'st12'}" fill="none"
				stroke="${data.nonEssentialLoadDynamicColour[1]}" stroke-width="1" stroke-miterlimit="10"
				pointer-events="stroke" />
			<path id="nes-load3" d="${this.getLines(3, config.grid.additional_loads)}"
				class="${config.grid.additional_loads >= 3 ? '' : 'st12'}" fill="none"
				stroke="${data.nonEssentialLoadDynamicColour[2]}" stroke-width="1" stroke-miterlimit="10"
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
				case 4:
				case 5:
				case 6:
					return 23;
				default:
					return 135;
			}
		})();

		const line1 = `M ${startX} 328 L 135 328 Q 140 328 140 323 L 140 320`;
		return svg`
			 <svg id="nes-flow1">
				<path id="nes-line1" d="${line1}" fill="none" stroke="${data.nonEssentialLoadMainDynamicColour}"
					  stroke-width="${data.nonessLineWidth}" stroke-miterlimit="10" pointer-events="stroke"/>
				<circle id="nes-dot1" cx="0" cy="0"
						r="${Math.min(2 + data.nonessLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${data.nonessentialLoads === 0 ? 'transparent' : `${data.nonEssentialLoadMainDynamicColour}`}">
					<animateMotion dur="${data.durationCur['ne']}s" repeatCount="indefinite"
								   keyPoints="0;1"
								   keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#nes-line1"/>
					</animateMotion>
				</circle>
			 </svg>
			 <svg id="nes-flow2">
				<path id="nes-line2" d="M 140 290 L 140 234" fill="none" stroke="${data.nonEssentialLoadMainDynamicColour}"
					  stroke-width="${data.nonessLineWidth}" stroke-miterlimit="10" pointer-events="stroke"/>
				<circle id="nes-dot2" cx="0" cy="0"
						r="${Math.min(2 + data.nonessLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${data.nonessentialLoads === 0 ? 'transparent' : `${data.nonEssentialLoadMainDynamicColour}`}">
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
			<rect x="${config.battery.show_battery_banks ? '90' : '105'}" y="290" width="70" height="30" rx="4.5" ry="4.5" 
				fill="none"
				stroke="${data.nonEssentialLoadMainDynamicColour}" pointer-events="all"
				display="${data.nonessentialLoads === 0 ? 'none' : ''}"/>
			<text id="ess_load_name" class="st16 left-align" x="${config.battery.show_battery_banks ? '93' : '108'}" y="295" 
				fill="${data.nonEssentialLoadMainDynamicColour}">
				${config.grid.nonessential_name}
			</text>
		`;
	}

	static generateTotalPower(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<text id="nonessential_load_power" x="${config.battery.show_battery_banks ? '125' : '140'}" y="307"
				  display="${data.nonessentialLoads === 0 ? 'none' : ''}"
				  class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
				  fill="${data.nonEssentialLoadMainDynamicColour}">
				${config.grid.auto_scale
			? Utils.convertValue(data.nonessentialPower, data.decimalPlaces) || 0
			: `${data.nonessentialPower || 0} ${UnitOfPower.WATT}`
		}
			</text>`;
	}
}