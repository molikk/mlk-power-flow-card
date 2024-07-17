import {DataDto, PowerFlowCardConfig} from '../../types';
import {svg} from 'lit';
import {localize} from '../../localize/localize';
import {icons} from '../../helpers/icons';
import {Utils} from '../../helpers/utils';
import {UnitOfElectricalCurrent, UnitOfElectricPotential, UnitOfPower} from '../../const';
import {CustomEntity} from "../../inverters/dto/custom-entity";

export class Solar {

    private static _solarColour: 'orange';
    private static _decimalPlacesEnergy: 2;
    private static _decimalPlaces: 2;

    static set decimalPlacesEnergy(value: 2) {
        this._decimalPlacesEnergy = value;
    }

    static set solarColour(value: 'orange') {
        this._solarColour = value;
    }

    static get solarColour(): "orange" {
        return this._solarColour;
    }

    static get decimalPlacesEnergy(): 2 {
        return this._decimalPlacesEnergy;
    }

    static get decimalPlaces(): 2 {
        return this._decimalPlaces;
    }

    static set decimalPlaces(value: 2) {
        this._decimalPlaces = value;
    }

    static generateSolarPower(data: DataDto, config: PowerFlowCardConfig) {
        return svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="pvtotal" x="205" y="116.5" width="70" height="30"
				 viewBox="0 0 70 30" overflow="visible">
				  <rect width="70" height="30" rx="4.5" ry="4.5" fill="none"
				  stroke="${config.solar.visualize_efficiency ? 'url(#SlG)' : data.solarColour}" pointer-events="all"
				  display="${config.solar.mppts === 1 ? 'none' : ''}"
				  class="${!config.show_solar ? 'st12' : ''}"/>
				  <defs>
					<linearGradient id="SlG" x1="0%" x2="0%" y1="100%" y2="0%">
						<stop offset="0%"
							  stop-color="${data.totalPVEfficiency === 0 ? 'grey' : data.solarColour}"/>
						<stop offset="${data.totalPVEfficiency}%"
							  stop-color="${data.totalPVEfficiency === 0 ? 'grey' : data.solarColour}"/>
						<stop offset="${data.totalPVEfficiency}%"
							  stop-color="${data.totalPVEfficiency < 100 ? 'grey' : data.solarColour}"/>
						<stop offset="100%"
							  stop-color="${data.totalPVEfficiency < 100 ? 'grey' : data.solarColour}"/>
					</linearGradient>
				  </defs>
			</svg>
			
			<svg id="solar-flow">
				<path id="so-line" d="M 239 190 L 239 147"
					  class="${!config.show_solar || config.solar.mppts === 1 ? 'st12' : ''}"
					  fill="none" stroke="${data.solarColour}" stroke-width="${data.solarLineWidth}"
					  stroke-miterlimit="10"
					  pointer-events="stroke"/>
				<circle id="so-dot" cx="0" cy="0"
						r="${Math.min(2 + data.solarLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						class="${!config.show_solar || config.solar.mppts === 1 ? 'st12' : ''}"
						fill="${data.totalPV === 0 ? 'transparent' : `${data.solarColour}`}">
					<animateMotion dur="${data.durationCur['solar']}s" repeatCount="indefinite"
								   keyPoints="1;0"
								   keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#so-line"/>
					</animateMotion>
				</circle>
			</svg>
			<text x="233" y="156" class="${config.solar.show_mppt_efficiency ? 'st3 st8 right-align' : 'st12'}"
				  display="${config.solar.mppts === 1 ? 'none' : ''}"
				  fill="${data.solarColour}">${data.totalPVEfficiency}%
			</text>
			${data.statePVTotal.isValid()
            ? svg`
				<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv_total)}>
					<text id="pvtotal_power" x="238.8" y="133.9" class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
						  display="${!config.show_solar || config.solar.mppts === 1 ? 'none' : ''}" 
						  fill="${data.solarColour}">
						${config.solar.auto_scale
                ? Utils.convertValueNew(data.totalPV, data.statePVTotal.getUOM(), data.decimalPlaces)
                : `${Utils.toNum(data.totalPV || 0, 0)} ${UnitOfPower.WATT}`
            }
				</text>
			</a>`
            : svg`
				<text id="pvtotal_power" x="238.8" y="133.9" class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
					  display="${!config.show_solar || config.solar.mppts === 1 ? 'none' : ''}" 
					  fill="${data.solarColour}">
					${config.solar.auto_scale
                ? Utils.convertValue(data.totalPV, data.decimalPlaces) || 0
                : `${Utils.toNum(data.totalPV || 0, 0)} ${UnitOfPower.WATT}`
            }
				</text>`
        }
		`;
    }


    static generateSolarHeader(data: DataDto, config: PowerFlowCardConfig) {
        let startPosition;
        let daily = svg``, monthly = svg``, yearly = svg``, total = svg``, remaining = svg``, tomorrow = svg``;

        let no: number = this.countGenerationElements(data);
        if (no == 0) {
            return svg``;
        }
        startPosition = this.setStartPosition(no);

        if (data.stateTomorrowSolar.isValid()) {
            tomorrow = this.getProduction('tomorrow_solar', data.stateTomorrowSolar, startPosition)
        }

        if (data.stateRemainingSolar.isValid()) {
            remaining = this.getProduction('remaining_solar', data.stateRemainingSolar, startPosition)
        }

        if (data.stateTotalSolarGeneration.isValid()) {
            total = this.getProduction('total_solar_generation', data.stateTotalSolarGeneration, startPosition)
        }

        if (data.stateYearlyPVEnergy.isValid()) {
            yearly = this.getProduction('yearly_solar', data.stateYearlyPVEnergy, startPosition)
        }

        if (data.stateMonthlyPVEnergy.isValid()) {
            monthly = this.getProduction('monthly_solar', data.stateMonthlyPVEnergy, startPosition)
        }

        if (data.stateDailyPVEnergy.isValid()) {
            daily = this.getProduction('daily_solar', data.stateDailyPVEnergy, startPosition)
        }

        startPosition.x -= 2 + startPosition.gap / 2;
        const icon = svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="sun" x="${startPosition.x}" y="10" width="40" height="40" viewBox="0 0 24 24">
				<path fill="${data.solarColour}" d="${icons.sun}"/>
			</svg>`;
        const envTemp = svg`
				<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.environment_temp)}>
					<text id="environ_temp" x="${startPosition.x}"" y="45"
						  class="${config.entities?.environment_temp ? 'st3 left-align' : 'st12'}"
						  fill="${data.solarColour}"
						  display="${data.stateEnvironmentTemp.isValid() ? '' : 'none'}">
						${data.stateEnvironmentTemp.toNum(1)}°
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
                return {x: 400 - 140, gap: 0};
            case 2:
                return {x: 400 - 70, gap: 0};
            default:
                return {x: 400, gap: 0};
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
        startPosition: { x: number, gap: number }
    ) {
        const startX = startPosition.x;
        const power = entity?.toPowerString(true, this.decimalPlacesEnergy) || '0';
        const name = localize("common." + fieldId);

        const powerWidth = this.getTextWidth(power, "16px Roboto");
        const nameWidth = this.getTextWidth(name, "9px Roboto");

        startPosition.gap = Math.max(nameWidth, powerWidth)
        startPosition.x -= startPosition.gap + 8;

        return svg`
            <a href="#" @click=${(e) => Utils.handlePopup(e, entity.entity_id)}>
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
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
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
        switch (mppt) {
            case 1:
                switch (max) {
                    case 1:
                        return [205, 'M 239.23 84 L 239 190', 230, 244.7, 238.8, 230, 'right-align'];
                    case 2:
                        return [158, 'M 193 84 L 193 122 Q 193 132 201 132 L 205 132.03', 188, 198, 192, 188, 'right-align'];
                    case 3:
                    case 4:
                        return [82, 'M 117 84 L 117 125 Q 117 132 124 132 L 205 132.03', 113, 121, 116, 113, 'right-align'];
                    case 5:
                        return [4, 'M  39 84 L  39 125 Q  39 132  46 132 L 205 132.03', 35, 44, 38, 35, 'right-align'];
                }
                break;
            case 2:
                switch (max) {
                    case 2:
                        return [254, 'M 289 84.5 L 289 125 Q 289 132 282 132 L 275 132', 281, 296, 289.5, 296, 'left-align'];
                    case 3:
                    case 4:
                        return [158, 'M 193 84 L 193 122 Q 193 132 201 132 L 205 132.03', 188, 198, 192, 188, 'right-align'];
                    case 5:
                        return [82, 'M 117 84 L 117 125 Q 117 132 124 132 L 205 132.03', 113, 121, 116, 113, 'right-align'];
                }
                break;
            case 3:
                switch (max) {
                    case 3:
                    case 4:
                        return [254, 'M 289 84.5 L 289 125 Q 289 132 282 132 L 275 132', 281, 296, 289.5, 296, 'left-align'];
                    case 5:
                        return [158, 'M 193 84 L 193 122 Q 193 132 201 132 L 205 132.03', 188, 198, 192, 188, 'right-align'];

                }
                break;
            case 4:
                switch (max) {
                    case 4:
                        return [330, 'M 365 85 L 365 125 Q 365 132 358 132 L 275 132', 357, 372, 366, 372, 'left-align'];
                    case 5:
                        return [254, 'M 289 84.5 L 289 125 Q 289 132 282 132 L 275 132', 281, 296, 289.5, 296, 'left-align'];
                }
                break;
            case 5:
                return [330, 'M 365 85 L 365 125 Q 365 132 358 132 L 275 132', 357, 372, 366, 372, 'left-align'];
        }
        return [];

    }

    private static pvLineMap: Record<string, string> = {
        pv1: '#pv1-line',
        pv2: '#pv2-line',
        pv3: '#pv3-line',
        pv4: '#pv4-line',
        pv5: '#pv5-line',
    }

    static generateMppt1(data: DataDto, config: PowerFlowCardConfig) {
        const X = this.getPositions(1, config.solar.mppts);

        return svg`${config.show_solar ?
            svg`
                ${this.generateFrame(X, 'pv1', data.PV1Efficiency, config.solar.visualize_efficiency)}
                ${this.generateFlowLine(X, 'pv1', data.statePV1Power, data.durationCur['pv1'], data.pv1LineWidth, data.minLineWidth)}
                ${this.generateName(X, config.solar.pv1_name)}
                ${this.generateEfficiency(X, data.PV1Efficiency, config.solar.show_mppt_efficiency)}
                ${this.generateEnergy(X, data.statePV1Energy, config.solar.show_mppt_production, config.solar.show_mppt_efficiency)}
                ${this.generateVoltage(X, data.statePV1Voltage)}
                ${this.generateAmperage(X, data.statePV1Current)}
                ${this.generatePower(X, data.statePV1Power, config.solar.auto_scale, data.largeFont)}
            `
            : svg``
        }`;

    }


    static generateMppt2(data: DataDto, config: PowerFlowCardConfig) {
        const X = this.getPositions(2, config.solar.mppts);
        return svg`${(config.show_solar && config.solar.mppts >= 2) ?
            svg`
                ${this.generateFrame(X, 'PV2', data.PV2Efficiency, config.solar.visualize_efficiency)}
                ${this.generateFlowLine(X, 'pv2', data.statePV2Power, data.durationCur['pv2'], data.pv2LineWidth, data.minLineWidth)}
                ${this.generateName(X, config.solar.pv2_name)}
                ${this.generateEfficiency(X, data.PV2Efficiency, config.solar.show_mppt_efficiency)}
                ${this.generateEnergy(X, data.statePV2Energy, config.solar.show_mppt_production, config.solar.show_mppt_efficiency)}
                ${this.generateVoltage(X, data.statePV2Voltage)}
                ${this.generateAmperage(X, data.statePV2Current)}
			          ${this.generatePower(X, data.statePV2Power, config.solar.auto_scale, data.largeFont)}
            `
            : svg``
        }`;
    }


    static generateMppt3(data: DataDto, config: PowerFlowCardConfig) {
        const X = this.getPositions(3, config.solar.mppts);
        return svg`${(config.show_solar && config.solar.mppts >= 3) ?
            svg`
                ${this.generateFrame(X, 'PV3', data.PV3Efficiency, config.solar.visualize_efficiency)}
                ${this.generateFlowLine(X, 'pv3', data.statePV3Power, data.durationCur['pv3'], data.pv3LineWidth, data.minLineWidth)}
                ${this.generateName(X, config.solar.pv3_name)}			
                ${this.generateEfficiency(X, data.PV3Efficiency, config.solar.show_mppt_efficiency)}
                ${this.generateEnergy(X, data.statePV3Energy, config.solar.show_mppt_production, config.solar.show_mppt_efficiency)}
                ${this.generateVoltage(X, data.statePV3Voltage)}
                ${this.generateAmperage(X, data.statePV3Current)}
			          ${this.generatePower(X, data.statePV3Power, config.solar.auto_scale, data.largeFont)}
            `
            : svg``
        }`;
    }

    static generateMppt4(data: DataDto, config: PowerFlowCardConfig) {
        const X = this.getPositions(4, config.solar.mppts);
        return svg`${(config.show_solar && config.solar.mppts >= 4) ?
            svg`
                ${this.generateFrame(X, 'PV4', data.PV4Efficiency, config.solar.visualize_efficiency)}
                ${this.generateFlowLine(X, 'pv4', data.statePV4Power, data.durationCur['pv4'], data.pv4LineWidth, data.minLineWidth)}
                ${this.generateName(X, config.solar.pv4_name)}
                ${this.generateEfficiency(X, data.PV4Efficiency, config.solar.show_mppt_efficiency)}
                ${this.generateEnergy(X, data.statePV4Energy, config.solar.show_mppt_production, config.solar.show_mppt_efficiency)}
                ${this.generateVoltage(X, data.statePV4Voltage)}
                ${this.generateAmperage(X, data.statePV4Current)}
                ${this.generatePower(X, data.statePV4Power, config.solar.auto_scale, data.largeFont)}
            `
            : svg``
        }`;
    }

    static generateMppt5(data: DataDto, config: PowerFlowCardConfig) {
        const X = this.getPositions(5, config.solar.mppts);
        return svg`${(config.show_solar && config.solar.mppts >= 5) ?
            svg`
                ${this.generateFrame(X, 'PV5', data.PV5Efficiency, config.solar.visualize_efficiency)}
                ${this.generateFlowLine(X, 'pv5', data.statePV5Power, data.durationCur['pv5'], data.pv5LineWidth, data.minLineWidth)}
                ${this.generateName(X, config.solar.pv5_name)}
                ${this.generateEfficiency(X, data.PV5Efficiency, config.solar.show_mppt_efficiency)}
                ${this.generateEnergy(X, data.statePV5Energy, config.solar.show_mppt_production, config.solar.show_mppt_efficiency)}
                ${this.generateVoltage(X, data.statePV5Voltage)}
                ${this.generateAmperage(X, data.statePV5Current)}
			          ${this.generatePower(X, data.statePV5Power, config.solar.auto_scale, data.largeFont)}
			      `
            : svg``
        }`;
    }


    private static generatePower(X: (number | string)[], entity: CustomEntity, autoScale: boolean, largeFont) {
        return svg`
            <a href="#" @click=${(e) => Utils.handlePopup(e, entity.entity_id)}>
                <text x="${X[4]}" y="71" class="${largeFont !== true ? 'st14' : 'st4'} st8" 
                    display="${entity.isValid() ? '' : 'none'}" 
                    fill="${this.solarColour}">
                    ${autoScale ? Utils.convertValue(entity, this.decimalPlaces) || 0 : entity.toNum(0) + " " + UnitOfPower.WATT}
                        </text>
			      </a>`;
    }

    private static generateFrame(
        X: (number | string)[],
        id: string,
        efficiency: number,
        efficiencyMode: boolean,
    ) {
        return svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="${id}" x="${X[0]}" y="54.5" width="70" height="30"
				viewBox="0 0 70 30" overflow="visible">
				<rect id="${id}" width="70" height="30" rx="4.5" ry="4.5" fill="none"
				stroke="${efficiencyMode ? ('url(#' + id + 'LG)') : this.solarColour}" pointer-events="all"
				/>
				<defs>
					<linearGradient id="${id}LG" x1="0%" x2="0%" y1="100%" y2="0%">
						<stop offset="0%" stop-color="${efficiency === 0 ? 'grey' : this.solarColour}"/>
						<stop offset="${efficiency}%" stop-color="${efficiency === 0 ? 'grey' : this.solarColour}"/>
						<stop offset="${efficiency}%" stop-color="${efficiency < 100 ? 'grey' : this.solarColour}"/>
						<stop offset="100%" stop-color="${efficiency < 100 ? 'grey' : this.solarColour}"/>
					</linearGradient>
				</defs>
			</svg>`;
    }

    private static generateFlowLine(
        X: (number | string)[],
        id: string,
        entity: CustomEntity,
        duration: number,
        lineWidth: number,
        minLineWidth: number
    ) {
        const power = entity.toPower();
        return svg`
			<svg id="${id}-flow">
				<path id="${id}-line" d="${X[1]}"
					  fill="none" stroke="${this.solarColour}" stroke-width="${lineWidth}"
					  stroke-miterlimit="10"
					  pointer-events="stroke"/>
				<circle id="${id}-dot" cx="0" cy="0"
						r="${Math.min(2 + lineWidth + Math.max(minLineWidth - 2, 0), 8)}"
						fill="${Math.round(power) <= 0 ? 'transparent' : `${this.solarColour}`}">
					<animateMotion dur="${duration}s" repeatCount="indefinite"
								   keyPoints="0;1"
								   keyTimes="0;1" calcMode="linear">
						<mpath href='${this.pvLineMap[id]}'/>
					</animateMotion>
				</circle>
			</svg>`;
    }

    private static generateName(X: (number | string)[], name: string) {
        return svg`
			<text x="${X[2]}" y="94" class="st3 st8 right-align"
				  fill="${this._solarColour}">${name}
			</text>`;
    }

    private static generateEfficiency(X: (number | string)[], efficiency: number, isVisible: boolean) {
        return svg`
            <text x="${X[2]}" y="106" class="${isVisible ? 'st3 st8 right-align' : 'st12'}"
                display="${isVisible ? '' : 'none'}" fill="${this.solarColour}">
                ${efficiency}%
            </text>`;
    }

    private static generateEnergy(X: (number | string)[], energyEntity: CustomEntity, showProduction: boolean, showEfficiency: boolean) {
        return svg`
            <a href="#" @click=${(e) => Utils.handlePopup(e, energyEntity.entity_id)} >
                <text x="${showEfficiency ? X[5] : X[2]}" y="${showEfficiency ? '118' : '106'}" class="st3 st8 ${showEfficiency ? X[6] : 'right-align'}" 
                    display="${showProduction && energyEntity.isValid()? '' : 'none'}" 
                    fill="${this.solarColour}">
                    ${energyEntity.toPowerString(true, 0)}
                </text>
            </a>`;
    }

    private static generateVoltage(X: (number | string)[], voltageEntity: CustomEntity) {
        return svg`
            <a href="#" @click=${(e) => Utils.handlePopup(e, voltageEntity.entity_id)}>
                <text x="${X[3]}" y="106"
                      class="st3 left-align"
                      display="${voltageEntity.isValid() ? '' : 'none'}"
                      fill="${this.solarColour}">${voltageEntity.toNum(1)} ${UnitOfElectricPotential.VOLT}
                </text>
            </a>`;
    }

    private static generateAmperage(X: (number | string)[], entity: CustomEntity) {
        return svg`
            <a href="#" @click=${(e) => Utils.handlePopup(e, entity.entity_id)}>
				<text id="" x="${X[3]}" y="94" class="st3 left-align"
					  display="${entity.isValid() ? '' : 'none'}"
					  fill="${this.solarColour}">${entity.toNum(1)}
					${UnitOfElectricalCurrent.AMPERE}
				</text>
			</a>`;
    }

    static generateSolarSellIcon(data: DataDto, config: PowerFlowCardConfig){
        return svg`
            <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.solar_sell_247)}>
                <svg xmlns="http://www.w3.org/2000/svg" id="solar_sell_on" x="245" y="150" width="18"
                     height="18" viewBox="0 0 30 30">
                    <path display="${!config.entities.solar_sell_247 || data.stateSolarSell.state === 'off' || data.stateSolarSell.state === '0' || !['1', 'on'].includes(data.stateSolarSell.state) ? 'none' : ''}"
                          fill="${data.solarColour}"
                          d="${icons.solarSellOn}"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" id="solar_sell_off" x="245" y="150" width="18"
                     height="18" viewBox="0 0 30 30">
                    <path display="${!config.entities.solar_sell_247 || data.stateSolarSell.state === 'on' || data.stateSolarSell.state === '1' || !['0', 'off'].includes(data.stateSolarSell.state) ? 'none' : ''}"
                          fill="${data.solarColour}"
                          d="${icons.solarSellOff}"/>
                </svg>
            </a>`;
    }

}