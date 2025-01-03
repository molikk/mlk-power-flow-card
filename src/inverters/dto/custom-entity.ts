import { HassEntity } from 'home-assistant-js-websocket/dist/types';
import { Utils } from '../../helpers/utils';
import { UnitOfElectricalCurrent, UnitOfEnergy, UnitOfPower } from '../../const';
import { PowerFlowCardConfig } from '../../types';
import { HomeAssistant } from 'custom-card-helpers';

/**
 * CustomEntity interface represents a custom entity in Home Assistant.
 * - this entity aids in reducing common boiler plate code. the end goal is that we can just use the state object instead of multiple vars
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
	 * Checks that the state is not null, undefined or unknown
	 */
	isValid(): boolean;

	/**
	 * Checks that the state is valid and entity is switch, toggle or boolean_input
	 */
	isValidSwitch(): boolean;

	/**
	 * Checks that the state is valid and entity is energy or Power
	 */
	isValidElectric(): boolean;

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

	getUOM(): UnitOfPower | UnitOfEnergy | UnitOfElectricalCurrent
}

// Function to convert HassEntity to CustomEntity
export function convertToCustomEntity(entity: any): CustomEntity {
	let isValid = entity?.state !== null && entity.state !== 'unknown' && entity.state !== undefined && entity?.entity_id != null && entity.entity_id;
	let notEmpty = entity?.state !== '' && isValid;
	return {
		...entity,
		toNum: (decimals?: number, invert?: boolean) => Utils.toNum(entity?.state, decimals, invert),
		toStr: (decimals?: number, invert?: boolean, abs?: boolean) => Utils.toNum(entity?.state, decimals, invert, abs).toFixed(decimals),
		isValid: () => isValid || false,
		isValidSwitch: () => isValid && ['on', 'off', 'On', 'Off', 'ON', 'OFF', 0, 1, true, false].includes(entity?.state) || false,
		isValidElectric: () => isValid && ['W', 'Wh', 'kW', 'kWh', 'MW', 'MWh', 'J', 'kJ', 'MJ', 'GJ', 'A', 'mA', 'V', 'mV', 'Hz', 'BTU/h'].includes(entity?.attributes?.unit_of_measurement) || false,
		notEmpty: () => notEmpty || false,
		isNaN: () => entity?.state === null || Number.isNaN(entity?.state),
		toPower: (invert?: boolean) => {
			const unit = (entity.attributes?.unit_of_measurement || '').toLowerCase();
			if (unit === 'kw' || unit === 'kwh') {
				return Utils.toNum(((entity?.state || '0') * 1000), 0, invert);
			} else if (unit === 'mw' || unit === 'mwh') {
				return Utils.toNum(((entity?.state || '0') * 1000000), 0, invert);
			} else {
				return Utils.toNum((entity?.state || '0'), 0, invert) || 0;
			}
		},
		toPowerString: (scale?: boolean, decimals?: number, invert?: boolean) =>
			scale ?
				Utils.convertValueNew(entity?.state, entity?.attributes?.unit_of_measurement, decimals) :
				`${Utils.toNum(entity?.state, decimals, invert).toFixed(decimals)} ${entity?.attributes?.unit_of_measurement || ''}`,
		toString: () => entity?.state?.toString() || '',
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
