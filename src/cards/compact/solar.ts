import { DataDto, PowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { localize } from '../../localize/localize';
import { icons } from '../../helpers/icons';
import { Utils } from '../../helpers/utils';
import { UnitOfElectricalCurrent, UnitOfElectricPotential, UnitOfPower } from '../../const';
import { CustomEntity } from '../../inverters/dto/custom-entity';

export class Solar {

	private static _solarColour: string = 'orange';
	private static _decimalPlacesEnergy: number = 2;
	private static _decimalPlaces: number = 2;

	static set decimalPlacesEnergy(value: number) {
		this._decimalPlacesEnergy = value;
	}

	static set solarColour(value: string) {
		this._solarColour = value;
	}

	static get solarColour(): string {
		return this._solarColour;
	}

	static get decimalPlacesEnergy(): number {
		return this._decimalPlacesEnergy;
	}

	static get decimalPlaces(): number {
		return this._decimalPlaces;
	}

	static set decimalPlaces(value: number) {
		this._decimalPlaces = value;
	}

	static generateSolarPower(data: DataDto, config: PowerFlowCardConfig) {
		const circle = this.getCircle(data.totalPV > 0 && config.low_resources.animations, 'so', data.solarLineWidth, data.minLineWidth, data.durationCur['solar'], config.solar.invert_flow);
		const path = (config.show_solar && config.solar.mppts > 1) ? svg`
			<svg id="solar-flow" style="overflow: visible">
				<path id="so-line" d="M 239 147 L 239 190"
					  fill="none" stroke="${data.solarColour}" stroke-width="${data.solarLineWidth}"
					  stroke-miterlimit="10"
					  pointer-events="stroke"/>
				${circle}
			</svg>` : svg``;

		const totalPVEfficiency = data.pvEfficiencyPerc[0];
		const efficiency = config.solar.show_mppt_efficiency ? svg`
			<text x="233" y="156" class="st3 st8 right-align"
				  fill="${data.solarColour}">${totalPVEfficiency}%
			</text>` : svg``;
		const efficiencyKwhp = config.solar.show_mppt_efficiency_kwhp ? svg`
			<text x="233" y="${config.solar.show_mppt_efficiency ? 168 : 156}" class="st3 st8 right-align"
				  fill="${data.solarColour}">${data.pvEfficiencyKwhp[0]} <tspan font-size="0.8em" baseline-shift="super" dx="-2" dy="1">Wh</tspan><tspan font-size="0.8em" baseline-shift="sub" dx="-6" dy="-2">Wp</tspan>
			</text>` : svg``;

		const power = config.solar.auto_scale
			? data.statePVTotal.isValid() ? Utils.convertValueNew(data.totalPV, data.statePVTotal.getUOM(), data.decimalPlaces) : Utils.convertValue(data.totalPV, data.decimalPlaces) || 0
			: `${Utils.toNum(data.totalPV || 0, 0)} ${UnitOfPower.WATT}`;

		let totalPower = svg`
			<text id="pvtotal_power" x="238.8" y="132.5" class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
				  fill="${data.solarColour}">
				${power}
			</text>`;

		if (data.statePVTotal.isValid()) {
			totalPower = svg`
			<a href="#" @click=${(e: Event) => Utils.handlePopup(e, config.entities.pv_total)}>
				${totalPower}
			</a>`;
		}
		return config.solar.mppts > 1 ? svg`
			<svg id="pv-total" 
					x="205" y="116.5" width="70" height="30"
		 			viewBox="0 0 70 30" style="overflow: visible">
				<defs>
					<linearGradient id="SlG-${data.timestamp_id}" x1="0%" x2="0%" y1="100%" y2="0%">
						<stop offset="0%"
							stop-color="${totalPVEfficiency === 0 ? 'grey' : data.solarColour}"/>
						<stop offset="${totalPVEfficiency}%"
							stop-color="${totalPVEfficiency === 0 ? 'grey' : data.solarColour}"/>
						<stop offset="${totalPVEfficiency}%"
							stop-color="${totalPVEfficiency < 100 ? 'grey' : data.solarColour}"/>
						<stop offset="100%"
							stop-color="${totalPVEfficiency < 100 ? 'grey' : data.solarColour}"/>
					</linearGradient>
			    </defs>
			    <rect width="70" height="30" rx="4.5" ry="4.5" fill="none"
			        stroke="${config.solar.visualize_efficiency ? `url(#SlG-${data.timestamp_id})` : data.solarColour}" pointer-events="all"
			    />
			</svg>
			${path}
			${efficiency}
			${efficiencyKwhp}
			${totalPower}
		` : svg``;
	}

	static generateSolarHeader(data: DataDto, config: PowerFlowCardConfig) {

		let daily = svg``, monthly = svg``, yearly = svg``, total = svg``, remaining = svg``, tomorrow = svg``;

		const no: number = this.countGenerationElements(data);
		if (no == 0) {
			return svg``;
		}
		const startPosition = this.setStartPosition(no);

		if (data.stateTomorrowSolar.isValid()) {
			tomorrow = this.getProduction('tomorrow_solar_name', data.stateTomorrowSolar, startPosition, config);
		}

		if (data.stateRemainingSolar.isValid()) {
			remaining = this.getProduction('remaining_solar_name', data.stateRemainingSolar, startPosition, config);
		}

		if (data.stateTotalSolarGeneration.isValid()) {
			total = this.getProduction('total_solar_generation_name', data.stateTotalSolarGeneration, startPosition, config);
		}

		if (data.stateYearlyPVEnergy.isValid()) {
			yearly = this.getProduction('yearly_solar_name', data.stateYearlyPVEnergy, startPosition, config);
		}

		if (data.stateMonthlyPVEnergy.isValid()) {
			monthly = this.getProduction('monthly_solar_name', data.stateMonthlyPVEnergy, startPosition, config);
		}

		if (data.stateDailyPVEnergy.isValid()) {
			daily = this.getProduction('daily_solar_name', data.stateDailyPVEnergy, startPosition, config);
		}

		startPosition.x -= 2 + startPosition.gap / 2;
		const icon_svg = svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="sun" x="${startPosition.x}" y="10" width="40" height="40" viewBox="0 0 24 24" style="overflow: visible">
				<path fill="${data.solarColour}" d="${icons.sun}"/>
			</svg>`;

		const icon = config.solar?.navigate ?
			svg`<a href="#" @click=${(e: Event) => Utils.handleNavigation(e, config.solar.navigate)}>
					${icon_svg}
				</a>`
			: icon_svg;

		const envTemp = svg`
				<a href="#" @click=${(e: Event) => Utils.handlePopup(e, config.entities.environment_temp)}>
					<text id="environ_temp" x="${startPosition.x}"" y="45"
						  class="${config.entities?.environment_temp ? 'st3 left-align' : 'st12'}"
						  fill="${data.solarColour}"
						  display="${data.stateEnvironmentTemp.isValid() ? '' : 'none'}">
						${data.stateEnvironmentTemp.toNum(1)}${data.stateEnvironmentTemp.getUOM()}
					</text>
				</a>`;

		return svg`
                ${icon}
                ${envTemp}
                ${daily}
                ${monthly}
                ${yearly}
                ${total}
                ${remaining}
                ${tomorrow}
		`;
	}

	private static setStartPosition(no: number) {
		switch (no) {
			case 1:
				return { x: 400 - 140, gap: 0 };
			case 2:
				return { x: 400 - 70, gap: 0 };
			default:
				return { x: 400, gap: 0 };
		}
	}

	private static countGenerationElements(data: DataDto) {
		let i = 0;

		if (data.stateTomorrowSolar.isValid()) {
			i++;
		}
		if (data.stateRemainingSolar.isValid()) {
			i++;
		}
		if (data.stateTotalSolarGeneration.isValid()) {
			i++;
		}

		if (data.stateYearlyPVEnergy.isValid()) {
			i++;
		}

		if (data.stateMonthlyPVEnergy.isValid()) {
			i++;
		}

		if (data.stateDailyPVEnergy.isValid()) {
			i++;
		}
		return i++;
	}

	private static getProduction(
		fieldId: string,
		entity: CustomEntity,
		startPosition: { x: number; gap: number },
		config: PowerFlowCardConfig) {
		const showUnits = config.solar?.hide_header_units === undefined ? true : !config.solar.hide_header_units;
		const startX = startPosition.x;
		const power = entity?.toPowerString(true, this.decimalPlacesEnergy, false, showUnits) || '0';
		const name = config.solar[fieldId] ? config.solar[fieldId] : localize('common.' + fieldId);

		const powerWidth = this.getTextWidth(power, '16px Roboto');
		const nameWidth = this.getTextWidth(name, '9px Roboto');

		startPosition.gap = Math.max(nameWidth, powerWidth);
		startPosition.x -= (startPosition.gap + 8);

		return svg`
            <a href="#" @click=${(e: Event) => Utils.handlePopup(e, entity.entity_id)}>
				<text id="${fieldId}_value" x="${startX - startPosition.gap / 2}" y="26" class="st10" fill="${this.solarColour}">
					${power}
				</text>
			</a>
            <text id="${fieldId}" x="${startX - startPosition.gap / 2}" y="40" class="st3" fill="${this.solarColour}">
                ${name}
            </text>`;
	}

	private static getTextWidth(text: string, font: string): number {
		// Create a temporary canvas element
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		let metrics = 0;
		if (context !== null) {
			// Set the font for the context
			context.font = font;

			// Measure the text width
			metrics = Math.round(context.measureText(text)?.width);
		}
		// Return the computed width
		return metrics;
	}

	private static getPositions(mppt: number, max: number) {
		const right = 'right-align';
		const left = 'left-align';
		//X [frame|name, path, %|kWh, V|A, power, kwhp, kwhp_allign]
		switch (mppt) {
			case 1:
				switch (max) {
					case 1:
						return [205, 'M 239 84 L 239 190', 231, 248, 240, 231, right];
					case 2:
						return [158, 'M 193 84 L 193 122 Q 193 132 201 132 L 205 132', 189, 197, 193, 189, right];
					case 3:
					case 4:
						return [82, 'M 117 84 L 117 125 Q 117 132 124 132 L 205 132', 113, 122, 117, 113, right];
					case 5:
						return [4, 'M  39 84 L  39 125 Q  39 132  46 132 L 205 132', 35, 44, 39, 35, right];
				}
				break;
			case 2:
				switch (max) {
					case 2:
						return [254, 'M 289 84 L 289 125 Q 289 132 282 132 L 275 132', 285, 294, 289, 294, left];
					case 3:
					case 4:
						return [158, 'M 193 84 L 193 122 Q 193 132 201 132 L 205 132', 189, 198, 193, 189, right];
					case 5:
						return [82, 'M 117 84 L 117 125 Q 117 132 124 132 L 205 132', 113, 122, 117, 113, right];
				}
				break;
			case 3:
				switch (max) {
					case 3:
					case 4:
						return [254, 'M 289 84 L 289 125 Q 289 132 282 132 L 275 132', 285, 294, 289, 294, left];
					case 5:
						return [158, 'M 193 84 L 193 122 Q 193 132 201 132 L 205 132', 189, 198, 193, 189, right];

				}
				break;
			case 4:
				switch (max) {
					case 4:
						return [330, 'M 365 84 L 365 125 Q 365 132 358 132 L 275 132', 361, 370, 365, 370, left];
					case 5:
						return [254, 'M 289 84 L 289 125 Q 289 132 282 132 L 275 132', 285, 294, 289, 294, left];
				}
				break;
			case 5:
				return [330, 'M 365 84 L 365 125 Q 365 132 358 132 L 275 132', 361, 370, 365, 370, left];
		}
		return [];

	}

	private static pvLineMap: Record<string, string> = {
		so: '#so-line',
		pv1: '#pv1-line',
		pv2: '#pv2-line',
		pv3: '#pv3-line',
		pv4: '#pv4-line',
		pv5: '#pv5-line',
	};

	static generateMppt1(data: DataDto, config: PowerFlowCardConfig) {
		const X = this.getPositions(1, config.solar.mppts);

		return svg`${config.show_solar ?
			svg`
                ${this.generateFrame(X[0] as number, 'pv1', data.pvEfficiencyPerc[1], config.solar.visualize_efficiency, data.timestamp_id)}
                ${this.generateFlowLine(X[1] as string, 'pv1', data.statePvPower[1], data.durationCur['pv1'], data.pv1LineWidth, data.minLineWidth, config.solar.invert_flow, config.low_resources.animations)}
                ${this.generateName(X[0] as number, config.solar.pv1_name)}
                ${this.generateEfficiencyPerc(X[2] as number, data.pvEfficiencyPerc[1], config.solar.show_mppt_efficiency)}
                ${this.generateEfficiencyKwhp(X[2] as number, X[5] as number, X[6] as string, data.pvEfficiencyKwhp[1], config.solar.show_mppt_efficiency, config.solar.show_mppt_efficiency_kwhp)}
                ${this.generateEnergy(X[2] as number, data.statePvEnergy[1], config.solar.show_mppt_production)}
                ${this.generateVoltage(X[3] as number, data.statePvVoltage[1])}
                ${this.generateAmperage(X[3] as number, data.statePvCurrent[1])}
                ${this.generatePower(X[4] as number, data.statePvPower[1], config.solar.auto_scale, data.largeFont)}
            `
			: svg``
		}`;

	}


	static generateMppt2(data: DataDto, config: PowerFlowCardConfig) {
		const X = this.getPositions(2, config.solar.mppts);
		return svg`${(config.show_solar && config.solar.mppts >= 2) ?
			svg`
                ${this.generateFrame(X[0] as number, 'PV2', data.pvEfficiencyPerc[2], config.solar.visualize_efficiency, data.timestamp_id)}
                ${this.generateFlowLine(X[1] as string, 'pv2', data.statePvPower[2], data.durationCur['pv2'], data.pv2LineWidth, data.minLineWidth, config.solar.invert_flow, config.low_resources.animations)}
                ${this.generateName(X[0] as number, config.solar.pv2_name)}
                ${this.generateEfficiencyPerc(X[2] as number, data.pvEfficiencyPerc[2], config.solar.show_mppt_efficiency)}
                ${this.generateEfficiencyKwhp(X[2] as number, X[5] as number, X[6] as string, data.pvEfficiencyKwhp[2], config.solar.show_mppt_efficiency, config.solar.show_mppt_efficiency_kwhp)}
                ${this.generateEnergy(X[2] as number, data.statePvEnergy[2], config.solar.show_mppt_production)}
                ${this.generateVoltage(X[3] as number, data.statePvVoltage[2])}
                ${this.generateAmperage(X[3] as number, data.statePvCurrent[2])}
	            ${this.generatePower(X[4] as number, data.statePvPower[2], config.solar.auto_scale, data.largeFont)}
            `
			: svg``
		}`;
	}


	static generateMppt3(data: DataDto, config: PowerFlowCardConfig) {
		const X = this.getPositions(3, config.solar.mppts);
		return svg`${(config.show_solar && config.solar.mppts >= 3) ?
			svg`
                ${this.generateFrame(X[0] as number, 'PV3', data.pvEfficiencyPerc[3], config.solar.visualize_efficiency, data.timestamp_id)}
                ${this.generateFlowLine(X[1] as string, 'pv3', data.statePvPower[3], data.durationCur['pv3'], data.pv3LineWidth, data.minLineWidth, config.solar.invert_flow, config.low_resources.animations)}
                ${this.generateName(X[0] as number, config.solar.pv3_name)}			
                ${this.generateEfficiencyPerc(X[2] as number, data.pvEfficiencyPerc[3], config.solar.show_mppt_efficiency)}
                ${this.generateEfficiencyKwhp(X[2] as number, X[5] as number, X[6] as string, data.pvEfficiencyKwhp[3], config.solar.show_mppt_efficiency, config.solar.show_mppt_efficiency_kwhp)}
                ${this.generateEnergy(X[2] as number, data.statePvEnergy[3], config.solar.show_mppt_production)}
                ${this.generateVoltage(X[3] as number, data.statePvVoltage[3])}
                ${this.generateAmperage(X[3] as number, data.statePvCurrent[3])}
	            ${this.generatePower(X[4] as number, data.statePvPower[3], config.solar.auto_scale, data.largeFont)}
            `
			: svg``
		}`;
	}

	static generateMppt4(data: DataDto, config: PowerFlowCardConfig) {
		const X = this.getPositions(4, config.solar.mppts);
		return svg`${(config.show_solar && config.solar.mppts >= 4) ?
			svg`
                ${this.generateFrame(X[0] as number, 'PV4', data.pvEfficiencyPerc[4], config.solar.visualize_efficiency, data.timestamp_id)}
                ${this.generateFlowLine(X[1] as string, 'pv4', data.statePvPower[4], data.durationCur['pv4'], data.pv4LineWidth, data.minLineWidth, config.solar.invert_flow, config.low_resources.animations)}
                ${this.generateName(X[0] as number, config.solar.pv4_name)}
                ${this.generateEfficiencyPerc(X[2] as number, data.pvEfficiencyPerc[4], config.solar.show_mppt_efficiency)}
                ${this.generateEfficiencyKwhp(X[2] as number, X[5] as number, X[6] as string, data.pvEfficiencyKwhp[4], config.solar.show_mppt_efficiency, config.solar.show_mppt_efficiency_kwhp)}
                ${this.generateEnergy(X[2] as number, data.statePvEnergy[4], config.solar.show_mppt_production)}
                ${this.generateVoltage(X[3] as number, data.statePvVoltage[4])}
                ${this.generateAmperage(X[3] as number, data.statePvCurrent[4])}
                ${this.generatePower(X[4] as number, data.statePvPower[4], config.solar.auto_scale, data.largeFont)}
            `
			: svg``
		}`;
	}

	static generateMppt5(data: DataDto, config: PowerFlowCardConfig) {
		const X = this.getPositions(5, config.solar.mppts);
		return svg`${(config.show_solar && config.solar.mppts >= 5) ?
			svg`
                ${this.generateFrame(X[0] as number, 'PV5', data.pvEfficiencyPerc[5], config.solar.visualize_efficiency, data.timestamp_id)}
                ${this.generateFlowLine(X[1] as string, 'pv5', data.statePvPower[5], data.durationCur['pv5'], data.pv5LineWidth, data.minLineWidth, config.solar.invert_flow, config.low_resources.animations)}
                ${this.generateName(X[0] as number, config.solar.pv5_name)}
                ${this.generateEfficiencyPerc(X[2] as number, data.pvEfficiencyPerc[5], config.solar.show_mppt_efficiency)}
                ${this.generateEfficiencyKwhp(X[2] as number, X[5] as number, X[6] as string, data.pvEfficiencyKwhp[5], config.solar.show_mppt_efficiency, config.solar.show_mppt_efficiency_kwhp)}
                ${this.generateEnergy(X[2] as number, data.statePvEnergy[5], config.solar.show_mppt_production)}
                ${this.generateVoltage(X[3] as number, data.statePvVoltage[5])}
                ${this.generateAmperage(X[3] as number, data.statePvCurrent[5])}
                ${this.generatePower(X[4] as number, data.statePvPower[5], config.solar.auto_scale, data.largeFont)}
			      `
			: svg``
		}`;
	}

	private static generatePower(X: number, entity: CustomEntity, autoScale: boolean, largeFont: boolean) {
		return svg`
            <a href="#" @click=${(e: Event) => Utils.handlePopup(e, entity.entity_id)}>
                <text x="${X}" y="72" class="${!largeFont ? 'st14' : 'st4'} st8" 
                    display="${entity.isValid() ? '' : 'none'}" 
                    fill="${this.solarColour}">
                    ${autoScale ? Utils.convertValue(entity, this.decimalPlaces) || 0 : entity.toNum(0) + ' ' + UnitOfPower.WATT}
                </text>
	      	</a>`;
	}

	private static generateFrame(
		X: number,
		id: string,
		efficiency: number,
		efficiencyMode: boolean,
		timestampId: number,
	) {
		return svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="${id}" x="${X}" y="54.5" width="70" height="30"
				viewBox="0 0 70 30" style="overflow: visible">
				<defs>
					<linearGradient id="${id}LG-${timestampId}" x1="0%" x2="0%" y1="100%" y2="0%">
						<stop offset="0%" stop-color="${efficiency === 0 ? 'grey' : this.solarColour}"/>
						<stop offset="${efficiency}%" stop-color="${efficiency === 0 ? 'grey' : this.solarColour}"/>
						<stop offset="${efficiency}%" stop-color="${efficiency < 100 ? 'grey' : this.solarColour}"/>
						<stop offset="100%" stop-color="${efficiency < 100 ? 'grey' : this.solarColour}"/>
					</linearGradient>
				</defs>
				<rect id="rect_${id}" width="70" height="30" rx="4.5" ry="4.5" fill="none"
					stroke="${efficiencyMode ? ('url(#' + id + 'LG-' + timestampId + ')') : this.solarColour}" pointer-events="all"
				/>
			</svg>`;
	}

	private static generateFlowLine(
		X: string,
		id: string,
		entity: CustomEntity,
		duration: number,
		lineWidth: number,
		minLineWidth: number,
		invertFlow: boolean,
		animations: boolean,
	) {
		const power = entity.toPower();
		const circle = this.getCircle(Math.round(power) > 0 && animations, id, lineWidth, minLineWidth, duration, invertFlow);

		return svg`
			<svg id="${id}-flow" style="overflow: visible">
				<path id="${id}-line" d="${X}"
					  fill="none" stroke="${this.solarColour}" stroke-width="${lineWidth}"
					  stroke-miterlimit="10"
					  pointer-events="stroke"/>
				${circle}
			</svg>`;
	}

	private static getCircle(condition: boolean, id: string, lineWidth: number, minLineWidth: number, duration: number, invertFlow: boolean) {
		return condition ? svg`
				<circle id="${id}-dot" cx="0" cy="0"
						r="${Math.min(2 + lineWidth + Math.max(minLineWidth - 2, 0), 8)}"
						fill="${this.solarColour}">
					<animateMotion dur="${duration}s" repeatCount="indefinite"
								   keyPoints=${invertFlow ? Utils.invertKeyPoints('0;1') : '0;1'}
								   keyTimes="0;1" 
								   calcMode="linear">
						<mpath href='${this.pvLineMap[id]}'/>
					</animateMotion>
				</circle>` : svg``;
	}

	private static generateName(X: number, name: string) {
		return svg`
			<text x="${(X + 3)}" y="59.5" class="st15 left-align" fill="${this._solarColour}">
				${name}
			</text>`;
	}

	private static generateEfficiencyPerc(X: number, efficiency: number, isVisible: boolean) {
		if (isVisible && !Number.isNaN(efficiency)) {
			return svg`
            <text x="${X}" y="94" class="st3 st8 right-align"
                fill="${this.solarColour}">
                ${efficiency}%
            </text>`;
		}
		return svg``;
	}

	private static generateEfficiencyKwhp(X: number, X2: number, align: string, efficiency: number, isVisiblePerc: boolean, isVisibleKWhp: boolean) {
		if (isVisibleKWhp && !Number.isNaN(efficiency)) {
			let posX = X, posY = 94, alignment = 'right-align';
			if (isVisiblePerc) {
				posX = X2;
				alignment = align;
				posY = 118;
			}
			return svg`
            <text x="${posX}" y="${posY}" class="st3 st8 ${alignment}"
                fill="${this.solarColour}">
                ${efficiency} <tspan font-size="0.8em" baseline-shift="super" dx="-2" dy="1">Wh</tspan><tspan font-size="0.8em" baseline-shift="sub" dx="-6" dy="-2">Wp</tspan>
            </text>`;
		}
		return svg``;
	}

	private static generateEnergy(X: number, energyEntity: CustomEntity, showProduction: boolean) {
		return svg`
            <a href="#" @click=${(e: Event) => Utils.handlePopup(e, energyEntity.entity_id)} >
                <text x="${X}" y="106" class="st3 st8 right-align" 
                    display="${showProduction && energyEntity.isValid() ? '' : 'none'}" 
                    fill="${this.solarColour}">
                    ${energyEntity.toPowerString(true, 0)}
                </text>
            </a>`;
	}

	private static generateVoltage(X: number, voltageEntity: CustomEntity) {
		return svg`
            <a href="#" @click=${(e: Event) => Utils.handlePopup(e, voltageEntity.entity_id)}>
                <text x="${X}" y="106"
                      class="st3 left-align"
                      display="${voltageEntity.isValid() ? '' : 'none'}"
                      fill="${this.solarColour}">${voltageEntity.toNum(1)}${UnitOfElectricPotential.VOLT}
                </text>
            </a>`;
	}

	private static generateAmperage(X: number, entity: CustomEntity) {
		return svg`
            <a href="#" @click=${(e: Event) => Utils.handlePopup(e, entity.entity_id)}>
				<text id="" x="${X}" y="94" class="st3 left-align" display="${entity.isValid() ? '' : 'none'}" fill="${this.solarColour}">
					${entity.toNum(1)}${UnitOfElectricalCurrent.AMPERE}
				</text>
			</a>`;
	}

	static generateSolarSellIcon(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
            <a href="#" @click=${(e: Event) => Utils.handlePopup(e, config.entities.solar_sell_247)}>
                <svg xmlns="http://www.w3.org/2000/svg" id="solar_sell_on" x="245" y="150" width="18"
                     height="18" viewBox="0 0 30 30" style="overflow: visible">
                    <path display="${!config.entities.solar_sell_247 || data.stateSolarSell.state === 'off' || data.stateSolarSell.state === '0' || !['1', 'on'].includes(data.stateSolarSell.state) ? 'none' : ''}"
                          fill="${data.solarColour}"
                          d="${icons.solarSellOn}"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" id="solar_sell_off" x="245" y="150" width="18"
                     height="18" viewBox="0 0 30 30" style="overflow: visible">
                    <path display="${!config.entities.solar_sell_247 || data.stateSolarSell.state === 'on' || data.stateSolarSell.state === '1' || !['0', 'off'].includes(data.stateSolarSell.state) ? 'none' : ''}"
                          fill="${data.solarColour}"
                          d="${icons.solarSellOff}"/>
                </svg>
            </a>`;
	}

}