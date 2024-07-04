import { svg, TemplateResult } from 'lit';
import { CustomEntity } from '../../inverters/dto/custom-entity';
import { Utils } from '../../helpers/utils';
import { localize } from '../../localize/localize';
import { UnitOfElectricalCurrent, UnitOfElectricPotential, UnitOfFrequency, UnitOfPower } from '../../const';

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
		toggle: CustomEntity, loadAutoScale: boolean, decimalPlaces: number,
	) {
		return svg`
			${icon}
			<rect id=${type}_load_frame-${id}" x="${shapeX}" y="${shapeY}" width="41" height="20" 
				rx="4.5" ry="4.5" fill="none" stroke="${color}" pointer-events="all" />
			<text id="${type}_load_name-${id}" x="${nameX}" y="${nameY}" class="st3 st8" fill="${color}">
				${name ? `${name}` : ''}
			</text>
			${!power.isValid() && toggle.isValidSwitch()?
				svg`
				<a href = "#" @click=${(e) => Utils.handlePopup(e, toggle.entity_id)}>
					<text id="${type}_load_toggle-${id}" x="${powerX}" y="${powerY}"
							class="st3"
							fill="${color}">
						${localize('common.' + (toggle?.toOnOff() || 'off'))}
					</text>
				</a>
				`
			:
				svg`
				<a href = "#" @click=${(e) => Utils.handlePopup(e, power.entity_id)}>
					<text id="${type}_load_power-${id}" x="${powerX}" y="${powerY}"
							display="${power.isValid() ? '' : 'none'}"
							class="st3"
							fill="${color}">
						${power?.toPowerString(loadAutoScale, decimalPlaces)}
					</text>
				</a>`
			}
			<a href="#" @click=${(e) => Utils.handlePopup(e, energy.entity_id)}>
				<text id="${type}_load_extra-${id}" x="${energyX}" y="${energyY}"
							display="${energy.entity_id && energy.isValid() ? '' : 'none'}"
							class="st3" fill="${color}">
					${energy.toNum(1)}
					${energy.getUOM()}
				</text>
			</a>`;
	}

	static generateFrequency(entity: CustomEntity, color, id: string, x: number, y: number, align: string) {
		return entity?.isValid()?
			svg`
            <a href="#" @click=${(e) => Utils.handlePopup(e, entity?.entity_id)}>
                <text id="${id}" x="${x}" y="${y}"
                      display="${entity?.isValid()? '': 'none'}"
                      class="st3 ${align}" fill="${color}">${entity.toStr(1, false)} ${UnitOfFrequency.HERTZ}
                </text>
            </a>`
			:``;
	}


	static generatePhaseAmperage(
		id: string,
		entity: CustomEntity,
		x: number,
		y: number,
		color
	) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, entity.entity_id)}>
				<text id="grid-current-${id}" x="${x}" y="${y}"
					  display="${entity.isValid() ? '' : 'none'}"
					  class="st3 left-align"
					  fill="${color}">
					${entity.toStr(1) || 0} ${UnitOfElectricalCurrent.AMPERE}
				</text>
			</a>`;
	}

	static generatePhaseVoltage(
		id: string,
		entity: CustomEntity,
		x: number,
		y: number,
		color
	) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, entity.entity_id)}>
				<text id="grid-potencial-${id}" x="${x}" y="${y}"
					  display="${entity.isValid() ? '' : 'none'}"
					  class="st3 right-align"
					  fill="${color}">
					${entity.toStr(1) || 0} ${UnitOfElectricPotential.VOLT}
				</text>
			</a>`;
	}

	 static generatePhasePower(
		id: string,
		entity: CustomEntity,
		x: number,
		y: number,
		autoScale: boolean,
		color,
		decimalPlaces: number
	) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, entity.entity_id)}>
				<text id="grid-power-${id}" x="${x}" y="${y}"
					  display="${entity.isValid() ? '' : 'none'}"
					  class="st3 right-align"
					  fill="${color}">
					${autoScale ? `${Utils.convertValue(entity, decimalPlaces) || 0}` : `${entity || 0} ${UnitOfPower.WATT}`}
				</text>
			</a>`;
	}
}