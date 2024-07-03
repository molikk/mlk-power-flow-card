import { svg } from 'lit';
import { DataDto, sunsynkPowerFlowCardConfig } from '../../types';
import { Utils } from '../../helpers/utils';
import { Load } from './load';
import { LoadUtils } from './loadUtils';

export class EssentialLoad {

	private static readonly mainX = Load.ESSENTIAL_LOAD_X;

	static generateLines(data: DataDto) {
		const lineX = this.mainX + 42;
		const line0 = `M ${lineX} 190 L ${lineX} 147`;
		const line1 = `M ${lineX} 190 L ${lineX} 147`;
		const line2 = `M ${lineX} 280 L ${lineX} 247`;
		const line3 = `M ${lineX} 360 L ${lineX} 323`;
		const line4 = `M ${lineX} 110 L ${lineX}  73`;

		return svg`
			<path id="es-load1" d="${line0}" class="${data.additionalLoad === 1 ? '' : 'st12'}"
						fill="none" stroke="${data.loadColour}" stroke-width="1" stroke-miterlimit="10"
						pointer-events="stroke" />
			<path id="es-load1" d="${line1}"
						class="${[2, 3, 4, 5, 6, 7, 8].includes(data.additionalLoad) ? '' : 'st12'}" fill="none"
						stroke="${data.loadColour}" stroke-width="1" stroke-miterlimit="10"
						pointer-events="stroke" />
			<path id="es-load2" d="${line2}"
						class="${[2, 3, 4, 5, 6, 7, 8].includes(data.additionalLoad) ? '' : 'st12'}" fill="none"
						stroke="${data.loadColour}" stroke-width="1" stroke-miterlimit="10"
						pointer-events="stroke" />
			<path id="es-load3" d="${line3}"
						class="${[5, 6, 7, 8].includes(data.additionalLoad) ? '' : 'st12'}" fill="none"
						stroke="${data.loadColour}" stroke-width="1" stroke-miterlimit="10"
						pointer-events="stroke" />
			<path id="es-load4" d="${line4}"
						class="${[7, 8].includes(data.additionalLoad) ? '' : 'st12'}" fill="none"
						stroke="${data.loadColour}" stroke-width="1" stroke-miterlimit="10"
						pointer-events="stroke" />
		`;
	}

	static generateLoad1(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const iconLeft = this.mainX + 11;
		const iconBig = this.mainX - 29;
		const shapeColumn1 = this.mainX;
		const nameColumn1 = this.mainX + 39;
		const nameColumn2 = this.mainX + 45;
		const powerColumn0 = this.mainX + 42;
		const powerColumn1 = this.mainX + 23;
		const extraColumn1 = this.mainX + 39;
		const extraColumn2 = this.mainX + 45;

		const icon1_big = LoadUtils.getIconWithCondition([1, 2, 3].includes(data.additionalLoad), iconBig, 114, data.iconEssentialLoad1, 'essload1-icon', 36);
		const icon1_big_link = LoadUtils.getIconLink(config.entities.essential_load1_toggle, icon1_big);

		const icon1 = LoadUtils.getIconWithCondition(data.additionalLoad >= 4, iconLeft, 81, data.iconEssentialLoad1, 'essload1_small-icon');
		const icon1_link = LoadUtils.getIconLink(config.entities.essential_load1_toggle, icon1);


		return svg`${data.additionalLoad >= 1 ?
			svg`
			${icon1_big_link}
			${icon1_link}
			
			<rect id="es-load1" x="${shapeColumn1}" y="116.5" width="82" height="30" rx="4.5" ry="4.5" fill="none"
						stroke="${data.dynamicColourEssentialLoad1}" pointer-events="all"
						display="${[1, 2, 3].includes(data.additionalLoad) ? '' : 'none'}" />
						
			<text id="es-load1" x="${nameColumn2}" y="108" class="st3"
					display="${[1, 2, 3].includes(data.additionalLoad) ? '' : 'none'}"
				fill="${data.dynamicColourEssentialLoad1}">${config.load?.load1_name ? `${config.load.load1_name}` : ''}
			</text>
			
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.essential_load1)}>
				<text id="ess_load1" x="${powerColumn0}" y="133"
							display="${[1, 2, 3].includes(data.additionalLoad) && data.stateEssentialLoad1.isValid() ? '' : 'none'}"
							class="${data.largeFont !== true ? 'st14' : 'st4'} st8"
							fill="${data.dynamicColourEssentialLoad1}">
					${data.stateEssentialLoad1?.toPowerString(config.load.auto_scale, data.decimalPlaces)}
				</text>
			</a>					
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.essential_load1_extra)}>
				<text id="ess_load1_extra" x="${extraColumn2}" y="157"
							display="${(config.entities?.essential_load1_extra && [1, 2, 3].includes(data.additionalLoad)) && data.stateEssentialLoad1Extra.isValid() ? '' : 'none'}"
							class="st3 left-align" fill="${data.dynamicColourEssentialLoad1}">
					${data.stateEssentialLoad1Extra.toNum(1)}
					${data.stateEssentialLoad1Extra.getUOM()}
				</text>
			</a>

			<rect id="es-load1" x="${shapeColumn1}" y="107" width="41" height="20" rx="4.5" ry="4.5" fill="none"
						stroke="${data.dynamicColourEssentialLoad1}" pointer-events="all"
						display="${data.additionalLoad >= 4 ? '' : 'none'}" />
			<text id="es-load1" x="${nameColumn1}" y="136" class="st3 st8 right-align"
					display="${data.additionalLoad >= 4 ? '' : 'none'}" fill="${data.dynamicColourEssentialLoad1}">
				${config.load?.load1_name ? `${config.load.load1_name}` : ''}
			</text>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.essential_load1)}>
				<text id="ess_load1" x="${powerColumn1}" y="118"
							display="${data.additionalLoad >= 4 && data.stateEssentialLoad1.isValid() ? '' : 'none'}"
							class="st3"
							fill="${data.dynamicColourEssentialLoad1}">
					${data.stateEssentialLoad1?.toPowerString(config.load.auto_scale, data.decimalPlaces)}
				</text>
			</a>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.essential_load1_extra)}>
				<text id="ess_load1_extra" x="${extraColumn1}" y="147"
							display="${(config.entities?.essential_load1_extra && data.additionalLoad >= 4) && data.stateEssentialLoad1Extra.isValid() ? '' : 'none'}"
							class="st3 right-align" fill="${data.dynamicColourEssentialLoad1}">
					${data.stateEssentialLoad1Extra.toNum(1)}
					${data.stateEssentialLoad1Extra.getUOM()}
				</text>
			</a>`
			: svg``
		}`;
	}

	static generateLoad2(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const iconLeft = this.mainX + 11;
		const iconRight = this.mainX + 53;
		const iconBig = this.mainX - 29;
		const shapeColumn1 = this.mainX;
		const shapeColumn2 = this.mainX + 43;
		const nameColumn1 = this.mainX + 39;
		const nameColumn2 = this.mainX + 45;
		const powerColumn0 = this.mainX + 42;
		const powerColumn1 = this.mainX + 23;
		const powerColumn2 = this.mainX + 63;
		const extraColumn1 = this.mainX + 39;
		const extraColumn2 = this.mainX + 45;

		const icon2_big = LoadUtils.getIcon(iconBig, 278, data.iconEssentialLoad2, 'essload2-icon', 36);
		const icon2_big_link = LoadUtils.getIconLink(config.entities.essential_load2_toggle, icon2_big);

		const icon2_if3 = LoadUtils.getIcon( iconLeft, 254, data.iconEssentialLoad2, 'essload2_small-icon');
		const icon2_if3_link = LoadUtils.getIconLink(config.entities.essential_load2_toggle, icon2_if3);

		const icon2 = LoadUtils.getIcon(iconRight, 81, data.iconEssentialLoad2, 'essload2_small-icon');
		const icon2_link = LoadUtils.getIconLink(config.entities.essential_load2_toggle, icon2);


		return svg`${data.additionalLoad >= 4 ?
			svg`
			${LoadUtils.generateLoad(
				'es', 2, icon2_link,
				data.dynamicColourEssentialLoad2, shapeColumn2, 107,
				config.load?.load2_name, nameColumn2, 136,
				data.stateEssentialLoad2, powerColumn2, 118,
				data.stateEssentialLoad2Extra, extraColumn2, 147,
				'left-align', config.load.auto_scale, data.decimalPlaces,
			)}`
			: svg`${data.additionalLoad === 3 ?
				svg`
			${LoadUtils.generateLoad(
					'es', 2, icon2_if3_link,
					data.dynamicColourEssentialLoad2, shapeColumn1, 280,
					config.load?.load2_name, nameColumn1, 310,
					data.stateEssentialLoad2, powerColumn1, 291,
					data.stateEssentialLoad2Extra, extraColumn1, 322,
					'right-align', config.load.auto_scale, data.decimalPlaces,
				)}`
				: svg`${data.additionalLoad === 2 ?
					svg`
						${icon2_big_link}
						
						<rect id="es-load2" x="${shapeColumn1}" y="280" width="82" height="30" rx="4.5" ry="4.5" fill="none"
									stroke="${data.dynamicColourEssentialLoad2}" pointer-events="all"
									display="${data.additionalLoad === 2 ? '' : 'none'}" />
						<text id="es-load2" x="${nameColumn2}" y="320.5" class="st3"
								display="${data.additionalLoad === 2 ? '' : 'none'}" fill="${data.dynamicColourEssentialLoad2}">
							${config.load?.load2_name ? `${config.load.load2_name}` : ''}
						</text>
						<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.essential_load2)}>
							<text id="ess_load2" x="${powerColumn0}" y="296.5"
										display="${data.additionalLoad === 2 && data.stateEssentialLoad2.isValid() ? '' : 'none'}"
										class="${data.largeFont !== true ? 'st14' : 'st4'} st8"
										fill="${data.dynamicColourEssentialLoad2}">
								${data.stateEssentialLoad2?.toPowerString(config.load.auto_scale, data.decimalPlaces)}
							</text>
						</a>
						<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.essential_load2_extra)}>
							<text id="ess_load2_extra" x="${extraColumn2}" y="272"
										display="${(config.entities?.essential_load2_extra && data.additionalLoad === 2) && data.stateEssentialLoad2Extra.isValid() ? '' : 'none'}"
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

	static generateLoad3(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const iconLeft = this.mainX + 11;
		const iconRight = this.mainX + 53;
		const shapeColumn1 = this.mainX;
		const shapeColumn2 = this.mainX + 43;
		const nameColumn1 = this.mainX + 39;
		const nameColumn2 = this.mainX + 45;
		const powerColumn1 = this.mainX + 23;
		const powerColumn2 = this.mainX + 63;
		const extraColumn1 = this.mainX + 39;
		const extraColumn2 = this.mainX + 45;

		const icon3_if3 = LoadUtils.getIcon(iconRight, 254, data.iconEssentialLoad3, 'essload3_small-icon');
		const icon3_if3_link = LoadUtils.getIconLink(config.entities.essential_load3_toggle, icon3_if3);

		const icon3 = LoadUtils.getIcon(iconLeft, 254, data.iconEssentialLoad3, 'essload3_small-icon');
		const icon3_link = LoadUtils.getIconLink(config.entities.essential_load3_toggle, icon3);

		return svg`${data.additionalLoad === 3 ?
			svg`
				${LoadUtils.generateLoad(
				'es', 3, icon3_if3_link,
				data.dynamicColourEssentialLoad3, shapeColumn2, 280,
				config.load?.load3_name, nameColumn2, 310,
				data.stateEssentialLoad3, powerColumn2, 291,
				data.stateEssentialLoad3Extra, extraColumn2, 322,
				'left-align', config.load.auto_scale, data.decimalPlaces,
			)}`
			: svg`${data.additionalLoad >= 4 ?
				svg`
				${LoadUtils.generateLoad(
					'es', 3, icon3_link,
					data.dynamicColourEssentialLoad3, shapeColumn1, 280,
					config.load?.load3_name, nameColumn1, 310,
					data.stateEssentialLoad3, powerColumn1, 291,
					data.stateEssentialLoad3Extra, extraColumn1, 322,
					'right-align', config.load.auto_scale, data.decimalPlaces,
				)}`
				: svg``
			}`
		}`;
	}

	static generateLoad4(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const iconRight = this.mainX + 53;
		const shapeColumn2 = this.mainX + 43;
		const nameColumn2 = this.mainX + 45;
		const powerColumn2 = this.mainX + 63;
		const extraColumn2 = this.mainX + 45;

		const icon4 = LoadUtils.getIcon(iconRight, 254, data.iconEssentialLoad4, 'essload4_small-icon');
		const icon4_link = LoadUtils.getIconLink(config.entities.essential_load4_toggle, icon4);

		return svg`${data.additionalLoad >= 4 ?
			svg`
			${LoadUtils.generateLoad(
				'es', 4, icon4_link,
				data.dynamicColourEssentialLoad4, shapeColumn2, 280,
				config.load?.load4_name, nameColumn2, 310,
				data.stateEssentialLoad4, powerColumn2, 291,
				data.stateEssentialLoad4Extra, extraColumn2, 322,
				'left-align', config.load.auto_scale, data.decimalPlaces,
			)}`
			: svg``
		}`;
	}

	static generateLoad5(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const iconLeft = this.mainX + 11;
		const shapeColumn1 = this.mainX;
		const nameColumn1 = this.mainX + 39;
		const powerColumn1 = this.mainX + 23;
		const extraColumn1 = this.mainX + 39;

		const icon5 = LoadUtils.getIcon(iconLeft, 335, data.iconEssentialLoad5, 'essload5_small-icon');
		const icon5_link = LoadUtils.getIconLink(config.entities.essential_load5_toggle, icon5);

		return svg`${data.additionalLoad >= 5 ?
			svg`
			${LoadUtils.generateLoad(
				'es', 5, icon5_link,
				data.dynamicColourEssentialLoad5, shapeColumn1, 362,
				config.load?.load5_name, nameColumn1, 390,
				data.stateEssentialLoad5, powerColumn1, 372,
				data.stateEssentialLoad5Extra, extraColumn1, 402,
				'right-align', config.load.auto_scale, data.decimalPlaces,
			)}`
			: svg``
		}`;
	}

	static generateLoad6(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const iconRight = this.mainX + 53;
		const shapeColumn2 = this.mainX + 43;
		const nameColumn2 = this.mainX + 45;
		const powerColumn2 = this.mainX + 63;
		const extraColumn2 = this.mainX + 45;

		const icon6 = LoadUtils.getIcon(iconRight, 335, data.iconEssentialLoad6, 'essload6_small-icon');
		const icon6_link = LoadUtils.getIconLink(config.entities.essential_load6_toggle, icon6);

		return svg`${data.additionalLoad >= 6 ?
			svg`
			${LoadUtils.generateLoad(
				'es', 6, icon6_link,
				data.dynamicColourEssentialLoad6, shapeColumn2, 362,
				config.load?.load6_name, nameColumn2, 390,
				data.stateEssentialLoad6, powerColumn2, 372,
				data.stateEssentialLoad6Extra, extraColumn2, 402,
				'left-align', config.load.auto_scale, data.decimalPlaces,
			)}`
			: svg``
		}`;
	}

	static generateLoad7(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const iconLeft = this.mainX + 11;
		const shapeColumn1 = this.mainX;
		const nameColumn1 = this.mainX + 39;
		const powerColumn1 = this.mainX + 23;
		const extraColumn1 = this.mainX + 39;

		const icon7 = LoadUtils.getIcon(iconLeft, 7, data.iconEssentialLoad7, 'essload7_small-icon');
		const icon7_link = LoadUtils.getIconLink(config.entities.essential_load7_toggle, icon7);

		return svg`${data.additionalLoad >= 7 ?
			svg`
			${LoadUtils.generateLoad(
				'es', 7, icon7_link,
				data.dynamicColourEssentialLoad7, shapeColumn1, 31,
				config.load?.load7_name, nameColumn1, 60,
				data.stateEssentialLoad7, powerColumn1, 42,
				data.stateEssentialLoad7Extra, extraColumn1, 72,
				'right-align', config.load.auto_scale, data.decimalPlaces,
			)}`
			: svg``
		}`;
	}

	static generateLoad8(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const iconRight = this.mainX + 53;
		const shapeColumn2 = this.mainX + 43;
		const nameColumn2 = this.mainX + 45;
		const powerColumn2 = this.mainX + 63;
		const extraColumn2 = this.mainX + 45;

		const icon8 = LoadUtils.getIcon(iconRight, 7, data.iconEssentialLoad8, 'essload8_small-icon');
		const icon8_link = LoadUtils.getIconLink(config.entities.essential_load8_toggle, icon8);

		return svg`${data.additionalLoad >= 8 ?
			svg`
			${LoadUtils.generateLoad(
				'es', 8, icon8_link,
				data.dynamicColourEssentialLoad8, shapeColumn2, 31,
				config.load?.load8_name, nameColumn2, 60,
				data.stateEssentialLoad8, powerColumn2, 42,
				data.stateEssentialLoad8Extra, extraColumn2, 72,
				'left-align', config.load.auto_scale, data.decimalPlaces,
			)}`
			: svg``
		}`;
	}



}