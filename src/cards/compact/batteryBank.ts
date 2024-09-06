import { BatteryBanksViewMode, DataDto, PowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { CustomEntity } from '../../inverters/dto/custom-entity';
import { Utils } from '../../helpers/utils';

export class BatteryBank {

	static getBatteryBanksDetails(data: DataDto, config: PowerFlowCardConfig) {
		if(config.battery.battery_banks_view_mode != BatteryBanksViewMode.inner){
			return svg``;
		}
		const banks = config.battery.battery_banks;
		let columns = [281, 312, 343, 374];
		let gap = 10, width = 28;
		if (banks <= 2) {
			gap = 35;
			width = 40;
			columns = [281, 324, 0, 0];
		}
		if (banks == 3) {
			gap = 35;
			width = 30;
			columns = [281, 314, 347, 0];
		}

		return svg`
			${this.generateTitle(banks, data.batteryColour)}
			${this.getBatteryBankDetails(1, banks, config,
			data.stateBatteryBank1Power,
			data.stateBatteryBank1Voltage,
			data.stateBatteryBank1Current,
			data.stateBatteryBank1Delta,
			data.stateBatteryBank1RemainingStorage,
			data.stateBatteryBank1Soc,
			config.battery.battery_bank_1_energy,
			data.dynamicBatteryBatteryBank1Colour, data.decimalPlaces, columns[0], gap, width)}
			${this.getBatteryBankDetails(2, banks, config,
			data.stateBatteryBank2Power,
			data.stateBatteryBank2Voltage,
			data.stateBatteryBank2Current,
			data.stateBatteryBank2Delta,
			data.stateBatteryBank2RemainingStorage,
			data.stateBatteryBank2Soc,
			config.battery.battery_bank_2_energy,
			data.dynamicBatteryBatteryBank2Colour, data.decimalPlaces, columns[1], gap, width)}
			${this.getBatteryBankDetails(3, banks, config,
			data.stateBatteryBank3Power,
			data.stateBatteryBank3Voltage,
			data.stateBatteryBank3Current,
			data.stateBatteryBank3Delta,
			data.stateBatteryBank3RemainingStorage,
			data.stateBatteryBank3Soc,
			config.battery.battery_bank_3_energy,
			data.dynamicBatteryBatteryBank3Colour, data.decimalPlaces, columns[2], gap, width)}
			${this.getBatteryBankDetails(4, banks, config,
			data.stateBatteryBank4Power,
			data.stateBatteryBank4Voltage,
			data.stateBatteryBank4Current,
			data.stateBatteryBank4Delta,
			data.stateBatteryBank4RemainingStorage,
			data.stateBatteryBank4Soc,
			config.battery.battery_bank_4_energy,
			data.dynamicBatteryBatteryBank4Colour, data.decimalPlaces, columns[3], gap, width)}
		`;
	}

	private static getBatteryBankDetails(
		id: number,
		banks: number,
		config: PowerFlowCardConfig,
		powerEntity: CustomEntity,
		voltageEntity: CustomEntity,
		currentEntity: CustomEntity,
		deltaEntity: CustomEntity,
		storageEntity: CustomEntity,
		socEntity: CustomEntity,
		batteryEnergy: number,
		colour: string, decimalPlaces: number,
		column: number, gap: number, width: number,
	) {
		if (id <= banks) {
			const textX = column + width / 2 + gap;
			const power = config.battery.auto_scale
				? config.battery.show_absolute
					? Utils.convertValueNew(Math.abs(powerEntity.toNum(decimalPlaces)), powerEntity.getUOM(), decimalPlaces, false)
					: Utils.convertValueNew(powerEntity.toNum(decimalPlaces), powerEntity.getUOM(), decimalPlaces, false) || '0'
				: powerEntity.toStr(config.decimal_places, config.battery?.invert_power, config.battery.show_absolute);

			const storage = storageEntity?.isValid()
				? storageEntity.toStr(2)
				: Utils.toNum((batteryEnergy * (socEntity.toNum(2) / 100) / 1000), 2).toFixed(2);
			return svg`
					<rect x="${column + gap}" y="274" width="${width}" height="66" rx="4.5" ry="4.5" fill="none" pointer-events="all" stroke="${colour}"></rect>
					<text x="${textX}" y="283" class="st15" fill="${colour}" id="battery_bank_${id}_power">${power}</text>
					<text x="${textX}" y="293" class="st15" fill="${colour}" id="battery_bank_${id}_voltage">${voltageEntity.toStr(2)}</text>
					<text x="${textX}" y="303" class="st15" fill="${colour}" id="battery_bank_${id}_current">${currentEntity.toStr(2, false, config.battery.show_absolute)}</text>
					<text x="${textX}" y="313" class="st15" fill="${colour}" id="battery_bank_${id}_delta">${deltaEntity.toStr(3)}</text>
					<text x="${textX}" y="323" class="st15" fill="${colour}" id="battery_bank_${id}_storage">${storage}</text>
					<text x="${textX}" y="333" class="st15" fill="${colour}" id="battery_bank_${id}_soc">${socEntity.toStr(2)}</text>
			`;
		}
		return svg``;
	}

	private static generateTitle(banks: number, batteryColour: string) {
		if (banks <= 3) {
			return svg`
				<rect x="278" y="274" width="35" height="66" rx="4.5" ry="4.5" fill="none" pointer-events="all" stroke="${batteryColour}"></rect>
				<text id="battery_voltage_183" x="280" y="283" class="st15 left-align" fill="${batteryColour}">Power:</text>
				<text id="battery_voltage_183" x="280" y="293" class="st15 left-align" fill="${batteryColour}">Voltage:</text>
				<text id="battery_voltage_183" x="280" y="303" class="st15 left-align" fill="${batteryColour}">Current:</text>
				<text id="battery_voltage_183" x="280" y="313" class="st15 left-align" fill="${batteryColour}">Delta:</text>
				<text id="battery_voltage_183" x="280" y="323" class="st15 left-align" fill="${batteryColour}">Storage:</text>
				<text id="battery_voltage_183" x="280" y="333" class="st15 left-align" fill="${batteryColour}">SOC:</text>
			`;
		} else if (banks > 3) {
			return svg`
					<rect x="278" y="274" width="10" height="66" rx="4.5" ry="4.5" fill="none" pointer-events="all" stroke="${batteryColour}"></rect>
					<text id="battery_voltage_183" x="280" y="283" class="st15 left-align" fill="${batteryColour}">P:</text>
					<text id="battery_voltage_183" x="280" y="293" class="st15 left-align" fill="${batteryColour}">V:</text>
					<text id="battery_voltage_183" x="280" y="303" class="st15 left-align" fill="${batteryColour}">A:</text>
					<text id="battery_voltage_183" x="280" y="313" class="st15 left-align" fill="${batteryColour}">Δ:</text>
					<text id="battery_voltage_183" x="280" y="323" class="st15 left-align" fill="${batteryColour}">S:</text>
					<text id="battery_voltage_183" x="280" y="333" class="st15 left-align" fill="${batteryColour}">%:</text>
				`;
		}
	}


}
