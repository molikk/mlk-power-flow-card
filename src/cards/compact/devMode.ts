import { svg } from 'lit';
import { DataDto, PowerFlowCardConfig } from '../../types';

export class DevMode{

	static generateLoadTimes(data: DataDto, config: PowerFlowCardConfig)  {

		return svg`
			<text id="$data_value" x="239" y="5" class="st15" fill="white">
					Data: ${data.refreshTime} Config: ${config.refresh_time}
				</text>`;
	}
}