import { BatteryBanksViewMode, DataDto, PowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { CustomEntity } from '../../inverters/dto/custom-entity';
import { Utils } from '../../helpers/utils';
import { Battery } from './battery';

export class BatteryBank {

	static getBatteryBanksDetailsInnerMode(data: DataDto, config: PowerFlowCardConfig) {
		if (config.battery.battery_banks_view_mode != BatteryBanksViewMode.inner) {
			return svg``;
		}
		let banks = config.battery.battery_banks;
		banks = banks > 4 ? 4 : banks;
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

		let result = svg`${this.generateInnerTitle(banks, 280, data.batteryColour)}`;
		for (let i = 0; i < banks; i++)
			result = svg`
			${result}
			${this.getInnerBatteryBankDetails(
				i + 1, banks, config,
				data.batteryBankPowerState[i+1],
				data.batteryBankVoltageState[i],
				data.batteryBankCurrentState[i],
				data.batteryBankDeltaState[i],
				data.batteryBankRemainingStorageState[i],
				data.batteryBankSocState[i],
				data.batteryBankEnergy[i],
				data.batteryBatteryBankColour[i],
				data.decimalPlaces, columns[i], gap, width,
			)}
			`;
		return result;
	}

	static getBatteryBanksDetailsOuterMode(data: DataDto, config: PowerFlowCardConfig) {
		if (config.battery.battery_banks_view_mode != BatteryBanksViewMode.outer) {
			return svg``;
		}
		const banks = config.battery.battery_banks;
		const width = 40,
			startX = 198 - (width + 3) * (banks > 4 ? banks - 4 : 0);

		let result = svg`${this.generateOuterTitle(config.battery.battery_banks, startX + 5, data.batteryColour)}`;
		for (let i = 0; i < config.battery.battery_banks; i++)
			result = svg`
			${result}
			${this.getOuterBatteryBankDetails(
				i + 1, banks, data, config,
				data.batteryBankPowerState[i+1],
				data.batteryBankVoltageState[i],
				data.batteryBankCurrentState[i],
				data.batteryBankTempState[i],
				data.batteryBankDeltaState[i],
				data.batteryBankRemainingStorageState[i],
				data.batteryBankSocState[i],
				data.batteryBankEnergy[i],
				data.batteryBatteryBankColour[i],
				data.decimalPlaces,
				startX + (width + 3) * (i + 1), width,
			)}
			`;
		return result;
	}

	private static getInnerBatteryBankDetails(
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
			const power = this.getPower(config, powerEntity, decimalPlaces);
			const storage = this.getStorage(storageEntity, config, batteryEnergy, socEntity);

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

	private static generateInnerTitle(banks: number, x: number, batteryColour: string) {
		if (banks <= 3) {
			return svg`
				<rect x="${x - 2}" y="274" width="35" height="66" rx="4.5" ry="4.5" fill="none" pointer-events="all" stroke="${batteryColour}"></rect>
				<text id="battery_banks_power" x="${x}" y="283" class="st15 left-align" fill="${batteryColour}">Power:</text>
				<text id="battery_banks_voltage" x="${x}" y="293" class="st15 left-align" fill="${batteryColour}">Voltage:</text>
				<text id="battery_banks_current" x="${x}" y="303" class="st15 left-align" fill="${batteryColour}">Current:</text>
				<text id="battery_banks_delta" x="${x}" y="313" class="st15 left-align" fill="${batteryColour}">Delta:</text>
				<text id="battery_banks_storage" x="${x}" y="323" class="st15 left-align" fill="${batteryColour}">Storage:</text>
				<text id="battery_banks_SOC" x="${x}" y="333" class="st15 left-align" fill="${batteryColour}">SOC:</text>
			`;
		} else if (banks > 3) {
			return svg`
					<rect x="${x - 2}" y="274" width="10" height="66" rx="4.5" ry="4.5" fill="none" pointer-events="all" stroke="${batteryColour}"></rect>
					<text id="battery_banks_power" x="${x}" y="283" class="st15 left-align" fill="${batteryColour}">P:</text>
					<text id="battery_banks_voltage" x="${x}" y="293" class="st15 left-align" fill="${batteryColour}">V:</text>
					<text id="battery_banks_current" x="${x}" y="303" class="st15 left-align" fill="${batteryColour}">A:</text>
					<text id="battery_banks_delta" x="${x}" y="313" class="st15 left-align" fill="${batteryColour}">Δ:</text>
					<text id="battery_banks_storage" x="${x}" y="323" class="st15 left-align" fill="${batteryColour}">S:</text>
					<text id="battery_banks_SOC" x="${x}" y="333" class="st15 left-align" fill="${batteryColour}">%:</text>
				`;
		}
	}

	private static generateOuterTitle(banks: number, x: number, batteryColour: string) {
		if (banks == 6) {
			x = x + 24;
			return svg`
				<rect x="${x - 2}" y="405" width="10" height="76" rx="4.5" ry="4.5" fill="none" pointer-events="all" stroke="${batteryColour}"></rect>
				<text id="battery_banks_power" x="${x}" y="413" class="st15 left-align" fill="${batteryColour}">P:</text>
				<text id="battery_banks_voltage" x="${x}" y="423" class="st15 left-align" fill="${batteryColour}">V:</text>
				<text id="battery_banks_current" x="${x}" y="433" class="st15 left-align" fill="${batteryColour}">A:</text>
				<text id="battery_banks_temp" x="${x}" y="443" class="st15 left-align" fill="${batteryColour}">T:</text>
				<text id="battery_banks_delta" x="${x}" y="453" class="st15 left-align" fill="${batteryColour}">Δ:</text>
				<text id="battery_banks_storage" x="${x}" y="463" class="st15 left-align" fill="${batteryColour}">S:</text>
				<text id="battery_banks_SOC" x="${x}" y="473" class="st15 left-align" fill="${batteryColour}">%:</text>
			`;
		}

		return svg`
			<rect x="${x - 2}" y="405" width="35" height="76" rx="4.5" ry="4.5" fill="none" pointer-events="all" stroke="${batteryColour}"></rect>
			<text id="battery_banks_power" x="${x}" y="413" class="st15 left-align" fill="${batteryColour}">Power:</text>
			<text id="battery_banks_voltage" x="${x}" y="423" class="st15 left-align" fill="${batteryColour}">Voltage:</text>
			<text id="battery_banks_current" x="${x}" y="433" class="st15 left-align" fill="${batteryColour}">Current:</text>
			<text id="battery_banks_temp" x="${x}" y="443" class="st15 left-align" fill="${batteryColour}">Temp:</text>
			<text id="battery_banks_delta" x="${x}" y="453" class="st15 left-align" fill="${batteryColour}">Delta:</text>
			<text id="battery_banks_storage" x="${x}" y="463" class="st15 left-align" fill="${batteryColour}">Storage:</text>
			<text id="battery_banks_SOC" x="${x}" y="473" class="st15 left-align" fill="${batteryColour}">SOC:</text>
		`;
	}

	private static getOuterBatteryBankDetails(
		id: number,
		banks: number,
		data: DataDto,
		config: PowerFlowCardConfig,
		powerEntity: CustomEntity,
		voltageEntity: CustomEntity,
		currentEntity: CustomEntity,
		tempEntity: CustomEntity,
		deltaEntity: CustomEntity,
		storageEntity: CustomEntity,
		socEntity: CustomEntity,
		batteryEnergy: number,
		colour: string, decimalPlaces: number,
		column: number, width: number,
	) {
		if (id <= banks) {
			const textX = column + width / 2 - 3;
			const power = this.getPower(config, powerEntity, decimalPlaces);
			const x = column - 3 + width / 2;
			const storage = this.getStorage(storageEntity, config, batteryEnergy, socEntity);

			return svg`
 					<svg id="battery-pack-flow-${id}" style="overflow: visible">
						<path id="bat-line"
					  		d="M 239 385 L 239 392 L ${x} 392 L ${x} 399" fill="none"
					  		stroke="${Battery.batteryColour(data, config)}" stroke-width="${data.batLineWidth}" stroke-miterlimit="10"
					  		pointer-events="stroke"/>
				  	</svg>
					<rect x="${column - 8 + width / 2}" y="400" width="10" height="5" rx="1.5" ry="1.5" fill="${colour}" pointer-events="all" stroke="${colour}" stroke-width="2.0"></rect>
					<rect x="${column - 2}" y="405" width="${width - 2}" height="76" rx="4.5" ry="4.5" fill="none" pointer-events="all" stroke="${colour}" stroke-width="3.0"></rect>
					<text x="${textX}" y="413" class="st15" fill="${colour}" id="battery_bank_${id}_power">${power}</text>
					<text x="${textX}" y="423" class="st15" fill="${colour}" id="battery_bank_${id}_voltage">${voltageEntity.toStr(2)}</text>
					<text x="${textX}" y="433" class="st15" fill="${colour}" id="battery_bank_${id}_current">${currentEntity.toStr(2, false, config.battery.show_absolute)}</text>
					<text x="${textX}" y="443" class="st15" fill="${colour}" id="battery_bank_${id}_temp">${tempEntity.toStr(1)}</text>
					<text x="${textX}" y="453" class="st15" fill="${colour}" id="battery_bank_${id}_delta">${deltaEntity.toStr(3)}</text>
					<text x="${textX}" y="463" class="st15" fill="${colour}" id="battery_bank_${id}_storage">${storage}</text>
					<text x="${textX}" y="473" class="st15" fill="${colour}" id="battery_bank_${id}_soc">${socEntity.toStr(2)}</text>
			`;
		}
		return svg``;
	}

	private static getStorage(storageEntity: CustomEntity, config: PowerFlowCardConfig, batteryEnergy: number, socEntity: CustomEntity) {
		const shutdown = config.battery.shutdown_soc_offgrid || config.battery.shutdown_soc || 0;
		return storageEntity?.isValid()
			? storageEntity.toStr(2)
			: config.battery.remaining_energy_to_shutdown
				? Utils.toNum((batteryEnergy * ((socEntity.toNum(2) - shutdown) / 100) / 1000), 2).toFixed(2)
				: Utils.toNum((batteryEnergy * (socEntity.toNum(2) / 100) / 1000), 2).toFixed(2);
	}

	private static getPower(config: PowerFlowCardConfig, powerEntity: CustomEntity, decimalPlaces: number) {
		return config.battery.auto_scale
			? config.battery.show_absolute
				? Utils.convertValueNew(Math.abs(powerEntity.toNum(decimalPlaces)), powerEntity.getUOM(), decimalPlaces, false)
				: Utils.convertValueNew(powerEntity.toNum(decimalPlaces), powerEntity.getUOM(), decimalPlaces, false) || '0'
			: powerEntity.toStr(config.decimal_places, config.battery?.invert_power, config.battery.show_absolute);
	}
}
