import { HassEntity } from 'home-assistant-js-websocket/dist/types';
import { Utils } from '../../helpers/utils';
import { UnitOfElectricalCurrent, UnitOfEnergy, UnitOfPower } from '../../const';
import { PowerFlowCardConfig } from '../../types';
import { HomeAssistant } from 'custom-card-helpers';

/**
 * CustomEntity interface represents a custom entity in Home Assistant.
 * - this entity aids in reducing common boilerplate code. the end goal is that we can just use the state object instead of multiple vars
 */
export interface CustomEntity extends HassEntity {
	state: string,

	/**
	 * Extension of Utils.toNum, returns the state in a number
	 * @param decimals
	 * @param invert
	 */
	toNum(decimals?: number, invert?: boolean): number;

	/**
	 * Extension of Utils.toNum, returns the state in a string
	 * @param decimals
	 * @param invert
	 * @param abs
	 */
	toStr(decimals?: number, invert?: boolean, abs?: boolean): string;

	toString(): string;

	/**
	 *  returns time in HH:MM
	 */
	toShortTime(withTrailingHourZero: boolean): string;

	/**
	 * Checks that the state is not null, undefined or unknown
	 */
	isValid(): boolean;

	/**
	 * Checks that the state is valid and entity is switch, toggle or boolean_input
	 */
	isValidSwitch(): boolean;

	/**
	 * Checks that the state is valid and entity is Energy or Power
	 */
	isValidElectric(): boolean;

	/**
	 * Checks that the state is valid and entity is time
	 */
	isValidTime(): boolean;

	/**
	 * Returns normalized on/off value
	 */
	toOnOff(): string;

	/**
	 * Checks that the state is not equal to ''
	 */
	notEmpty(): boolean;

	isNaN(): boolean;

	/**
	 * Auto converts the state to watts/kilowatts
	 * @param invert
	 */
	toPower(invert?: boolean): number;

	/**
	 * Auto converts the state to watts/kilowatts, with the suffix
	 * @param invert
	 * @param decimals
	 * @param scale
	 */
	toPowerString(scale?: boolean, decimals?: number, invert?: boolean): string;

	getUOM(): UnitOfPower | UnitOfEnergy | UnitOfElectricalCurrent | string
}

// Function to convert HassEntity to CustomEntity
export function convertToCustomEntity(entity): CustomEntity {
	const isValid = entity?.state !== null && entity.state !== 'unknown' && entity.state !== undefined && entity?.entity_id != null && entity.entity_id;
	const notEmpty = entity?.state !== '' && isValid;
	return {
		...entity,
		toNum: (decimals?: number, invert?: boolean) => Utils.toNum(entity?.state, decimals, invert),
		toStr: (decimals?: number, invert?: boolean, abs?: boolean) => Utils.toNum(entity?.state, decimals, invert, abs).toFixed(decimals),
		isValid: () => isValid || false,
		isValidSwitch: () => isValid && ['on', 'off', 'On', 'Off', 'ON', 'OFF', 0, 1, true, false].includes(entity?.state) || false,
		isValidElectric: () => isValid && ['W', 'Wh', 'kW', 'kWh', 'MW', 'MWh', 'J', 'kJ', 'MJ', 'GJ', 'A', 'mA', 'V', 'mV', 'Hz', 'BTU/h'].includes(entity?.attributes?.unit_of_measurement) || false,
		isValidTime: () => isValid && entity?.attributes?.has_time == true || false,
		notEmpty: () => notEmpty || false,
		isNaN: () => entity?.state === null || Number.isNaN(entity?.state),
		toPower: (invert?: boolean) => {
			const unit = (entity.attributes?.unit_of_measurement || '').toLowerCase();
			if (unit === UnitOfPower.KILO_WATT.toLowerCase() || unit === UnitOfEnergy.KILO_WATT_HOUR.toLowerCase()) {
				return Utils.toNum(((entity?.state || '0') * 1000), 0, invert);
			} else if (unit === UnitOfPower.MEGA_WATT.toLowerCase() || unit === UnitOfEnergy.MEGA_WATT_HOUR.toLowerCase()) {
				return Utils.toNum(((entity?.state || '0') * 1000000), 0, invert);
			} else if (unit === UnitOfPower.WATT.toLowerCase() || unit === UnitOfEnergy.WATT_HOUR.toLowerCase()) {
				return Utils.toNum(((entity?.state || '0')), 0, invert);
			} else {
				return Utils.toNum((entity?.state || '0'), 2, invert) || 0;
			}
		},
		toPowerString: (scale?: boolean, decimals?: number, invert?: boolean) =>
			scale ?
				Utils.convertValueNew(entity?.state, entity?.attributes?.unit_of_measurement, decimals) :
				`${Utils.toNum(entity?.state, decimals, invert).toFixed(decimals)} ${entity?.attributes?.unit_of_measurement || ''}`,
		toString: () => entity?.state?.toString() || '',
		toShortTime: (withTrailingHourZero: boolean = true) =>
			(withTrailingHourZero && entity?.attributes?.hour < 10 ? '0' : '') + entity?.attributes?.hour
			+ ':' + (entity?.attributes?.minute < 10 ? '0' : '') + entity?.attributes?.minute,
		toOnOff: () => ['on', 'On', 'ON', 1, true].includes(entity.state) ? 'on' : 'off',
		getUOM: () => entity?.attributes?.unit_of_measurement || '',
	};
}

export function getEntity(config: PowerFlowCardConfig,
                          hass: HomeAssistant,
                          entity: keyof PowerFlowCardConfig,
                          defaultValue: Partial<CustomEntity> | null = {
	                          state: '0', attributes: { unit_of_measurement: '' },
                          }): CustomEntity {
	const props = String(entity).split('.');

	let entityString: string;
	if (props.length > 1) {
		entityString = config[props[0]][props[1]];
	} else if (props.length > 0) {
		entityString = config[props[0]];
	} else {
		entityString = '';
	}

	const state = entityString ? hass.states[entityString] : undefined;
	return (state !== undefined ? convertToCustomEntity(state)
		: defaultValue ? convertToCustomEntity(defaultValue)
			: convertToCustomEntity({ state: undefined })) as CustomEntity;
}
