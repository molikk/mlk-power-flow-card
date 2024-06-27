import {InverterSettingsDto} from '../dto/inverter-settings.dto';
import {InverterModel} from '../../types';
import {localize} from '../../localize/localize';

export class SMASolar extends InverterSettingsDto {
    brand = InverterModel.SMASolar;
    statusGroups = {
        standby: {states: ['0', 'standby', 'stand-by'], color: 'blue', message: localize('common.standby')},
        selftest: {states: ['1', 'selftest', 'self-checking'], color: 'yellow', message: localize('common.selftest')},
        normal: {states: ['307: Ok (Ok)'], color: 'green', message: localize('common.normal')},
        alarm: {states: ['455: Warning (Wrn)'], color: 'orange', message: localize('common.alarm')},
        fault: {states: ['35: Fault (Alm)'], color: 'red', message: localize('common.fault')},
    };
    image = 'data:image/png;base64,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'
}