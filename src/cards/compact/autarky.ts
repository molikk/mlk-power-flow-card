import { svg } from 'lit';
import { AutarkyType, DataDto } from '../../types';
import { localize } from '../../localize/localize';

export class Autarky {
	private static readonly mainX = 120;
	private static readonly mainY = 267;

	static getTexts(data: DataDto) {
		const autarky=this.mainX;
		const ratio = this.mainX + 46;
		return svg`
			<text id="autarkye_value" x="${autarky}" y="${this.mainY}"
				display="${data.enableAutarky === AutarkyType.No ? 'none' : ''}"
				class="${data.enableAutarky === AutarkyType.Energy ? 'st4 st8 left-align' : 'st12'}"
				fill="${data.inverterColour}">${data.autarkyEnergy}%
			</text>
			<text id="ratioe_value" x="${ratio}" y="${this.mainY}"
				display="${data.enableAutarky === AutarkyType.No ? 'none' : ''}"
				class="${data.enableAutarky === AutarkyType.Energy ? 'st4 st8 left-align' : 'st12'}"
				fill="${data.inverterColour}">${data.ratioEnergy}%
			</text>
			<text id="autarkyp_value" x="${autarky}" y="${this.mainY}"
				display="${data.enableAutarky === AutarkyType.No ? 'none' : ''}"
				class="${data.enableAutarky === AutarkyType.Power ? 'st4 st8 left-align' : 'st12'}"
				fill="${data.inverterColour}">${data.autarkyPower}%
			</text>
			<text id="ratiop_value" x="${ratio}" y="${this.mainY}"
				display="${data.enableAutarky === AutarkyType.No ? 'none' : ''}"
				class="${data.enableAutarky === AutarkyType.Power ? 'st4 st8 left-align' : 'st12'}"
				fill="${data.inverterColour}">${data.ratioPower}%
			</text>
			<text id="autarkyas_value" x="${autarky}" y="${this.mainY}"
				display="${data.enableAutarky === AutarkyType.No ? 'none' : ''}"
				class="${data.enableAutarky === AutarkyType.AutoSelf ? 'st4 st8 left-align' : 'st12'}"
				fill="${data.inverterColour}">${data.autarkyAuto}%
			</text>
			<text id="ratioas_value" x="${ratio}" y="${this.mainY}"
				display="${data.enableAutarky === AutarkyType.No ? 'none' : ''}"
				class="${data.enableAutarky === AutarkyType.AutoSelf ? 'st4 st8 left-align' : 'st12'}"
				fill="${data.inverterColour}">${data.autarkySelf}%
			</text>
			<text id="autarky" x="${autarky}" y="${this.mainY+13}" display="${data.enableAutarky === AutarkyType.No ? 'none' : ''}"
				class="st3 left-align" fill="${data.inverterColour}">
			${data.enableAutarky === AutarkyType.AutoSelf ? localize('common.autarkyAuto') : localize('common.autarky')}
			</text>
			<text id="ratio" x="${ratio}" y="${this.mainY+13}" display="${data.enableAutarky === AutarkyType.No ? 'none' : ''}"
				class="st3 left-align" fill="${data.inverterColour}">
			${data.enableAutarky === AutarkyType.AutoSelf ? localize('common.autarkySelf') : localize('common.ratio')}
			</text> 
    `;
	}
}