import { svg } from 'lit';
import { AdditionalLoadsViewMode, DataDto, PowerFlowCardConfig } from '../../types';
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
		//const line3 = `M ${lineX} 362 L ${lineX} 306`;
		//const line4 = `M ${lineX} 136 L ${lineX}  81`;

		if (config.load.additional_loads_view_mode === AdditionalLoadsViewMode.old) {
			return svg`
				<path id="es-load1" d="${line0}"
						class="${[1, 2, 3].includes(data.additionalLoads) ? '' : 'st12'}" fill="none"
						stroke="${data.loadColour}" stroke-width="1" stroke-miterlimit="10"
						pointer-events="stroke" />
				<path id="es-load1" d="${line1}"
						class="${data.additionalLoads == 4 ? '' : 'st12'}" fill="none"
						stroke="${data.loadColour}" stroke-width="1" stroke-miterlimit="10"
						pointer-events="stroke" />
				<path id="es-load2" d="${line2}"
						class="${data.additionalLoads >= 2 ? '' : 'st12'}" fill="none"
						stroke="${data.loadColour}" stroke-width="1" stroke-miterlimit="10"
						pointer-events="stroke" />
			`;
		}
		return svg``;
	}

	static generateLoad1(data: DataDto, config: PowerFlowCardConfig) {
		const isAux = config.load.show_aux || false;
		const iconBig = this.mainX + 5;
		const shapeColumn1 = this.mainX;
		const powerColumn0 = this.mainX + 42;
		const extraColumn2 = this.mainX + 45;

		if (data.additionalLoads > 4) {
			return svg`
			${LoadUtils.generateEssentialLoad(
				1, data.essentialLoadCol1Icon,
				data.essentialLoadCol1DynamicColour,
				EssentialLoad.loadNameCol1(config),
				data.essentialLoadCol1State,
				LoadUtils.extraMode2(config) ? data.essentialLoadCol1Extra2State : data.essentialLoadCol1ExtraState,
				data.essentialLoadCol1ToggleState,
				config.load.auto_scale, data.decimalPlaces,
				Load.column1, Load.row2,
			)}`;
		}
		const icon1_big = LoadUtils.getIconWithCondition(data.additionalLoads <= 3, iconBig, isAux ? 113 : 95, data.iconEssentialLoad1, 'ess_load1-icon', 36);
		const icon1_big_link = LoadUtils.getIconLink(data.stateEssentialLoad1Toggle.entity_id, icon1_big);
		return svg`${data.additionalLoads === 4 ?
			svg`
			${LoadUtils.generateEssentialLoadInternal(1, data.iconEssentialLoad1,
				data.dynamicColourEssentialLoad1,
				config.load?.load1_name,
				data.stateEssentialLoad1,
				data.stateEssentialLoad1Extra,
				data.stateEssentialLoad1Toggle,
				config.load.auto_scale, data.decimalPlaces,
				Load.column1, Load.row2,
			)}`
			:
			svg`${data.additionalLoads >= 1 ?
				svg`
					${icon1_big_link}
					
					<rect id="es-load1" x="${shapeColumn1}" y="${isAux ? '141' : '126'}" width="82" height="30" rx="4.5" ry="4.5" fill="none"
								stroke="${data.dynamicColourEssentialLoad1}" pointer-events="all"
								display="${data.additionalLoads <= 3 ? '' : 'none'}" />	
					<text id="es-load1" x="${isAux ? extraColumn2 : powerColumn0}" y="${isAux ? '133' : '118'}" class="st3  left-align"
							display="${data.additionalLoads <= 3 ? '' : 'none'}"
							fill="${data.dynamicColourEssentialLoad1}">
						${config.load?.load1_name ? `${config.load.load1_name}` : ''}
					</text>
					<a href="#" @click=${(e: Event) => Utils.handlePopup(e, data.stateEssentialLoad1.entity_id)}>
						<text id="ess_load1" x="${powerColumn0}" y="${isAux ? '158' : '143'}"
								display="${data.additionalLoads <= 3 && data.stateEssentialLoad1.isValid() ? '' : 'none'}"
								class="${data.largeFont !== true ? 'st14' : 'st4'} st8"
								fill="${data.dynamicColourEssentialLoad1}">
							${data.stateEssentialLoad1?.toPowerString(config.load.auto_scale, data.decimalPlaces)}
						</text>
					</a>				
					<a href="#" @click=${(e: Event) => Utils.handlePopup(e, data.stateEssentialLoad1Extra.entity_id)}>
						<text id="ess_load1_extra" x="${extraColumn2}" y="${isAux ? '182' : '167'}"
									display="${(data.stateEssentialLoad1Extra.entity_id && data.additionalLoads <= 3) && data.stateEssentialLoad1Extra.isValid() ? '' : 'none'}"
									class="st3 left-align" fill="${data.dynamicColourEssentialLoad1}">
							${data.stateEssentialLoad1Extra.toNum(1)}
							${data.stateEssentialLoad1Extra.getUOM()}
						</text>
					</a>`
				: svg``
			}`
		}`;
	}

	static generateLoad2(data: DataDto, config: PowerFlowCardConfig) {
		const iconBig = this.mainX + 5;
		const shapeColumn1 = this.mainX;
		const powerColumn0 = this.mainX + 42;
		const extraColumn2 = this.mainX + 45;

		if (data.additionalLoads > 4) {
			return svg`
			${LoadUtils.generateEssentialLoad(
				2, data.essentialLoadCol1Icon,
				data.essentialLoadCol1DynamicColour,
				EssentialLoad.loadNameCol1(config),
				data.essentialLoadCol1State,
				LoadUtils.extraMode2(config) ? data.essentialLoadCol1Extra2State : data.essentialLoadCol1ExtraState,
				data.essentialLoadCol1ToggleState,
				config.load.auto_scale, data.decimalPlaces,
				Load.column2, Load.row2,
			)}`;
		}
		const icon2_big = LoadUtils.getIcon(iconBig, 250, data.iconEssentialLoad2, 'ess_load2-icon', 36);
		const icon2_big_link = LoadUtils.getIconLink(data.stateEssentialLoad2Toggle.entity_id, icon2_big);

		return svg`${[3, 4].includes(data.additionalLoads) ?
			svg`
			${LoadUtils.generateEssentialLoadInternal(2, data.iconEssentialLoad2,
				data.dynamicColourEssentialLoad2,
				config.load?.load2_name,
				data.stateEssentialLoad2,
				data.stateEssentialLoad2Extra,
				data.stateEssentialLoad2Toggle,
				config.load.auto_scale, data.decimalPlaces,
				data.additionalLoads === 4 ? Load.column2 : Load.column1,
				data.additionalLoads === 4 ? Load.row2 : Load.row4,
			)}`
			: svg`${data.additionalLoads === 2 ?
				svg`
					${icon2_big_link}
					
					<rect id="es-load2" x="${shapeColumn1}" y="286" width="82" height="30" rx="4.5" ry="4.5" fill="none"
								stroke="${data.dynamicColourEssentialLoad2}" pointer-events="all" />
					<text id="es-load2" x="${powerColumn0}" y="326.5" class="st3"
							fill="${data.dynamicColourEssentialLoad2}">
						${config.load?.load2_name ? `${config.load.load2_name}` : ''}
					</text>
					<a href="#" @click=${(e: Event) => Utils.handlePopup(e, data.stateEssentialLoad2.entity_id)}>
						<text id="ess_load2" x="${powerColumn0}" y="302.5"
									display="${data.stateEssentialLoad2.isValid() ? '' : 'none'}"
									class="${data.largeFont !== true ? 'st14' : 'st4'} st8"
									fill="${data.dynamicColourEssentialLoad2}">
							${data.stateEssentialLoad2?.toPowerString(config.load.auto_scale, data.decimalPlaces)}
						</text>
					</a>
					<a href="#" @click=${(e: Event) => Utils.handlePopup(e, data.stateEssentialLoad2Extra.entity_id)}>
						<text id="ess_load2_extra" x="${extraColumn2}" y="278"
									display="${data.stateEssentialLoad2Extra.isValid() ? '' : 'none'}"
									class="st3 left-align" fill="${data.dynamicColourEssentialLoad2}">
							${data.stateEssentialLoad2Extra.toNum(1)}
							${data.stateEssentialLoad2Extra.getUOM()}
						</text>
					</a>`
				: svg``
			}`
		}`;
	}

	static generateLoad3(data: DataDto, config: PowerFlowCardConfig) {

		if (data.additionalLoads > 4) {
			return svg`
			${LoadUtils.generateEssentialLoad(
				3, data.essentialLoadCol1Icon,
				data.essentialLoadCol1DynamicColour,
				EssentialLoad.loadNameCol1(config),
				data.essentialLoadCol1State,
				LoadUtils.extraMode2(config) ? data.essentialLoadCol1ExtraState : data.essentialLoadCol1ExtraState,
				data.essentialLoadCol1ToggleState,
				config.load.auto_scale, data.decimalPlaces,
				Load.column1, Load.row4,
			)}`;
		}

		return svg`
		${LoadUtils.generateEssentialLoadInternal(3, data.iconEssentialLoad3,
			data.dynamicColourEssentialLoad3,
			config.load?.load3_name,
			data.stateEssentialLoad3,
			data.stateEssentialLoad3Extra,
			data.stateEssentialLoad3Toggle,
			config.load.auto_scale, data.decimalPlaces,
			data.additionalLoads === 3 ? Load.column2 : Load.column1, Load.row4,
		)}`;
	}

	static isColumnDisplayable(config: PowerFlowCardConfig, id: number) {
		switch (id) {
			case 1:
			case 2:
				return [AdditionalLoadsViewMode.col6, AdditionalLoadsViewMode.col5, AdditionalLoadsViewMode.col4, AdditionalLoadsViewMode.col3, AdditionalLoadsViewMode.col2].includes(config.load.additional_loads_view_mode);
			case 3:
				return [AdditionalLoadsViewMode.col6, AdditionalLoadsViewMode.col5, AdditionalLoadsViewMode.col4, AdditionalLoadsViewMode.col3].includes(config.load.additional_loads_view_mode);
			case 4:
				return [AdditionalLoadsViewMode.col6, AdditionalLoadsViewMode.col5, AdditionalLoadsViewMode.col4].includes(config.load.additional_loads_view_mode);
			case 5:
				return [AdditionalLoadsViewMode.col6, AdditionalLoadsViewMode.col5].includes(config.load.additional_loads_view_mode);
			case 6:
				return [AdditionalLoadsViewMode.col6].includes(config.load.additional_loads_view_mode);
			default:
				return false;
		}
	}


	static generateLoad4(data: DataDto, config: PowerFlowCardConfig) {

		if (data.additionalLoads > 4) {
			return svg`
			${LoadUtils.generateEssentialLoad(
				4, data.essentialLoadCol1Icon,
				data.essentialLoadCol1DynamicColour,
				EssentialLoad.loadNameCol1(config),
				data.essentialLoadCol1State,
				LoadUtils.extraMode2(config) ? data.essentialLoadCol1Extra2State : data.essentialLoadCol1ExtraState,
				data.essentialLoadCol1ToggleState,
				config.load.auto_scale, data.decimalPlaces,
				Load.column2, Load.row4,
			)}`;
		}

		return svg`${data.additionalLoads == 4 ?
			svg`
				${LoadUtils.generateEssentialLoadInternal(4, data.iconEssentialLoad4,
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

	private static loadNameCol1(config: PowerFlowCardConfig) {
		return [
			config.load?.load_1_1_name,
			config.load?.load_1_2_name,
			config.load?.load_1_3_name,
			config.load?.load_1_4_name,
			config.load?.load_1_5_name,
			config.load?.load_1_6_name,
		];
	}

	private static loadNameCol2(config: PowerFlowCardConfig) {
		return [
			config.load?.load_2_1_name,
			config.load?.load_2_2_name,
			config.load?.load_2_3_name,
			config.load?.load_2_4_name,
			config.load?.load_2_5_name,
			config.load?.load_2_6_name,
		];
	}

	private static loadNameCol3(config: PowerFlowCardConfig) {
		return [
			config.load?.load_3_1_name,
			config.load?.load_3_2_name,
			config.load?.load_3_3_name,
			config.load?.load_3_4_name,
			config.load?.load_3_5_name,
			config.load?.load_3_6_name,
		];
	}

	private static loadNameCol4(config: PowerFlowCardConfig) {
		return [
			config.load?.load_4_1_name,
			config.load?.load_4_2_name,
			config.load?.load_4_3_name,
			config.load?.load_4_4_name,
			config.load?.load_4_5_name,
			config.load?.load_4_6_name,
		];
	}

	private static loadNameCol5(config: PowerFlowCardConfig) {
		return [
			config.load?.load_5_1_name,
			config.load?.load_5_2_name,
			config.load?.load_5_3_name,
			config.load?.load_5_4_name,
			config.load?.load_5_5_name,
			config.load?.load_5_6_name,
		];
	}

	private static loadNameCol6(config: PowerFlowCardConfig) {
		return [
			config.load?.load_6_1_name,
			config.load?.load_6_2_name,
			config.load?.load_6_3_name,
			config.load?.load_6_4_name,
			config.load?.load_6_5_name,
			config.load?.load_6_6_name,
		];
	}

	private static row(id: number) {
		switch (id) {
			case 2:
				return Load.row2;
			case 3:
				return Load.row3;
			case 4:
				return Load.row4;
			case 5:
				return Load.row5;
			case 6:
				return Load.row6;
			default:
				return Load.row1;
		}
	}

	static generateLoadCol1(data: DataDto, config: PowerFlowCardConfig, id: number) {
		if (id == 1 && config.load.show_aux && (config.load.aux_loads >= 1 || config.load.show_daily_aux))
			return svg``;
		return svg`
		${LoadUtils.generateEssentialLoad(
			id, data.essentialLoadCol1Icon,
			data.essentialLoadCol1DynamicColour,
			EssentialLoad.loadNameCol1(config),
			data.essentialLoadCol1State,
			LoadUtils.extraMode2(config) ? data.essentialLoadCol1Extra2State : data.essentialLoadCol1ExtraState,
			data.essentialLoadCol1ToggleState,
			config.load.auto_scale, data.decimalPlaces,
			Load.column1, EssentialLoad.row(id),
		)}`;
	}

	static generateLoadCol2(data: DataDto, config: PowerFlowCardConfig, id: number) {
		if (id == 1 && config.load.show_aux && (config.load.aux_loads >= 2 || config.load.show_daily_aux))
			return svg``;
		return svg`
		${LoadUtils.generateEssentialLoad(
			id, data.essentialLoadCol2Icon,
			data.essentialLoadCol2DynamicColour,
			EssentialLoad.loadNameCol2(config),
			data.essentialLoadCol2State,
			LoadUtils.extraMode2(config) ? data.essentialLoadCol2Extra2State : data.essentialLoadCol2ExtraState,
			data.essentialLoadCol2ToggleState,
			config.load.auto_scale, data.decimalPlaces,
			Load.column2, EssentialLoad.row(id),
		)}`;
	}

	static generateLoadCol3(data: DataDto, config: PowerFlowCardConfig, id: number) {
		if (id == 1 && config.load.show_aux && config.load.aux_loads >= 3)
			return svg``;
		return svg`
		${LoadUtils.generateEssentialLoad(
			id, data.essentialLoadCol3Icon,
			data.essentialLoadCol3DynamicColour,
			EssentialLoad.loadNameCol3(config),
			data.essentialLoadCol3State,
			LoadUtils.extraMode2(config) ? data.essentialLoadCol3Extra2State : data.essentialLoadCol3ExtraState,
			data.essentialLoadCol3ToggleState,
			config.load.auto_scale, data.decimalPlaces,
			Load.column3, EssentialLoad.row(id),
		)}`;
	}

	static generateLoadCol4(data: DataDto, config: PowerFlowCardConfig, id: number) {
		if (id == 1 && config.load.show_aux && config.load.aux_loads >= 4)
			return svg``;
		return svg`
		${LoadUtils.generateEssentialLoad(
			id, data.essentialLoadCol4Icon,
			data.essentialLoadCol4DynamicColour,
			EssentialLoad.loadNameCol4(config),
			data.essentialLoadCol4State,
			LoadUtils.extraMode2(config) ? data.essentialLoadCol4Extra2State : data.essentialLoadCol4ExtraState,
			data.essentialLoadCol4ToggleState,
			config.load.auto_scale, data.decimalPlaces,
			Load.column4, EssentialLoad.row(id),
		)}`;
	}

	static generateLoadCol5(data: DataDto, config: PowerFlowCardConfig, id: number) {
		if (id == 1 && config.load.show_aux && config.load.aux_loads >= 5)
			return svg``;
		return svg`
		${LoadUtils.generateEssentialLoad(
			id, data.essentialLoadCol5Icon,
			data.essentialLoadCol5DynamicColour,
			EssentialLoad.loadNameCol5(config),
			data.essentialLoadCol5State,
			LoadUtils.extraMode2(config) ? data.essentialLoadCol5Extra2State : data.essentialLoadCol5ExtraState,
			data.essentialLoadCol5ToggleState,
			config.load.auto_scale, data.decimalPlaces,
			Load.column5, EssentialLoad.row(id),
		)}`;
	}

	static generateLoadCol6(data: DataDto, config: PowerFlowCardConfig, id: number) {
		if (id == 1 && config.load.show_aux && config.load.aux_loads >= 6)
			return svg``;
		return svg`
		${LoadUtils.generateEssentialLoad(
			id, data.essentialLoadCol6Icon,
			data.essentialLoadCol6DynamicColour,
			EssentialLoad.loadNameCol6(config),
			data.essentialLoadCol6State,
			LoadUtils.extraMode2(config) ? data.essentialLoadCol6Extra2State : data.essentialLoadCol6ExtraState,
			data.essentialLoadCol6ToggleState,
			config.load.auto_scale, data.decimalPlaces,
			Load.column6, EssentialLoad.row(id),
		)}`;
	}
}