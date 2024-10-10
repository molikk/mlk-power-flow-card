import { svg } from 'lit';
import { DataDto, PowerFlowCardConfig } from '../../types';
import { localize } from '../../localize/localize';
import { Utils } from '../../helpers/utils';
import { UnitOfPower } from '../../const';

export class Load {
	public static readonly LOAD_X = 418;
	public static readonly GAP = 8;
	public static readonly rowAux: number = 3;
	public static readonly row1: number = 35;
	public static readonly row2: number = 110;
	public static readonly row3: number = 185;
	public static readonly row4: number = 260;
	public static readonly row5: number = 335;
	public static readonly row6: number = 410;
	public static readonly column1: number = Load.LOAD_X - 43 - Load.GAP / 2;
	public static readonly column2: number = Load.LOAD_X;
	public static readonly column3: number = Load.column2 + 43 + Load.GAP / 2;
	public static readonly column4: number = Load.column3 + 43 + Load.GAP / 2;
	public static readonly column5: number = Load.column4 + 43 + Load.GAP / 2;
	public static readonly columns: number[] = [ Load.column1,  Load.column2,  Load.column3,  Load.column4, Load.column5]
	public static readonly yGaps = [26, 55, 37, 67]; //shape, name, power, energy
	public static readonly xGaps = [53, 43, 63.5]; //icon, shape, names

	static generateDailyLoad(data: DataDto, config: PowerFlowCardConfig) {

		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.day_load_energy_84)}>
				<text id="daily_load_value" x="${this.LOAD_X - 5}" y="182"
					  class="st10 right-align" display="${!data.loadShowDaily || !data.stateDayLoadEnergy.isValid() ? 'none' : ''}"
					  fill="${data.loadColour}">
					${data.stateDayLoadEnergy?.toPowerString(true, data.decimalPlacesEnergy)}
				</text>
			</a>
			<text id="daily_load" x="${this.LOAD_X - 5}" y="195"
				    class="st3 right-align"
				    fill="${!data.loadShowDaily ? 'transparent' : `${data.loadColour}`}">
				${localize('common.daily_load')}
			</text>
		`;
	}

	static generateFlowLines(data: DataDto, config: PowerFlowCardConfig) {
		const startX = 264.7;
		const gap = 70;
		const width = this.LOAD_X + 3 - startX - gap;
		const start1 = startX;
		const stop1 = start1 + width / 2;
		const start2 = stop1 + gap;
		const stop2 = start2 + width / 2;

		const line1 = `M ${start1} 218.5 L ${stop1} 218.5`;
		const line2 = `M ${start2} 218.5 L ${stop2} 218.5`;
		return svg`
			 <svg id="load-flow">
				<path id="es-line" d="${line1}" fill="none" stroke="${config.load.dynamic_colour ? data.flowColour : data.loadColour}"
					  stroke-width="${data.loadLineWidth}" stroke-miterlimit="10" pointer-events="stroke"/>
				<circle id="es-dot" cx="0" cy="0"
						r="${Math.min(2 + data.loadLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${data.essentialPower === 0 ? 'transparent' : `${config.load.dynamic_colour ? data.flowColour : data.loadColour}`}">
					<animateMotion dur="${data.durationCur['load']}s" repeatCount="indefinite"
								   keyPoints="0;1"
								   keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#es-line"/>
					</animateMotion>
				</circle>
			</svg>
			<svg id="load-flow1">
				<path id="es-line1" d="${line2}" fill="none" stroke="${config.load.dynamic_colour ? data.flowColour : data.loadColour}"
					  stroke-width="${data.loadLineWidth}" stroke-miterlimit="10" pointer-events="stroke"/>
				<circle id="es-dot" cx="0" cy="0"
						r="${Math.min(2 + data.loadLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${data.essentialPower === 0 ? 'transparent' : `${config.load.dynamic_colour ? data.flowColour : data.loadColour}`}">
					<animateMotion dur="${data.durationCur['load']}s" repeatCount="indefinite"
								   keyPoints="0;1"
								   keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#es-line1"/>
					</animateMotion>
				</circle>
			</svg>
	`;
	}

	static generatePowers(data: DataDto, config: PowerFlowCardConfig) {
		const x = 400 + (this.LOAD_X - 400) / 2 - 30;
		return svg`
			<text id="load-power-L1" x="${x}" y="241"
				  display="${config.inverter.three_phase && config.entities?.load_power_L1 ? '' : 'none'}"
				  class="st3 left-align" fill="${data.loadColour}">
				${config.load.auto_scale ? `${Utils.convertValue(data.loadPowerL1, data.decimalPlaces) || 0}` : `${data.loadPowerL1 || 0} ${UnitOfPower.WATT}`}
			</text>
			<text id="load-power-L2" x="${x}" y="254"
				  display="${config.inverter.three_phase && config.entities?.load_power_L2 ? '' : 'none'}"
				  class="st3 left-align" fill="${data.loadColour}">
				${config.load.auto_scale ? `${Utils.convertValue(data.loadPowerL2, data.decimalPlaces) || 0}` : `${data.loadPowerL2 || 0} ${UnitOfPower.WATT}`}
			</text>
			<text id="load-power-L3" x="${x}" y="267"
				  display="${config.inverter.three_phase && config.entities?.load_power_L3 ? '' : 'none'}"
				  class="st3 left-align" fill="${data.loadColour}">
				${config.load.auto_scale ? `${Utils.convertValue(data.loadPowerL3, data.decimalPlaces) || 0}` : `${data.loadPowerL3 || 0} ${UnitOfPower.WATT}`}
			</text>
		`;
	}

	static generateShapeAndName(data: DataDto, config: PowerFlowCardConfig) {
		const x = 400 + (this.LOAD_X - 400) / 2 - 101.3;

		return svg`
			<rect x="${x}" y="203.5" width="70" height="30" rx="4.5" ry="4.5" fill="none"
				stroke="${data.loadColour}" pointer-events="all"/>
			<text id="ess_load_name" class="st16 left-align" x="${x + 3}" y="208.5" fill="${data.loadColour}">
				${config.load.essential_name}
			</text>
		`;
	}

	static generateTotalLoad(data: DataDto, config: PowerFlowCardConfig) {
		const x = 400 + (this.LOAD_X - 400) / 2 - 65.3;
		return svg`
			${config.entities?.essential_power && config.entities.essential_power !== 'none'
			? svg`
				<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.essential_power)}>
					<text id="ess_power" x="${x}" y="220" class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
						  fill="${data.loadColour}">
						${config.load.auto_scale ? `${Utils.convertValue(data.essentialPower, data.decimalPlaces) || 0}` : `${data.essentialPower || 0} ${UnitOfPower.WATT}`}
					</text>
				</a>`
			: svg`
				<text id="ess_power" x="${x}" y="220" class="${data.largeFont !== true ? 'st14' : 'st4'} st8" 
					  fill="${data.loadColour}">
					${config.load.auto_scale ? `${Utils.convertValue(data.essentialPower, data.decimalPlaces) || 0}` : `${data.essentialPower || 0} ${UnitOfPower.WATT}`}
				</text>`
		}
		`;
	}

	static generateIcon(data: DataDto, config: PowerFlowCardConfig) {

		return svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="essen" x="${data.essIconSize === 1 ? this.LOAD_X + 5 : this.LOAD_X + 2}"
				 y="${data.essIconSize === 1 ? '186' : '177.5'}" width="${data.essIconSize === 1 ? '75' : '79'}"
				 height="${data.essIconSize === 1 ? '75' : '79'}"
				 viewBox="0 0 24 24">
				<defs>
					<linearGradient id="Lg" x1="0%" x2="0%" y1="100%" y2="0%">
						<stop offset="0%"
							stop-color="${data.gridPercentage > 0 ? data.gridColour : (data.batteryPercentage > 0 ? data.batteryColour : data.solarColour)}"/>
						<stop offset="${data.gridPercentage}%"
							stop-color="${data.gridPercentage > 0 ? data.gridColour : (data.batteryPercentage > 0 ? data.batteryColour : data.solarColour)}"/>
						<stop offset="${data.gridPercentage}%"
							stop-color="${data.batteryPercentage > 0 ? data.batteryColour : data.solarColour}"/>
						<stop offset="${(data.gridPercentage + data.batteryPercentage)}%"
							stop-color="${data.batteryPercentage > 0 ? data.batteryColour : data.solarColour}"/>
						<stop offset="${(data.gridPercentage + data.batteryPercentage)}%"
							stop-color="${data.solarColour}"/>
						<stop offset="100%"
							stop-color="${data.solarColour}"/>
					</linearGradient>
				</defs>
				<path fill="${config.load.dynamic_colour ? 'url(#Lg)' : data.loadColour}"
					  d="${data.essIcon}"/>
			</svg>
		`;
	}
}