import { InverterModel, InverterSettings } from '../../types';
import { CustomEntity } from './custom-entity';

export class InverterSettingsDto {
	brand!: InverterModel;
	model?: string; // not currently used, but could be used to support multiple models per brand, where simple rules changes.
	statusGroups!: InverterStatus;
	batteryStatusGroups?: InverterStatus;
	image!: string;

	constructor() {
	}

	getBatteryCapacityTarget(
		batteryPower: number,
		gridStatus: string,
		shutdown: number,
		inverterProg: InverterSettings,
		batterySOC: number,
		maxSOC: number,
		invertBatFlow: boolean,
	) {
		let batteryCapacity = 0;
		if (invertBatFlow ? batteryPower < 0 : batteryPower > 0) {
			if (gridStatus === 'off' || gridStatus === '0' || gridStatus.toLowerCase() === 'off-grid' || !inverterProg.show || batterySOC <= inverterProg.capacity) {
				if (batterySOC < shutdown) {
					batteryCapacity = 0;
				} else {
					batteryCapacity = shutdown;
				}
			} else {
				batteryCapacity = inverterProg.capacity;
			}
		} else if (invertBatFlow ? batteryPower > 0 : batteryPower < 0) {
			if (gridStatus === 'off' || gridStatus === '0' || gridStatus.toLowerCase() === 'off-grid' || !inverterProg.show || batterySOC >= inverterProg.capacity) {
				if (batterySOC > maxSOC) {
					batteryCapacity = 100;
				} else {
					batteryCapacity = maxSOC;
				}
			} else if (batterySOC < inverterProg.capacity) {
				batteryCapacity = inverterProg.capacity;
			}
		}
		return batteryCapacity;
	}
}

export type InverterStatus = {
	[key in InverterStatuses]?: InverterStatusConfig
}

export enum InverterStatuses {
	Standby = 'standby',
	SelfTest = 'selftest',
	Normal = 'normal',
	Alarm = 'alarm',
	Fault = 'fault',
	Idle = 'idle',
	NormalStop = 'normalstop',
	Shutdown = 'shutdown',
	OnGrid = 'ongrid',
	OffGrid = 'offgrid',
	Check = 'check',
	NoBattery = 'noBattery',
	Discharging = 'discharging',
	Charging = 'charging',
	Waiting = 'waiting',
	Exporting = 'exporting',
	Importing = 'importing',
	Flash = 'flash',
	Offline = 'offline',
	Running = 'running',
	SleepMode = 'sleepmode',
	Off = 'off',
	LowPower = 'lowpower',
	Bulk = 'bulk',
	Absorption = 'absorption',
	Float = 'float',
	Storage = 'storage',
	Equalize = 'equalize',
	Passthru = 'passthru',
	Inverting = 'inverting',
	PowerAssist = 'powerassist',
	PowerSupply = 'powersupply',
	Sustain = 'sustain',
	ExternalControl = 'externalcontrol'
}

export interface InverterStatusConfig {
	states: string[],
	color: string,
	message: string
}
