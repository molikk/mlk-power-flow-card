import { html } from 'lit';
import { DataDto } from '../../types';

export class Style {

	static getStyle(data: DataDto) {
		return html`
					<style>
					  	.nes-load-icon {
							color: ${data.nonEssentialLoadMainDynamicColour} !important;
							--mdc-icon-size: 32px;
						}

						.nes-load1_small-icon {
							color: ${data.nonEssentialLoadDynamicColour[1-1]} !important;
							--mdc-icon-size: 20px;
						}

						.nes-load2_small-icon {
							color: ${data.nonEssentialLoadDynamicColour[2-1]} !important;
							--mdc-icon-size: 20px;
						}

						.nes-load3_small-icon {
							color: ${data.nonEssentialLoadDynamicColour[3-1]} !important;
							--mdc-icon-size: 20px;
						}

						.nes-load4_small-icon {
							color: ${data.nonEssentialLoadDynamicColour[4-1]} !important;
							--mdc-icon-size: 20px;
						}

						.nes-load5_small-icon {
							color: ${data.nonEssentialLoadDynamicColour[5-1]} !important;
							--mdc-icon-size: 20px;
						}

						.nes-load6_small-icon {
							color: ${data.nonEssentialLoadDynamicColour[6-1]} !important;
							--mdc-icon-size: 20px;
						}

						.grid-icon {
							color: ${data.customGridIconColour} !important;
							--mdc-icon-size: 64px;
						}

						.small_ac_dc_icon {
							color: ${data.inverterColour} !important;
							--mdc-icon-size: 10px;
						}
					</style>`;
	}
}