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

						.essload9_small-icon {
							color: ${data.dynamicColourEssentialLoad9} !important;
							--mdc-icon-size: 20px;
						}

						.essload10_small-icon {
							color: ${data.dynamicColourEssentialLoad10} !important;
							--mdc-icon-size: 20px;
						}

						.essload11_small-icon {
							color: ${data.dynamicColourEssentialLoad11} !important;
							--mdc-icon-size: 20px;
						}

						.essload12_small-icon {
							color: ${data.dynamicColourEssentialLoad12} !important;
							--mdc-icon-size: 20px;
						}

						.essload13_small-icon {
							color: ${data.dynamicColourEssentialLoad13} !important;
							--mdc-icon-size: 20px;
						}

						.essload14_small-icon {
							color: ${data.dynamicColourEssentialLoad14} !important;
							--mdc-icon-size: 20px;
						}

						.essload15_small-icon {
							color: ${data.dynamicColourEssentialLoad15} !important;
							--mdc-icon-size: 20px;
						}

						.essload16_small-icon {
							color: ${data.dynamicColourEssentialLoad16} !important;
							--mdc-icon-size: 20px;
						}

						.essload17_small-icon {
							color: ${data.dynamicColourEssentialLoad17} !important;
							--mdc-icon-size: 20px;
						}

						.essload18_small-icon {
							color: ${data.dynamicColourEssentialLoad18} !important;
							--mdc-icon-size: 20px;
						}

						.essload19_small-icon {
							color: ${data.dynamicColourEssentialLoad19} !important;
							--mdc-icon-size: 20px;
						}

						.essload20_small-icon {
							color: ${data.dynamicColourEssentialLoad20} !important;
							--mdc-icon-size: 20px;
						}

						.essload21_small-icon {
							color: ${data.dynamicColourEssentialLoad21} !important;
							--mdc-icon-size: 20px;
						}

						.essload22_small-icon {
							color: ${data.dynamicColourEssentialLoad22} !important;
							--mdc-icon-size: 20px;
						}

						.essload23_small-icon {
							color: ${data.dynamicColourEssentialLoad23} !important;
							--mdc-icon-size: 20px;
						}

						.aux-load1_small-icon {
							color: ${data.auxLoadDynamicColour[0]} !important;
							--mdc-icon-size: 20px;
						}

						.aux-load2_small-icon {
							color: ${data.auxLoadDynamicColour[1]} !important;
							--mdc-icon-size: 20px;
						}

						.aux-load3_small-icon {
							color: ${data.auxLoadDynamicColour[2]} !important;
							--mdc-icon-size: 20px;
						}

						.aux-load4_small-icon {
							color: ${data.auxLoadDynamicColour[3]} !important;
							--mdc-icon-size: 20px;
						}


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