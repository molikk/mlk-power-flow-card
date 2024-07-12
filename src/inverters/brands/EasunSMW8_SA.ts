import {InverterSettingsDto} from '../dto/inverter-settings.dto';
import {InverterModel} from '../../types';
import {localize} from '../../localize/localize';

//Easun from SolarAssistant
export class EasunSMW8_SA extends InverterSettingsDto {
    brand = InverterModel.EasunSMW8_SA;
    statusGroups = {
        standby: {states: ['0', 'standby'], color: 'blue', message: localize('common.standby')},
        solar_battery: {states: ['1', 'solar/battery'], color: 'green', message: 'Solar/Battery'},
        grid: {states: ['2', 'grid'], color: 'orange', message: 'Grid'},
        power_saving: {states: ['3', 'power saving'], color: 'rgb(0,150,200)', message: 'Power saving'},
        power_on: {states: ['4', 'power on'], color: '#5fb6ad', message: 'Power on'},
        fault: {states: ['5', 'fault'], color: 'red', message: localize('common.fault')},
    };

    image = 'data:image/png;base64,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'
}
