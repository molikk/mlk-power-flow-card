import { DataDto, PowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { localize } from '../../localize/localize';
import { Utils } from '../../helpers/utils';
import { UnitOfEnergy } from '../../const';

export class Battery {

	static generateShapes(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<rect x="205" y="290" width="70" height="30" rx="4.5" ry="4.5" fill="none"
				  stroke="${data.batteryColour}" pointer-events="all"
				  display="${config.show_battery ? '' : 'none'}"
				  class=""/>
		`;
	}

	static generateDuration(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<text id="duration" x="${data.compactMode ? '270' : '290'}" y="377.5"
				  class="${data.largeFont !== true ? 'st14' : 'st4'} left-align"
				  display="${!config.show_battery ? 'none' : ''}"
				  fill="${data.batteryEnergy === 0 || data.isFloating || data.batteryPower === 0 ? 'transparent' : `${data.batteryColour}`}">
				${data.batteryDuration}
			</text>
			<text id="duration_text" x="${data.compactMode ? '270' : '290'}" y="393.7" class="st3 left-align"
				  display="${!config.show_battery ? 'none' : ''}"
				  fill="${data.batteryEnergy === 0 || data.batteryPower <= 0 || data.isFloating ? 'transparent' : `${data.batteryColour}`}">
				${localize('common.runtime_to')} ${data.batteryCapacity}% @${data.formattedResultTime}
			</text>
			<text id="duration_text_charging" x="${data.compactMode ? '270' : '290'}" y="393.7"
				  class="st3 left-align"
				  display="${!config.show_battery ? 'none' : ''}"
				  fill="${data.batteryEnergy === 0 || data.batteryPower >= 0 || data.isFloating ? 'transparent' : `${data.batteryColour}`}">
				${localize('common.to')} ${data.batteryCapacity}% @${data.formattedResultTime}
			</text>
			<text id="floating" x="${data.compactMode ? '270' : '290'}" y="393.7" class="st3 left-align"
				  display="${!config.show_battery ? 'none' : ''}"
				  fill="${data.batteryEnergy === 0 || !data.isFloating ? 'transparent' : `${data.batteryColour}`}">
				${localize('common.battery_floating')}
			</text>		
		`;
	}

	static generateDailyCharge(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<text id="daily_bat_charge" x="${data.compactMode ? '132' : '77.2'}" y="357.2"
				  class="st3 left-align"
				  fill="${data.batteryShowDaily !== true || !config.show_battery ? 'transparent' : `${data.batteryColour}`}">
				${localize('common.daily_charge')}
			</text>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.day_battery_charge_70)}>
				<text id="daily_bat_charge_value" x="${data.compactMode ? '132' : '77.2'}" y="343"
					  class="st10 left-align"
					  display="${data.batteryShowDaily !== true || !config.show_battery || !data.stateDayBatteryCharge.isValid() ? 'none' : ''}"
					  fill="${data.batteryColour}">
					${data.stateDayBatteryCharge?.toPowerString(true, data.decimalPlacesEnergy)}
				</text>
			</a>
		`;
	}

	static generateDailyDischarge(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<text id="daily_bat_dischcharge" x="${data.compactMode ? '132' : '77.2'}" y="393.7"
				  class="st3 left-align"
				  fill="${data.batteryShowDaily !== true || !config.show_battery ? 'transparent' : `${data.batteryColour}`}">
				${localize('common.daily_discharge')}
			</text>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.day_battery_discharge_71)}>
				<text id="daily_bat_discharge_value" x="${data.compactMode ? '132' : '77.2'}" y="380.1"
					  class="st10 left-align"
					  display="${data.batteryShowDaily !== true || !config.show_battery || !data.stateDayBatteryDischarge.isValid() ? 'none' : ''}"
					  fill="${data.batteryColour}">
					${data.stateDayBatteryDischarge?.toPowerString(true, data.decimalPlacesEnergy)}
				</text>
			</a>
		`;
	}

	static generateFlowLines(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
 			<svg id="battery-flow">
				<path id="bat-line"
					  d="${data.compactMode ? 'M 239 250 L 239 290' : 'M 239 250 L 239 324'}"
					  class="${!config.show_battery ? 'st12' : ''}" fill="none"
					  stroke="${config.battery.dynamic_colour ? data.flowBatColour : data.batteryColour}" stroke-width="${data.batLineWidth}" stroke-miterlimit="10"
					  pointer-events="stroke"/>
				<circle id="power-dot-discharge" cx="0" cy="0"
						r="${Math.min(2 + data.batLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						class="${!config.show_battery ? 'st12' : ''}"
						fill="${data.batteryPower < 0 || data.batteryPower === 0 ? 'transparent' : `${data.batteryColour}`}">
					<animateMotion dur="${data.durationCur['battery']}s" repeatCount="indefinite"
								   keyPoints="1;0" keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#bat-line"/>
					</animateMotion>
				</circle>
				<circle id="power-dot-charge" cx="0" cy="0"
						r="${Math.min(2 + data.batLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						class="${!config.show_battery ? 'st12' : ''}"
						fill="${data.batteryPower > 0 || data.batteryPower === 0 ? 'transparent' : `${config.battery.dynamic_colour ? data.flowBatColour : data.batteryColour}`}">
					<animateMotion dur="${data.durationCur['battery']}s" repeatCount="indefinite"
								   keyPoints="0;1" keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#bat-line"/>
					</animateMotion>
				</circle>
			</svg>`;
	}

	static generateState(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<text x="169" y="${!config.battery.show_remaining_energy ? '320' : '311'}" class="st3 left-align"
				  display="${!config.show_battery || data.compactMode ? 'none' : ''}"
				  fill="${data.batteryColour}">
				${data.batteryStateMsg}
			</text>`;
	}

	static generateCapacity(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<text x="${data.compactMode ? '270' : !config.entities?.battery_status ? '193' : '169'}"
				  y="${data.compactMode ? '338' : '323'}"
				  class="${!config.entities?.battery_status && !data.compactMode ? 'st3' : 'st3 left-align'}"
				  display="${!config.show_battery || !config.battery.show_remaining_energy ? 'none' : ''}"
				  fill="${data.batteryColour}">
				${Utils.toNum((data.batteryEnergy * (data.stateBatterySoc.toNum(2) / 100) / 1000), 2)}
				${UnitOfEnergy.KILO_WATT_HOUR}
			</text>`;
	}

	static generateShutdownSOC(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<text id="battery_soc_184" x="${data.compactMode ? '343' : '363'}" y="351"
				  fill=${data.batteryColour}
				  class="${config.battery.hide_soc || !config.show_battery ? 'st12' : 'st14 left-align'}"
				  display="${!data.inverterProg.show && config.battery?.shutdown_soc_offgrid ? '' : 'none'}">
				${data.batteryShutdown}%
			</text>
			<text id="battery_soc_184" x="${data.compactMode ? '343' : '363'}" y="364"
				  fill=${data.batteryColour}
				  class="${config.battery.hide_soc || !config.show_battery ? 'st12' : 'st14 left-align'}"
				  display="${!data.inverterProg.show && config.battery?.shutdown_soc_offgrid ? '' : 'none'}">
				${data.shutdownOffGrid}%
			</text>`;
	}

	static generateBatteryGradient(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="bat" x="${data.compactMode ? '212.5' : '232.5'}"
				 y="325.5" width="78.75"
				 height="78.75" preserveAspectRatio="none"
				 viewBox="0 0 24 24">
				<defs>
					<linearGradient id="bLg" x1="0%" x2="0%" y1="100%" y2="0%">
						<stop offset="0%"
							  stop-color="${data.gridPercentageBat > 0 ? data.gridColour : data.pvPercentageBat > 0 ? data.solarColour : data.batteryColour}"/>
						<stop offset="${data.gridPercentageBat < 2 ? 0 : data.gridPercentageBat}%"
							  stop-color="${data.gridPercentageBat > 0 ? data.gridColour : data.pvPercentageBat > 0 ? data.solarColour : data.batteryColour}"/>
						<stop offset="${data.gridPercentageBat < 2 ? 0 : data.gridPercentageBat}%"
							  stop-color="${data.pvPercentageBat > 0 ? data.solarColour : data.batteryColour}"/>
						<stop offset="${(data.gridPercentageBat < 2 ? 0 : data.gridPercentageBat) + (data.pvPercentageBat < 2 ? 0 : data.pvPercentageBat)}%"
							  stop-color="${data.pvPercentageBat > 0 ? data.solarColour : data.batteryColour}"/>
						<stop offset="${(data.gridPercentageBat < 2 ? 0 : data.gridPercentageBat) + (data.pvPercentageBat < 2 ? 0 : data.pvPercentageBat)}%"
							  stop-color="${data.batteryColour}"/>
						<stop offset="100%"
							  stop-color="${data.batteryColour}"/>
					</linearGradient>
				</defs>
				<path class="${!config.show_battery ? 'st12' : ''}"
					  fill="${config.battery.dynamic_colour ? 'url(#bLg)' : data.batteryColour}"
					  d="${config.battery.linear_gradient ? data.battery0 : data.batteryIcon}"/>
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" id="bat" x="${data.compactMode ? '212.5' : '232.5'}"
				 y="325.5" width="78.75"
				 height="78.75" preserveAspectRatio="none"
				 viewBox="0 0 24 24">
				<defs>
					<linearGradient id="sLg" x1="0%" x2="0%" y1="100%" y2="0%">
						<stop offset="0%"
							  stop-color="red"/>
						<stop offset="100%"
							  stop-color="${data.stopColour}"/>
						<animate attributeName="${config.battery.animate ? 'y2' : 'none'}" dur="6s" values="100%; 0%" repeatCount="indefinite" />
					</linearGradient>
				</defs>
				<path class="${!config.show_battery ? 'st12' : ''}"
					  fill="${config.battery.linear_gradient ? 'url(#sLg)' : data.batteryColour}"
					  display="${!config.battery.linear_gradient ? 'none' : ''}"
					  d="${data.batteryCharge}"/>
			</svg>		
		`;
	}
}