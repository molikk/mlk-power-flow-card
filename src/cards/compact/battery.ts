import { DataDto, PowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { localize } from '../../localize/localize';
import { Utils } from '../../helpers/utils';
import { UnitOfElectricalCurrent, UnitOfElectricPotential, UnitOfEnergy, UnitOfPower } from '../../const';

export class Battery {

	static generateShapes(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<rect x="205" y="290" width="70" height="30" rx="4.5" ry="4.5" fill="none"
				  stroke="${data.batteryColour}" pointer-events="all"
				  display="${config.show_battery ? '' : 'none'}"
				  class=""/>
		`;
	}

	static generatePower(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
				<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_power_190)}>
            <text id="data.batteryPower_190" x="239"
                  y="307"
                  display="${config.entities.battery_power_190 === 'none' ? 'none' : ''}"
                  fill=${data.batteryColour} class="${data.largeFont !== true ? 'st14' : 'st4'} st8">
                ${config.battery.auto_scale
			? `${config.battery.show_absolute
				? Utils.convertValueNew(Math.abs(data.stateBatteryPower.toNum(data.decimalPlaces)), data.stateBatteryPower.getUOM(), data.decimalPlaces)
				: Utils.convertValueNew(data.stateBatteryPower.toNum(data.decimalPlaces), data.stateBatteryPower.getUOM(), data.decimalPlaces) || '0'}`
			: `${data.stateBatteryPower.toStr(config.decimal_places, config.battery?.invert_power, config.battery.show_absolute)} ${UnitOfPower.WATT}`
		}
            </text>
        </a>
		`;
	}

	static generateCircle(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
				<circle id="bat" cx="238.5"
                cy="326" r="3.5"
                display="${config.entities?.battery_status === 'none' || !config.entities?.battery_status ? 'none' : ''}"
                fill="${data.batteryStateColour}"/>`;
	}

	static generateVoltage(data: DataDto) {
		return svg`
				<a href="#" @click=${(e) => Utils.handlePopup(e, data.stateBatteryVoltage.entity_id)}>
            <text id="battery_voltage_183" x="281" y="299"
                  display="${data.stateBatteryVoltage.isValid() ? '' : 'none'}"
                  fill=${data.batteryColour} class="st3 left-align">
                ${data.stateBatteryVoltage.toStr(data.decimalPlaces)} ${UnitOfElectricPotential.VOLT}
            </text>
        </a>
		`;
	}

	static generateCurrent(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
				<a href="#" @click=${(e) => Utils.handlePopup(e, data.stateBatteryCurrent.entity_id)}>
            <text id="battery_current_191" x="281" y="312"
                  display="${data.stateBatteryCurrent.isValid() ? '' : 'none'}"
                  fill=${data.batteryColour} class="st3 left-align">
                ${data.stateBatteryCurrent.toStr(data.decimalPlaces, false, config.battery.show_absolute)} ${UnitOfElectricalCurrent.AMPERE}
            </text>
        </a>       
		`;
	}

	static generateTemp(data: DataDto) {
		return svg`
				<a href="#" @click=${(e) => Utils.handlePopup(e, data.stateBatteryTemp.entity_id)}>
                <text id="battery_temp_182" x="205"
                      y="332"
                      class="st3 left-align"
                      fill="${data.batteryColour}"
                      display="${data.stateBatteryTemp.isValid() ? '' : 'none'}">
                    ${data.stateBatteryTemp.toNum(1)}°
                </text>
            </a>
                    
		`;
	}

	static generateDuration(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<text id="duration" x="270" y="377.5"
				  class="${data.largeFont !== true ? 'st14' : 'st4'} left-align"
				  display="${!config.show_battery ? 'none' : ''}"
				  fill="${data.batteryEnergy === 0 || data.isFloating || data.stateBatteryPower.toNum(0) === 0 ? 'transparent' : `${data.batteryColour}`}">
				${data.batteryDuration}
			</text>
			<text id="duration_text" x="270" y="393.7" class="st3 left-align"
				  display="${!config.show_battery ? 'none' : ''}"
				  fill="${data.batteryEnergy === 0 || data.stateBatteryPower.toNum(0) <= 0 || data.isFloating ? 'transparent' : `${data.batteryColour}`}">
				${localize('common.runtime_to')} ${data.batteryCapacity}% @${data.formattedResultTime}
			</text>
			<text id="duration_text_charging" x="270" y="393.7"
				  class="st3 left-align"
				  display="${!config.show_battery ? 'none' : ''}"
				  fill="${data.batteryEnergy === 0 || data.stateBatteryPower.toNum(0) >= 0 || data.isFloating ? 'transparent' : `${data.batteryColour}`}">
				${localize('common.to')} ${data.batteryCapacity}% @${data.formattedResultTime}
			</text>
			<text id="floating" x="$270" y="393.7" class="st3 left-align"
				  display="${!config.show_battery ? 'none' : ''}"
				  fill="${data.batteryEnergy === 0 || !data.isFloating ? 'transparent' : `${data.batteryColour}`}">
				${localize('common.battery_floating')}
			</text>		
		`;
	}

	static generateDailyCharge(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<text id="daily_bat_charge" x="132" y="357.2"
				  class="st3 left-align"
				  fill="${data.batteryShowDaily !== true || !config.show_battery ? 'transparent' : `${data.batteryColour}`}">
				${localize('common.daily_charge')}
			</text>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.day_battery_charge_70)}>
				<text id="daily_bat_charge_value" x="132" y="343"
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
			<text id="daily_bat_dischcharge" x="132" y="393.7"
				  class="st3 left-align"
				  fill="${data.batteryShowDaily !== true || !config.show_battery ? 'transparent' : `${data.batteryColour}`}">
				${localize('common.daily_discharge')}
			</text>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.day_battery_discharge_71)}>
				<text id="daily_bat_discharge_value" x="132" y="380.1"
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
					  d="M 239 250 L 239 290"
					  class="${!config.show_battery ? 'st12' : ''}" fill="none"
					  stroke="${config.battery.dynamic_colour ? data.flowBatColour : data.batteryColour}" stroke-width="${data.batLineWidth}" stroke-miterlimit="10"
					  pointer-events="stroke"/>
				<circle id="power-dot-discharge" cx="0" cy="0"
						r="${Math.min(2 + data.batLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						class="${!config.show_battery ? 'st12' : ''}"
						fill="${data.stateBatteryPower.toNum(0) <= 0 ? 'transparent' : `${data.batteryColour}`}">
					<animateMotion dur="${data.durationCur['battery']}s" repeatCount="indefinite"
								   keyPoints="1;0" keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#bat-line"/>
					</animateMotion>
				</circle>
				<circle id="power-dot-charge" cx="0" cy="0"
						r="${Math.min(2 + data.batLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						class="${!config.show_battery ? 'st12' : ''}"
						fill="${data.stateBatteryPower.toNum(0) >= 0 ? 'transparent' : `${config.battery.dynamic_colour ? data.flowBatColour : data.batteryColour}`}">
					<animateMotion dur="${data.durationCur['battery']}s" repeatCount="indefinite"
								   keyPoints="0;1" keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#bat-line"/>
					</animateMotion>
				</circle>
			</svg>`;
	}


	static generateSOC(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
				<a href="#" @click=${(e) => Utils.handlePopup(e, data.stateBatterySoc.entity_id)}>
	          <text id="battery_soc_184" x="270" y="358"
	                display="${data.stateBatterySoc.isValid() ? '' : 'none'}"
	                fill=${data.batteryColour} 
	                class="${config.battery.hide_soc ? 'st12' : 'st13 st8 left-align'}" >
	              ${data.stateBatterySoc.toStr(data.stateBatterySoc.toNum(0) === 100 ? 0 : 1)}%
	          </text>
	      </a>
		    <text id="battery_soc_184" x="331" y="358"
              fill=${data.batteryColour}
              class="${config.battery.hide_soc? 'st12' : 'st13 st8 left-align'}"
              display="${!data.inverterProg.show && config.battery.shutdown_soc_offgrid ? '' : 'none'}">
            |
        </text>`;
	}

	static generateSOH(data: DataDto) {
		return svg`
				<a href="#" @click=${(e) => Utils.handlePopup(e, data.stateBatterySOH.entity_id)}>
              <text id="battery_soh" x="205"
                    y="332"
                    class="${data.stateBatterySOH.isValid() ? 'st3 left-align' : 'st12'}"
                    fill="${data.batteryColour}"
                    display="${!data.stateBatterySOH.isValid() || data.stateBatteryTemp.isValid() ? 'none' : ''}">
                  ${data.stateBatterySOH.toNum(0)}%
              </text>
          </a>`;
	}


	static generateCapacity(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<text x="270" y="338" class="st3 left-align"
				  display="${!config.show_battery || !config.battery.show_remaining_energy ? 'none' : ''}"
				  fill="${data.batteryColour}">
				${Utils.toNum((data.batteryEnergy * (data.stateBatterySoc.toNum(2) / 100) / 1000), 2)}
				${UnitOfEnergy.KILO_WATT_HOUR}
			</text>`;
	}

	static generateShutdownSOC(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<text id="battery_soc_184" x="343" y="351"
				  fill=${data.batteryColour}
				  class="${config.battery.hide_soc || !config.show_battery ? 'st12' : 'st14 left-align'}"
				  display="${!data.inverterProg.show && config.battery?.shutdown_soc_offgrid ? '' : 'none'}">
				${data.batteryShutdown}%
			</text>
			<text id="battery_soc_184" x="343" y="364"
				  fill=${data.batteryColour}
				  class="${config.battery.hide_soc || !config.show_battery ? 'st12' : 'st14 left-align'}"
				  display="${!data.inverterProg.show && config.battery?.shutdown_soc_offgrid ? '' : 'none'}">
				${data.shutdownOffGrid}%
			</text>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_soc_184)}>
          <text id="battery_soc_184" x="330" y="358"
                fill=${data.batteryColour}
                class="st13 st8 left-align"
                display="${!data.inverterProg.show || config.entities.battery_soc_184 === 'none' || config.battery.hide_soc ? 'none' : ''}">
              | ${data.inverterProg.capacity || 0}%
          </text>
      </a>
      <a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.battery_soc_184)}>
          <text id="battery_soc_184" x="330" y="358"
                fill=${data.batteryColour}
                class="${config.battery.hide_soc  ? 'st12' : 'st13 st8 left-align'}"
                display="${!data.inverterProg.show && config.battery?.shutdown_soc && !config.battery?.shutdown_soc_offgrid ? '' : 'none'}">
              | ${data.batteryShutdown || 0}%
          </text>
      </a>`;
	}

	static generateBatteryGradient(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="bat" x="212.5"
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
			<svg xmlns="http://www.w3.org/2000/svg" id="bat" x="212.5"
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