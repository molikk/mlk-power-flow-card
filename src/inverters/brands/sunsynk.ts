import {InverterSettingsDto} from '../dto/inverter-settings.dto';
import {InverterModel} from '../../types';
import {localize} from '../../localize/localize';

export class Sunsynk extends InverterSettingsDto {
    brand = InverterModel.Sunsynk;
    statusGroups = {
        standby: {states: ['0', 'standby', 'stand-by'], color: 'blue', message: localize('common.standby')},
        selftest: {states: ['1', 'selftest', 'self-checking'], color: 'yellow', message: localize('common.selftest')},
        normal: {states: ['2', 'normal', 'ok'], color: 'green', message: localize('common.normal')},
        alarm: {states: ['3', 'alarm'], color: 'orange', message: localize('common.alarm')},
        fault: {states: ['4', 'fault'], color: 'red', message: localize('common.fault')},
    };
    image = 'data:image/png;base64,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'
}
