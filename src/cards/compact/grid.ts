import { DataDto, sunsynkPowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { Utils } from '../../helpers/utils';
import { UnitOfElectricalCurrent, UnitOfElectricPotential, UnitOfPower, validGridConnected, validGridDisconnected } from '../../const';
import { icons } from '../../helpers/icons';
import { CustomEntity } from '../../inverters/dto/custom-entity';
import { localize } from '../../localize/localize';

export class Grid {

	private static readonly _col1X = 103;
	private static readonly _col2X = 107;

	private static _gridColour: 'gray';
	private static _decimalPlaces: 2;

	static get gridColour(): 'gray' {
		return this._gridColour;
	}

	static set gridColour(value: 'gray') {
		this._gridColour = value;
	}


	static get decimalPlaces(): 2 {
		return this._decimalPlaces;
	}

	static set decimalPlaces(value: 2) {
		this._decimalPlaces = value;
	}

	static generateShapes(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			<rect x="105" y="203.5" width="70" height="30" rx="4.5" ry="4.5" fill="none"
				stroke="${data.gridColour}" pointer-events="all"
				display="${!config.show_grid ? 'none' : ''}"/>
		`;
	}

	static generatePhases(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			${this.generatePhasePower('L1', data.stateGridPowerL1, this._col1X, 241, config.grid.auto_scale)}
			${this.generatePhasePower('L2', data.stateGridPowerL2, this._col1X, 254, config.grid.auto_scale)}
			${this.generatePhasePower('L3', data.stateGridPowerL3, this._col1X, 267, config.grid.auto_scale)}
			
			${this.generatePhaseVoltage('L1', data.stateGridVoltageL1, this._col1X, 195)}
			${this.generatePhaseVoltage('L2', data.stateGridVoltageL2, this._col1X, 182)}
			${this.generatePhaseVoltage('L3', data.stateGridVoltageL3, this._col1X, 169)}
			
			${this.generatePhaseAmperage('L1', data.stateGridCurrentL1, this._col2X, 195)}
			${this.generatePhaseAmperage('L2', data.stateGridCurrentL2, this._col2X, 182)}
			${this.generatePhaseAmperage('L3', data.stateGridCurrentL3, this._col2X, 169)}
		`;
	}

	private static generatePhaseAmperage(
		id: string,
		entity: CustomEntity,
		x: number,
		y: number,
	) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, entity.entity_id)}>
				<text id="grid-current-${id}" x="${x}" y="${y}"
					  display="${entity.isValid() ? '' : 'none'}"
					  class="st3 left-align"
					  fill="${this.gridColour}">
					${entity.toStr(1) || 0} ${UnitOfElectricalCurrent.AMPERE}
				</text>
			</a>`;
	}

	private static generatePhaseVoltage(
		id: string,
		entity: CustomEntity,
		x: number,
		y: number,
	) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, entity.entity_id)}>
				<text id="grid-potencial-${id}" x="${x}" y="${y}"
					  display="${entity.isValid() ? '' : 'none'}"
					  class="st3 right-align"
					  fill="${this.gridColour}">
					${entity.toStr(1) || 0} ${UnitOfElectricPotential.VOLT}
				</text>
			</a>`;
	}

	private static generatePhasePower(
		id: string,
		entity: CustomEntity,
		x: number,
		y: number,
		autoScale: boolean,
	) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, entity.entity_id)}>
				<text id="grid-power-${id}" x="${x}" y="${y}"
					  display="${entity.isValid() ? '' : 'none'}"
					  class="st3 right-align"
					  fill="${this.gridColour}">
					${autoScale ? `${Utils.convertValue(entity, this.decimalPlaces) || 0}` : `${entity || 0} ${UnitOfPower.WATT}`}
				</text>
			</a>`;
	}

	static generateEnergyCost(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.energy_cost_buy)}>
				<text id="energy_cost" x="${this._col2X}" y="241" class="st3 left-align" 
					  fill="${data.gridImportColour}" 
					  display="${config.entities?.energy_cost_buy && data.stateEnergyCostBuy.isValid() ? '' : 'none'}" >
					${data.stateEnergyCostBuy.toStr(config.grid?.energy_cost_decimals || 2)} ${data.stateEnergyCostBuy.getUOM()}
				</text>
			</a>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.energy_cost_sell)}>
				<text id="energy_cost" x="${this._col2X}" y="254"  class="st3 left-align" 
					  fill="${data.gridExportColour}" 
					  display="${config.entities?.energy_cost_sell && data.stateEnergyCostSell.isValid() ? '' : 'none'}" >
					${data.stateEnergyCostSell.toStr(config.grid?.energy_cost_decimals || 2)} ${data.stateEnergyCostSell.getUOM()}
				</text>
			</a>
		`;
	}

	static generateGridName(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			<text x="5" y="${config.grid.show_daily_buy ? '296' : '267'}" class="st3 st8 left-align" fill="${data.gridColour}"
				  display="${!config.show_grid ? 'none' : ''}">${config.grid.grid_name}
			</text>`;
	}

	static generateFlowLines(data: DataDto) {
		return svg`
			<svg id="grid-flow">
				<path id="grid-line" d="M 175 218 L 215 218" fill="none" stroke="${data.gridColour}"
					  stroke-width="${data.gridLineWidth}" stroke-miterlimit="10" pointer-events="stroke"/>
				<circle id="grid-dot" cx="0" cy="0"
						r="${Math.min(2 + data.gridLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${data.totalGridPower === 0 ? 'transparent' : `${data.gridColour}`}">
					<animateMotion dur="${data.durationCur['grid']}s" repeatCount="indefinite"
								   keyPoints="${data.totalGridPower > 0?'0;1':'1;0'}"
								   keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#grid-line"/>
					</animateMotion>
				</circle>
			</svg>
			<svg id="grid1-flow">
				<path id="grid-line1" d="M 65 218 L 105 218" fill="none" stroke="${data.gridColour}"
					  stroke-width="${data.gridLineWidth}" stroke-miterlimit="10" pointer-events="stroke"/>
				<circle id="grid-dot1" cx="0" cy="0"
						r="${Math.min(2 + data.gridLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${data.totalGridPower === 0 ? 'transparent' : `${data.gridColour}`}">
					<animateMotion dur="${data.durationCur['grid']}s" repeatCount="indefinite"
								   keyPoints="${data.totalGridPower > 0?'0;1':'1;0'}"
								   keyTimes="0;1" calcMode="linear">
						<mpath xlink:href="#grid-line1"/>
					</animateMotion>
				</circle>
			</svg>		
		`;
	}

	static generateIcon(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.grid_connected_status_194)}>
				<svg xmlns="http://www.w3.org/2000/svg" id="transmission_on" x="-0.5" y="187.5"
					 width="64.5" height="64.5" viewBox="0 0 24 24">
					<path class="${validGridDisconnected.includes(data.gridStatus.toLowerCase()) ? 'st12' : ''}"
						  fill="${data.gridColour}"
						  display="${!config.show_grid || data.totalGridPower < 0 || config.grid.import_icon ? 'none' : ''}"
						  d="${icons.gridOn}"/>
				</svg>
				<svg xmlns="http://www.w3.org/2000/svg" id="transmission_off" x="-0.5" y="187.5"
					 width="64.5" height="64.5" viewBox="0 0 24 24">
					<path class="${validGridConnected.includes(data.gridStatus.toLowerCase()) ? 'st12' : ''}"
						  fill="${data.gridOffColour}" display="${!config.show_grid || config.grid.disconnected_icon ? 'none' : ''}"
						  d="${icons.gridOff}"/>
				</svg>
				<svg xmlns="http://www.w3.org/2000/svg" id="grid_export" x="-0.5" y="187.5"
					 width="64.5" height="64.5" viewBox="0 0 24 24">
					<path class="${validGridDisconnected.includes(data.gridStatus.toLowerCase()) ? 'st12' : ''}"
						  fill="${data.gridColour}"
						  display="${!config.show_grid || data.totalGridPower >= 0 || config.grid.export_icon ? 'none' : ''}"
						  d="${icons.gridExportCompact}"/>
				</svg>
			</a>
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.grid_connected_status_194)}>
				<g display="${config.show_grid || config.grid.import_icon || config.grid.disconnected_icon || config.grid.export_icon ? '' : 'none'}">
					<foreignObject x="-0.5" y="187.5" width="70" height="70" style="position: fixed; ">
						<body xmlns="http://www.w3.org/1999/xhtml">
						<div style="position: fixed; ">
							<ha-icon icon="${data.customGridIcon}" class="grid-icon"></ha-icon>
						</div>
						</body>
					</foreignObject>
				</g>
			</a>
			`;
	}

	static generatePrepaidUnits(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.prepaid_units)}>
				<text id="prepaid" x="31.5" y="257"
					  class="${config.entities?.prepaid_units ? 'st3' : 'st12'}"
					  fill="${data.gridColour}" display="${!config.show_grid || !data.statePrepaidUnits.isValid() ? 'none' : ''}">
					${data.statePrepaidUnits.toStr(1)} ${config.grid.prepaid_unit_name}
				</text>
			</a>
		`;
	}

	static generateDailyImport(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.day_grid_import_76)}>
				<text id="daily_grid_buy_value" x="5" y="270" class="st10 left-align"
					  display="${data.gridShowDailyBuy !== true || !data.stateDayGridImport.isValid() ? 'none' : ''}"
					  fill="${data.gridColour}">
					${data.stateDayGridImport?.toPowerString(true, data.decimalPlacesEnergy)}
				</text>
			</a>
			<text id="daily_grid_buy" x="5" y="284" class="st3 left-align"
				  fill="${data.gridShowDailyBuy !== true ? 'transparent' : `${data.gridColour}`}"
				  display="${!config.show_grid ? 'none' : ''}">
				${config.grid.label_daily_grid_buy}
			</text>
		`;
	}

	static generateDailyExport(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.day_grid_export_77)}>
				<text id="daily_grid_sell_value" x="5" y="150" class="st10 left-align"
					  display="${data.gridShowDailySell !== true || !data.stateDayGridExport.isValid() ? 'none' : ''}"
					  fill="${data.gridColour}">
					${data.stateDayGridExport?.toPowerString(true, data.decimalPlacesEnergy)}
				</text>
			</a>
			<text id="daily_grid_sell" x="5" y="164" class="st3 left-align"
				  fill="${data.gridShowDailySell !== true ? 'transparent' : `${data.gridColour}`}"
				  display="${!config.show_grid ? 'none' : ''}">
				${config.grid.label_daily_grid_sell}
			</text>
		`;
	}

	static generateLimit(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.max_sell_power)}>
				<text id="max_sell_power" x="5" y="179" class="st3 left-align"
					  fill="${['off', '0'].includes(data.stateSolarSell.state) ? 'grey' : data.gridColour}"
					  display="${!data.stateMaxSellPower.isValid || !config.entities?.max_sell_power ? 'none' : ''}">
					${localize('common.limit')}: ${data.stateMaxSellPower.toPowerString(config.grid.auto_scale, data.decimalPlaces)}
				</text>
			</a>`;
	}

	static generateTotalGridPower(data: DataDto, config: sunsynkPowerFlowCardConfig) {
		return svg`
			${config.inverter.three_phase
			? config.entities?.grid_ct_power_total
				? svg`
					<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.grid_ct_power_total)}>
						<text id="grid_total_power" x="140" y="219.2"
							  display="${!config.show_grid || config.entities.grid_ct_power_172 === 'none' ? 'none' : ''}"
							  class="${data.largeFont !== true ? 'st14' : 'st4'} st8" fill="${data.gridColour}">
							${config.grid.auto_scale
								? `${config.grid.show_absolute
									? `${Math.abs(parseFloat(Utils.convertValue(data.totalGridPower, data.decimalPlaces)))} ${Utils.convertValue(data.totalGridPower, data.decimalPlaces).split(' ')[1]}`
									: Utils.convertValue(data.totalGridPower, data.decimalPlaces) || 0}`
								: `${config.grid.show_absolute
									? `${Math.abs(data.totalGridPower)} ${UnitOfPower.WATT}`
									: `${data.totalGridPower || 0} ${UnitOfPower.WATT}`
								}`
							}
						</text>
					</a>`
				: svg`
					<text id="grid_total_power" x="140" y="219.2"
						  display="${!config.show_grid || config.entities.grid_ct_power_172 === 'none' ? 'none' : ''}"
						  class="${data.largeFont !== true ? 'st14' : 'st4'} st8" fill="${data.gridColour}">
						${config.grid.auto_scale
							? `${config.grid.show_absolute
								? `${Math.abs(parseFloat(Utils.convertValue(data.totalGridPower, data.decimalPlaces)))} ${Utils.convertValue(data.totalGridPower, data.decimalPlaces).split(' ')[1]}`
								: Utils.convertValue(data.totalGridPower, data.decimalPlaces) || 0}`
							: `${config.grid.show_absolute
								? `${Math.abs(data.totalGridPower)} ${UnitOfPower.WATT}`
								: `${data.totalGridPower || 0} ${UnitOfPower.WATT}`
							}`
						}
					</text>`
			: svg`
				<a href="#" @click=${(e) => Utils.handlePopup(e, config.entities.grid_ct_power_172)}>
					<text id="grid_total_power" x="140" y="219.2"
						  display="${!config.show_grid || config.entities.grid_ct_power_172 === 'none' ? 'none' : ''}"
						  class="${data.largeFont !== true ? 'st14' : 'st4'} st8" fill="${data.gridColour}">
						${config.grid.auto_scale
							? `${config.grid.show_absolute
								? `${Math.abs(parseFloat(Utils.convertValue(data.totalGridPower, data.decimalPlaces)))} ${Utils.convertValue(data.totalGridPower, data.decimalPlaces).split(' ')[1]}`
								: Utils.convertValue(data.totalGridPower, data.decimalPlaces) || 0}`
							: `${config.grid.show_absolute
								? `${Math.abs(data.totalGridPower)} ${UnitOfPower.WATT}`
								: `${data.totalGridPower || 0} ${UnitOfPower.WATT}`
							}`
						}
					</text>
				</a>`
			}		
		`;
	}
}