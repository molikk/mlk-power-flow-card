import { svg } from 'lit';
import { DataDto, PowerFlowCardConfig } from '../../types';

export class DevMode {

	static generateLoadTimes(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<text id="data_value" x="239" y="5" class="st15" fill="white">
				Data: ${data.refreshTime} Config: ${config.refresh_time}
			</text>`;
	}

	static generateUpdateMsg() {
		return svg`
			<text id="update" x="239" y="8" class="st14" fill="${new Date().getSeconds() % 2 == 0 ? "red" : "white"}">
				Schema update required! Go to config and save it (without making any changes)
			</text>`;
	}
}