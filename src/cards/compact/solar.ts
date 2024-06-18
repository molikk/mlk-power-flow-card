import { DataDto, sunsynkPowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { localize } from '../../localize/localize';
import { icons } from '../../helpers/icons';
import { Utils } from '../../helpers/utils';
import { UnitOfElectricalCurrent, UnitOfElectricPotential, UnitOfPower } from '../../const';

export class Solar {

	static generateIcon(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="sun" x="154" y="10" width="40" height="40"
				 viewBox="0 0 24 24">
				<path class="${!config.show_solar ? 'st12' : ''}" fill="${data.solarColour}"
					  d="${icons.sun}"/>
			</svg>
			`;
	}

	static generateDailySolar(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			<text id="daily_solar" x="200" y="40" class="st3 left-align"
				  display="${config.solar.display_mode === 1 ? '' : 'none'}"
				  fill="${!data.solarShowDaily || !config.show_solar ? 'transparent' : `${data.solarColour}`}">
				${localize('common.daily_solar')}
			</text>
			<text id="remaining_solar" x="200" y="40" class="st3 left-align"
				  display="${config.solar.display_mode === 2 ? '' : 'none'}"
				  fill="${!data.solarShowDaily || !config.show_solar ? 'transparent' : `${data.solarColour}`}">
				${localize('common.daily_solar_left')}
			</text>
			<text id="total_solar_generation" x="200" y="40" class="st3 left-align"
				  display="${config.solar.display_mode === 3 ? '' : 'none'}"
				  fill="${!data.solarShowDaily || !config.show_solar ? 'transparent' : `${data.solarColour}`}">
				${localize('common.total_solar_generation')}
			</text>
		`;
	}

	private static getPositions(mppt: number, max: number) {
		switch (mppt) {
			case 1:
				switch (max) {
					case 1:
						return [205, 'M 239.23 84 L 239 190', 230, 244.7, 238.8, 230, 'right-align'];
					case 2:
						return [154, 'M 187 84 L 187 122 Q 187 132 195 132 L 205 132.03', 179, 194, 188.1, 179, 'right-align'];
					case 3:
					case 4:
						return [78, 'M 113 84 L 113 125 Q 113 132 120 132 L 205 132.03', 105, 120, 113, 105, 'right-align'];
					case 5:
						return [ 4, 'M  39 84 L  39 125 Q  39 132  46 132 L 205 132.03', 31, 46, 38, 31, 'right-align'];
				}
				break;
			case 2:
				switch (max) {
					case 2:
						return [254, 'M 289 84.5 L 289 125 Q 289 132 282 132 L 275 132', 281, 296, 289.5, 296, 'left-align'];
					case 3:
					case 4:
						return [154, 'M 187 84 L 187 122 Q 187 132 195 132 L 205 132.03', 179, 194, 188.1, 179, 'right-align'];
					case 5:
						return [78, 'M 113 84 L 113 125 Q 113 132 120 132 L 205 132.03', 105, 120, 113, 105, 'right-align'];
				}
				break;
			case 3:
				switch (max) {
					case 3:
					case 4:
						return [254, 'M 289 84.5 L 289 125 Q 289 132 282 132 L 275 132', 281, 296, 289.5, 296, 'left-align'];
					case 5:
						return [154, 'M 187 84 L 187 122 Q 187 132 195 132 L 205 132.03', 179, 194, 188.1, 179, 'right-align'];

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

	static generateMppt1(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const X = this.getPositions(1, config.solar.mppts);
		return svg`${config.show_solar ?
			svg`
				<svg xmlns="http://www.w3.org/2000/svg" id="pv1" x="${X[0]}" y="54.5" 
					 width="70" height="30" viewBox="0 0 70 30" overflow="visible">
					  <rect id="pv1" width="70" height="30" rx="4.5" ry="4.5" 
					  fill="none" stroke="${[1, 3].includes(config.solar.efficiency) ? 'url(#PV1LG)' : data.solarColour}"
					  pointer-events="all"/>
					  <defs>
						<linearGradient id="PV1LG" x1="0%" x2="0%" y1="100%" y2="0%">
							<stop offset="0%"
								  stop-color="${data.PV1Efficiency === 0 ? 'grey' : data.solarColour}"/>
							<stop offset="${data.PV1Efficiency}%"
								  stop-color="${data.PV1Efficiency === 0 ? 'grey' : data.solarColour}"/>
							<stop offset="${data.PV1Efficiency}%"
								  stop-color="${data.PV1Efficiency < 100 ? 'grey' : data.solarColour}"/>
							<stop offset="100%"
								  stop-color="${data.PV1Efficiency < 100 ? 'grey' : data.solarColour}"/>
						</linearGradient>
					  </defs>
				</svg>
				<svg id="pv1-flow">
					<path id="pv1-line"
						  d="${X[1]}"
						  fill="none"
						  stroke="${data.solarColour}" stroke-width="${data.pv1LineWidth}" stroke-miterlimit="10"
						  pointer-events="stroke"/>
					<circle id="pv1-dot" cx="0" cy="0"
							r="${Math.min(2 + data.pv1LineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
							fill="${Math.round(data.pv1PowerWatts) <= 0 ? 'transparent' : `${data.solarColour}`}">
						<animateMotion dur="${data.durationCur['pv1']}s" repeatCount="indefinite"
									   keyPoints="0;1"
									   keyTimes="0;1" calcMode="linear">
							<mpath xlink:href="#pv1-line"/>
						</animateMotion>
					</circle>
				</svg>
				<text x="${X[2]}" y="94" class="st3 st8 right-align"
					  fill="${data.solarColour}">
					${config.solar.pv1_name}
				</text>
				<text x="${X[5]}" y="${[2, 3].includes(config.solar.efficiency) ? '118' : '106'}" class="st3 st8 ${X[6]}" 
					display="${config.solar.show_mppt_production ? '' : 'none'}" 
					fill="${data.solarColour}">
					${data.statePV1Energy.toPowerString(true, 0)}
				</text>
				<text x="${X[2]}" y="106" class="${[2, 3].includes(config.solar.efficiency) ? 'st3 st8 right-align' : 'st12'}"
					display="${[2, 3].includes(config.solar.efficiency) ? '' : 'none'}" fill="${data.solarColour}">
					${data.PV1Efficiency}%
				</text>
				<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv1_voltage_109)}>
					<text id="pv1_voltage" x="${X[3]}" y="106"
						  class="st3 left-align"
						  display="${config.entities.pv1_voltage_109 && config.entities.pv1_voltage_109 != 'none' && data.statePV1Voltage.isValid() ? '' : 'none'}"
						  fill="${data.solarColour}">${data.statePV1Voltage.toNum(1)} ${UnitOfElectricPotential.VOLT}
					</text>
				</a>
				<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv1_current_110)}>
					<text id="pv1_current" x="${X[3]}" y="94"
						  class="st3 left-align"
						  display="${config.entities.pv1_current_110 && config.entities.pv1_current_110 != 'none' && data.statePV1Current.isValid() ? '' : 'none'}"
						  fill="${data.solarColour}">${data.statePV1Current.toNum(1)} ${UnitOfElectricalCurrent.AMPERE}
					</text>
				</a>
				<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv1_power_186)}>
					<text id="pv1_power_186" x="${X[4]}" y="71" 
						  class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
						  display="${data.statePV1Power.isValid() ? '' : 'none'}" 
						  fill="${data.solarColour}">
						  ${config.solar.auto_scale
				? Utils.convertValue(data.pv1PowerWatts, data.decimalPlaces) || 0
				: `${Utils.toNum(data.pv1PowerWatts || 0, 0)} ${UnitOfPower.WATT}`}
					</text>
				</a> `
			: svg``
		}`;

	}

	static generateMppt2(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const X = this.getPositions(2, config.solar.mppts);
		return svg`${(config.show_solar && config.solar.mppts >= 2) ?
			svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="pv2" x="${X[0]}" y="54.5" width="70" height="30"
				 viewBox="0 0 70 30" overflow="visible">
				  <rect id="pv2" width="70" height="30" rx="4.5" ry="4.5" fill="none"
				  stroke="${[1, 3].includes(config.solar.efficiency) ? 'url(#PV2LG)' : data.solarColour}" pointer-events="all"
				  />
				  <defs>
					<linearGradient id="PV2LG" x1="0%" x2="0%" y1="100%" y2="0%">
						<stop offset="0%"
							  stop-color="${data.PV2Efficiency === 0 ? 'grey' : data.solarColour}"/>
						<stop offset="${data.PV2Efficiency}%"
							  stop-color="${data.PV2Efficiency === 0 ? 'grey' : data.solarColour}"/>
						<stop offset="${data.PV2Efficiency}%"
							  stop-color="${data.PV2Efficiency < 100 ? 'grey' : data.solarColour}"/>
						<stop offset="100%"
							  stop-color="${data.PV2Efficiency < 100 ? 'grey' : data.solarColour}"/>
					</linearGradient>
				  </defs>
			</svg>
			<svg id="pv2-flow">
				<path id="pv2-line" d="${X[1]}"
					  fill="none" stroke="${data.solarColour}" stroke-width="${data.pv2LineWidth}"
					  stroke-miterlimit="10"
					  pointer-events="stroke"/>
				<circle id="pv2-dot" cx="0" cy="0"
						r="${Math.min(2 + data.pv2LineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${Math.round(data.pv2PowerWatts) <= 0 ? 'transparent' : `${data.solarColour}`}">
					<animateMotion dur="${data.durationCur['pv2']}s" repeatCount="indefinite"
								   keyPoints="0;1"
								   keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#pv2-line"/>
					</animateMotion>
				</circle>
			</svg>
			<text x="${X[2]}" y="94" class="st3 st8 right-align"
				  fill="${data.solarColour}">${config.solar.pv2_name}
			</text>
			<text x="${X[5]}" y="${[2, 3].includes(config.solar.efficiency) ? '118' : '106'}" class="st3 st8 ${X[6]}" 
				display="${config.solar.show_mppt_production ? '' : 'none'}" 
				fill="${data.solarColour}">
				${data.statePV2Energy.toPowerString(true, 0)}
			</text>
			<text x="${X[2]}" y="106" class="${[2, 3].includes(config.solar.efficiency) ? 'st3 st8 right-align' : 'st12'}"
				  display="${[2, 3].includes(config.solar.efficiency) ? '' : 'none'}"
				  fill="${data.solarColour}">${data.PV2Efficiency}%
			</text>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv2_voltage_111)}>
				<text id="data.pv2_voltage" x="${X[3]}" y="106" class="st3 left-align"
					  display="${config.entities.pv2_voltage_111 && config.entities.pv2_voltage_111 != 'none' && data.statePV2Voltage.isValid() ? '' : 'none'}"
					  fill="${data.solarColour}">${data.statePV2Voltage.toNum(1)}
					${UnitOfElectricPotential.VOLT}
				</text>
			</a>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv2_current_112)}>
				<text id="data.pv2_current" x="${X[3]}" y="94" class="st3 left-align"
					  display="${config.entities.pv2_current_112 && config.entities.pv2_current_112 != 'none' && data.statePV2Current.isValid() ? '' : 'none'}"
					  fill="${data.solarColour}">${data.statePV2Current.toNum(1)}
					${UnitOfElectricalCurrent.AMPERE}
				</text>
			</a>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv2_power_187)}>
				<text id="pv2_power_187" x="${X[4]}" y="71" class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
					  display="${data.statePV2Power.isValid() ? '' : 'none'}" 
					  fill="${data.solarColour}">
					  ${config.solar.auto_scale
				? Utils.convertValue(data.pv2PowerWatts, data.decimalPlaces) || 0
				: `${Utils.toNum(data.pv2PowerWatts || 0, 0)} ${UnitOfPower.WATT}`}
				</text>
			</a> `
			: svg``
		}`;
	}

	static generateMppt3(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const X = this.getPositions(3, config.solar.mppts);
		return svg`${(config.show_solar && config.solar.mppts >= 3) ?
			svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="pv3" x="${X[0]}" y="54.5" width="70" height="30"
				 viewBox="0 0 70 30" overflow="visible">
				  <rect id="pv3" width="70" height="30" rx="4.5" ry="4.5" fill="none"
				  stroke="${[1, 3].includes(config.solar.efficiency) ? 'url(#PV3LG)' : data.solarColour}" pointer-events="all"
				  />
				  <defs>
					<linearGradient id="PV3LG" x1="0%" x2="0%" y1="100%" y2="0%">
						<stop offset="0%"
							  stop-color="${data.PV3Efficiency === 0 ? 'grey' : data.solarColour}"/>
						<stop offset="${data.PV3Efficiency}%"
							  stop-color="${data.PV3Efficiency === 0 ? 'grey' : data.solarColour}"/>
						<stop offset="${data.PV3Efficiency}%"
							  stop-color="${data.PV3Efficiency < 100 ? 'grey' : data.solarColour}"/>
						<stop offset="100%"
							  stop-color="${data.PV3Efficiency < 100 ? 'grey' : data.solarColour}"/>
					</linearGradient>
				  </defs>
			</svg>
			<svg id="pv3-flow">
				<path id="pv3-line" d="${X[1]}"
					  fill="none" stroke="${data.solarColour}" stroke-width="${data.pv3LineWidth}"
					  stroke-miterlimit="10"
					  pointer-events="stroke"/>
				<circle id="pv3-dot" cx="0" cy="0"
						r="${Math.min(2 + data.pv3LineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${Math.round(data.pv3PowerWatts) <= 0 ? 'transparent' : `${data.solarColour}`}">
					<animateMotion dur="${data.durationCur['pv3']}s" repeatCount="indefinite"
								   keyPoints="0;1"
								   keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#pv3-line"/>
					</animateMotion>
				</circle>
			</svg>
			<text x="${X[2]}" y="94" class="st3 st8 right-align"
				  fill="${data.solarColour}">${config.solar.pv3_name}
			</text>
			<text x="${X[5]}" y="${[2, 3].includes(config.solar.efficiency) ? '118' : '106'}" class="st3 st8 ${X[6]}" 
				display="${config.solar.show_mppt_production ? '' : 'none'}" 
				fill="${data.solarColour}">
				${data.statePV3Energy.toPowerString(true, 0)}
			</text>
			<text x="${X[2]}" y="106" class="${[2, 3].includes(config.solar.efficiency) ? 'st3 st8 right-align' : 'st12'}"
				  display="${[2, 3].includes(config.solar.efficiency) ? '' : 'none'}"
				  fill="${data.solarColour}">${data.PV3Efficiency}%
			</text>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv3_voltage_113)}>
				<text id="pv3_voltage" x="${X[3]}" y="106" class="st3 left-align"
					  display="${config.entities.pv3_voltage_113 && config.entities.pv3_voltage_113 != 'none' && data.statePV3Voltage.isValid() ? '' : 'none'}"
					  fill="${data.solarColour}">${data.statePV3Voltage.toNum(1)}
					${UnitOfElectricPotential.VOLT}
				</text>
			</a>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv3_current_114)}>
				<text id="pv3_current" x="${X[3]}" y="94" class="st3 left-align"
					    display="${config.entities.pv3_current_114 && config.entities.pv3_current_114 != 'none' && data.statePV3Current.isValid() ? '' : 'none'}"
					  fill="${data.solarColour}">${data.statePV3Current.toNum(1)}
					${UnitOfElectricalCurrent.AMPERE}
				</text>
			</a>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv3_power_188)}>
				<text id="pv3_power_188" x="${X[4]}" y="71" class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
					  display="${data.statePV3Power.isValid() ? '' : 'none'}" 
					  fill="${data.solarColour}">
					  ${config.solar.auto_scale
				? Utils.convertValue(data.pv3PowerWatts, data.decimalPlaces) || 0
				: `${Utils.toNum(data.pv3PowerWatts || 0, 0)} ${UnitOfPower.WATT}`}
				</text>
			</a> `
			: svg``
		}`;
	}

	static generateMppt4(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const X = this.getPositions(4, config.solar.mppts);
		return svg`${(config.show_solar && config.solar.mppts >= 4) ?
			svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="pv4" x="${X[0]}" y="54.5" width="70" height="30"
				 viewBox="0 0 70 30" overflow="visible">
				  <rect id="pv4" width="70" height="30" rx="4.5" ry="4.5" fill="none"
				  stroke="${[1, 3].includes(config.solar.efficiency) ? 'url(#PV4LG)' : data.solarColour}" pointer-events="all"
				  />
				  <defs>
					<linearGradient id="PV4LG" x1="0%" x2="0%" y1="100%" y2="0%">
						<stop offset="0%"
							  stop-color="${data.PV4Efficiency === 0 ? 'grey' : data.solarColour}"/>
						<stop offset="${data.PV4Efficiency}%"
							  stop-color="${data.PV4Efficiency === 0 ? 'grey' : data.solarColour}"/>
						<stop offset="${data.PV4Efficiency}%"
							  stop-color="${data.PV4Efficiency < 100 ? 'grey' : data.solarColour}"/>
						<stop offset="100%"
							  stop-color="${data.PV4Efficiency < 100 ? 'grey' : data.solarColour}"/>
					</linearGradient>
				  </defs>
			</svg>
			<svg id="pv4-flow">
				<path id="pv4-line" d="${X[1]}"
					  fill="none" stroke="${data.solarColour}" stroke-width="${data.pv4LineWidth}"
					  stroke-miterlimit="10"
					  pointer-events="stroke"/>
				<circle id="pv4-dot" cx="0" cy="0"
						r="${Math.min(2 + data.pv4LineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${Math.round(data.pv4PowerWatts) <= 0 ? 'transparent' : `${data.solarColour}`}">
					<animateMotion dur="${data.durationCur['pv4']}s" repeatCount="indefinite"
								   keyPoints="0;1"
								   keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#pv4-line"/>
					</animateMotion>
				</circle>
			</svg>
			<text x="${X[2]}" y="94" class="st3 st8 right-align"
				  fill="${data.solarColour}">${config.solar.pv4_name}
			</text>
			<text x="${X[5]}" y="${[2, 3].includes(config.solar.efficiency) ? '118' : '106'}" class="st3 st8 ${X[6]}" 
				display="${config.solar.show_mppt_production ? '' : 'none'}" 
				fill="${data.solarColour}">
				${data.statePV4Energy.toPowerString(true, 0)}
			</text>
			
			<text x="${X[2]}" y="106" class="${[2, 3].includes(config.solar.efficiency) ? 'st3 st8 right-align' : 'st12'}"
				  display="${[2, 3].includes(config.solar.efficiency) ? '' : 'none'}"
				  fill="${data.solarColour}">${data.PV4Efficiency}%
			</text>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv4_voltage_115)}>
				<text id="pv4_voltage" x="${X[3]}" y="106" class="st3 left-align"
					  display="${config.entities.pv4_voltage_115 && config.entities.pv4_voltage_115 != 'none' && data.statePV4Voltage.isValid() ? '' : 'none'}"
					  fill="${data.solarColour}">${data.statePV4Voltage.toNum(1)}
					${UnitOfElectricPotential.VOLT}
				</text>
			</a>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv4_current_116)}>
				<text id="pv4_current" x="${X[3]}" y="94" class="st3 left-align"
					  display="${config.entities.pv4_current_116 && config.entities.pv4_current_116 != 'none' && data.statePV4Current.isValid() ? '' : 'none'}"
					  fill="${data.solarColour}">${data.statePV4Current.toNum(1)}
					${UnitOfElectricalCurrent.AMPERE}
				</text>
			</a>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv4_power_189)}>
				<text id="pv4_power_189" x="${X[4]}" y="71" class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
					  display="${data.statePV4Power.isValid() ? '' : 'none'}" 
					  fill="${data.solarColour}">
					  ${config.solar.auto_scale
				? Utils.convertValue(data.pv4PowerWatts, data.decimalPlaces) || 0
				: `${Utils.toNum(data.pv4PowerWatts || 0, 0)} ${UnitOfPower.WATT}`}
				</text>
			</a>`
			: svg``
		}`;
	}

	static generateMppt5(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		const X = this.getPositions(5, config.solar.mppts);
		return svg`${(config.show_solar && config.solar.mppts >= 5) ?
			svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="pv5" x="${X[0]}" y="54.5" width="70" height="30"
				 viewBox="0 0 70 30" overflow="visible">
				  <rect id="pv5" width="70" height="30" rx="4.5" ry="4.5" fill="none"
				  stroke="${[1, 3].includes(config.solar.efficiency) ? 'url(#PV5LG)' : data.solarColour}" pointer-events="all"
				  />
				  <defs>
					<linearGradient id="PV5LG" x1="0%" x2="0%" y1="100%" y2="0%">
						<stop offset="0%"
							  stop-color="${data.PV5Efficiency === 0 ? 'grey' : data.solarColour}"/>
						<stop offset="${data.PV5Efficiency}%"
							  stop-color="${data.PV5Efficiency === 0 ? 'grey' : data.solarColour}"/>
						<stop offset="${data.PV5Efficiency}%"
							  stop-color="${data.PV5Efficiency < 100 ? 'grey' : data.solarColour}"/>
						<stop offset="100%"
							  stop-color="${data.PV5Efficiency < 100 ? 'grey' : data.solarColour}"/>
					</linearGradient>
				  </defs>
			</svg>
			<svg id="pv5-flow">
				<path id="pv5-line" d="${X[1]}"
					  fill="none" stroke="${data.solarColour}" stroke-width="${data.pv5LineWidth}"
					  stroke-miterlimit="10"
					  pointer-events="stroke"/>
				<circle id="pv5-dot" cx="0" cy="0"
						r="${Math.min(2 + data.pv5LineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${Math.round(data.pv5PowerWatts) <= 0 ? 'transparent' : `${data.solarColour}`}">
					<animateMotion dur="${data.durationCur['pv5']}s" repeatCount="indefinite"
								   keyPoints="0;1"
								   keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#pv5-line"/>
					</animateMotion>
				</circle>
			</svg>
			<text x="${X[2]}" y="94" class="st3 st8 right-align"
				  fill="${data.solarColour}">${config.solar.pv5_name}
			</text>
			<text x="${X[5]}" y="${[2, 3].includes(config.solar.efficiency) ? '118' : '106'}" class="st3 st8 ${X[6]}" 
				display="${config.solar.show_mppt_production ? '' : 'none'}" 
				fill="${data.solarColour}">
				${data.statePV5Energy.toPowerString(true, 0)}
			</text>
			
			<text x="${X[2]}" y="106" class="${[2, 3].includes(config.solar.efficiency) ? 'st3 st8 right-align' : 'st12'}"
				  display="${[2, 3].includes(config.solar.efficiency) ? '' : 'none'}"
				  fill="${data.solarColour}">${data.PV5Efficiency}%
			</text>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv5_voltage)}>
				<text id="pv5_voltage" x="${X[3]}" y="106" class="st3 left-align"
					  display="${config.entities.pv5_voltage && config.entities.pv5_voltage != 'none' && data.statePV5Voltage.isValid() ? '' : 'none'}"
					  fill="${data.solarColour}">${data.statePV5Voltage.toNum(1)}
					${UnitOfElectricPotential.VOLT}
				</text>
			</a>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv5_current)}>
				<text id="pv5_current" x="${X[3]}" y="94" class="st3 left-align"
					  display="${config.entities.pv5_current && config.entities.pv5_current != 'none' && data.statePV5Current.isValid() ? '' : 'none'}"
					  fill="${data.solarColour}">${data.statePV5Current.toNum(1)}
					${UnitOfElectricalCurrent.AMPERE}
				</text>
			</a>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv5_power)}>
				<text id="pv5_power_189" x="${X[4]}" y="71" class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
					  display="${data.statePV5Power.isValid() ? '' : 'none'}" 
					  fill="${data.solarColour}">
					  ${config.solar.auto_scale
				? Utils.convertValue(data.pv5PowerWatts, data.decimalPlaces) || 0
				: `${Utils.toNum(data.pv5PowerWatts || 0, 0)} ${UnitOfPower.WATT}`}
				</text>
			</a>`
			: svg``
		}`;
	}
	static generateSolarPower(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="pvtotal" x="205" y="116.5" width="70" height="30"
				 viewBox="0 0 70 30" overflow="visible">
				  <rect width="70" height="30" rx="4.5" ry="4.5" fill="none"
				  stroke="${[1, 3].includes(config.solar.efficiency) ? 'url(#SlG)' : data.solarColour}" pointer-events="all"
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
			<text x="215" y="156" class="${[2, 3].includes(config.solar.efficiency) ? 'st3 st8' : 'st12'}"
				  display="${config.solar.mppts === 1 ? 'none' : ''}"
				  fill="${data.solarColour}">${data.totalPVEfficiency}%
			</text>
			${config.entities?.pv_total
			? svg`
				<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.pv_total)}>
					<text id="pvtotal_power" x="238.8" y="133.9" class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
						  display="${!config.show_solar || config.solar.mppts === 1 || !data.statePVTotal.isValid() ? 'none' : ''}" 
						  fill="${data.solarColour}">
						${config.solar.auto_scale
				? config.entities?.pv_total
					? Utils.convertValueNew(data.totalPV, data.statePVTotal.getUOM(), data.decimalPlaces)
					: Utils.convertValue(data.totalPV, data.decimalPlaces) || 0
				: `${Utils.toNum(data.totalPV || 0, 0)} ${UnitOfPower.WATT}`
			}
				</text>
			</a>`
			: svg`
				<text id="pvtotal_power" x="238.8" y="133.9" class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
					  display="${!config.show_solar || config.solar.mppts === 1 || !data.statePVTotal.isValid() ? 'none' : ''}" 
					  fill="${data.solarColour}">
					${config.solar.auto_scale
				? config.entities?.pv_total
					? Utils.convertValueNew(data.totalPV, data.statePVTotal.getUOM(), data.decimalPlaces)
					: Utils.convertValue(data.totalPV, data.decimalPlaces) || 0
				: `${Utils.toNum(data.totalPV || 0, 0)} ${UnitOfPower.WATT}`
			}
				</text>`
		}
		`;
	}
}