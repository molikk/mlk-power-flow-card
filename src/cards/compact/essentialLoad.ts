import { svg } from 'lit';
import { DataDto, PowerFlowCardConfig } from '../../types';
import { Utils } from '../../helpers/utils';
import { Load } from './load';
import { LoadUtils } from './loadUtils';

export class EssentialLoad {

	private static readonly mainX = Load.LOAD_X;

	static generateLines(data: DataDto, config: PowerFlowCardConfig) {
		const isAux = config.load.show_aux || false;
		const lineX = Load.column2 + Load.xGaps[1] - (Load.column2 - Load.column1 - 41) / 2;
		const line0 = `M ${lineX} 190 L ${lineX} ${isAux ? '171.5' : '156'}`;
		const line1 = `M ${lineX} 190 L ${lineX} 156`;
		const line2 = `M ${lineX} 286 L ${lineX} 247`;
		const line3 = `M ${lineX} 362 L ${lineX} 306`;
		const line4 = `M ${lineX} 136 L ${lineX}  81`;

		return svg`
			<path id="es-load1" d="${line0}"
						class="${data.additionalLoad < 4 ? '' : 'st12'}" fill="none"
						stroke="${data.loadColour}" stroke-width="1" stroke-miterlimit="10"
						pointer-events="stroke" />
			<path id="es-load1" d="${line1}"
						class="${data.additionalLoad >= 4 ? '' : 'st12'}" fill="none"
						stroke="${data.loadColour}" stroke-width="1" stroke-miterlimit="10"
						pointer-events="stroke" />
			<path id="es-load2" d="${line2}"
						class="${data.additionalLoad >= 2 ? '' : 'st12'}" fill="none"
						stroke="${data.loadColour}" stroke-width="1" stroke-miterlimit="10"
						pointer-events="stroke" />
			<path id="es-load3" d="${line3}"
						class="${data.additionalLoad >= 5 ? '' : 'st12'}" fill="none"
						stroke="${data.loadColour}" stroke-width="1" stroke-miterlimit="10"
						pointer-events="stroke" />
			<path id="es-load4" d="${line4}"
						class="${data.additionalLoad >= 7 && !config.load.show_aux ? '' : 'st12'}" fill="none"
						stroke="${data.loadColour}" stroke-width="1" stroke-miterlimit="10"
						pointer-events="stroke" />
		`;
	}

	static generateLoad1(data: DataDto, config: PowerFlowCardConfig) {
		const isAux = config.load.show_aux || false;
		const iconBig = this.mainX + 5;
		const shapeColumn1 = this.mainX;
		const powerColumn0 = this.mainX + 42;
		const extraColumn2 = this.mainX + 45;

		const icon1_big = LoadUtils.getIconWithCondition(data.additionalLoad <= 3, iconBig, isAux ? 113 : 95, data.iconEssentialLoad1, 'essload1-icon', 36);
		const icon1_big_link = LoadUtils.getIconLink(config.entities.essential_load1_toggle, icon1_big);


		return svg`${data.additionalLoad >= 4 ?
			svg`
			${LoadUtils.generateEssentialLoad(1, data.iconEssentialLoad1,
				data.dynamicColourEssentialLoad1,
				config.load?.load1_name,
				data.stateEssentialLoad1,
				data.stateEssentialLoad1Extra,
				data.stateEssentialLoad1Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column1, Load.row2,
			)}`
			:
			svg`${data.additionalLoad >= 1 ?
				svg`
					${icon1_big_link}
					
					<rect id="es-load1" x="${shapeColumn1}" y="${isAux ? '141' : '126'}" width="82" height="30" rx="4.5" ry="4.5" fill="none"
								stroke="${data.dynamicColourEssentialLoad1}" pointer-events="all"
								display="${data.additionalLoad <= 3 ? '' : 'none'}" />	
					<text id="es-load1" x="${isAux ? extraColumn2 : powerColumn0}" y="${isAux ? '133' : '118'}" class="st3  left-align"
							display="${data.additionalLoad <= 3 ? '' : 'none'}"
							fill="${data.dynamicColourEssentialLoad1}">
						${config.load?.load1_name ? `${config.load.load1_name}` : ''}
					</text>
					<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.essential_load1)}>
						<text id="ess_load1" x="${powerColumn0}" y="${isAux ? '158' : '143'}"
								display="${data.additionalLoad <= 3 && data.stateEssentialLoad1.isValid() ? '' : 'none'}"
								class="${data.largeFont !== true ? 'st14' : 'st4'} st8"
								fill="${data.dynamicColourEssentialLoad1}">
							${data.stateEssentialLoad1?.toPowerString(config.load.auto_scale, data.decimalPlaces)}
						</text>
					</a>				
					<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.essential_load1_extra)}>
						<text id="ess_load1_extra" x="${extraColumn2}" y="${isAux ? '182' : '167'}"
									display="${(config.entities?.essential_load1_extra && data.additionalLoad <= 3) && data.stateEssentialLoad1Extra.isValid() ? '' : 'none'}"
									class="st3 left-align" fill="${data.dynamicColourEssentialLoad1}">
							${data.stateEssentialLoad1Extra.toNum(1)}
							${data.stateEssentialLoad1Extra.getUOM()}
						</text>
					</a>`
				: ``
			}
			`
		}`;
	}

	static generateLoad2(data: DataDto, config: PowerFlowCardConfig) {
		const iconBig = this.mainX + 5;
		const shapeColumn1 = this.mainX;
		const powerColumn0 = this.mainX + 42;
		const extraColumn2 = this.mainX + 45;

		const icon2_big = LoadUtils.getIcon(iconBig, 250, data.iconEssentialLoad2, 'essload2-icon', 36);
		const icon2_big_link = LoadUtils.getIconLink(config.entities.essential_load2_toggle, icon2_big);

		return svg`${data.additionalLoad >= 4 ?
			svg`
			${LoadUtils.generateEssentialLoad(2, data.iconEssentialLoad2,
				data.dynamicColourEssentialLoad2,
				config.load?.load2_name,
				data.stateEssentialLoad2,
				data.stateEssentialLoad2Extra,
				data.stateEssentialLoad2Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column2, Load.row2,
			)}`
			: svg`${data.additionalLoad === 3 ?
				svg`
					${LoadUtils.generateEssentialLoad(2, data.iconEssentialLoad2,
					data.dynamicColourEssentialLoad2,
					config.load?.load2_name,
					data.stateEssentialLoad2,
					data.stateEssentialLoad2Extra,
					data.stateEssentialLoad2Toggle,
					config.load.auto_scale, data.decimalPlaces,
					Load.column1, Load.row4,
				)}`
				: svg`${data.additionalLoad === 2 ?
					svg`
						${icon2_big_link}
						
						<rect id="es-load2" x="${shapeColumn1}" y="286" width="82" height="30" rx="4.5" ry="4.5" fill="none"
									stroke="${data.dynamicColourEssentialLoad2}" pointer-events="all" />
						<text id="es-load2" x="${powerColumn0}" y="326.5" class="st3"
								fill="${data.dynamicColourEssentialLoad2}">
							${config.load?.load2_name ? `${config.load.load2_name}` : ''}
						</text>
						<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.essential_load2)}>
							<text id="ess_load2" x="${powerColumn0}" y="302.5"
										display="${data.stateEssentialLoad2.isValid() ? '' : 'none'}"
										class="${data.largeFont !== true ? 'st14' : 'st4'} st8"
										fill="${data.dynamicColourEssentialLoad2}">
								${data.stateEssentialLoad2?.toPowerString(config.load.auto_scale, data.decimalPlaces)}
							</text>
						</a>
						<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.essential_load2_extra)}>
							<text id="ess_load2_extra" x="${extraColumn2}" y="278"
										display="${data.stateEssentialLoad2Extra.isValid() ? '' : 'none'}"
										class="st3 left-align" fill="${data.dynamicColourEssentialLoad2}">
								${data.stateEssentialLoad2Extra.toNum(1)}
								${data.stateEssentialLoad2Extra.getUOM()}
							</text>
						</a>`
					: svg``
				}`
			}`
		}`;
	}

	static generateLoad3(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad === 3 ?
			svg`
				${LoadUtils.generateEssentialLoad(3, data.iconEssentialLoad3,
				data.dynamicColourEssentialLoad3,
				config.load?.load3_name,
				data.stateEssentialLoad3,
				data.stateEssentialLoad3Extra,
				data.stateEssentialLoad3Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column2, Load.row4,
			)}`
			: svg`${data.additionalLoad >= 4 ?
				svg`
					${LoadUtils.generateEssentialLoad(3, data.iconEssentialLoad3,
					data.dynamicColourEssentialLoad3,
					config.load?.load3_name,
					data.stateEssentialLoad3,
					data.stateEssentialLoad3Extra,
					data.stateEssentialLoad3Toggle,
					config.load.auto_scale, data.decimalPlaces,
					Load.column1, Load.row4,
				)}`
				: svg``
			}`
		}`;
	}

	static generateLoad4(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 4 ?
			svg`
				${LoadUtils.generateEssentialLoad(4, data.iconEssentialLoad4,
				data.dynamicColourEssentialLoad4,
				config.load?.load4_name,
				data.stateEssentialLoad4,
				data.stateEssentialLoad4Extra,
				data.stateEssentialLoad4Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column2, Load.row4,
			)}`
			: svg``
		}`;

	}

	static generateLoad5(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 5 ?
			svg`
				${LoadUtils.generateEssentialLoad(5, data.iconEssentialLoad5,
				data.dynamicColourEssentialLoad5,
				config.load?.load5_name,
				data.stateEssentialLoad5,
				data.stateEssentialLoad5Extra,
				data.stateEssentialLoad5Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column1, Load.row5,
			)}`
			: svg``
		}`;
	}

	static generateLoad6(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 6 ?
			svg`
				${LoadUtils.generateEssentialLoad(6, data.iconEssentialLoad6,
				data.dynamicColourEssentialLoad6,
				config.load?.load6_name,
				data.stateEssentialLoad6,
				data.stateEssentialLoad6Extra,
				data.stateEssentialLoad6Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column2, Load.row5,
			)}`
			: svg``
		}`;
	}


	static generateLoad7(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 7 && !config.load.show_aux ?
			svg`
				${LoadUtils.generateEssentialLoad(7, data.iconEssentialLoad7,
				data.dynamicColourEssentialLoad7,
				config.load?.load7_name,
				data.stateEssentialLoad7,
				data.stateEssentialLoad7Extra,
				data.stateEssentialLoad7Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column1, Load.row1,
			)}`
			: svg``
		}`;
	}


	static generateLoad8(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 8 && !config.load.show_aux ?
			svg`
				${LoadUtils.generateEssentialLoad(8, data.iconEssentialLoad8,
				data.dynamicColourEssentialLoad8,
				config.load?.load8_name,
				data.stateEssentialLoad8,
				data.stateEssentialLoad8Extra,
				data.stateEssentialLoad8Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column2, Load.row1,
			)}`
			: svg``
		}`;
	}


	static generateLoad9(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 9 ?
			svg`
				${LoadUtils.generateEssentialLoad(9, data.iconEssentialLoad9,
				data.dynamicColourEssentialLoad9,
				config.load?.load9_name,
				data.stateEssentialLoad9,
				data.stateEssentialLoad9Extra,
				data.stateEssentialLoad9Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column3, Load.row3,
			)}`
			: svg``
		}`;
	}

	static generateLoad10(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 10 ?
			svg`
				${LoadUtils.generateEssentialLoad(10, data.iconEssentialLoad10,
				data.dynamicColourEssentialLoad10,
				config.load?.load10_name,
				data.stateEssentialLoad10,
				data.stateEssentialLoad10Extra,
				data.stateEssentialLoad10Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column3, Load.row2,
			)}`
			: svg``
		}`;
	}

	static generateLoad11(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 11 ?
			svg`
			${LoadUtils.generateEssentialLoad(11, data.iconEssentialLoad11,
				data.dynamicColourEssentialLoad11,
				config.load?.load11_name,
				data.stateEssentialLoad11,
				data.stateEssentialLoad11Extra,
				data.stateEssentialLoad11Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column3, Load.row4,
			)}`
			: svg``
		}`;
	}

	static generateLoad12(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 12 ?
			svg`
			${LoadUtils.generateEssentialLoad(12, data.iconEssentialLoad12,
				data.dynamicColourEssentialLoad12,
				config.load?.load12_name,
				data.stateEssentialLoad12,
				data.stateEssentialLoad12Extra,
				data.stateEssentialLoad12Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column3, Load.row5,
			)}`
			: svg``
		}`;
	}

	static generateLoad13(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 13 && !config.load.show_aux ?
			svg`
			${LoadUtils.generateEssentialLoad(13, data.iconEssentialLoad13,
				data.dynamicColourEssentialLoad13,
				config.load?.load13_name,
				data.stateEssentialLoad13,
				data.stateEssentialLoad13Extra,
				data.stateEssentialLoad13Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column3, Load.row1,
			)}`
			: svg``
		}`;
	}

	static generateLoad14(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 14 ?
			svg`
				${LoadUtils.generateEssentialLoad(14, data.iconEssentialLoad14,
				data.dynamicColourEssentialLoad14,
				config.load?.load14_name,
				data.stateEssentialLoad14,
				data.stateEssentialLoad14Extra,
				data.stateEssentialLoad14Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column4, Load.row3,
			)}`
			: svg``
		}`;
	}

	static generateLoad15(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 15 ?
			svg`
				${LoadUtils.generateEssentialLoad(15, data.iconEssentialLoad15,
				data.dynamicColourEssentialLoad15,
				config.load?.load15_name,
				data.stateEssentialLoad15,
				data.stateEssentialLoad15Extra,
				data.stateEssentialLoad15Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column4, Load.row2,
			)}`
			: svg``
		}`;
	}

	static generateLoad16(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 16 ?
			svg`
			${LoadUtils.generateEssentialLoad(16, data.iconEssentialLoad16,
				data.dynamicColourEssentialLoad16,
				config.load?.load16_name,
				data.stateEssentialLoad16,
				data.stateEssentialLoad16Extra,
				data.stateEssentialLoad16Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column4, Load.row4,
			)}`
			: svg``
		}`;
	}

	static generateLoad17(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 17 ?
			svg`
			${LoadUtils.generateEssentialLoad(17, data.iconEssentialLoad17,
				data.dynamicColourEssentialLoad17,
				config.load?.load17_name,
				data.stateEssentialLoad17,
				data.stateEssentialLoad17Extra,
				data.stateEssentialLoad17Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column4, Load.row5,
			)}`
			: svg``
		}`;
	}

	static generateLoad18(data: DataDto, config: PowerFlowCardConfig) {

		return svg`${data.additionalLoad >= 18 && !config.load.show_aux ?
			svg`
			${LoadUtils.generateEssentialLoad(18, data.iconEssentialLoad18,
				data.dynamicColourEssentialLoad18,
				config.load?.load18_name,
				data.stateEssentialLoad18,
				data.stateEssentialLoad18Extra,
				data.stateEssentialLoad18Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column4, Load.row1,
			)}`
			: svg``
		}`;
	}
}