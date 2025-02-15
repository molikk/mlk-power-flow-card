---
myst:
  enable_extensions: [ "colon_fence" ]
---

# Configuration

The card can be configured through the following attributes:

| Editor name (en)        | Attribute          | Default                                                  | Description                                                  |
|-------------------------|--------------------|----------------------------------------------------------|--------------------------------------------------------------|
|                         | type:              | **Required** `custom:mlk-power-flow-card`                | The custom card                                              |
| Title Options           | title:             | See [Title](#title) attributes below                     | List of title attributes.                                    |
| General Options         | general:           | See [General](#general) attributes below                 | List of general attributes.                                  |
| Inverter Options        | inverter:          | See [Inverter](#inverter) attributes below               | List of inverter attributes.                                 |
| Solar Options           | solar:             | See [Solar](#solar) attributes below                     | List of solar attributes. Required if `show_solar: true`     |
| Battery Options         | battery:           | See [Battery](#battery) attributes below                 | List of battery attributes. Required if `show_battery: true` |
| Battery Bank Options    | (part of battery:) | See [Battery Banks](#battery-banks) attributes below     | List of battery bank attributes.                             |
| Load Options            | load:              | See [Load](#load) attributes below                       | List of load attributes.                                     |
| Additional Load Options | (part of load:)    | See [Additional Load](#additional-load) attributes below | List of auxiliary load attributes.                           |
| Aux Load Options        | (part of load:)    | See [Aux Load](#aux-load) attributes below               | List of auxiliary load attributes.                           |
| Grid Options            | grid:              | See [Grid](#grid) attributes below                       | List of grid attributes. Required if `show_grid: true`       |
| Grid Load Options       | (part of grid:)    | See [Grid Load](#grid-load) attributes below             | List of grid loads attributes.                               |                   

## Title

| Editor name (en) | Attribute     | Default | Description                                                     |
|------------------|---------------|---------|-----------------------------------------------------------------|
| Title            | title:        |         | Set the card title i.e. Inverter One                            |
| Title Colour     | title_colour: |         | Sets the colour of the card title. (`red`, `green`, `blue` etc) |
| Title Size (px)  | title_size:   | `32px`  | Set the font size for the card title i.e. `16px`, `24px`        |

## General

| Editor name (en)              | Attribute                          | Default | Description                                                                                                                                                                                               |
|-------------------------------|------------------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Large Font                    | large_font:                        | `false` | Increases font size of sensor data                                                                                                                                                                        |
| Wide View                     | wide_view_mode:                    | `false` | Toggles panel mode setting card width to `720px`. For use with Panel(1 card) view types or grid layouts                                                                                                   |
| Card Height (px or %)         | card_height:                       | `100%`  | Sets the card height in pixels or percentage. Specify the value i.e. `400px` or provide a sensor i.e. `input.number_height`                                                                               |
| Card Width (px or %)          | card_width:                        | `100%`  | Sets the card width in pixels or percentage. Specify the value i.e. `400px`, `80%` or provide a sensor i.e. `input.number_width`. For adjustments when using the Panel(1 card) view types or grid layouts |
| Show Solar                    | show_solar:                        | `true`  | Toggle display of solar information                                                                                                                                                                       |
| Show Battery                  | show_battery:                      | `true`  | Toggle display of battery information                                                                                                                                                                     |
| Show Grid                     | show_grid:                         | `true`  | Toggle display of grid information                                                                                                                                                                        |
| Align grid to left            | align_grid:                        | `false` | Aligns grid group to left side of viewbox. Use with [Viewbox:min-x](#general-viewbox)                                                                                                                     |
| Align load to right           | align_load:                        | `false` | Aligns load and AUX group to right side of viewbox. Use with `wide_view_mod` and [Viewbox:width](#general-viewbox)                                                                                        |
| Dynamic Line Width            | dynamic_line_width:                | `false` | Adjusts the width of the lines and animated dot based on the ratio of current power to `max_power` (defined in each section below). Requires `max_power` to be explicitly defined                         |
| Max Line Width                | max_line_width:                    | `4`     | Sets the maximum line width when `dynamic_line_width: true`. If you prefer thick lines set a larger value. Reduce this value for a more subtle scaling affect. Values greater the `8` are ignored         |
| Min Line Width                | min_line_width:                    | `1`     | Sets the minimum or default line width on the card. Values greater the `8` are ignored                                                                                                                    |
| Decimal Places                | decimal_places:                    | `2`     | Sets the number of decimal places to display when using the `auto_scale` option.                                                                                                                          |
| Decimal Places (Daily Energy) | decimal_places_energy:             | `1`     | Sets the number of decimal places to display for the daily energy values.                                                                                                                                 |
| Adv. ViewBox Options          | [Sub-menu](#general-viewbox)       |         | Shows sub-menu with Advanced ViewBox options details. **Use with cautious!** Check [link](https://svgwg.org/svg2-draft/coords.html#ViewBoxAttribute) for more information.                                |
| Low resources Options         | [Sub-menu](#general-low-resources) |         | shows sub-menu with Low resource devices options details. **Use with cautious!**                                                                                                                          |

### General: ViewBox

| Editor name (en) | Attribute      | Default | Description                                                                                                   |
|------------------|----------------|---------|---------------------------------------------------------------------------------------------------------------|
| min-x            | viewbox_min_x  | `0`     | ViewBox min-x.                                                                                                |
| min-y            | viewbox_min_y  |         | ViewBox min-y (if not given, value depends on show_solar, show_battery, additional_loads & aux_loads values)  |
| width            | viewbox_width  |         | ViewBox width (if not given, value depends on number of aux and essential loads)                              |
| height           | viewbox_height |         | ViewBox height (if not given, value depends on show_solar, show_battery, additional_loads & aux_loads values) |

### General: Low Resources

| Editor name (en) | Attribute        | Default | Description                                                                                            |
|------------------|------------------|---------|--------------------------------------------------------------------------------------------------------|
| Refresh Interval | refresh_interval | `500`   | Sets data and view refresh interval. Doesn't affect animations smoothness. See table below for meaning |
| Animations       | animations       |         | If sets to `true` shows all animations like flow animation                                             |

| Refresh Interval | Refresh Rate                                                                         |
|------------------|--------------------------------------------------------------------------------------|
| 1                | 1000Hz - fastest refresh, high CPU load                                              |
| 10               | 100Hz - old default                                                                  |
| 15               | 60Hz - screen refresh rate                                                           |
| 100              | 10Hz                                                                                 |
| 500              | 2Hz                                                                                  |
| 1000             | 1Hz - Once per second, still should be visible as smooth, recommended for most usage |
| 10000            | 0,1Hz once per 10 sec, user might see latency in data refresh, very low CPU Load     |

Note: values of refresh rates aren't 100% accurate and depends on browser/app and device load. Value means highest Refresh Rate possible and might be lower when
device is in high CPU load.

## Inverter

| Editor name (en)   | Attribute                      | Default                               | Description                                                                                                                                                                                                                                                                                                                                                                                               |
|--------------------|--------------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Three Phase        | three_phase:                   | `false`                               | If set to `true` additional 3 phase sensors will be displayed. Requires entity attributes to be defined i.e. `inverter_current_L2`, `inverter_current_L3`, `inverter_voltage_L2`, `inverter_voltage_L3` , `grid_ct_power_L2`, `grid_ct_power_L3`, `load_power_L1`, `load_power_L2`, `load_power_L3`                                                                                                       |
| Auto Scale         | auto_scale:                    | `true`                                | If set to `true` the card will use the entities `unit_of_measurement` attribute to perform the correct scaling (i,e, power values greater than 999W will be displayed as kW e.g. 1.23kW) and display the correct unit. The number of decimal places can be changed using the `decimal_places` card attribute apart from the daily energy values which are set using the `decimal_places_energy` attribute |
| Model              | model:                         | `sunsynk`                             | Selects which inverter image and status codes to use. Options are `lux`, `solis`, `goodwe`, `goodwe_gridmode`, `foxess`, `solax`, `sunsynk`, `victron`, `fronius`, `solaredge`, `growatt`, `sofar`, `ces-battery-box`, `deye`, `azzurro`, `powmr`, `mppsolar`, `smasolar`, `huawei`, , `Easun SMW8kW SA`.                                                                                                 |
| Modern             | modern:                        | `true`                                | Display the inverter using the modern image. Set to `false` to display an image of the inverter based on the `model` attribute below.                                                                                                                                                                                                                                                                     |
| Autarky            | autarky:                       | `power`                               | Display autarky and ratio as a percentage using either realtime power or daily energy values. Set to `no` to hide (`energy/power/Auto$Self/no`). Check [Autarky](#autarky) for details                                                                                                                                                                                                                    |
| Colour             | colour:                        | `grey`                                | Sets the colour of the inverter and data. Hex codes (`'#66ff00'` etc) or names (`red`, `green`, `blue` etc)                                                                                                                                                                                                                                                                                               |
| Navigation Path    | navigate:                      |                                       | Sets the navigation path when clicking on the inverter image. Can be used to link to other dashboards and views e.g. `/lovelace/1`                                                                                                                                                                                                                                                                        |
| Invert Flow        | invert_flow:                   | `false`                               | Inverts the animated flow.                                                                                                                                                                                                                                                                                                                                                                                |
| AC Icon            | ac_icon:                       | `AC`                                  | Set the AC temperature icon. If not present "AC" will be displayed                                                                                                                                                                                                                                                                                                                                        |
| DC Icon            | dc_icon:                       | `DC`                                  | Set the DC temperature icon. If not present "DC" will be displayed                                                                                                                                                                                                                                                                                                                                        |
| Inverter Entities  | [Sub-menu](#inverter-entities) | Shows sub-menu with Inverter Entities |
| Programs Entities: | [Sub-menu](#programs-entities) | Shows sub-menu with Programs Entities |

### Inverter Entities

| Attribute                 | Default                                     | Description                                                                                                                |
|---------------------------|---------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| inverter_status_59:       | `sensor.sunsynk_overall_state`              | Expects a sensor that contains inverter status represented as a string or number.  See [Inverter status](#inverter-status) |
| inverter_voltage_154:     | `sensor.sunsynk_inverter_voltage`           | Inverter L1 voltage (V)                                                                                                    |
| inverter_voltage_L2:      |                                             | Inverter L2 voltage (V)                                                                                                    |
| inverter_voltage_L3:      |                                             | Inverter L3 voltage (V)                                                                                                    |
| load_frequency_192:       | `sensor.sunsynk_load_frequency`             | Load frequency (Hz)                                                                                                        |
| inverter_current_164:     | `sensor.sunsynk_inverter_current`           | Inverter L1 current (A)                                                                                                    |
| inverter_current_L2:      |                                             | Inverter L2 current (A)                                                                                                    |
| inverter_current_L3:      |                                             | Inverter L3 current (A)                                                                                                    |
| inverter_power_175:       | `sensor.sunsynk_inverter_power`             | Inverter power (W).                                                                                                        |
| grid_power_169:           |                                             | Inverters grid power                                                                                                       |
| dc_transformer_temp_90:   | `sensor.sunsynk_dc_transformer_temperature` | Inverter DC temperature (℃)                                                                                                |
| radiator_temp_91:         | `sensor.sunsynk_radiator_temperature`       | Inverter AC temperature (℃)                                                                                                |
| inverter_load_percentage: |                                             | Inverter Load in Percents (0-100 range). If enabled visualize load on Inverter image                                       |
| use_timer_248:            | `switch.sunsynk_toggle_system_timer`        | Displays "Use timer" status as an icon next to the inverter. Set to `no` to hide                                           |
| priority_load_243:        | `switch.sunsynk_toggle_priority_load`       | Shows if energy pattern is set to priority load or priority battery as an icon next to the inverter. Set to `no` to hide   |

#### Programs Entities

| Attribute       | Default                                        | Description                                                  |
|-----------------|------------------------------------------------|--------------------------------------------------------------|
| prog1_time:     | `sensor.sunsynk_time_slot_1`                   | Program 1 start time (`HH:MM`)                               |
| prog1_capacity: | `number.sunsynk_system_mode_soc_time1`         | Program 1 capacity (SOC) setting                             |
| prog1_charge:   | `switch.sunsynk_system_mode_grid_charge_time1` | Program 1 charge options (`on/off`, `1/0`, `No Grid or Gen`) |
| prog2_time:     | `sensor.sunsynk_time_slot_2`                   | Program 2 start time (`HH:MM`)                               |
| prog2_capacity: | `number.sunsynk_system_mode_soc_time2`         | Program 2 capacity (SOC) setting                             |
| prog2_charge:   | `switch.sunsynk_system_mode_grid_charge_time2` | Program 2 charge options (`on/off`, `1/0`, `No Grid or Gen`) |
| prog3_time:     | `sensor.sunsynk_time_slot_3`                   | Program 3 start time (`HH:MM`)                               |
| prog3_capacity: | `number.sunsynk_system_mode_soc_time3`         | Program 3 capacity (SOC) setting                             |
| prog3_charge:   | `switch.sunsynk_system_mode_grid_charge_time3` | Program 3 charge options (`on/off`, `1/0`, `No Grid or Gen`) |
| prog4_time:     | `sensor.sunsynk_time_slot_4`                   | Program 4 start time (`HH:MM`)                               |
| prog4_capacity: | `number.sunsynk_system_mode_soc_time4`         | Program 4 capacity (SOC) setting                             |
| prog4_charge:   | `switch.sunsynk_system_mode_grid_charge_time4` | Program 4 charge options (`on/off`, `1/0`, `No Grid or Gen`) |
| prog5_time:     | `sensor.sunsynk_time_slot_5`                   | Program 5 start time (`HH:MM`)                               |
| prog5_capacity: | `number.sunsynk_system_mode_soc_time5`         | Program 5 capacity (SOC) setting                             |
| prog5_charge:   | `switch.sunsynk_system_mode_grid_charge_time5` | Program 5 charge options (`on/off`, `1/0`, `No Grid or Gen`) |
| prog6_time:     | `sensor.sunsynk_time_slot_6`                   | Program 6 start time (`HH:MM`)                               |
| prog6_capacity: | `number.sunsynk_system_mode_soc_time6`         | Program 6 capacity (SOC) setting                             |
| prog6_charge:   | `switch.sunsynk_system_mode_grid_charge_time6` | Program 6 charge options (`on/off`, `1/0`, `No Grid or Gen`) |

## Solar

These attributes are only needed if `show_solar` is set to `true`

| Editor name (en)    | Attribute                              | Default  | Description                                                                                                                                                                                                                                                                                                                                                                                               |
|---------------------|----------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MPPTs               | mppts:                                 | `2`      | Specify the number of MPPT's in use `1`, `2`, `3`, `4` or `5`                                                                                                                                                                                                                                                                                                                                             |
| Auto Scale          | auto_scale:                            | `true`   | If set to `true` the card will use the entities `unit_of_measurement` attribute to perform the correct scaling (i,e, power values greater than 999W will be displayed as kW e.g. 1.23kW) and display the correct unit. The number of decimal places can be changed using the `decimal_places` card attribute apart from the daily energy values which are set using the `decimal_places_energy` attribute |
| Colour              | colour:                                | `orange` | Sets the colour of all the solar card objects. Hex codes (`'#66ff00'` etc) or names (`red`, `green`, `blue` etc)                                                                                                                                                                                                                                                                                          |
| Navigation Path     | navigate:                              |          | Sets the navigation path when clicking on the solar icon. Can be used to link to other dashboards and views e.g. `/lovelace/1`                                                                                                                                                                                                                                                                            |
| Invert Flow         | invert_flow:                           | `false`  | Inverts the animated flow.                                                                                                                                                                                                                                                                                                                                                                                |
| Dynamic Colour      | dynamic_colour:                        | `true`   | The solar elements on the card will be greyed out if total solar power < 10W.                                                                                                                                                                                                                                                                                                                             | 
| Anim. Speed         | animation_speed:                       | `9`      | Set slowest animation speed in seconds, depending on Power produced                                                                                                                                                                                                                                                                                                                                       |
| Off Threshold       | off_threshold:                         | `10`     | When total PV power falls belows this threshold colour will change to grey. Requires `dynamic_colour` to be enabled                                                                                                                                                                                                                                                                                       |
| Production Names    | [Sub-menu](#solar-production-names)    |          | Shows sub-menu with solar production names.                                                                                                                                                                                                                                                                                                                                                               |
| Production Entities | [Sub-menu](#solar-production-entities) |          | Shows sub-menu with solar production entities.                                                                                                                                                                                                                                                                                                                                                            |
| PV Max Power        | [Sub-menu](#solar-pv-max-power)        |          | Shows sub-menu with Max Power values required to calculate and visualize efficiency                                                                                                                                                                                                                                                                                                                       |
| PVs Options         | [Sub-menu](#solar-pvs-options)         |          | Shows sub-menu with MPPTs Options to set                                                                                                                                                                                                                                                                                                                                                                  |
| PV1 Entities        | [Sub-menu](#solar-pv1-entities)        |          | Shows sub-menu with PV1 Entities                                                                                                                                                                                                                                                                                                                                                                          |
| PV2 Entities        | [Sub-menu](#solar-pv2-entities)        |          | Shows sub-menu with PV2 Entities                                                                                                                                                                                                                                                                                                                                                                          |
| PV3 Entities        | [Sub-menu](#solar-pv3-entities)        |          | Shows sub-menu with PV3 Entities                                                                                                                                                                                                                                                                                                                                                                          |
| PV4 Entities        | [Sub-menu](#solar-pv4-entities)        |          | Shows sub-menu with PV4 Entities                                                                                                                                                                                                                                                                                                                                                                          |
| PV5 Entities        | [Sub-menu](#solar-pv5-entities)        |          | Shows sub-menu with PV5 Entities                                                                                                                                                                                                                                                                                                                                                                          |
| Optional Entities   | [Sub-menu](#solar-optional-entities)   |          | Shows sub-menu with Other Solar Entities                                                                                                                                                                                                                                                                                                                                                                  |

### Solar: production names

| Editor name (en)                   | Attribute                    | Default         | Description                                    |
|------------------------------------|------------------------------|-----------------|------------------------------------------------|
| Daily Solar Production Name        | daily_solar_name:            | `DAILY SOLAR`   | Set the name for daily_solar entity            |
| Monthly Solar Production Name      | monthly_solar_name:          | `MONTHLY SOLAR` | Set the name for monthly_solar entity          |
| Yearly Solar Production Name       | yearly_solar_name:           | `YEARLY SOLAR`  | Set the name for yearly_solar entity           |
| Total Solar Generation Name        | total_solar_generation_name: | `TOTAL SOLAR`   | Set the name for total_solar_generation entity |
| Today'S Left Solar Production Name | remaining_solar_name:        | `LEFT SOLAR`    | Set the name for remaining_solar entity        |
| Tomorrow Solar Production Name     | tomorrow_solar_name:         | `TOMORROW`      | Set the name for tomorrow_solar entity         |

### Solar" production entities

| Attribute              | Default                        | Description                                                                                                                 |
|------------------------|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| pv_total:              |                                | Provide a sensor for total pv power. If omitted the card uses internal logic to calculate this based on the pv1-5 power (W) |
| day_pv_energy_108:     | `sensor.sunsynk_day_pv_energy` | Daily solar generation (kWh)                                                                                                |
| monthly_pv_generation: |                                | Monthly solar generation (kWh)                                                                                              |
| yearly_pv_generation:  |                                | Yearly solar generation (kWh)                                                                                               |
| total_pv_generation:   |                                | Total Solar generation                                                                                                      |
| remaining_solar:       |                                | The remaining solar forecast for the day (kWh).                                                                             |
| tomorrow_solar:        |                                | Solar forecast for tomorrow (kWh).                                                                                          |

### Solar: PV Max Power

| Editor name (en) | Attribute      | Default | Description                                                                                                                                                                                                  |
|------------------|----------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Max Power        | max_power:     | `8000`  | Maximum power draw to calculate animation speed. This value is also used to calculate the solar efficiency for the total PV power and should equal the total size of your PV array. Numeric value or sensor. |
| PV1 Max Power    | pv1_max_power: |         | Maximum power of MPPT1 based on the number and size of panels. Used to calculate solar efficiency of the string (W). Numeric value or sensor.                                                                |
| PV2 Max Power    | pv2_max_power: |         | Maximum power of MPPT2 based on the number and size of panels. Used to calculate solar efficiency of the string (W). Numeric value or sensor.                                                                |
| PV3 Max Power    | pv3_max_power: |         | Maximum power of MPPT3 based on the number and size of panels. Used to calculate solar efficiency of the string (W). Numeric value or sensor.                                                                |
| PV4 Max Power    | pv4_max_power: |         | Maximum power of MPPT4 based on the number and size of panels. Used to calculate solar efficiency of the string (W). Numeric value or sensor                                                                 |
| PV5 Max Power    | pv5_max_power: |         | Maximum power of MPPT5 based on the number and size of panels. Used to calculate solar efficiency of the string (W). Numeric value or sensor                                                                 |

### Solar: PVs Options

| Editor name (en)      | Attribute             | Default | Description                                                |
|-----------------------|-----------------------|---------|------------------------------------------------------------|
| PV1 Name              | pv1_name:             | `PV1`   | Set the display name for MPPT1                             |
| PV2 Name              | pv2_name:             | `PV2`   | Set the display name for MPPT2                             |
| PV3 Name              | pv3_name:             | `PV3`   | Set the display name for MPPT3                             |
| PV4 Name              | pv4_name:             | `PV4`   | Set the display name for MPPT4                             |
| PV5 Name              | pv5_name:             | `PV5`   | Set the display name for MPPT5                             |
| Show PVs Efficiency   | visualize_efficiency: | `true`  | `false` - Disabled, `true` - Graphic display of Efficiency |
| Show PVs Efficiency % | show_mppt_efficiency: | `false` | Show % of each MPPT efficiency                             |
| Show PVs Production   | show_mppt_production: | `true`  | Show each MPPT energy production                           |

### Solar: PV1 Entities

| Attribute        | Default                      | Description                    |
|------------------|------------------------------|--------------------------------|
| pv1_power_186:   | `sensor.sunsynk_pv1_power`   | PV string 1 power (W)          |
| pv1_production:  |                              | PV string 1 daily energy (kWh) |
| pv1_voltage_109: | `sensor.sunsynk_pv1_voltage` | PV string 1 voltage (V)        |
| pv1_current_110: | `sensor.sunsynk_pv1_current` | PV string 1 current (A)        |

### Solar: PV2 Entities

| Attribute        | Default                      | Description                    |
|------------------|------------------------------|--------------------------------|
| pv2_power_187:   | `sensor.sunsynk_pv2_power`   | PV string 2 power (W)          |
| pv2_production:  |                              | PV string 2 daily energy (kWh) |
| pv2_voltage_111: | `sensor.sunsynk_pv2_voltage` | PV string 2 voltage (V)        |
| pv2_current_112: | `sensor.sunsynk_pv2_current` | PV string 2 current (A)        |

### Solar: PV3 Entities

| Attribute        | Default | Description                    |
|------------------|---------|--------------------------------|
| pv3_power_188:   |         | PV string 3 power (W)          |
| pv3_production:  |         | PV string 3 daily energy (kWh) |
| pv3_voltage_113: |         | PV string 3 voltage (V)        |
| pv3_current_114: |         | PV string 3 current (A)        |

### Solar: PV4 Entities

| Attribute        | Default | Description                    |
|------------------|---------|--------------------------------|
| pv4_power_189:   |         | PV string 4 power (W)          |
| pv4_production:  |         | PV string 4 daily energy (kWh) |
| pv4_voltage_115: |         | PV string 4 voltage (V)        |
| pv4_current_116: |         | PV string 4 current (A)        |

### Solar: PV5 Entities

| Attribute        | Default | Description                    |
|------------------|---------|--------------------------------|
| pv5_power:       |         | PV string 5 power (W)          |
| pv5_production:  |         | PV string 5 daily energy (kWh) |
| pv5_voltage_115: |         | PV string 5 voltage (V)        |
| pv5_current_116: |         | PV string 5 current (A)        |

### Solar: Optional entities

| Attribute         | Default | Description                                                                                                                    |
|-------------------|---------|--------------------------------------------------------------------------------------------------------------------------------|
| solar_sell_247:   |         | Displays icons to indicate if sell solar is active or not. The switch can be toggled by clicking on the icon (`on/off`, `1/0`) |
| environment_temp: |         | Display outside temperature or other environment temperature below the sun icon                                                |

## Battery

To display battery power and current as absolute values set `show_absolute: true`. This is set to false by default and
will return your sensor value. The animated dot will change direction depending on the charging or discharging state.
The `invert_power` attribute can be used to reverse direction if needed by your sensor.

| Editor name (en)                  | Attribute                              | Default | Description                                                                                                                                                                                                                                                                                                                                                                                               |
|-----------------------------------|----------------------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Energy                            | energy:                                | `0`     | **Required** Total battery energy in Wh (e.g. 3 x 5.32kWh = 15960). If set to `0` the remaining battery runtime will be hidden. Numeric value or sensor i.e. `sensor.sunsynk_battery_energy`                                                                                                                                                                                                              |
| Shutdown SOC                      | shutdown_soc:                          | `20`    | **Required** The battery shutdown percentage used to calculate remaining runtime. Numeric value or sensor i.e. `sensor.sunsynk_battery_capacity_shutdown`                                                                                                                                                                                                                                                 |
| Shutdown SOC (Off Grid)           | shutdown_soc_offgrid:                  |         | The offgrid battery shutdown percentage used to calculate remaining runtime. Numeric value or sensor i.e. `sensor.offgrid_battery_capacity_shutdown`                                                                                                                                                                                                                                                      |
| Soc End Of Charge                 | soc_end_of_charge:                     | `100`   | Set the charge cut-off capacity. The minimum value is `50`. The maximum value is `100`. Numeric value or sensor i.e. `sensor.soc_end_of_charge`                                                                                                                                                                                                                                                           |
| Show Daily                        | show_daily:                            | `false` | Toggles the daily total                                                                                                                                                                                                                                                                                                                                                                                   |
| Auto Scale                        | auto_scale:                            | `true`  | If set to `true` the card will use the entities `unit_of_measurement` attribute to perform the correct scaling (i,e, power values greater than 999W will be displayed as kW e.g. 1.23kW) and display the correct unit. The number of decimal places can be changed using the `decimal_places` card attribute apart from the daily energy values which are set using the `decimal_places_energy` attribute |
| Invert Power                      | invert_power:                          | `false` | Set to `true` if your sensor provides a positive number for battery charge and negative number for battery discharge. See also `invert_flow:` below.                                                                                                                                                                                                                                                      |
| Show Absolute                     | show_absolute:                         | `false` | set to `true` to display power and current as absolute values                                                                                                                                                                                                                                                                                                                                             |
| Colour                            | colour:                                | `pink`  | Sets the colour of all the battery card objects. Hex codes (`'#66ff00'` etc) or names (`red`, `green`, `blue` etc)                                                                                                                                                                                                                                                                                        |
| Navigation Path                   | navigate:                              |         | Sets the navigation path when clicking on the battery icon. Can be used to link to other dashboards and views e.g. `/lovelace/1`                                                                                                                                                                                                                                                                          |
| Invert Flow                       | invert_flow:                           | `false` | Inverts the animated flow. Expects a positive number for battery charging and a negative number for battery discharging                                                                                                                                                                                                                                                                                   |
| Charge Colour                     | charge_colour:                         |         | Sets the colour of all the battery card objects when charging. Hex codes (`'#66ff00'` etc) or names (`red`, `green`, `blue` etc)                                                                                                                                                                                                                                                                          |
| Dynamic Colour                    | dynamic_colour:                        | `true`  | The battery icon colour will change based on the % contribution of the power source (grid, solar) supplying the battery. Set to `false`  to disable. If `priority_load_243: on` solar will prioritise the essential load. If `false` or omitted solar will prioritise the battery.                                                                                                                        |
| Linear Gradient                   | linear_gradient:                       | `true`  | The blocks inside the battery icon that represent SOC will be coloured using a linear gradient that ranges from red to green                                                                                                                                                                                                                                                                              |
| Animate Linear Gradient           | animate:                               | `true`  | Animates the linear gradient inside the battery icon                                                                                                                                                                                                                                                                                                                                                      |
| Anim. Speed                       | animation_speed:                       | `6`     | Set slowest animation speed in seconds, depending on power draw                                                                                                                                                                                                                                                                                                                                           |
| Hide SOC                          | hide_soc:                              | `false` | If set to `true` the current program capacity (soc), or for `Goodwe` inverters the shutdown soc and offgrid shutdown soc that is shown to the left of the current battery SOC will be hidden.                                                                                                                                                                                                             |
| Show Remaining Energy             | show_remaining_energy:                 | `true`  | Set to `true` to display the remaining battery energy in kWh based on the current SOC.                                                                                                                                                                                                                                                                                                                    |
| Show Remaining Energy to Shutdown | remaining_energy_to_shutdown:          | `false` | If set to `true` the displayed remaining battery energy will be the available energy to the shutdown SOC and not to 0%. For battery requires `show_remaining_energy: true`.                                                                                                                                                                                                                               |
| Max Power                         | max_power:                             | `4500`  | Maximum power draw to calculate animation speed. Numeric value or sensor i.e. `number.battery_maximum_discharging_power`                                                                                                                                                                                                                                                                                  |
| Path Threshold                    | path_threshold:                        | `100`   | Specify threshold to apply dynamic colour to the battery path element. The colour of the path will change to the source colour if the percentage supply by a single source equals or exceeds this value                                                                                                                                                                                                   |
| Battery Entities                  | [Sub-menu](#battery-battery-entities)  |         | Shows sub-menu with Battery Entities                                                                                                                                                                                                                                                                                                                                                                      |
| Optional Entities                 | [Sub-menu](#battery-optional-entities) |         | Shows sub-menu with Battery Entities                                                                                                                                                                                                                                                                                                                                                                      |

### Battery: Battery Entities

| Attribute                  | Default                                  | Description                                                                                                                                                                                                                                                          |
|----------------------------|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| battery_power_190:         | `sensor.sunsynk_battery_power`           | **Required** Battery power (W). Requires a negative number for battery charging and a positive number for battery discharging. Set the `invert_power:` battery attribute to `yes` if your sensor reports this the other way around                                   |
| battery_soc_184:           | `sensor.sunsynk_battery_soc`             | **Required** Battery state of charge (%)                                                                                                                                                                                                                             |
| battery_current_191:       | `sensor.sunsynk_battery_current`         | **Required** Battery current (A)                                                                                                                                                                                                                                     |
| battery_voltage_183:       | `sensor.sunsynk_battery_voltage`         | Battery voltage (V)                                                                                                                                                                                                                                                  |
| battery_temp_182:          | `sensor.sunsynk_battery_temperature`     | Battery temperature (°). Note do not define this sensor if you want to display battery SOH. See below.                                                                                                                                                               |
| day_battery_charge_70:     | `sensor.sunsynk_day_battery_charge`      | Daily battery charge (kWh)                                                                                                                                                                                                                                           |
| day_battery_discharge_71:  | `sensor.sunsynk_day_battery_discharge`   | Daily battery usage (kWh)                                                                                                                                                                                                                                            |
| battery_remaining_storage  |                                          | Battery remaining capacity. If set it is displayed instead of calculated value                                                                                                                                                                                       |
| battery_rated_capacity:    |                                          | Battery rated capacity (Ah). If provided this sensor will be used to calculate battery energy. The`energy` attribute under the battery card configuration will be ignored.                                                                                           |
| battery_soh:               |                                          | Battery State of Health (SOH) (%). You can chose to display either battery temperature or battery SOH but not both. They are displayed in the same place on the card. If `battery_temp_182:` is defined it will take priority and this sensor will not be displayed. |
| battery_current_direction: | `sensor.solis_battery_current_direction` | Used only when inverter model is set to `solis` (`0`, `1`)                                                                                                                                                                                                           |
| battery_status:            | `sensor.battery_mode_code`               | Used only when inverter model is set to  `goodwe`, `goodwe_gridmode` or `huawei`. Battery status `0, 1, 2, 3, 4`                                                                                                                                                     |

### Battery: Optional Entities

| Attribute             | Default | Description                                                                       |
|-----------------------|---------|-----------------------------------------------------------------------------------|
| energy:               | `0`     | **Required** Total battery energy in Wh (e.g. 3 x 5.32kWh = 15960) entity.        |
| shutdown_soc:         | `20`    | **Required** The battery shutdown percentage used to calculate remaining runtime. |
| shutdown_soc_offgrid: |         | The offgrid battery shutdown percentage used to calculate remaining runtime.      |
| max_power:            | `4500`  | Maximum power draw to calculate animation speed.                                  |

## Battery Banks

| Editor name (en)        | Attribute                          | Default | Description                                                                      |
|-------------------------|------------------------------------|---------|----------------------------------------------------------------------------------|
| Show Battery Banks      | show_battery_banks:                |         | Toggle display battery banks details                                             |
| Battery Banks View Mode | battery_banks_view_mode:           |         | Choose battery bank view mode: none, inner                                       |
| Battery Banks           | battery_banks:                     |         | Specify the number of Battery Banks's in use `0`, `1`, `2`, `3`, `4`, `5` or `6` |
| Battery 1 Max Energy    | battery_bank_1_energy:             |         | Specify Battery Bank 1 Max Available Energy                                      |
| Battery 2 Max Energy    | battery_bank_2_energy:             |         | Specify Battery Bank 2 Max Available Energy                                      |
| Battery 3 Max Energy    | battery_bank_3_energy:             |         | Specify Battery Bank 3 Max Available Energy                                      |
| Battery 4 Max Energy    | battery_bank_4_energy:             |         | Specify Battery Bank 4 Max Available Energy                                      |
| Battery 5 Max Energy    | battery_bank_5_energy:             |         | Specify Battery Bank 5 Max Available Energy                                      |
| Battery 6 Max Energy    | battery_bank_6_energy:             |         | Specify Battery Bank 6 Max Available Energy                                      |
| Battery Bank 1 Entities | [Sub-menu](#battery-bank-entities) |         | Shows sub-menu with Battery Bank 1 Entities                                      |
| Battery Bank 2 Entities | [Sub-menu](#battery-bank-entities) |         | Shows sub-menu with Battery Bank 2 Entities                                      |
| Battery Bank 3 Entities | [Sub-menu](#battery-bank-entities) |         | Shows sub-menu with Battery Bank 3 Entities                                      |
| Battery Bank 4 Entities | [Sub-menu](#battery-bank-entities) |         | Shows sub-menu with Battery Bank 4 Entities                                      |
| Battery Bank 5 Entities | [Sub-menu](#battery-bank-entities) |         | Shows sub-menu with Battery Bank 5 Entities                                      |
| Battery Bank 6 Entities | [Sub-menu](#battery-bank-entities) |         | Shows sub-menu with Battery Bank 6 Entities                                      |

### Battery Bank Entities

| Attribute                         | Default | Description                              |
|-----------------------------------|---------|------------------------------------------|
| battery_bank_X_power:             |         | Specify Battery Bank X Power             |
| battery_bank_X_voltage:           |         | Specify Battery Bank X Voltage           |
| battery_bank_X_current:           |         | Specify Battery Bank X Current           |
| battery_bank_X_delta:             |         | Specify Battery Bank X Delta             |
| battery_bank_X_temp:              |         | Specify Battery Bank X Temperature       |
| battery_bank_X_remaining_storage: |         | Specify Battery Bank X Remaining Storage |
| battery_bank_X_soc:               |         | Specify Battery Bank X SOC               |

Note: `X` is integer between `1` and `6`

## Load

| Editor name (en) | Attribute                       | Default     | Description                                                                                                                                                                                                                                                                                                                                                                                               |
|------------------|---------------------------------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Show Daily       | show_daily:                     | `false`     | Toggles the daily total.                                                                                                                                                                                                                                                                                                                                                                                  |
| Daily Load Label | label_daily_load:               | `false`     | Toggles the daily total.                                                                                                                                                                                                                                                                                                                                                                                  |
| Auto Scale       | auto_scale:                     | `true`      | If set to `true` the card will use the entities `unit_of_measurement` attribute to perform the correct scaling (i,e, power values greater than 999W will be displayed as kW e.g. 1.23kW) and display the correct unit. The number of decimal places can be changed using the `decimal_places` card attribute apart from the daily energy values which are set using the `decimal_places_energy` attribute |
| Colour           | colour:                         | `'#5fb6ad'` | Sets the colour of all the load card objects. Hex codes (`'#66ff00'` etc) or names (`red`, `green`, `blue` etc)                                                                                                                                                                                                                                                                                           |
| Navigation Path  | navigate:                       |             | Sets the navigation path when clicking on the house icon. Can be used to link to other dashboards and views e.g. `/lovelace/1`                                                                                                                                                                                                                                                                            |
| Invert Flow      | invert_flow:                    | `false`     | Inverts the animated flow.                                                                                                                                                                                                                                                                                                                                                                                |
| Dynamic Colour   | dynamic_colour:                 | `true`      | The essential icon colour will change based on the % contribution of the power source (battery, grid, solar) supplying the load. Set to `false`  to disable                                                                                                                                                                                                                                               |
| Dynamic Icon     | dynamic_icon:                   | `true`      | The essential icon will change when there is 100% contribution from a single power source (battery, grid, solar). Set to `false`  to disable                                                                                                                                                                                                                                                              |
| Invert Values    | invert_load:                    | `false`     | Set to `true` if your sensor provides a negative number when the load is drawing power                                                                                                                                                                                                                                                                                                                    |
| Essential Name   | essential_name:                 | `Essential` | Set the display name for the essential load                                                                                                                                                                                                                                                                                                                                                               |
| Anim. Speed      | animation_speed:                | `8`         | Set slowest animation speed in seconds, depending on Power draw                                                                                                                                                                                                                                                                                                                                           |
| Max Power        | max_power:                      | `8000`      | Maximum power draw to calculate animation speed. Numeric value or sensor                                                                                                                                                                                                                                                                                                                                  |
| Off Threshold    | off_threshold:                  | `0`         | When power falls below this value the load will be considered off and colour will change to grey. Requires `dynamic_colour` to be enabled. Can also be set to `-1` to disable.                                                                                                                                                                                                                            |
| Path Threshold   | path_threshold:                 | `100`       | Specify threshold to apply dynamic colour to the load path element. The colour of the path will change to the source colour if the percentage supply by a single source equals or exceeds this value                                                                                                                                                                                                      |
| Load Entities    | [Sub-menu](#load-load-entities) |             | Shows sub-menu with Load Entities                                                                                                                                                                                                                                                                                                                                                                         |

### Load: Load Entities

| Attribute           | Default                          | Description                                                                                                                                       |
|---------------------|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| day_load_energy_84: | `sensor.sunsynk_day_load_energy` | Daily load (kWh)                                                                                                                                  |
| essential_power:    | `none`                           | Sensor that provides Essential Load power (W). Check [Essential Power Calculation](#essential-power-calculation) if entity not provided or `none` |
| load_power_L1:      |                                  | Load L1 Power (W)                                                                                                                                 |
| load_power_L2:      |                                  | Load L2 Power (W)                                                                                                                                 |
| load_power_L3:      |                                  | Load L3 Power (W)                                                                                                                                 |

## Additional Load

| Editor name (en)           | Attribute                                       | Default | Description                                                                                                  |
|----------------------------|-------------------------------------------------|---------|--------------------------------------------------------------------------------------------------------------|
| Additional Loads View Mode | additional_loads_view_mode:                     | `none`  | Sets Additional Loads View Mode. Check [Additional Loads View Mode](#additional-loads-view-mode) for details |
| Items 1-4 Options          | [Sub-menu](#additional-load-items-1-4-options)  |         | Shows sub-menu with Additional Load 1-4 Options                                                              |
| Items 1-4 Entities         | [Sub-menu](#additional-load-Items-1-4-entities) |         | Shows sub-menu with Essential Load 1-4 Entities                                                              |
| Column 1 Options           | [Sub-menu](#additional-load-Column-X-options)   |         | Shows sub-menu with Additional Load Column 1 Options                                                         |
| Column 1 Entities          | [Sub-menu](#additional-load-Column-X-entities)  |         | Shows sub-menu with Essential Load Column 1 Entities                                                         |
| Column 2 Options           | [Sub-menu](#additional-load-Column-X-options)   |         | Shows sub-menu with Additional Load Column 2 Options                                                         |
| Column 2 Entities          | [Sub-menu](#additional-load-Column-X-entities)  |         | Shows sub-menu with Essential Load Column 2 Entities                                                         |
| Column 3 Options           | [Sub-menu](#additional-load-Column-X-options)   |         | Shows sub-menu with Additional Load Column 3 Options                                                         |
| Column 3 Entities          | [Sub-menu](#additional-load-Column-X-entities)  |         | Shows sub-menu with Essential Load Column 3 Entities                                                         |
| Column 4 Options           | [Sub-menu](#additional-load-Column-X-options)   |         | Shows sub-menu with Additional Load Column 4 Options                                                         |
| Column 4 Entities          | [Sub-menu](#additional-load-Column-X-entities)  |         | Shows sub-menu with Essential Load Column 4 Entities                                                         |
| Column 5 Options           | [Sub-menu](#additional-load-Column-X-options)   |         | Shows sub-menu with Additional Load Column 5 Options                                                         |
| Column 5 Entities          | [Sub-menu](#additional-load-Column-X-entities)  |         | Shows sub-menu with Essential Load Column 5 Entities                                                         |
| Column 6 Options           | [Sub-menu](#additional-load-Column-X-options)   |         | Shows sub-menu with Additional Load Column 6 Options                                                         |
| Column 6 Entities          | [Sub-menu](#additional-load-Column-X-entities)  |         | Shows sub-menu with Essential Load Column 6 Entities                                                         |

### Additional Load: Items 1-4 Options

| Editor name (en) | Attribute   | Default | Description                                                                                    |
|------------------|-------------|---------|------------------------------------------------------------------------------------------------|
| Load 1 Name      | load1_name: |         | Set the display name for the essential load 1                                                  |
| Load 1 Icon      | load1_icon: | none    | Set the essential load 1 image using preset or any mdi icon. Check [icon](#icons) for details. |
| Load 2 Name      | load2_name: |         | Set the display name for the essential load 2                                                  |
| Load 2 Icon      | load2_icon: | none    | Set the essential load 2 image using preset or any mdi icon. Check [icon](#icons) for details. |
| Load 3 Name      | load3_name: |         | Set the display name for the essential load 3                                                  |
| Load 3 Icon      | load3_icon: | none    | Set the essential load 3 image using preset or any mdi icon. Check [icon](#icons) for details. |
| Load 4 Name      | load4_name: |         | Set the display name for the essential load 4                                                  |
| Load 4 Icon      | load4_icon: | none    | Set the essential load 4 image using preset or any mdi icon. Check [icon](#icons) for details. |

### Additional Load: Items 1-4 Entities

| Attribute               | Default | Description                                                                                                                                                                                              |
|-------------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| essential_load1:        |         | Sensor that contains the power of your essential load 1 (W). Can also be used to display any sensor data i.e. temp, energy etc if `auto_scale: false`. If not present toggle state will be used instead. |
| essential_load1_extra:  |         | Sensor that contains additional information you want displayed for your essential load 1 e.g. Daily kWh, Temperature etc                                                                                 |
| essential_load1_toggle: |         | Sensor that contains link to entity that will show up when essential load 1 icon clicked                                                                                                                 |
| essential_load2:        |         | Sensor that contains the power of your essential load 2 (W). Can also be used to display any sensor data i.e. temp, energy etc if `auto_scale: false`. If not present toggle state will be used instead. |
| essential_load2_extra:  |         | Sensor that contains additional information you want displayed for your essential load 2 e.g. Daily kWh, Temperature etc                                                                                 |
| essential_load2_toggle: |         | Sensor that contains link to entity that will show up when essential load 2 icon clicked                                                                                                                 |
| essential_load3:        |         | Sensor that contains the power of your essential load 3 (W). Can also be used to display any sensor data i.e. temp, energy etc if `auto_scale: false`. If not present toggle state will be used instead. |
| essential_load3_extra:  |         | Sensor that contains additional information you want displayed for your essential load 3 e.g. Daily kWh, Temperature etc                                                                                 |
| essential_load3_toggle: |         | Sensor that contains link to entity that will show up when essential load 3 icon clicked                                                                                                                 |
| essential_load4:        |         | Sensor that contains the power of your essential load 4 (W). Can also be used to display any sensor data i.e. temp, energy etc if `auto_scale: false`. If not present toggle state will be used instead. |
| essential_load4_extra:  |         | Sensor that contains additional information you want displayed for your essential load 4 e.g. Daily kWh, Temperature etc                                                                                 |
| essential_load4_toggle: |         | Sensor that contains link to entity that will show up when essential load 4 icon clicked                                                                                                                 |

### Additional Load: Column X Options

| Editor name (en)       | Attribute               | Default | Description                                                                                                  |
|------------------------|-------------------------|---------|--------------------------------------------------------------------------------------------------------------|
| Load X-Y Name          | load_X_Y_name:          |         | Set the display name for the essential load column X row Y                                                   |
| Load X-Y Icon          | load_X_Y_icon:          |         | Set the essential load  column X row Y image using preset or any mdi icon. Check [icon](#icons) for details. |
| Load X-Y Color         | load_X_Y_color:         |         | Overrides color of load card object                                                                          |
| Load X-Y Off Color     | load_X_Y_off_color:     |         | Overrides off color of load card object                                                                      |
| Load X-Y Max Threshold | load_X_Y_max_threshold: |         | Set the upper threshold for the AUX load that will activate the `load_X_Y_max_color`.                        |
| Load X-Y Max Color     | load_X_Y_max_color:     |         | Set the upper threshold color for AUX load card object                                                       |

Note: `X` stands for column, values `1` to `6`;
Note2: `Y` stands for row, values `1` to `6`
Note3: items `1-3` and `2-3` doesn't exist

### Additional Load: Column X Entities

| Attribute                  | Default | Description                                                                                                                                                                                                           |
|----------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| essential_load_X_Y:        |         | Sensor that contains the power of your essential load column X row Y (W). Can also be used to display any sensor data i.e. temp, energy etc if `auto_scale: false`. If not present toggle state will be used instead. |
| essential_load_X_Y_extra:  |         | Sensor that contains additional information you want displayed for your essential load column X row Y e.g. Daily kWh, Temperature etc                                                                                 |
| essential_load_X_Y_toggle: |         | Sensor that contains link to entity that will show up when essential load column X row Y icon clicked                                                                                                                 |

Note: `X` stands for column, values `1` to `6`;
Note2: `Y` stands for row, values `1` to `6`
Note3: items `1-3` and `2-3` doesn't exist

## AUX Load

| Editor name (en)   | Attribute                           | Default           | Description                                                                                                                                             |
|--------------------|-------------------------------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Show Aux           | show_aux:                           | `false`           | Toggles the display of AUX                                                                                                                              |
| Aux Loads          | aux_loads:                          | `0`               | Display additional loads on the AUX side (`0/1/2/3/4/5`)                                                                                                |
| Aux Name           | aux_name:                           | `Auxilary`        | Set the display name for the AUX Load                                                                                                                   |
| Daily Aux Name     | aux_daily_name:                     | `DAILY AUX`       | Set the display name for the DAILY AUX label                                                                                                            |
| Aux Icon           | aux_type:                           | `default`         | Sets the AUX image using preset or any mdi icon e.g. `mdi:ev-station`. Presets are: `gen`, `inverter` `default`, `oven`, `pump`, `aircon` and `boiler`. |
| Invert Aux         | invert_aux:                         | `false`           | Set to `true` if your sensor provides a positive number for AUX input and negative number for AUX output                                                |
| Show Absolute      | show_absolute_aux:                  | `false`           | set to `true` to display power as an absolute value                                                                                                     |
| Aux Dynamic Colour | aux_dynamic_colour:                 | `true`            | The respective aux elements on the card will be greyed out if aux power = 0W.                                                                           |
| Colour             | aux_colour:                         | `the load colour` | Sets the colour of all the AUX card objects. Hex codes (`'#66ff00'` etc) or names (`red`, `green`, `blue` etc)                                          |
| Off Colour         | aux_off_colour:                     | `the load colour` | Sets the colour of the AUX icon and label when disconnected. Hex codes (`'#66ff00'` etc) or names (`red`, `green`, `blue` etc)                          |
| Show Daily Aux     | show_daily_aux:                     | `false`           | Toggles the daily AUX total. Only displayed if `show_aux` is set to `true`                                                                              |
| Invert Flow        | aux_invert_flow:                    | `false`           | Inverts the animated flow.                                                                                                                              |
| Main Entities      | [Sub-menu](#aux-load-main-entities) |                   | Shows sub-menu with Auxiliary Load Entities                                                                                                             |
| Item Options       | [Sub-menu](#aux-load-item-options)  |                   | Shows sub-menu with Auxiliary Load details                                                                                                              |
| Items Entities     | [Sub-menu](#aux-load-item-entities) |                   | Shows sub-menu with Auxiliary Load Entities                                                                                                             |

### Aux Load: Main Entities

| Attribute       | Requirement | Default                    | Description                                     |
|-----------------|-------------|----------------------------|-------------------------------------------------|
| day_aux_energy: | Optional    |                            | Sensor that provides the daily AUX energy (kWh) |
| aux_power_166:  | Optional    | `sensor.sunsynk_aux_power` | Auxiliary power (W)                             |

### Aux Load: Item Options

| Editor name (en)         | Attribute                | Default | Description                                                                                                               |
|--------------------------|--------------------------|---------|---------------------------------------------------------------------------------------------------------------------------|
| Aux Load X Name          | aux_loadX_name:          |         | Set the display name for the AUX load                                                                                     |
| Aux Load X Icon          | aux_loadX_icon:          |         | Set the AUX load image using any mdi icon e.g. `mdi:ev-station`. You can also provide a sensor that returns the mdi icon. |
| Aux Load X Color         | aux_loadX_color:         |         | Overrides color of load card object                                                                                       |
| Aux Load X Off Color     | aux_loadX_off_color:     |         | Overrides off color of AUX load card object                                                                               |
| Aux Load X Max Threshold | aux_loadX_max_threshold: |         | Set the upper threshold for the AUX load that will activate the `aux_loadX_max_color`.                                    |
| Aux Load X Max Color     | aux_loadX_max_color:     |         | Set the upper threshold color for AUX load card object                                                                    |

Note: `X` stands for item id/column, values `1` to `6`;

### Aux Load: Item Entities

| Attribute         | Default | Description                                                                                                         |
|-------------------|---------|---------------------------------------------------------------------------------------------------------------------|
| aux_loadX:        |         | Sensor that contains the power of your AUX load X (W)                                                               |
| aux_loadX_extra:  |         | Sensor that contains additional information you want displayed for your aux load X e.g. Daily kWh, Temperature etc. |
| aux_loadX_toggle: |         | Sensor that contains link to entity that will show up when aux load X icon clicked                                  |

Note: `X` stands for item id/column, values `1` to `6`;

## Grid

| Editor name (en)      | Attribute                       | Default     | Description                                                                                                                                                                                                                                                                                                                                                                                               |
|-----------------------|---------------------------------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Grid Name             | grid_name:                      |             | Set the display name for the grid                                                                                                                                                                                                                                                                                                                                                                         |
| Max Power             | max_power:                      | `8000`      | Maximum power draw to calculate animation speed. Numeric value or sensor                                                                                                                                                                                                                                                                                                                                  |
| Show Daily Buy        | show_daily_buy:                 | `false`     | Toggles the daily buy total                                                                                                                                                                                                                                                                                                                                                                               |
| Daily Grid Buy Label  | label_daily_grid_buy:           |             | Set custom text for the "DAILY GRID BUY" label that is displayed.                                                                                                                                                                                                                                                                                                                                         |
| Show Daily Sell       | show_daily_sell:                | `false`     | Toggles the daily sell total                                                                                                                                                                                                                                                                                                                                                                              |
| Daily Grid Sell Label | label_daily_grid_sell:          |             | Set custom test for the "DAILY GRID SELL" label that is displayed.                                                                                                                                                                                                                                                                                                                                        |
| Auto Scale            | auto_scale:                     | `true`      | If set to `true` the card will use the entities `unit_of_measurement` attribute to perform the correct scaling (i,e, power values greater than 999W will be displayed as kW e.g. 1.23kW) and display the correct unit. The number of decimal places can be changed using the `decimal_places` card attribute apart from the daily energy values which are set using the `decimal_places_energy` attribute |
| Invert Values         | invert_grid:                    | `false`     | Set to `true` if your sensor provides a negative number for grid import and a positive number for grid export                                                                                                                                                                                                                                                                                             |
| Show Absolute         | show_absolute:                  | `false`     | set to `true` to display power as absolute                                                                                                                                                                                                                                                                                                                                                                | 
| Colour                | colour:                         | `'#5490c2'` | Sets the colour of all the grid card objects. Hex codes (`'#66ff00'` etc) or names (`red`, `green`, `blue` etc).                                                                                                                                                                                                                                                                                          |
| Navigation Path       | navigate:                       |             | Sets the navigation path when clicking on the Grid icon. Can be used to link to other dashboards and views e.g. `/lovelace/1`                                                                                                                                                                                                                                                                             |
| Invert Flow           | invert_flow:                    | `false`     | Inverts the animated flow.                                                                                                                                                                                                                                                                                                                                                                                |
| No Grid Colour        | no_grid_colour:                 |             | Sets the colour of all the grid card objects when there is no grid power. Hex codes (`'#66ff00'` etc) or names (`red`, `green`, `blue` etc). If not set will use the `colour:` value defined above total                                                                                                                                                                                                  |
| Export Colour         | export_colour:                  |             | Sets the colour of all the grid card objects when exporting (selling) energy. Hex codes (`'#66ff00'` etc) or names (`red`, `green`, `blue` etc). If not set will use the `colour:` value defined above.                                                                                                                                                                                                   |
| Grid Off Colour       | grid_off_colour:                |             | Sets the colour of the grid icon when the grid is disconnected.                                                                                                                                                                                                                                                                                                                                           |                                                                                                                                            |
| Energy Cost Decimals  | energy_cost_decimals:           | `2`         | Sets the number of decimal places to display the buy and sell energy costs                                                                                                                                                                                                                                                                                                                                |
| Anim. Speed           | animation_speed:                | `8`         | Set slowest animation speed in seconds, depending on power draw                                                                                                                                                                                                                                                                                                                                           |
| Off Threshold         | off_threshold:                  | `0`         | When power falls below this value the load will be considered off and colour will change to grey. Requires `dynamic_colour` to be enabled. Can also be set to `-1` to disable.                                                                                                                                                                                                                            |
| Import Icon           | import_icon:                    |             | Set the grid connected/import image using any mdi icon e.g. `mdi:transmission-tower-import`. You can also provide a sensor that returns the mdi icon. If defined overrides the card default icon.                                                                                                                                                                                                         |
| Export Icon           | export_icon:                    |             | Set the grid export image using any mdi icon e.g. `mdi:transmission-tower-export`. You can also provide a sensor that returns the mdi icon. If defined overrides the card default icon.                                                                                                                                                                                                                   |
| Disconnected Icon     | disconnected_icon:              |             | Set the grid disconnected image using any mdi icon e.g. `mdi:transmission-tower-off`. You can also provide a sensor that returns the mdi icon. If defined overrides the card default icon.                                                                                                                                                                                                                |
| Pre-paid Unit Name    | prepaid_unit_name:              |             |                                                                                                                                                                                                                                                                                                                                                                                                           |
| Grid Entities         | [Sub-menu](#grid-grid-entities) |             | Shows sub-menu with Grid Entities                                                                                                                                                                                                                                                                                                                                                                         |

### Grid: Grid Entities

| Attribute                  | Default                                       | Description                                                                                                                                                                                                 |
|----------------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| day_grid_import_76:        | `sensor.sunsynk_day_grid_import`              | Daily grid import (kWh)                                                                                                                                                                                     |
| day_grid_export_77:        | `sensor.sunsynk_day_grid_export`              | Daily grid export (kWh)                                                                                                                                                                                     |
| grid_frequency:            |                                               | Grid frequency (Hz)                                                                                                                                                                                         |
| grid_ct_power_172:         | `sensor.sunsynk_grid_ct_power`                | **Required** Grid CT L1 power (W)                                                                                                                                                                           |
| grid_ct_power_L2:          | `none`                                        | Grid CT L2 power (W)                                                                                                                                                                                        |
| grid_ct_power_L3:          | `none`                                        | Grid CT L3 power (W)                                                                                                                                                                                        |
| grid_voltage_L1:           |                                               | Grid Voltage L1 (V)                                                                                                                                                                                         |
| grid_voltage_L2:           |                                               | Grid Voltage L2 (V)                                                                                                                                                                                         |
| grid_voltage_L3:           |                                               | Grid Voltage L3 (V)                                                                                                                                                                                         |
| grid_current_L1:           |                                               | Grid Current L1 (A)                                                                                                                                                                                         |
| grid_current_L2:           |                                               | Grid Current L2 (A)                                                                                                                                                                                         |
| grid_current_L3:           |                                               | Grid Current L3 (A)                                                                                                                                                                                         |
| grid_ct_power_total:       |                                               | For three phase systems. The card will automatically calculate this based on (Grid CT L1 power + Grid CT L2 power + Grid CT L3 power)  You can optionally provide your own sensor for total grid power. (W) |
| grid_voltage:              | `sensor.solis_grid_voltage`                   | Sensor providing grid voltage (v). Used only when inverter model is set to `solis`                                                                                                                          |
| grid_connected_status_194: | `binary_sensor.sunsynk_grid_connected_status` | Grid connected status (case insensitive) `on/off`,`1/0`, `On-Grid/Off-Grid`, or `On Grid/Off Grid`                                                                                                          |
| energy_cost_buy:           |                                               | Sensor that provides current buy energy cost per kWh                                                                                                                                                        |
| energy_cost_sell:          |                                               | Sensor that provides current sell energy cost per kWh                                                                                                                                                       |
| prepaid_units:             |                                               | Account balance of prepaid electricity units                                                                                                                                                                |
| max_sell_power:            | `number.sunsynk_max_sell_power`               | Sets the maximum allowed output power to flow to the grid. Also known as "Export Control User Limit" (W)                                                                                                    |

## Grid Load

| Editor name (en)   | Attribute                             | Default         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|--------------------|---------------------------------------|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Show Non Essential | show_nonessential:                    | `true`          | Toggles the display of non-essential                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |   
| Invert Flow        | ness_invert_flow:                     | `false`         | Inverts the animated flow.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Additional Loads   | additional_loads:                     | `0`             | Toggle the display of additional loads on the non-essential side (`0/1/2/3/4/5/6`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Name               | nonessential_name:                    | `Non Essential` | Set the display name for the non-essential load                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Icon               | nonessential_icon:                    | `default`       | Change the non-essential image using presets or any mdi icon e.g. `mdi:ev-station`. Presets are: <br /> <img height="25px" src="https://api.iconify.design/mdi/house-import-outline.svg"> `default`  <img height="25px" src="https://api.iconify.design/fluent/oven-32-regular.svg"> `oven`, <img height="25px" src="https://api.iconify.design/material-symbols/water-heater.svg"> `boiler` </br> <br/> <img height="25px" src="https://api.iconify.design/material-symbols/water-pump-outline.svg"> `pump`,  <img height="25px" src="https://api.iconify.design/mdi/air-conditioner.svg"> `aircon` </br> |
| Show Daily         | show_nonessential_daily:              |                 | Toggles the display of non-essential daily energy                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Daily Name         | nonessential_daily_name:              |                 | 'Set the display name for the non-essential daily energy                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 
| Main Entities      | [Sub-menu](#grid-load-main-entities)  |                 | Shows sub-menu with Non-Essential Load Entities                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Row 1 Options      | [Sub-menu](#grid-load-row-1-options)  |                 | Shows sub-menu with Non-Essential Load Row 1 Options                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Row 1 Entities     | [Sub-menu](#grid-load-row-1-entities) |                 | Shows sub-menu with Non-Essential Load Row 1 Entities                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Row 2 Options      | [Sub-menu](#grid-load-row-2-Options)  |                 | Shows sub-menu with Non-Essential Load Row 2 Options                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Row 2 Entities     | [Sub-menu](#grid-load-row-2-entities) |                 | Shows sub-menu with Non-Essential Load Row 2 Entities                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

### Grid Load: Main Entities

| Attribute           | Default | Description                                                                                                                                             |
|---------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| nonessential_power  |         | Sensor that provides Essential Load power (W). Check [Nonessential Power Calculation](#nonessential-power-calculation) if entity not provided or `none` |
| nonessential_energy |         | Sensor that provides Essential Daily energy (kWh).                                                                                                      |

### Grid Load: Row 1 Options

### Grid Load: Row 2 Options

| Editor name (en)     | Attribute            | Default | Description                                                                                           |
|----------------------|----------------------|---------|-------------------------------------------------------------------------------------------------------|
| Load X Name          | loadX_name:          |         | Set the display name for the non-essential/Grid load X                                                |
| Load X Icon          | loadX_icon:          |         | Change the non-essential/Grid load X image using any mdi icon e.g. `mdi:ev-station`.                  |
| Load X Import Color  | loadX_import_color:  |         | Overrides import color of non-essential/Grid load X card object                                       |
| Load X Export Color  | loadX_export_color:  |         | Overrides export color of non-essential/Grid load X card object                                       |
| Load X Off Color     | loadX_off_color:     |         | Overrides off color of non-essential/Grid load X card object                                          |
| Load X Max Threshold | loadX_max_threshold: |         | Set the upper threshold for the non-essential/Grid load that will activate the `aux_loadX_max_color`. |
| Load X Max Color     | loadX_max_color:     |         | Set the upper threshold color for non-essential/Grid load card object                                 |

Note: for Row 1: `X` stands for item id/column, values `1` to `3`;
Note2: for Row 2: `X` stands for item id/column, values `4` to `6`;

### Grid Load: Row 1 Entities

### Grid Load: Row 2 Entities

| Attribute                   | Default | Description                                                                                                                 |
|-----------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------|
| non_essential_loadX:        |         | Sensor that contains the power of your non-essential load X (W). If not present toggle state will be used instead.          |
| non_essential_loadX_extra:  |         | Sensor that contains additional information you want displayed for your nonessential load X e.g. Daily kWh, Temperature etc |
| non_essential_loadX_toggle: |         | Sensor that contains link to entity that will show up when nonessential load X icon clicked                                 |

Note: for Row 1: `X` stands for item id/column, values `1` to `3`;
Note2: for Row 2: `X` stands for item id/column, values `4` to `6`;

## Entities

Entity attributes below have been appended with the modbus register # e.g. `pv2_power_187` to indicate which Sunsynk
register should be read when configuring your sensors. Replace the default sensors with your own specific sensor names.
It is important that your sensors read the expected modbus register value. If you have missing sensors for any attribute
set it to none i.e. `day_pv_energy_108: none`. This will hide the sensor data from the card. To display a placeholder
with a default value of 0 set it to `zero` or any other value i.e. `solarday_108: zero`.

See the [WIKI](https://github.com/molikk/mlk-power-flow-card/wiki/Sensor-Mappings) for more information on sensor
mappings if using other integration methods.

### Notes

The card calculates the sensors below based on supplied attributes in the config so you don't need to define them in Home
Assistant. NOTE if your essential and non-essential readings are inaccurate replace sensor 169 with 167. Alternatively
provide the card with sensors that calculate this data i.e. essential_power: and nonessential_power:

### Icons

In every icon field you can use preset or any mdi icon e.g. `mdi:ev-station` Presets are: `boiler`, `pump`, `aircon`, `oven`. You can also provide a sensor that
returns the mdi icon.

## Calculations

### Total PV

Total PV is provided through `total_pv` entity.

If `total_pv` entity is not provided value will be calculated as:

```
total_pv = pv1_power_186 + pv2_power_187 + pv3_power_188 + pv4_power_189 + pv5_power
```

### Essential Power Calculation

Essential Load is provided through `essential_power` entity.

* For 3 phases mode (`three_phase:true`) when `essential_power` is not provided it will be calculated as:

```
load_power_L1 +  load_power_L2 +  load_power_L3
```

* For non 3 phase mode (`three_phase:false`)  when `essential_power` is not provided one of 2 calculations mode will be used:
	* when `inverter_power_175` is provided:
	  ```
	  essential_power = inverter_power_175 + grid_power_169 - aux_power_166
	  ```
	* otherwise
	  ```
	  essential_power = totalPV + battery_power_190 + grid_power_169 - aux_power_166
	  ```

### Nonessential Power Calculation

Nonessential Load is provided through `nonessential_power` entity.

* If there is no  `nonessential_power` entity and there is no `grid_power_169` entity then

```
nonessentialPower = non_essential_load1 + non_essential_load2 + non_essential_load3
```

* otherwise If there is no  `nonessential_power` entity

	* If `three_phase:false`

  ```
  nonessential = grid_ct_power_172 - grid_power_169
  ```

	* If `three_phase:true`

  ```
  nonessential = grid_ct_power_172 + grid_ct_power_L2 + grid_ct_power_L3 - grid_power_169
  ```
* otherwise
  ```
  essential=  nonessential_power entity

  ```

### Autarky

Autarky is the percentage of self-sufficiency through Home Production. <br />
Ratio is the percentage of produced electricity used by the home. <br />
It is calculated based on the formula below and borrowed from the [Power Distribution Card](https://github.com/JonahKr/power-distribution-card)  <br />
<ul><li>Autarky in Percent = Home Production / Home Consumption </li>
<li>Ratio in Percent = Home Consumption / Home Production</li></ul> 

Home Production = Solar + Battery (discharge) + Aux (in), Home Consumption = Essential power + Nonessential power + Aux (out) + Battery (charge) <br />

Auto&Self mode represents Auto consumption & Self usage. Auto consumption is similar to Power Ratio, Self consumption is ratio between produced energy to all
energy (produced energy + imported energy)

### Additional Loads View Mode

| Mode Name              | Attribute | Description                                                                                         |
|------------------------|-----------|-----------------------------------------------------------------------------------------------------|
| none                   | none      | Hide all Additional Loads                                                                           |
| Minimal view (4 loads) | old       | Displays up to 4 main Additional Loads. If set less then 4 some of them has bigger icons and values |
| 2 Columns              | col2      | Displays first 2 columns                                                                            |
| 3 Columns              | col3      | Displays first 3 columns                                                                            |
| 4 Columns              | col4      | Displays first 4 columns                                                                            |
| 5 Columns              | col5      | Displays first 5 columns                                                                            |
| 6 Columns              | col6      | Displays first 6 columns                                                                            |

Note: Chosen Mode affects panel width (if not set separately)

### Inverter status

inverter_status_59 Entity expects a sensor that contains inverter status represented as a string or number.

| Inverter      | `standby`                                      | `selftest`                             | `normal`                                                          | `alarm`                                                                                                                                                                                                                                                                                 | `fault`                                                                                            | 
|---------------|------------------------------------------------|----------------------------------------|-------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| **Azzuro**    | `0`, `standby`, `stand-by`                     | `1`, `selftest`, `self-checking`       | `2`, `normal`, `ok`                                               | `3`, `alarm`                                                                                                                                                                                                                                                                            | `4`, `fault`                                                                                       | 
| **Deye**      | `0`, `standby`, `stand-by`                     | `1`, `selftest`, `self-checking`       | `2`, `normal`, `ok`                                               | `3`, `alarm`                                                                                                                                                                                                                                                                            | `4`, `fault`                                                                                       |
| **Fronius**   | `8`, `11`, `13`                                | `0`, `1`, `2`, `3`, `4`, `5`, `6`, `9` | `7`, `12`                                                         | `3`                                                                                                                                                                                                                                                                                     | `255`                                                                                              |
| **Growatt**   | `0`, `standby`, `stand-by`                     | `selftest`, `self-checking`            | `1`, `normal`, `ok`                                               | `alarm`                                                                                                                                                                                                                                                                                 | `3`, `fault`                                                                                       |
| **Lux**       | `0`                                            |                                        | `2`, `4`, `5`, `8`, `9`, `10`, `11`, `12`, `16`, `20`, `32`, `40` | `7`, `17`, `64`, `136`, `192`                                                                                                                                                                                                                                                           | `1`                                                                                                |
| **MPPSolar**  | `0`, `standby`, `stand-by`                     | `1`, `selftest`, `self-checking`       | `2`, `normal`, `ok`                                               | `3`, `alarm`                                                                                                                                                                                                                                                                            | `4`, `fault`                                                                                       | 
| **PowMr**     | `0`, `standby`, `stand-by`                     | `1`, `selftest`, `self-checking`       | `2`, `normal`, `ok`                                               | `3`, `alarm`                                                                                                                                                                                                                                                                            | `4`, `fault`                                                                                       | 
| **SMA Solar** | `0`, `standby`, `stand-by`                     | `1`, `selftest`, `self-checking`       | `307: Ok (Ok)`                                                    | `455: Warning (Wrn)`                                                                                                                                                                                                                                                                    | `35: Fault (Alm)`                                                                                  |
| **Sofar**     | `0`, `standby`, `stand-by`                     | `1`, `selftest`, `self-checking`       | `2`, `normal`, `ok`                                               | `3`, `alarm`                                                                                                                                                                                                                                                                            | `4`, `fault`                                                                                       | 
| **SolarEdge** | `0`, `1`, `2`, `3`, `6`, `standby`, `stand-by` | `8`, `selftest`, `self-checking`       | `4`, `normal`, `ok`                                               | `5`, `alarm`                                                                                                                                                                                                                                                                            | `7`, `fault`                                                                                       |
| **Solis**     | `1`, `2`                                       | `4139`                                 | `0`, `3`                                                          | `4100`, `4112`, `4113`, `4114`, `4115`, `4116`, <br/>`4120`, `4122`, `4123`, `4124`, `4125`, `4127`, `4128`, `4129`,<br/> `4130`, `4132`, `4133`, `4134`, `4135`, `4136`, `4137`, `4138`,<br/> `4140`, `4144`, `4145`, `4146`, `4147`, `4148`, <br/>`4150`, `4151`, `4152`,<br/> `8123` | `4117`, `4118`, `4119`, <br/>`4121`,<br/> `4131`, `4134`, `4135`, <br/>`4144`, <br/>`4164`, `4167` | 
| **Sunsynk**   | `0`, `standby`, `stand-by`                     | `1`, `selftest`, `self-checking`       | `2`, `normal`, `ok`                                               | `3`, `alarm`                                                                                                                                                                                                                                                                            | `4`, `fault`                                                                                       |

| Inverter         | `standby`                                                                                        | `selftest`                                   | `normal`                                                                                                               | `alarm`                                                                                      | `fault`                                                                                                                               | custom states                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 
|------------------|--------------------------------------------------------------------------------------------------|----------------------------------------------|------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **EasunSMW8_SA** | `0`, `standby`                                                                                   |                                              |                                                                                                                        |                                                                                              | `5`, `fault`                                                                                                                          | **solar_battery**: `1`, `solar/battery`<br /> **grid**: `2`, `grid`<br /> **power_saving**: `3`, `power saving`<br /> **power_on**: `4`, `power on`                                                                                                                                                                                                                                                                                                                             |
| **FoxESS**       | `waiting`                                                                                        | `self test`                                  |                                                                                                                        |                                                                                              | `recoverable fault`, `unrecoverable fault`                                                                                            | **ongrid**: `on grid`<br /> **offgrid**: `off grid / eps`                                                                                                                                                                                                                                                                                                                                                                                                                       |                
| **Goodwe**       | `0`, `wait mode`                                                                                 |                                              |                                                                                                                        |                                                                                              | `3`, `fault mode`                                                                                                                     | **ongrid**: `1`, `normal (on-grid)`<br /> **offgrid**: `2`, `normal (off-grid)`<br /> **flash**: `4`, `flash mode`<br /> **check**: `5`, `check mode`                                                                                                                                                                                                                                                                                                                           |
| **GoodweGrid**   |                                                                                                  |                                              |                                                                                                                        |                                                                                              |                                                                                                                                       | **idle**: `0`, `idle`<br /> **exporting**: `1`, `exporting`<br /> **importing**: `2`, `importing`                                                                                                                                                                                                                                                                                                                                                                               |                                                                                                                               |                                                                                              |                                                     |                                                                                                                                                                                                                                                                                                                                                                                |
| **Huawei**       | `standby`                                                                                        | `spot check`                                 | `grid-connected, grid-connected normally`, <br/>`grid-connected, grid connection with derating due to power rationing` | `grid-connected, grid connection with derating due to internal causes of the solar inverter` | `stop due to faults`, `stop due to power rationing`                                                                                   | **shutdown**: `shutdown`<br />  **normalstop**: `normal stop`                                                                                                                                                                                                                                                                                                                                                                                                                   |  
| **Solax**        | `0`, `waiting`, `waitmode`, `9`, `idle`, `idlemode`, `idle mode`, `10`, `standby`, `standbymode` | `8`, `self testing`, `selftest`, `self test` | `2`, `normal`, `normalmode`, `normal mode`                                                                             |                                                                                              | `4`, `permanent fault`, `permanentfaultmode`, `permanent fault mode`, `3`, `fault`, `faultmode`                                       | **offgrid**: `6`, `off-grid waiting`, `epscheckmode`, `7`, `off-grid`, `epsmode`, `eps mode`<br /> **check**: `1`, `checking`, `checkmode`, `5`, `update`, `updatemode`, `update mode`, `eps check mode`                                                                                                                                                                                                                                                                        |
| **Victron**      |                                                                                                  |                                              |                                                                                                                        |                                                                                              | `2`, `fault`                                                                                                                          | **off**: `0`, `off`<br/> **lowpower**: `1`, `low power`<br/> **bulk**: `3`, `bulk`<br/> **absorption**: `4`, `absorption`<br/> **float**: `5`, `float`<br/> **storage**: `6`, `storage`<br/> **equalize**: `7`, `equalize`<br/> **passthru**: `8`, `passthru`<br/> **inverting**: `9`, `inverting`<br/> **powerassist**: `10`, `power assist`<br/> **powersupply**: `11`, `power supply`<br/> **sustain**: `244`, `sustain`<br/> **externalcontrol**: `252`, `external control` |
| **Sungrow**      | `standby`,`initial standby`                                                                      | `startup`                                    |                                                                                                                        | `warn running`                                                                               | `update failed`, `maintain mode`,`emergency stop`,<br/>`fault`,`unknown`,`un-initialized`,`open loop`,<br/>`safe mode`,`dispatch run` | **running**: `running`<br/> **offgrid**: `off-grid mode`<br/> **externalcontrol**: `external ems mode`,`forced mode`<br/> **shutdown**: `shutdown`,`restarting`,`afci self test shutdown`<br/> **normalstop**: `stop`<br/> **sustain**: `de-rating running`                                                                                                                                                                                                                     | 

Sunsynk  `0, 1, 2, 3, 4` or `standby, selftest, normal, alarm, fault`. For Lux `0,1,2,4,5,7,8,9,10,11,12,16,17,20,32,40,64,136,192`. For `Solis` expects a
numeric
value `0-57`. For `Goodwe` `0,1,2,3,4,5` or `Wait mode, Normal (On-Grid), Normal (Off-Grid), Fault Mode, Flash Mode, Check Mode`. For `Goodwe_gridmode` `0,1,2`
or
`Idle, Exporting, Importing`

## "Custom element doesn't exist: mlk-power-flow-card" handling

### Android:

Clear cache in App Info

### iOS:

1. Clear app cache
2. Clear frontend cache: (Settings > Companion App > Debugging > Reset frontend cache)