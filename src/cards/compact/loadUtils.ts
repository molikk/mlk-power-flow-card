import { svg, TemplateResult } from 'lit';
import { CustomEntity } from '../../inverters/dto/custom-entity';
import { Utils } from '../../helpers/utils';

export class LoadUtils {

	static getIconWithCondition(condition: boolean, x: number, y: number, icon: string, style_class: string, size = 30) {
		return svg`
			<g display="${condition ? '' : 'none'}">
				<foreignObject x="${x}" y="${y}" width="${size}" height="${size}" style="position: fixed; ">
					<body xmlns="http://www.w3.org/1999/xhtml">
					<div style="position: fixed; ">
						<ha-icon icon="${icon}" class="${style_class}"></ha-icon>
					</div>
					</body>
				</foreignObject>
			</g>`;
	}

	static getIcon(x: number, y: number, icon: string, style_class: string, size = 30) {
		return svg`
			<foreignObject x="${x}" y="${y}" width="${size}" height="${size}" style="position: fixed; ">
				<body xmlns="http://www.w3.org/1999/xhtml">
				<div style="position: fixed; ">
					<ha-icon icon="${icon}" class="${style_class}"></ha-icon>
				</div>
				</body>
			</foreignObject>`;
	}

	static getIconLink(entity: string, icon: TemplateResult<2>) {
		return svg`
		${entity
			? svg`<a href="#" @click=${(e) => Utils.handlePopup(e, entity)}>${icon}</a>`
			: svg`${icon}`
		}
		`;
	}

	static generateLoad(
		type: string, id: number, icon: TemplateResult,
		color: string, shapeX: number, shapeY: number,
		name: string, nameX: number, nameY: number,
		power: CustomEntity, powerX: number, powerY: number,
		energy: CustomEntity, energyX: number, energyY: number,
		align: string, loadAutoScale: boolean, decimalPlaces: number,
	) {
		return svg`
			${icon}
			<rect id=${type}_load_frame-${id}" x="${shapeX}" y="${shapeY}" width="41" height="20" rx="4.5" ry="4.5" fill="none"
						stroke="${color}" pointer-events="all" />
			<text id="${type}_load_name-${id}" x="${nameX}" y="${nameY}" class="st3 st8 ${align}"
					fill="${color}">
				${name ? `${name}` : ''}
			</text>
			<a href="#" @click=${(e) => Utils.handlePopup(e, power.entity_id)}>
				<text id="${type}_load_power-${id}" x="${powerX}" y="${powerY}"
							display="${power.isValid() ? '' : 'none'}"
							class="st3 ${align}"
							fill="${color}">
					${power?.toPowerString(loadAutoScale, decimalPlaces)}
				</text>
			</a>
			<a href="#" @click=${(e) => Utils.handlePopup(e, energy.entity_id)}>
				<text id="${type}_load_extra-${id}" x="${energyX}" y="${energyY}"
							display="${energy.entity_id && energy.isValid() ? '' : 'none'}"
							class="st3 ${align}" fill="${color}">
					${energy.toNum(1)}
					${energy.getUOM()}
				</text>
			</a>`;
	}
}