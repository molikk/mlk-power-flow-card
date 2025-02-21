import { CustomEntity } from '../inverters/dto/custom-entity';

export class BatteryIconManager {
	static convert(state_battery_soc: CustomEntity) {
		const batteryLevel = parseInt(state_battery_soc.state);
		const battery0 = this.batteryCharge(0);

		let batteryIcon: string, batteryCharge: string, stopColour: string;

		switch (true) {
			case batteryLevel >= 25: {
				const lvl = Math.floor((batteryLevel + 5) / 10) * 10;
				console.log(batteryLevel, lvl);
				batteryIcon = this.batteryIcon(lvl);
				batteryCharge = this.batteryCharge(lvl);
				stopColour = 'orange';
				break;
			}
			case 10 <= batteryLevel && batteryLevel < 25:
				batteryIcon = this.batteryIcon(20);
				batteryCharge = this.batteryCharge(20);
				stopColour = 'orange';
				break;
			case 0 <= batteryLevel && batteryLevel < 10:
			default:
				batteryIcon = this.batteryIcon(0);
				batteryCharge = this.batteryCharge(0);
				stopColour = 'red';
				break;
		}
		return { batteryIcon, batteryCharge, stopColour, battery0 };
	}

	private static batteryIcon(lvl: number) {
		const icon = {
			//Complete Battery Icon
			100: 'M12 20H4V6h8L12 20m.67-16H11V2H5v2H3.33C2.6 4 2 4.6 2 5.33v15.34C2 21.4 2.6 22 3.33 22h9.34c.74 0 1.33-.59 1.33-1.33V5.33C14 4.6 13.4 4 12.67 4M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5zM5 14 11 14 11 15H5zM5 12.5 11 12.5 11 13.5H5zM5 11 11 11 11 12H5zM5 9.5 11 9.5 11 10.5H5zM5 8 11 8 11 9H5zM5 6.5 11 6.5 11 7.5H5z',
			90: 'M12 20H4V6h8L12 20m.67-16H11V2H5v2H3.33C2.6 4 2 4.6 2 5.33v15.34C2 21.4 2.6 22 3.33 22h9.34c.74 0 1.33-.59 1.33-1.33V5.33C14 4.6 13.4 4 12.67 4M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5zM5 14 11 14 11 15H5zM5 12.5 11 12.5 11 13.5H5zM5 11 11 11 11 12H5zM5 9.5 11 9.5 11 10.5H5zM5 8 11 8 11 9H5z',
			80: 'M12 20H4V6h8L12 20m.67-16H11V2H5v2H3.33C2.6 4 2 4.6 2 5.33v15.34C2 21.4 2.6 22 3.33 22h9.34c.74 0 1.33-.59 1.33-1.33V5.33C14 4.6 13.4 4 12.67 4M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5zM5 14 11 14 11 15H5zM5 12.5 11 12.5 11 13.5H5zM5 11 11 11 11 12H5zM5 9.5 11 9.5 11 10.5H5z',
			70: 'M12 20H4V6h8L12 20m.67-16H11V2H5v2H3.33C2.6 4 2 4.6 2 5.33v15.34C2 21.4 2.6 22 3.33 22h9.34c.74 0 1.33-.59 1.33-1.33V5.33C14 4.6 13.4 4 12.67 4M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5zM5 14 11 14 11 15H5zM5 12.5 11 12.5 11 13.5H5zM5 11 11 11 11 12H5z',
			60: 'M12 20H4V6h8L12 20m.67-16H11V2H5v2H3.33C2.6 4 2 4.6 2 5.33v15.34C2 21.4 2.6 22 3.33 22h9.34c.74 0 1.33-.59 1.33-1.33V5.33C14 4.6 13.4 4 12.67 4M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5zM5 14 11 14 11 15H5zM5 12.5 11 12.5 11 13.5H5z',
			50: 'M12 20H4V6h8L12 20m.67-16H11V2H5v2H3.33C2.6 4 2 4.6 2 5.33v15.34C2 21.4 2.6 22 3.33 22h9.34c.74 0 1.33-.59 1.33-1.33V5.33C14 4.6 13.4 4 12.67 4M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5zM5 14 11 14 11 15H5z',
			40: 'M12 20H4V6h8L12 20m.67-16H11V2H5v2H3.33C2.6 4 2 4.6 2 5.33v15.34C2 21.4 2.6 22 3.33 22h9.34c.74 0 1.33-.59 1.33-1.33V5.33C14 4.6 13.4 4 12.67 4M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5z',
			30: 'M12 20H4V6h8L12 20m.67-16H11V2H5v2H3.33C2.6 4 2 4.6 2 5.33v15.34C2 21.4 2.6 22 3.33 22h9.34c.74 0 1.33-.59 1.33-1.33V5.33C14 4.6 13.4 4 12.67 4M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5z',
			20: 'M12 20H4V6h8L12 20m.67-16H11V2H5v2H3.33C2.6 4 2 4.6 2 5.33v15.34C2 21.4 2.6 22 3.33 22h9.34c.74 0 1.33-.59 1.33-1.33V5.33C14 4.6 13.4 4 12.67 4M5.02 18.5v1L11 19.5 11 18.5z',
			//Empty Battery shell
			0: 'M12 20H4V6h8L12 20m.67-16H11V2H5v2H3.33C2.6 4 2 4.6 2 5.33v15.34C2 21.4 2.6 22 3.33 22h9.34c.74 0 1.33-.59 1.33-1.33V5.33C14 4.6 13.4 4 12.67 4',
		};
		return icon[lvl];
	}

	private static batteryCharge(lvl: number) {
		const charge = {
			//Battery Infill, no shell
			100: 'M11 19M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5zM5 14 11 14 11 15H5zM5 12.5 11 12.5 11 13.5H5zM5 11 11 11 11 12H5zM5 9.5 11 9.5 11 10.5H5zM5 8 11 8 11 9H5zM5 6.5 11 6.5 11 7.5H5z',
			90: 'M11 19M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5zM5 14 11 14 11 15H5zM5 12.5 11 12.5 11 13.5H5zM5 11 11 11 11 12H5zM5 9.5 11 9.5 11 10.5H5zM5 8 11 8 11 9H5z',
			80: 'M11 19M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5zM5 14 11 14 11 15H5zM5 12.5 11 12.5 11 13.5H5zM5 11 11 11 11 12H5zM5 9.5 11 9.5 11 10.5H5zH5z',
			70: 'M11 19M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5zM5 14 11 14 11 15H5zM5 12.5 11 12.5 11 13.5H5zM5 11 11 11 11 12H5zM5 11z',
			60: 'M11 19M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5zM5 14 11 14 11 15H5zM5 12.5 11 12.5 11 13.5H5z',
			50: 'M11 19M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5zM5 14 11 14 11 15H5zH5z',
			40: 'M11 19M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 16.5 11 16.5 11 15.5H5zH5z',
			30: 'M11 19M5.02 18.5v1L11 19.5 11 18.5zM5 18 11 18 11 17H5zM5 17z',
			20: 'M11 19M5.02 18.5v1L11 19.5 11 18.5zM5 19z',
			//Empty Battery shell
			0: 'M12 20H4V6h8L12 20m.67-16H11V2H5v2H3.33C2.6 4 2 4.6 2 5.33v15.34C2 21.4 2.6 22 3.33 22h9.34c.74 0 1.33-.59 1.33-1.33V5.33C14 4.6 13.4 4 12.67 4',
		};
		return charge[lvl];
	}
}
