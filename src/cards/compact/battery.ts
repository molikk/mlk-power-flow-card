import { BatteryBanksViewMode, DataDto, PowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { localize } from '../../localize/localize';
import { Utils } from '../../helpers/utils';
import { UnitOfElectricalCurrent, UnitOfElectricPotential, UnitOfEnergy, UnitOfPower } from '../../const';
import { CustomEntity } from '../../inverters/dto/custom-entity';
import { renderCircle } from '../../helpers/circle';
import { BatteryUtils } from './batteryUtils';

export class Battery {

	static batteryColour(data: DataDto, config: PowerFlowCardConfig) {
		return config.battery.dynamic_colour ? data.flowBatColour : data.batteryColour;
	}

	static generateShapes(data: DataDto, config: PowerFlowCardConfig) {
		const y = Battery.showOuterBatteryBanks(config) ? 285 : 290;
		return svg`
			<rect x="205" y="${y}" width="70" height="30" rx="4.5" ry="4.5" fill="none"
				  stroke="${Battery.batteryColour(data, config)}" pointer-events="all"
				  class=""/>
		`;
	}

	static generatePower(data: DataDto, config: PowerFlowCardConfig) {
		const y = Battery.showOuterBatteryBanks(config) ? 302 : 307;
		const power = BatteryUtils.getBatteryPowerValue(
			config.battery.use_battery_banks_values,
			data.batteryBankPowerState,
			config.battery.battery_banks,
			config.battery.invert_power,
		);
		const value = config.battery.auto_scale
			? `${config.battery.show_absolute
				? Utils.convertValueNew(Math.abs(power), UnitOfPower.WATT, data.decimalPlaces)
				: Utils.convertValueNew(power, UnitOfPower.WATT, data.decimalPlaces) || '0'}`
			: `${Utils.toStr(power, config.decimal_places, config.battery?.invert_power, config.battery.show_absolute)} ${UnitOfPower.WATT}`
			;

		const text = svg`
			<text id="batteryPower_190" x="239"
                  y="${y}"
                  display="${BatteryUtils.isPowerValid(data, config) ? '' : 'none'}"
                  fill=${Battery.batteryColour(data, config)} class="${data.largeFont !== true ? 'st14' : 'st4'} st8">
                ${value}
            </text>`;


		return config.battery.use_battery_banks_values ? text : svg`
		<a href="#" @click=${(e: Event) => Utils.handlePopup(e, config.entities.battery_power_190)}>
            ${text}
        </a>
		`;
	}

	static showInnerBatteryBanks(config: PowerFlowCardConfig) {
		return config.battery.show_battery_banks && config.battery.battery_banks_view_mode == BatteryBanksViewMode.inner;
	}

	static showOuterBatteryBanks(config: PowerFlowCardConfig) {
		return config.battery.show_battery_banks && config.battery.battery_banks_view_mode == BatteryBanksViewMode.outer;
	}

	static generateVoltage(data: DataDto, config: PowerFlowCardConfig) {
		const x = Battery.showInnerBatteryBanks(config) ? 202 : 281;
		const y = Battery.showOuterBatteryBanks(config) ? 294 : 299;
		const voltage = BatteryUtils.getBatteryVoltageValue(
			config.battery.use_battery_banks_values,
			data.stateBatteryVoltage,
			config.battery.battery_banks,
			data.batteryBankVoltageState,
			config.decimal_places);

		const text = svg`
			<text id="battery_voltage_183" x="${x}" y="${y}"
                  display="${BatteryUtils.isVoltageValid(data, config) ? '' : 'none'}"
                  fill=${data.batteryColour} class="st3 ${Battery.showInnerBatteryBanks(config) ? 'right-align' : 'left-align'}">
                ${Utils.toStr(voltage, data.decimalPlaces)} ${UnitOfElectricPotential.VOLT}
            </text>
		`;

		return config.battery.use_battery_banks_values ? text : svg`
		<a href="#" @click=${(e: Event) => Utils.handlePopup(e, data.stateBatteryVoltage.entity_id)}>
        	${text}
        </a>
		`;
	}

	static generateCurrent(data: DataDto, config: PowerFlowCardConfig) {
		const x = Battery.showInnerBatteryBanks(config) ? 202 : 281;
		const y = Battery.showOuterBatteryBanks(config) ? 307 : 312;
		const align = Battery.showInnerBatteryBanks(config) ? 'right-align' : 'left-align';
		const current = BatteryUtils.getBatteryCurrentValue(
			config.battery.use_battery_banks_values,
			data.stateBatteryCurrent,
			config.battery.battery_banks,
			data.batteryBankCurrentState,
			config.decimal_places,
		);

		const text = svg`
			<text id="battery_current_191" x="${x}" y="${y}"
                  display="${BatteryUtils.isCurrentValid(data, config) ? '' : 'none'}"
                  fill=${data.batteryColour} class="st3 ${align}">
                ${Utils.toStr(current, data.decimalPlaces, false, config.battery.show_absolute)} ${UnitOfElectricalCurrent.AMPERE}
            </text>  
		`;

		return config.battery.use_battery_banks_values ? text : svg`
		<a href="#" @click=${(e: Event) => Utils.handlePopup(e, data.stateBatteryCurrent.entity_id)}>
            {text}
        </a>       
		`;
	}

	static generateTemp(data: DataDto, config: PowerFlowCardConfig) {
		const x = Battery.showOuterBatteryBanks(config) ? 322 : 227;
		const y = Battery.showOuterBatteryBanks(config) ? 294 : 334;
		const align = Battery.showOuterBatteryBanks(config) ? 'left-align' : 'right-align';
		const temperature = BatteryUtils.getBatteryTemperatureValue(
			config.battery.use_battery_banks_values,
			data.stateBatteryTemp,
			config.battery.battery_banks,
			data.batteryBankTempState,
			config.decimal_places,
		);

		const text = svg`
			<text id="battery_temp_182" x="${x}" y="${y}"
					display="${BatteryUtils.isTemperatureValid(data, config) ? '' : 'none'}"
					fill="${data.batteryColour}" class="st3 ${align}" >
				${Utils.toStr(temperature, data.decimalPlaces)}${data.stateBatteryTemp.getUOM()}
			</text>
		`;
		return config.battery.use_battery_banks_values ? text : svg`
		<a href="#" @click=${(e: Event) => Utils.handlePopup(e, data.stateBatteryTemp.entity_id)}>
		   ${text}
		</a>         
		`;
	}

	static generateDuration(data: DataDto, config: PowerFlowCardConfig) {
		const power = BatteryUtils.getBatteryPowerValue(
			config.battery.use_battery_banks_values,
			data.batteryBankPowerState,
			config.battery.battery_banks,
			config.battery.invert_power,
		);
		const current = BatteryUtils.getBatteryCurrentValue(
			config.battery.use_battery_banks_values,
			data.stateBatteryCurrent,
			config.battery.battery_banks,
			data.batteryBankCurrentState,
			config.decimal_places,
		);

		const y = Battery.showOuterBatteryBanks(config) ? 377.5 : 393.5;
		const isCharging = config.battery.invert_flow ? power >= 0 : power <= 0;
		const isFloating = Battery.isFloating2(current);
		const formattedResult = config.battery?.runtime_in_kwh ? data.formattedResultCapacity : data.formattedResultTime;

		let text = svg``;
		let link = svg``;
		let isVisible = true;
		switch (true) {
			case data.batteryEnergy === 0:
				isVisible = false;
				break;
			case !isCharging && !isFloating:
				text = svg`${localize('common.run')} ${data.batteryCapacity}%`;
				link = svg`@${formattedResult}`;
				break;
			case isCharging && !isFloating:
				text = svg`${localize('common.charge')} ${data.batteryCapacity}%`;
				link = svg`@${formattedResult}`;
				break;
			case isFloating:
				text = svg`${localize('common.battery_floating')}`;
				break;
			default:
				isVisible = false;
		}

		return isVisible ? svg`
			<text id="duration" x="270" y="${y - 16}" class="${data.largeFont !== true ? 'st14' : 'st4'} left-align"
		  			fill="${!isFloating && data.batteryPower !== 0 ? `${data.batteryColour}` : 'transparent'}">
				${data.batteryDuration}
			</text>
			<text id="duration_text" x="270" y="${y}" class="st3 left-align" fill="${data.batteryColour}">
				${text}
				<tspan id="duration_link" class="st3 left-align" fill="${data.batteryColour}">
				 	<a href="#" @click=${() => Battery.handleCapacityClick(config, config.battery?.runtime_in_kwh)} fill="${data.batteryColour}">
						${link}
					</a>
				</tspan>
			</text>
		` : svg``;
	}

	static handleCapacityClick(config, state: boolean) {
		config.battery.runtime_in_kwh = !state;
	}

	static generateDailyCharge(data: DataDto, config: PowerFlowCardConfig) {
		const x = Battery.showOuterBatteryBanks(config) ? 142 : 132;
		const y = Battery.showOuterBatteryBanks(config) ? 333 : 343;
		return svg`
			<text id="daily_bat_charge" x="${x}" y="${y + 13}" class="st3 left-align"
				  fill="${data.batteryShowDaily !== true ? 'transparent' : `${data.batteryColour}`}">
				${localize('common.daily_charge')}
			</text>
			<a href="#" @click=${(e: Event) => Utils.handlePopup(e, config.entities.day_battery_charge_70)}>
				<text id="daily_bat_charge_value" x="${x}" y="${y}" class="st10 left-align"
					  display="${data.batteryShowDaily !== true || !data.stateDayBatteryCharge.isValid() ? 'none' : ''}"
					  fill="${data.batteryColour}">
					${data.stateDayBatteryCharge?.toPowerString(true, data.decimalPlacesEnergy)}
				</text>
			</a>
		`;
	}

	static generateDailyDischarge(data: DataDto, config: PowerFlowCardConfig) {
		const x = Battery.showOuterBatteryBanks(config) ? 142 : 132;
		const y = Battery.showOuterBatteryBanks(config) ? 365 : 380;
		return svg`
			<text id="daily_bat_dischcharge" x="${x}" y="${y + 13}"
				  class="st3 left-align"
				  fill="${data.batteryShowDaily !== true ? 'transparent' : `${data.batteryColour}`}">
				${localize('common.daily_discharge')}
			</text>
			<a href="#" @click=${(e: Event) => Utils.handlePopup(e, config.entities.day_battery_discharge_71)}>
				<text id="daily_bat_discharge_value" x="${x}" y="${y}"
					  class="st10 left-align"
					  display="${data.batteryShowDaily !== true || !data.stateDayBatteryDischarge.isValid() ? 'none' : ''}"
					  fill="${data.batteryColour}">
					${data.stateDayBatteryDischarge?.toPowerString(true, data.decimalPlacesEnergy)}
				</text>
			</a>
		`;
	}

	static generateFlowLines(data: DataDto, config: PowerFlowCardConfig) {
		const y = Battery.showOuterBatteryBanks(config) ? 285 : 290;

		const circle = renderCircle(
			data.batteryPower != 0 && config.low_resources.animations,
			'bat-power-dot',
			data.batLineWidth,
			data.minLineWidth,
			Battery.batteryColour(data, config),
			data.durationCur['battery'],
			data.batteryPower > 0 ? '1;0' : '0;1',
			config.battery.invert_flow,
			'#bat-line',
		);

		return svg`
 			<svg id="battery-flow" style="overflow: visible">
				<path id="bat-line"
					  d="M 239 250 L 239 ${y}" fill="none"
					  stroke="${Battery.batteryColour(data, config)}" stroke-width="${data.batLineWidth}" stroke-miterlimit="10"
					  pointer-events="stroke"/>
				${circle}
			</svg>`;
	}

	static generateSOH(data: DataDto) {
		return svg`
			<a href="#" @click=${(e: Event) => Utils.handlePopup(e, data.stateBatterySOH.entity_id)}>
              	<text id="battery_soh" x="205" y="332" fill="${data.batteryColour}"
                    class="${data.stateBatterySOH.isValid() ? 'st3 left-align' : 'st12'}"
                    display="${!data.stateBatterySOH.isValid() || data.stateBatteryTemp.isValid() ? 'none' : ''}">
                 		${data.stateBatterySOH.toNum(0)}%
              	</text>
          	</a>`;
	}

	static generateCapacity(data: DataDto, config: PowerFlowCardConfig) {
		const x = Battery.showInnerBatteryBanks(config) ? 202 : (Battery.showOuterBatteryBanks(config) ? 322 : 270);
		const y = Battery.showInnerBatteryBanks(config) ? 325 : (Battery.showOuterBatteryBanks(config) ? 307 : 338);
		const align = Battery.showInnerBatteryBanks(config) ? 'right-align' : 'left-align';

		if (data.stateBatteryRemainingStorage?.isValid()) {
			return svg`
				<a href="#" @click=${(e: Event) => Utils.handlePopup(e, data.stateBatteryRemainingStorage.entity_id)}>
					<text id="battery_remainig_storage" x="${x}" y="${y}"
						class="st3 ${align}"
						  display="${!config.battery.show_remaining_energy ? 'none' : ''}"
						  fill="${data.batteryColour}">
						${data.stateBatteryRemainingStorage.toStr(2, false, true)} ${data.stateBatteryRemainingStorage.getUOM()}
					</text>
				</a>`;
		}

		const shutdown = config.battery.shutdown_soc_offgrid || config.battery.shutdown_soc || 0;
		const storage = config.battery.remaining_energy_to_shutdown
			? Utils.toNum((data.batteryEnergy * ((data.batterySocValue - shutdown) / 100) / 1000), 2).toFixed(2)
			: Utils.toNum((data.batteryEnergy * (data.batterySocValue / 100) / 1000), 2).toFixed(2);

		return svg`
			<text id="battery_remainig_storage_calc" x="${x}" y="${y}" class="st3 ${align}"
				  display="${!config.battery.show_remaining_energy ? 'none' : ''}"
				  fill="${data.batteryColour}">
				${storage}
				${UnitOfEnergy.KILO_WATT_HOUR}
			</text>`;
	}

	static generateSOC(data: DataDto, config: PowerFlowCardConfig) {
		const y = Battery.showOuterBatteryBanks(config) ? 335 : 351;

		const soc = BatteryUtils.getBatterySocValue(
			config.battery.use_battery_banks_values,
			data.stateBatterySoc,
			config.battery.battery_banks,
			data.batteryBankSocState
		);

		const text = svg`
			<text id="battery_soc_184" x="270" y="${y + 7}" fill=${data.batteryColour} 
				class="${config.battery.hide_soc ? 'st12' : 'st13 st8 left-align'}">
			  ${Utils.toStr(soc, soc === 100.0 ? 0 : 1)}%
			</text>`;

		return config.battery?.use_battery_banks_values ? text
			: svg`
			<a href="#" @click=${(e: Event) => Utils.handlePopup(e, data.stateBatterySoc.entity_id)}>
          		${text}
	      	</a>`;
	}

	static generateSOCinProg(data: DataDto, config: PowerFlowCardConfig) {
		if (config.battery.hide_soc_shutdown) {
			return svg``;
		}

		const y = Battery.showOuterBatteryBanks(config) ? 335 : 351;

		return data.inverterProg.show ? svg`
			<text id="battery_prog_soc_184_capacity" x="330" y="${y + 7}" fill=${data.batteryColour}
					class="st13 st8 left-align"
					display="${config.entities.battery_soc_184 === 'none' || config.battery.hide_soc ? 'none' : ''}">
				| ${data.inverterProg.capacity || 0}%
			</text>`
			: svg`
			<text id="battery_prog_soc_184_soc_shutdown" x="330" y="${y + 7}" fill=${data.batteryColour}
					class="${config.battery.hide_soc ? 'st12' : 'st13 st8 left-align'}"
					display="${config.battery?.shutdown_soc && !config.battery?.shutdown_soc_offgrid ? '' : 'none'}">
				| ${data.batteryShutdown || 0}%
			</text>
			<text id="battery_prog_soc_184_line" x="331" y="${y + 7}" fill=${data.batteryColour}
              		class="${config.battery.hide_soc ? 'st12' : 'st13 st8 left-align'}"
              		display="${config.battery.shutdown_soc_offgrid ? '' : 'none'}" >
                |
        	</text>
		    <text id="battery_prog_soc_184_shutdown" x="343" y="${y}" fill=${data.batteryColour}
		  			class="${config.battery.hide_soc ? 'st12' : 'st14 left-align'}"
				  	display="${config.battery?.shutdown_soc_offgrid ? '' : 'none'}">
				${data.batteryShutdown}%
			</text>
			<text id="battery_prog_soc_184_offgrid" x="343" y="${y + 13}" fill=${data.batteryColour}
		  			class="${config.battery.hide_soc ? 'st12' : 'st14 left-align'}"
				  	display="${config.battery?.shutdown_soc_offgrid ? '' : 'none'}">
				${data.shutdownOffGrid}%
			</text>`
			;
	}

	static generateBatteryGradient(data: DataDto, config: PowerFlowCardConfig) {
		const y = Battery.showOuterBatteryBanks(config) ? 312.5 : 325.5;
		const bat = svg`
			<svg xmlns="http://www.w3.org/2000/svg" id="bat-frame" x="212.5"
				 y="${y}" width="78.75"
				 height="78.75" preserveAspectRatio="none"
				 viewBox="0 0 24 24" >
				<defs>
					<linearGradient id="bLg-${data.timestamp_id}" x1="0%" x2="0%" y1="100%" y2="0%">
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
				<path fill="${config.battery.dynamic_colour ? `url(#bLg-${data.timestamp_id})` : data.batteryColour}"
					  d="${config.battery.linear_gradient ? data.battery0 : data.batteryIcon}"/>
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" id="bat-gradient" x="212.5"
				 y="${y}" width="78.75"
				 height="78.75" preserveAspectRatio="none"
				 viewBox="0 0 24 24">
				<defs>
					<linearGradient id="solar-gradient-${data.timestamp_id}" x1="0%" x2="0%" y1="100%" y2="0%">
						<stop offset="0%"
							  stop-color="red"/>
						<stop offset="100%"
							  stop-color="${data.stopColour}"/>
						<animate attributeName="${config.battery.animate ? 'y2' : 'none'}" dur="6s" values="100%; 0%" repeatCount="indefinite" />
					</linearGradient>
				</defs>
				<path fill="${config.battery.linear_gradient ? `url(#solar-gradient-${data.timestamp_id})` : data.batteryColour}"
					  display="${!config.battery.linear_gradient ? 'none' : ''}"
					  d="${data.batteryCharge}"/>
			</svg>		
		`;
		return config.battery.navigate ?
			svg` <a href="#" @click=${(e: Event) => Utils.handleNavigation(e, config.battery.navigate)}>
				${bat}
			</a>`
			: bat;
	}

	static isFloating(stateBatteryCurrent: CustomEntity) {
		return this.isFloating2(stateBatteryCurrent.toNum(2));
	}

	static isFloating2(current: number) { //FIXME rename
		return Math.abs(current) <= 1.00;
	}
}