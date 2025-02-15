import { UnitOfEnergy, unitOfEnergyConversionRules, UnitOfEnergyOrPower, UnitOfPower } from '../const';
import { navigate } from 'custom-card-helpers';

export class Utils {
	static toNum(val: string | number, decimals: number = -1, invert: boolean = false, abs: boolean = false): number {
		let numberValue = Number(val);
		if (Number.isNaN(numberValue)) {
			return 0;
		}
		if (decimals >= 0) {
			numberValue = parseFloat(numberValue.toFixed(decimals));
		}
		if (invert) {
			numberValue *= -1;
		}
		if (abs) {
			numberValue = Math.abs(numberValue);
		}
		return numberValue;
	}

	static invertKeyPoints(keyPoints: string) {
		return keyPoints.split(';').reverse().join(';');
	}

	static convertValue(value: any, decimal: number = 2) {
		decimal = Number.isNaN(decimal) ? 2 : decimal;
		if (Math.abs(value) >= 1000000) {
			return `${(value / 1000000).toFixed(decimal)} MW`;
		} else if (Math.abs(value) >= 1000) {
			return `${(value / 1000).toFixed(decimal)} kW`;
		} else {
			return `${Math.round(value)} W`;
		}
	}

	static convertValueNew(
		value: string | number,
		unit: UnitOfEnergyOrPower | string = '',
		decimal: number = 2,
		withUnit: boolean = true,
	): string {
		decimal = isNaN(decimal) ? 2 : decimal;
		const numberValue = Number(value);
		if (isNaN(numberValue)) return Number(0).toFixed(decimal);

		const rules = unitOfEnergyConversionRules[unit];
		if (!rules) {
			if (withUnit) {
				return `${this.toNum(numberValue, decimal)} ${unit}`;
			}
			return `${this.toNum(numberValue, decimal)}`;
		}

		if ((unit === UnitOfPower.WATT || unit === UnitOfEnergy.WATT_HOUR) && Math.abs(numberValue) < 1000) {
			if (withUnit) {
				return `${Math.round(numberValue)} ${unit}`;
			}
			return `${Math.round(numberValue)}`;
		}

		if (unit === UnitOfPower.KILO_WATT && Math.abs(numberValue) < 1) {
			if (withUnit) {
				return `${Math.round(numberValue * 1000)} W`;
			}
			return `${Math.round(numberValue * 1000)}`;
		}
		if (unit === UnitOfEnergy.KILO_WATT_HOUR && Math.abs(numberValue) < 1) {
			if (withUnit) {
				return `${Math.round(numberValue * 1000)} Wh`;
			}
			return `${Math.round(numberValue * 1000)}`;
		}

		if (unit === UnitOfPower.MEGA_WATT && Math.abs(numberValue) < 1) {
			if (withUnit) {
				return `${(numberValue * 1000).toFixed(decimal)} kW`;
			}
			return `${(numberValue * 1000).toFixed(decimal)}`;
		}
		if (unit === UnitOfEnergy.MEGA_WATT_HOUR && Math.abs(numberValue) < 1) {
			if (withUnit) {
				return `${(numberValue * 1000).toFixed(decimal)} kWh`;
			}
			return `${(numberValue * 1000).toFixed(decimal)}`;
		}

		for (const rule of rules) {
			if (Math.abs(numberValue) >= rule.threshold) {
				const convertedValue = (numberValue / rule.divisor).toFixed(rule.decimal || decimal);
				if (withUnit) {
					return `${convertedValue} ${rule.targetUnit}`;
				}
				return `${convertedValue}`;
			}
		}

		if (withUnit) {
			return `${numberValue.toFixed(decimal)} ${unit}`;
		}
		return `${numberValue.toFixed(decimal)}`;
	}

	static toHexColor(color: string): string {
		if (!color) {
			return 'grey'
		}
		if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)) {
			return color.toUpperCase();
		}
		const match = color.match(/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/);
		if (match) {
			const [r, g, b] = match.slice(1, 4).map(Number);
			return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
		}
		// probs a color name
		return color
	}

	private static isPopupOpen = false;

	static handlePopup(event: Event, entityId: string) {
		if (!entityId) {
			return;
		}
		event.preventDefault();
		this._handleClick(event, { action: 'more-info' }, entityId);
	}

	static handleNavigation(event: Event, navigationPath: string) {
		if (!navigationPath) {
			return;
		}
		event.preventDefault();
		this._handleClick(event, { action: 'navigate', navigation_path: navigationPath }, null);
	}

	private static _handleClick(event: Event, actionConfig: any, entityId: string | null) {
		if (!event || (!entityId && !actionConfig.navigation_path)) {
			//console.warn("no Click action to handle", event, entityId, actionConfig);
			return;
		}

		event.stopPropagation();

		// Handle different actions based on actionConfig
		switch (actionConfig.action) {
			case 'more-info':
				this._dispatchMoreInfoEvent(event, <string>entityId);
				break;
			case 'navigate':
				this._handleNavigationEvent(event, actionConfig.navigation_path);
				break;
			default:
				console.warn(`Action '${actionConfig.action}' is not supported.`);
		}
	}

	private static _dispatchMoreInfoEvent(event: Event, entityId: string) {
		if (Utils.isPopupOpen) {
			//console.log("popUp is already opened: ", entityId, event);
			return;
		}

		Utils.isPopupOpen = true;

		const moreInfoEvent = new CustomEvent('hass-more-info', {
			composed: true,
			detail: { entityId },
		});

		history.pushState({ popupOpen: true }, '', window.location.href);

		if (event.target != null) {
			event.target.dispatchEvent(moreInfoEvent);
		} else {
			console.log("Event.target is null: ", event);
		}

		const closePopup = () => {

			if (Utils.isPopupOpen) {
				//console.log(`Closing popup for entityId: ${entityId}`);
				Utils.isPopupOpen = false;

				// Remove the event listener to avoid multiple bindings
				window.removeEventListener('popstate', closePopup);

				// Optionally, if your popup close logic doesn't trigger history.back(), call it manually
				//history.back();
			}
		};

		window.addEventListener('popstate', closePopup, { once: true });
	}

	private static _handleNavigationEvent(event: Event, navigationPath: string) {
		// Perform the navigation action
		if (navigationPath) {
			navigate(event.target, navigationPath); // Assuming 'navigate' is a function available in your environment
		} else {
			console.warn('Navigation path is not provided.');
		}
	}
}
