import { html } from 'lit';
import { DataDto } from '../../types';

export class Style {

	static getStyle(data: DataDto) {
		return html`
			<style>
				.essload1-icon {
					color: ${data.dynamicColourEssentialLoad1} !important;
					--mdc-icon-size: 32px;
				}

				.essload2-icon {
					color: ${data.dynamicColourEssentialLoad2} !important;
					--mdc-icon-size: 32px;
				}

				.essload1_small-icon {
					color: ${data.dynamicColourEssentialLoad1} !important;
					--mdc-icon-size: 20px;
				}

				.essload2_small-icon {
					color: ${data.dynamicColourEssentialLoad2} !important;
					--mdc-icon-size: 20px;
				}
								
				.essload3_small-icon {
					color: ${data.dynamicColourEssentialLoad3} !important;
					--mdc-icon-size: 20px;
				}

				.essload4_small-icon {
					color: ${data.dynamicColourEssentialLoad4} !important;
					--mdc-icon-size: 20px;
				}

				.essload5_small-icon {
					color: ${data.dynamicColourEssentialLoad5} !important;
					--mdc-icon-size: 20px;
				}

				.essload6_small-icon {
					color: ${data.dynamicColourEssentialLoad6} !important;
					--mdc-icon-size: 20px;
				}

				.essload7_small-icon {
					color: ${data.dynamicColourEssentialLoad7} !important;
					--mdc-icon-size: 20px;
				}

				.essload8_small-icon {
					color: ${data.dynamicColourEssentialLoad8} !important;
					--mdc-icon-size: 20px;
				}

				.nes-load-icon {
					color: ${data.dynamicColourNonEssentialLoad} !important;
					--mdc-icon-size: 32px;
				}

				.nes-load1_small-icon {
					color: ${data.dynamicColourNonEssentialLoad1} !important;
					--mdc-icon-size: 24px;
				}

				.nes-load2_small-icon {
					color: ${data.dynamicColourNonEssentialLoad2} !important;
					--mdc-icon-size: 24px;
				}

				.nes-load3_small-icon {
					color: ${data.dynamicColourNonEssentialLoad3} !important;
					--mdc-icon-size: 24px;
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