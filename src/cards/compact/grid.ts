import { DataDto, PowerFlowCardConfig } from '../../types';
import { svg } from 'lit';
import { Utils } from '../../helpers/utils';
import { UnitOfPower, validGridConnected, validGridDisconnected } from '../../const';
import { icons } from '../../helpers/icons';
import { localize } from '../../localize/localize';
import { LoadUtils } from './loadUtils';

export class Grid {

	private static readonly _col1X = 103;
	private static readonly _col2X = 107;
	private static readonly _col3X = 137;

	private static _gridColour: string = 'gray';
	private static _decimalPlaces: 2;

	static get gridColour(): string {
		return this._gridColour;
	}

	static set gridColour(value: string) {
		this._gridColour = value;
	}

	static get decimalPlaces(): 2 {
		return this._decimalPlaces;
	}

	static set decimalPlaces(value: 2) {
		this._decimalPlaces = value;
	}

	static generateShapeAndName(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<rect x="105" y="203.5" width="70" height="30" rx="4.5" ry="4.5" fill="none"
				stroke="${data.gridColour}" pointer-events="all"/>
			<text x="108" y="208.5" class="st16 st8 left-align" fill="${data.gridColour}">
				${config.grid.grid_name}
			</text>`;
	}

	static generatePhases(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			${LoadUtils.generatePhasePower('L1', data.stateGridPowerL1, this._col1X, 241, config.grid.auto_scale, this.gridColour, this.decimalPlaces)}
			${LoadUtils.generatePhasePower('L2', data.stateGridPowerL2, this._col1X, 254, config.grid.auto_scale, this.gridColour, this.decimalPlaces)}
			${LoadUtils.generatePhasePower('L3', data.stateGridPowerL3, this._col1X, 267, config.grid.auto_scale, this.gridColour, this.decimalPlaces)}
			
			${LoadUtils.generatePhaseVoltage('L1', data.stateGridVoltageL1, this._col1X, 195, this.gridColour)}
			${LoadUtils.generatePhaseVoltage('L2', data.stateGridVoltageL2, this._col1X, 182, this.gridColour)}
			${LoadUtils.generatePhaseVoltage('L3', data.stateGridVoltageL3, this._col1X, 169, this.gridColour)}
			
			${LoadUtils.generatePhaseAmperage('L1', data.stateGridCurrentL1, this._col2X, 195, this.gridColour)}
			${LoadUtils.generatePhaseAmperage('L2', data.stateGridCurrentL2, this._col2X, 182, this.gridColour)}
			${LoadUtils.generatePhaseAmperage('L3', data.stateGridCurrentL3, this._col2X, 169, this.gridColour)}
		`;
	}

	static generateFrequency(data: DataDto) {
		return svg`${LoadUtils.generateFrequency(data.stateGridFrequency, data.gridColour, 'grid_frequency', this._col1X, 208, 'right-align')}`;
	}


	static generateEnergyCost(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e:Event) => Utils.handlePopup(e, config.entities.energy_cost_buy)}>
				<text id="energy_cost" x="${this._col3X}" y="182" class="st3 left-align" 
					  fill="${data.gridImportColour}" 
					  display="${config.entities?.energy_cost_buy && data.stateEnergyCostBuy.isValid() ? '' : 'none'}" >
					${data.stateEnergyCostBuy.toStr(config.grid?.energy_cost_decimals || 2)} ${data.stateEnergyCostBuy.getUOM()}
				</text>
			</a>
			<a href="#" @click=${(e:Event) => Utils.handlePopup(e, config.entities.energy_cost_sell)}>
				<text id="energy_cost" x="${this._col3X}" y="195"  class="st3 left-align" 
					  fill="${data.gridExportColour}" 
					  display="${config.entities?.energy_cost_sell && data.stateEnergyCostSell.isValid() ? '' : 'none'}" >
					${data.stateEnergyCostSell.toStr(config.grid?.energy_cost_decimals || 2)} ${data.stateEnergyCostSell.getUOM()}
				</text>
			</a>
		`;
	}

	static generateFlowLines(data: DataDto, config: PowerFlowCardConfig, xTransform: number) {
		let keyPoints = data.totalGridPower > 0 ? '0;1' : '1;0';
		keyPoints = config.grid.invert_flow ? Utils.invertKeyPoints(keyPoints) : keyPoints;

		const lineEnd = 215 + xTransform;
		const animationDuration = (lineEnd - 175) / (215 - 175) * data.durationCur['grid'];

		let circle1 = this.getCircle(data.totalGridPower > 0, 'grid-dot1', data, animationDuration, keyPoints, '#grid-line1');
		let circle2 = this.getCircle(data.totalGridPower > 0, 'grid-dot2', data, data.durationCur['grid'], keyPoints, '#grid-line2');

		return svg`
			<svg id="grid-flow1" style="overflow: visible">
				<path id="grid-line1" d="M 175 218 L ${lineEnd} 218" fill="none" stroke="${data.gridColour}"
					  stroke-width="${data.gridLineWidth}" stroke-miterlimit="10" pointer-events="stroke"/>
				${circle1}
			</svg>
			<svg id="grid-flow2" style="overflow: visible">
				<path id="grid-line2" d="M 65 218 L 105 218" fill="none" stroke="${data.gridColour}"
					  stroke-width="${data.gridLineWidth}" stroke-miterlimit="10" pointer-events="stroke"/>
				${circle2}
			</svg>`;
	}

	private static getCircle(condition: boolean, circleId: string, data: DataDto, animationDuration: number, keyPoints: string, lineId: string) {
		return condition ? svg`
				<circle id="${circleId}" cx="0" cy="0"
						r="${Math.min(2 + data.gridLineWidth + Math.max(data.minLineWidth - 2, 0), 8)}"
						fill="${data.gridColour}">
					<animateMotion dur="${animationDuration}s" repeatCount="indefinite"
								   keyPoints="${keyPoints}"
								   keyTimes="0;1" calcMode="linear">
						<mpath href='${lineId}'/>
					</animateMotion>
				</circle>` : svg``;
	}

	static generateIcon(data: DataDto, config: PowerFlowCardConfig) {
		const grid = svg`
				<svg xmlns="http://www.w3.org/2000/svg" id="transmission_on" x="-0.5" y="187.5"
					 width="64.5" height="64.5" viewBox="0 0 24 24" style="overflow: visible">
					<path class="${validGridDisconnected.includes(data.gridStatus.toLowerCase()) ? 'st12' : ''}"
						  fill="${data.gridColour}"
						  display="${data.totalGridPower < 0 || config.grid.import_icon ? 'none' : ''}"
						  d="${icons.gridOn}"/>
				</svg>
				<svg xmlns="http://www.w3.org/2000/svg" id="transmission_off" x="-0.5" y="187.5"
					 width="64.5" height="64.5" viewBox="0 0 24 24" style="overflow: visible">
					<path class="${validGridConnected.includes(data.gridStatus.toLowerCase()) ? 'st12' : ''}"
						  fill="${data.gridOffColour}" display="${config.grid.disconnected_icon ? 'none' : ''}"
						  d="${icons.gridOff}"/>
				</svg>
				<svg xmlns="http://www.w3.org/2000/svg" id="grid_export" x="-0.5" y="187.5"
					 width="64.5" height="64.5" viewBox="0 0 24 24" style="overflow: visible">
					<path class="${validGridDisconnected.includes(data.gridStatus.toLowerCase()) ? 'st12' : ''}"
						  fill="${data.gridColour}"
						  display="${data.totalGridPower >= 0 || config.grid.export_icon ? 'none' : ''}"
						  d="${icons.gridExportCompact}"/>
				</svg>
			`;
		const custom_grid = svg`
				<g display="${config.grid.import_icon || config.grid.disconnected_icon || config.grid.export_icon ? '' : 'none'}">
					<foreignObject x="-0.5" y="187.5" width="70" height="70">
						<div xmlns="http://www.w3.org/1999/xhtml"  style="position: fixed;; width: 70px; height: 70px; ">
							<ha-icon icon="${data.customGridIcon}" 
							style="color: ${data.customGridIconColour} !important; --mdc-icon-size: 64px;" />
						</div>
					</foreignObject>
				</g>
			`;
		return config.grid?.navigate ?
			svg`
				 <a href="#" @click=${(e:Event) => Utils.handleNavigation(e, config.grid.navigate)}>
				    ${grid}
				</a>
				 <a href="#" @click=${(e:Event) => Utils.handleNavigation(e, config.grid.navigate)}>
				    ${custom_grid}
				</a> `
			: svg`
				<a href="#" @click=${(e:Event) => Utils.handlePopup(e, config.entities.grid_connected_status_194)}>
					${grid}
				</a>
				<a href="#" @click=${(e:Event) => Utils.handlePopup(e, config.entities.grid_connected_status_194)}>
					${custom_grid}
				</a>
			`;
	}

	static generatePrepaidUnits(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e:Event) => Utils.handlePopup(e, config.entities.prepaid_units)}>
				<text id="prepaid" x="31.5" y="257"
					  class="${config.entities?.prepaid_units ? 'st3' : 'st12'}"
					  fill="${data.gridColour}" display="${!data.statePrepaidUnits.isValid() ? 'none' : ''}">
					${data.statePrepaidUnits.toStr(1)} ${config.grid.prepaid_unit_name}
				</text>
			</a>
		`;
	}

	static generateDailyImport(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e:Event) => Utils.handlePopup(e, config.entities.day_grid_import_76)}>
				<text id="daily_grid_buy_value" x="5" y="270" class="st10 left-align"
					  display="${data.gridShowDailyBuy !== true || !data.stateDayGridImport.isValid() ? 'none' : ''}"
					  fill="${data.gridColour}">
					${data.stateDayGridImport?.toPowerString(true, data.decimalPlacesEnergy)}
				</text>
			</a>
			<text id="daily_grid_buy" x="5" y="284" class="st3 left-align"
				  fill="${data.gridShowDailyBuy !== true ? 'transparent' : `${data.gridColour}`}">
				${config.grid.label_daily_grid_buy}
			</text>
		`;
	}

	static generateDailyExport(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e:Event) => Utils.handlePopup(e, config.entities.day_grid_export_77)}>
				<text id="daily_grid_sell_value" x="5" y="150" class="st10 left-align"
					  display="${data.gridShowDailySell !== true || !data.stateDayGridExport.isValid() ? 'none' : ''}"
					  fill="${data.gridColour}">
					${data.stateDayGridExport?.toPowerString(true, data.decimalPlacesEnergy)}
				</text>
			</a>
			<text id="daily_grid_sell" x="5" y="164" class="st3 left-align"
				  fill="${data.gridShowDailySell !== true ? 'transparent' : `${data.gridColour}`}">
				${config.grid.label_daily_grid_sell}
			</text>
		`;
	}

	static generateLimit(data: DataDto, config: PowerFlowCardConfig) {
		return svg`
			<a href="#" @click=${(e:Event) => Utils.handlePopup(e, config.entities.max_sell_power)}>
				<text id="max_sell_power" x="5" y="179" class="st3 left-align"
					  fill="${['off', '0'].includes(data.stateSolarSell.state) ? 'grey' : data.gridColour}"
					  display="${!data.stateMaxSellPower.isValid || !config.entities?.max_sell_power ? 'none' : ''}">
					${localize('common.limit')}: ${data.stateMaxSellPower.toPowerString(config.grid.auto_scale, data.decimalPlaces)}
				</text>
			</a>`;
	}

	static generateTotalGridPower(data: DataDto, config: PowerFlowCardConfig) {
		const totalGridPower = config.grid.auto_scale
			? `${config.grid.show_absolute
				? `${Math.abs(parseFloat(Utils.convertValue(data.totalGridPower, data.decimalPlaces)))} ${Utils.convertValue(data.totalGridPower, data.decimalPlaces).split(' ')[1]}`
				: Utils.convertValue(data.totalGridPower, data.decimalPlaces) || 0}`
			: `${config.grid.show_absolute
				? `${Math.abs(data.totalGridPower)} ${UnitOfPower.WATT}`
				: `${data.totalGridPower || 0} ${UnitOfPower.WATT}`
			}`;
		return svg`
			${config.inverter.three_phase && config.entities?.grid_ct_power_total
			? svg`
				<a href="#" @click=${(e:Event) => Utils.handlePopup(e, config.entities.grid_ct_power_total)}>
					<text id="grid_total_power" x="140" y="220"
						  display="${config.entities.grid_ct_power_total === 'none' ? 'none' : ''}"
						  class="${data.largeFont !== true ? 'st14' : 'st4'} st8" fill="${data.gridColour}">
						${totalGridPower}
					</text>
				</a>`
			: svg`
				<a href="#" @click=${(e:Event) => Utils.handlePopup(e, config.entities.grid_ct_power_172)}>
					<text id="grid_total_power" x="140" y="220"
				  			display="${config.entities.grid_ct_power_172 === 'none' ? 'none' : ''}"
				  			class="${data.largeFont !== true ? 'st14' : 'st4'} st8" fill="${data.gridColour}">
						${totalGridPower}
					</text>
				</a>`
			}		
		`;
	}
}