import { BatteryBanksViewMode, DataDto, PowerFlowCardConfig } from '../../types';
import { svg, TemplateResult } from 'lit';
import { LoadUtils } from './loadUtils';
import { Utils } from '../../helpers/utils';
import { UnitOfPower } from '../../const';
import { Load } from './load';
import { localize } from '../../localize/localize';

export class GridLoad {

	private static getPositions(no: number, max: number): number {
		switch (max) {
			case 1:
				return 92;
			case 2:
				switch (no) {
					case 1:
						return 46;
					case 2:
						return 92;
				}
				break;
			case 3:
				switch (no) {
					case 1:
						return 0;
					case 2:
						return 46;
					case 3:
						return 92;
				}
				break;
			case 4:
				switch (no) {
					case 1:
						return 0;
					case 2:
					case 4:
						return 46;
					case 3:
						return 92;
				}
				break;
			case 5:
			case 6:
				switch (no) {
					case 1:
					case 4:
						return 0;
					case 2:
					case 5:
						return 46;
					case 3:
					case 6:
						return 92;
				}
				break;
		}
		return 0;
	}

	static generateLoad(data: DataDto, config: PowerFlowCardConfig, ID: number) {
		const id = ID - 1;
		const X = this.getPositions(ID, config.grid.additional_loads);
		const row = id < 3 ? Load.row5 : Load.row6;
		return data.nonessentialLoads > id ?
			svg`
				${LoadUtils.generateGridLoad(
				id + 1, data.nonessentialLoadIcon[id],
				data.nonEssentialLoadDynamicColour[id],
				GridLoad.nonessentialLoadName(config)[id],
				data.nonessentialLoadState[id],
				LoadUtils.extraMode2(config) ? data.nonEssentialLoadExtra2State[id] : data.nonEssentialLoadExtraState[id],
				data.nonEssentialLoadToggleState[id],
				config.grid.auto_scale, data.decimalPlaces,
				X, row, [11, 0, 20.5],
			)}`
			: svg``;
	}

	static nonessentialLoadName(config: PowerFlowCardConfig) {
		return [
			config.grid?.load1_name,
			config.grid?.load2_name,
			config.grid?.load3_name,
			config.grid?.load4_name,
			config.grid?.load5_name,
			config.grid?.load6_name,
		];
	}

	private static getLines(no: number, max: number) {
		switch (no) {
			case 1:
				switch (max) {
					case 1:
						return `M 112 328L 112 333`;
					case 2:
						return `M 67 328 L 67 333`;
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
						return `M 112 328L 112 333`;
					case 3:
					case 4:
					case 5:
					case 6:
						return `M 67 328 L 67 333`;
				}
				break;
			case 3:
				return `M 112 328L 112 333`;
		}
		return ``;
	}

	static generateIcon(data: DataDto, config: PowerFlowCardConfig) {
		let show = config.grid.show_nonessential;
		let x = config.battery.show_battery_banks ? 58 : 68;
		if (config.grid.show_nonessential && config.grid.show_nonessential_daily) {
			if (config.battery.show_battery_banks && config.battery.battery_banks_view_mode == BatteryBanksViewMode.inner) {
				show = false;
			}
			x = 158;
		}

		const icon = LoadUtils.getIconWithStyleAndCondition(
			show,
			x, 290,
			data.nonessentialIcon,
			data.nonEssentialLoadMainDynamicColour,
			32, 32,
		);

		return svg`${icon}`;
	}

	static generateLines(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<path id="nes-load1" d="${this.getLines(1, config.grid.additional_loads)}"
				class="${config.grid.additional_loads >= 1 ? '' : 'st12'}" fill="none"
				stroke="${data.nonEssentialLoadMainDynamicColour}" stroke-width="1" stroke-miterlimit="10"
				pointer-events="stroke" />
			<path id="nes-load2" d="${this.getLines(2, config.grid.additional_loads)}"
				class="${config.grid.additional_loads >= 2 ? '' : 'st12'}" fill="none"
				stroke="${data.nonEssentialLoadMainDynamicColour}" stroke-width="1" stroke-miterlimit="10"
				pointer-events="stroke" />
			<path id="nes-load3" d="${this.getLines(3, config.grid.additional_loads)}"
				class="${config.grid.additional_loads >= 3 ? '' : 'st12'}" fill="none"
				stroke="${data.nonEssentialLoadMainDynamicColour}" stroke-width="1" stroke-miterlimit="10"
				pointer-events="stroke" />
		`;
	}

	static generateFlowLine(data: DataDto, config: PowerFlowCardConfig) {
		const startX: number = (() => {
			switch (config.grid.additional_loads) {
				case 1:
					return 112;
				case 2:
					return 67;
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
		const line2 = 'M 140 290 L 140 234';

		const circle2 = this.getCircle(config.grid.show_nonessential && data.nonessentialPower > 0 && config.low_resources.animations, 'nes-dot2', data, config, '#nes-line2');

		const flowLine1 = this.getFlowLine(config.grid.additional_loads > 0, 'nes-flow1', 'nes-line1', line1, data, svg``);
		const flowLine2 = this.getFlowLine(true, 'nes-flow2', 'nes-line2', line2, data, circle2);

		return svg`
			${flowLine1}
			${flowLine2}
			`;
	}

	private static getCircle(condition: boolean, circleId: string, data: DataDto, config: PowerFlowCardConfig, lineId: string) {
		return condition ? svg`
			<circle id="${circleId}" cx="0" cy="0"
					r="${Math.min(2 + data.nonessLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
					fill="${data.nonEssentialLoadMainDynamicColour}">
				<animateMotion dur="${data.durationCur['ne']}s" repeatCount="indefinite"
							   keyPoints=${config.grid.ness_invert_flow ? Utils.invertKeyPoints('1;0') : '1;0'}
							   keyTimes="0;1" calcMode="linear">
					<mpath href='${lineId}'/>
				</animateMotion>
			</circle>` : svg``;
	}

	private static getFlowLine(condition: boolean, flowId: string, lineId: string, line: string, data: DataDto, circle: TemplateResult<2>) {
		return condition ? svg`
			<svg id="${flowId}" style="overflow: visible">
				<path id="${lineId}" d="${line}" fill="none" stroke="${data.nonEssentialLoadMainDynamicColour}"
					  stroke-width="${data.nonessLineWidth}" stroke-miterlimit="10" pointer-events="stroke"/>
				${circle}
			 </svg` : svg``;

	}

	static generateShapeAndName(data: DataDto, config: PowerFlowCardConfig) {
		return config.grid.show_nonessential ?
			svg`
			<rect x="${config.battery.show_battery_banks ? '90' : '105'}" y="290" width="70" height="30" rx="4.5" ry="4.5" 
				fill="none"
				stroke="${data.nonEssentialLoadMainDynamicColour}" pointer-events="all"/>
			<text id="ess_load_name" class="st16 left-align" x="${config.battery.show_battery_banks ? '93' : '108'}" y="295" 
				fill="${data.nonEssentialLoadMainDynamicColour}">
				${config.grid.nonessential_name}
			</text>`
			: svg``;
	}

	static generateTotalPower(data: DataDto, config: PowerFlowCardConfig) {
		return config.grid.show_nonessential ?
			svg`
			<text id="nonessential_load_power" x="${config.battery.show_battery_banks ? '125' : '140'}" y="307"
				  class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
				  fill="${data.nonEssentialLoadMainDynamicColour}">
				${config.grid.auto_scale
				? Utils.convertValue(data.nonessentialPower, data.decimalPlaces) || 0
				: `${data.nonessentialPower || 0} ${UnitOfPower.WATT}`
			}
			</text>`
			: svg``;
	}

	static generateDailyLoad(data: DataDto, config: PowerFlowCardConfig) {
		if (config.grid?.show_nonessential_daily) {
			return svg`
				<a href="#" @click=${(e: Event) => Utils.handlePopup(e, data.stateNonessentialDailyEnergy?.entity_id)}>
				    <text id="nes_daily_load_value" class="st10 right-align" 
				        x="85" y="302" 
				        display="${data.stateNonessentialDailyEnergy.isValid() ? '' : 'none'}"
				        fill="${data.nonEssentialLoadMainDynamicColour}">
				        ${data.stateNonessentialDailyEnergy?.toPowerString(true, data.decimalPlacesEnergy)}
				    </text>
				</a>
				<text id="nes_daily_load" class="st3 right-align" 
					x="85" y="315" 
					fill="${data.nonEssentialLoadMainDynamicColour}">
				    ${config.grid?.nonessential_daily_name ? config.grid?.nonessential_daily_name : localize('common.daily_grid')}
				</text>`;
		}
		return svg``;
	}
}