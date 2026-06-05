import { Utils } from '../../helpers/utils';
import { CustomEntity } from '../../inverters/dto/custom-entity';
import { DataDto, PowerFlowCardConfig } from '../../types';

export class BatteryUtils {

	static getBatteryPowerValue(
		useBatteryBanksValues: boolean,
		batteryBankPowerState: CustomEntity[],
		batteryBanks: number,
		batteryInvertPower: boolean,
	): number {
		if (useBatteryBanksValues) {
			if (batteryBanks < 1) {
				return 0;
			}
			let value = 0;
			for (let i = 1; i <= batteryBanks; i++) {
				value += batteryBankPowerState[i].toPower(batteryInvertPower);
			}
			return value;
		}
		return batteryBankPowerState[0].toPower(batteryInvertPower);
	}

	static getBatteryVoltageValue(
		useBatteryBanksValues: boolean,
		stateBatteryVoltage: CustomEntity,
		batteryBanks: number,
		batteryBankVoltageState: CustomEntity[],
		decimalPlaces: number | undefined,
	): number {
		if (useBatteryBanksValues) {
			if (batteryBanks <= 0) {
				return 0;
			}
			let value = 0;
			for (let i = 0; i < batteryBanks; i++) {
				value += batteryBankVoltageState[i].toNum(decimalPlaces);
			}
			return Math.round(100 * value / batteryBanks) / 100;
		}
		return stateBatteryVoltage.toNum(decimalPlaces);
	}

	static getBatteryCurrentValue(
		useBatteryBanksValues: boolean,
		stateBatteryCurrent: CustomEntity,
		batteryBanks: number,
		batteryBankCurrentState: CustomEntity[],
		decimalPlaces: number | undefined,
	): number {
		if (useBatteryBanksValues) {
			if (batteryBanks <= 0) {
				return 0;
			}
			let value = 0;
			for (let i = 0; i < batteryBanks; i++) {
				value += batteryBankCurrentState[i].toNum(decimalPlaces);
			}
			return value;
		}
		return stateBatteryCurrent.toNum(decimalPlaces);
	}

	static getBatteryTemperatureValue(
		useBatteryBanksValues: boolean,
		batteryTemperatureState: CustomEntity,
		batteryBanks: number,
		batteryBankTemperatureState: CustomEntity[],
		decimalPlaces: number | undefined,
	): number {
		if (useBatteryBanksValues) {
			if (batteryBanks <= 0) {
				return 0;
			}
			let value = 0;
			for (let i = 0; i < batteryBanks; i++) {
				value += batteryBankTemperatureState[i].toNum(decimalPlaces);
			}
			return value / batteryBanks;
		}
		return batteryTemperatureState.toNum(decimalPlaces);
	}

//FIXME requires dependency to battery bank size
	static getBatterySocValue(
		useBatteryBanksValues: boolean,
		stateBatterySoc: CustomEntity,
		batteryBanks: number,
		batteryBankSocState: CustomEntity[],
	): number {
		if (useBatteryBanksValues) {
			if (batteryBanks <= 0) {
				return 0;
			}
			let value = 0;
			for (let i = 0; i < batteryBanks; i++) {
				value += batteryBankSocState[i].toNum(1);
			}
			return Utils.toNum(value, 1);
		}
		return stateBatterySoc.toNum(1);
	}


	static isPowerValid(data: DataDto, config: PowerFlowCardConfig): boolean {
		return BatteryUtils.isValid(data.batteryBankPowerState[0], config.battery?.use_battery_banks_values);
	}

	static isVoltageValid(data: DataDto, config: PowerFlowCardConfig): boolean {
		return BatteryUtils.isValid(data.stateBatteryVoltage, config.battery?.use_battery_banks_values);
	}

	static isCurrentValid(data: DataDto, config: PowerFlowCardConfig): boolean {
		return BatteryUtils.isValid(data.stateBatteryCurrent, config.battery?.use_battery_banks_values);
	}
	static isTemperatureValid(data: DataDto, config: PowerFlowCardConfig): boolean {
		return BatteryUtils.isValid(data.stateBatteryTemp, config.battery?.use_battery_banks_values);
	}

	static isValid(entity: CustomEntity, useBatteryBanksValues: boolean): boolean {
		return useBatteryBanksValues || entity.isValid();
	}


}