import { svg, TemplateResult } from 'lit';
import { CustomEntity } from '../../inverters/dto/custom-entity';
import { Utils } from '../../helpers/utils';
import { localize } from '../../localize/localize';
import { UnitOfElectricalCurrent, UnitOfElectricPotential, UnitOfFrequency, UnitOfPower } from '../../const';
import { Load } from './load';

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
		return this.getIconWithCondition(true, x, y, icon, style_class, size);
	}

	static getIconWithStyleAndCondition(condition: boolean, x: number, y: number, icon: string, color: string, size = 30, icon_size = 20) {
		return svg`
			<g display="${condition ? '' : 'none'}">
				<foreignObject x="${x}" y="${y}" width="${size}" height="${size}" style="position: fixed; ">
					<body xmlns="http://www.w3.org/1999/xhtml">
					<div style="position: fixed; ">
						<ha-icon icon="${icon}" style="color: ${color} !important; --mdc-icon-size: ${icon_size}px;"></ha-icon>
					</div>
					</body>
				</foreignObject>
			</g>`;
	}

	static getIconWithStyle(x: number, y: number, icon: string, color: string, size = 30, icon_size = 20) {
		return this.getIconWithStyleAndCondition(true, x, y, icon, color, size, icon_size);
	}

	static getIconLink(entity: string, icon: TemplateResult<2>) {
		return entity
			? svg`<a href="#" @click=${(e) => Utils.handlePopup(e, entity)}>${icon}</a>`
			: svg`${icon}`;
	}

	static generateLoadItem(
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
				rx="4.5" ry="4.5" fill="none" stroke="${color}" pointer-events="all" 
				display="${power?.isValid() || toggle?.isValidSwitch() ? '' : 'none'}" />
			<text id="${type}_load_name-${id}" x="${nameX}" y="${nameY}" class="st3 st8" fill="${color}">
				${name ? `${name}` : ''}
			</text>
			${!power?.isValid() && toggle?.isValidSwitch() ?
			svg`
				<a href = "#" @click=${(e) => Utils.handlePopup(e, toggle?.entity_id)}>
					<text id="${type}_load_toggle-${id}" x="${powerX}" y="${powerY}"
							class="st3"
							fill="${color}">
						${localize('common.' + (toggle?.toOnOff() || 'off'))}
					</text>
				</a>
				`
			:
			svg`
				<a href = "#" @click=${(e) => Utils.handlePopup(e, power?.entity_id)}>
					<text id="${type}_load_power-${id}" x="${powerX}" y="${powerY}"
							display="${power?.isValid() ? '' : 'none'}"
							class="st3"
							fill="${color}">
						${power?.toPowerString(loadAutoScale, decimalPlaces)}
					</text>
				</a>`
		}
			<a href="#" @click=${(e) => Utils.handlePopup(e, energy?.entity_id)}>
				<text id="${type}_load_extra-${id}" x="${energyX}" y="${energyY}"
							display="${energy?.isValid() ? '' : 'none'}"
							class="st3" fill="${color}">
					${energy?.isValidElectric() ? energy?.toStr(1) : energy?.toString()}
					${energy?.getUOM()}
				</text>
			</a>`;
	}

	static generateEssentialLoadInternal(
		id: number, icon: string,
		color: string, name: string,
		power: CustomEntity, energy: CustomEntity, toggle: CustomEntity,
		loadAutoScale: boolean, decimalPlaces: number,
		mainX: number, mainY: number, xGaps: number[] = Load.xGaps, yGaps: number[] = Load.yGaps,
	) {
		const icon_link = LoadUtils.getIconLink(
			toggle?.entity_id,
			LoadUtils.getIconWithStyle(mainX + xGaps[0], mainY, icon, color),
		);

		return LoadUtils.generateLoadItem(
			'es', id, icon_link,
			color, mainX + xGaps[1], mainY + yGaps[0],
			name, mainX + xGaps[2], mainY + yGaps[1],
			power, mainX + xGaps[2], mainY + yGaps[2],
			energy, mainX + xGaps[2], mainY + yGaps[3],
			toggle, loadAutoScale, decimalPlaces,
		);
	}

	static generateEssentialLoad(
		ID: number, icon: string[],
		color: string[], name: string[],
		power: CustomEntity[], energy: CustomEntity[], toggle: CustomEntity[],
		loadAutoScale: boolean, decimalPlaces: number,
		column: number, mainY: number, xGaps: number[] = Load.xGaps, yGaps: number[] = Load.yGaps,
	) {
		const id = ID - 1;
		return LoadUtils.generateEssentialLoadInternal(
			ID, icon[id], color[id], name[id],
			power[id], energy[id], toggle[id],
			loadAutoScale, decimalPlaces,
			column, mainY, xGaps, yGaps,
		);
	}

	static generateGridLoad(
		id: number, icon: string,
		color: string, name: string,
		power: CustomEntity, energy: CustomEntity, toggle: CustomEntity,
		loadAutoScale: boolean, decimalPlaces: number,
		mainX: number, mainY: number, xGaps: number[] = Load.xGaps, yGaps: number[] = Load.yGaps,
	) {
		const icon_link = LoadUtils.getIconLink(
			toggle?.entity_id,
			LoadUtils.getIconWithStyle(mainX + xGaps[0], mainY, icon, color, 30, 20),
		);

		return LoadUtils.generateLoadItem(
			'nes', id, icon_link,
			color, mainX + xGaps[1], mainY + yGaps[0],
			name, mainX + xGaps[2], mainY + yGaps[1],
			power, mainX + xGaps[2], mainY + yGaps[2],
			energy, mainX + xGaps[2], mainY + yGaps[3],
			toggle, loadAutoScale, decimalPlaces,
		);
	}

	static generateAuxLoad(
		ID: number, icon: string[],
		color: string[], name: string[],
		power: CustomEntity[], energy: CustomEntity[], toggle: CustomEntity[],
		loadAutoScale: boolean, decimalPlaces: number,
		columns: number[], mainY: number, xGaps: number[] = Load.xGaps, yGaps: number[] = Load.yGaps,
	) {
		const id = ID - 1;
		return LoadUtils.generateAuxLoadInternal(
			ID, icon[id], color[id], name[id],
			power[id], energy[id], toggle[id],
			loadAutoScale, decimalPlaces,
			columns[id], mainY, xGaps, yGaps,
		);
	}

	static generateAuxLoadInternal(
		id: number, icon: string,
		color: string, name: string,
		power: CustomEntity, energy: CustomEntity, toggle: CustomEntity,
		loadAutoScale: boolean, decimalPlaces: number,
		mainX: number, mainY: number, xGaps: number[], yGaps: number[],
	) {
		const icon_link = LoadUtils.getIconLink(
			toggle?.entity_id,
			LoadUtils.getIconWithStyle(mainX + xGaps[0], mainY, icon, color, 30, 20),
		);

		return LoadUtils.generateLoadItem(
			'aux', id, icon_link,
			color, mainX + xGaps[1], mainY + yGaps[0],
			name, mainX + xGaps[2], mainY + yGaps[1],
			power, mainX + xGaps[2], mainY + yGaps[2],
			energy, mainX + xGaps[2], mainY + yGaps[3],
			toggle, loadAutoScale, decimalPlaces,
		);
	}


	static generateFrequency(entity: CustomEntity, color, id: string, x: number, y: number, align: string) {
		return entity?.isValid() ?
			svg`
            <a href="#" @click=${(e) => Utils.handlePopup(e, entity?.entity_id)}>
                <text id="${id}" x="${x}" y="${y}"
                      display="${entity?.isValid() ? '' : 'none'}"
                      class="st3 ${align}" fill="${color}">${entity?.toStr(1, false)} ${UnitOfFrequency.HERTZ}
                </text>
            </a>`
			: ``;
	}


	static generatePhaseAmperage(
		id: string,
		entity: CustomEntity,
		x: number,
		y: number,
		color,
	) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, entity?.entity_id)}>
				<text id="grid-current-${id}" x="${x}" y="${y}"
					  display="${entity?.isValid() ? '' : 'none'}"
					  class="st3 left-align"
					  fill="${color}">
					${entity?.toStr(1) || 0} ${UnitOfElectricalCurrent.AMPERE}
				</text>
			</a>`;
	}

	static generatePhaseVoltage(
		id: string,
		entity: CustomEntity,
		x: number,
		y: number,
		color,
	) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, entity?.entity_id)}>
				<text id="grid-potencial-${id}" x="${x}" y="${y}"
					  display="${entity?.isValid() ? '' : 'none'}"
					  class="st3 right-align"
					  fill="${color}">
					${entity?.toStr(1) || 0} ${UnitOfElectricPotential.VOLT}
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
		decimalPlaces: number,
	) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, entity?.entity_id)}>
				<text id="grid-power-${id}" x="${x}" y="${y}"
					  display="${entity?.isValid() ? '' : 'none'}"
					  class="st3 right-align"
					  fill="${color}">
					${autoScale ? `${Utils.convertValue(entity, decimalPlaces) || 0}` : `${entity || 0} ${UnitOfPower.WATT}`}
				</text>
			</a>`;
	}
}