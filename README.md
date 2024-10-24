# Power FlowCard by Molikk

An animated Home Assistant card to emulate the power flow that's shown on the Sunsynk Inverter screen. 
You can use this to display data from many inverters e.g. Sunsynk, Deye, Solis, Lux, FoxESS, Goodwe, Huawei etc as long as you have the required sensor data. 
This project was based and heavily influenced by [sunsynk-power-flow-card](https://github.com/slipx06/sunsynk-power-flow-card)

See the project's [documentation](https://molikk.github.io/mlk-power-flow-card/index.html) for integration methods and examples.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=molikk&repository=mlk-power-flow-card&category=plugin)
![GitHub latest version](https://img.shields.io/github/v/release/molikk/mlk-power-flow-card?include_prereleases&style=for-the-badge&label=Latest%20version)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/molikk/mlk-power-flow-card?style=for-the-badge) 
<!-- [![Community Forum](https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge)](https://community.home-assistant.io/t/sunsynk-deye-inverter-power-flow-card/562933/1) -->
<!-- <a href="https://www.buymeacoffee.com/slipx" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="28" width="120"></a> -->

## Features

* Animated power flow based on positive/negative/zero sensor values with configurable dynamic speed. (Supports inverted battery, AUX and grid power).
* Dynamic battery image based on SOC.
* Grid connected status.
* Configurable battery size and shutdown SOC to calculate and display remaining battery runtime based on current battery usage and system time slot setting i.e. SOC, Grid Charge. Can be toggled off.
* Daily Totals that can be toggled on or off.
* Hide all solar data if not installed or specify number of mppts in use. Set custom MPPT labels.
* "Use Timer" setting and "Energy Pattern" setting (Priority Load or Priority Battery) shown as dynamic icons, with the ability to hide if not required. If setup as switches can be toggled by clicking on the card.
* Panel mode for bigger card.
* AUX and Non-essential can be hidden from the full card or assigned configurable labels.
* Customisable - Change colours and images.
* Most entities can be clicked to show more-info dialog.
* Optional data points include self-sufficiency and ratio percentages, battery temperature, AC and DC temperature.
* Display additional non-essential, essential and AUX loads.
* Display energy cost per kWh and solar sell status.
* Select your inverter model for custom inverter status and battery status messages i.e. Sunsynk, Lux, Goodwe, Solis.

## Screenshots

![image](https://github.com/molikk/mlk-power-flow-card/assets/12862966/25d458f7-9137-442e-a2c0-85e179ee07d0)

![image](https://github.com/molikk/mlk-power-flow-card/assets/12862966/3cfcff4b-a609-41b6-9da1-eea63ff44c2d)

![image](https://github.com/molikk/mlk-power-flow-card/assets/12862966/a269a066-f8e1-41a7-af1f-1411d89cd438)

![image](https://github.com/molikk/mlk-power-flow-card/assets/12862966/256c43de-4062-48f9-b0b4-f9cb0153d71f)

![image](https://github.com/user-attachments/assets/902fce6f-666a-4027-97e3-2b58703efa76)

## Installation

The card can be installed via HACS (recommended) or manually.

### Installation using HACS
[![hacs_badge](https://img.shields.io/badge/HACS-Default-blue.svg)](https://github.com/custom-components/hacs)


1. Install HACS.
2. Search & Install mlk-power-flow-card or click the button below.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=molikk&repository=mlk-power-flow-card&category=plugin)

### Manual Installation

1. Create a new directory under `www` and name it `mlk-power-flow-card` e.g `www/mlk-power-flow-card/`.
2. Copy the `mlk-power-flow-card.js` into the directory.
3. Add the resource to your Dashboard. You can append the filename with a `?ver=x` and increment x each time you download a new version to force a reload and avoid using a cached version. It is also a good idea to clear your browser cache.

![image](https://github.com/molikk/mlk-power-flow-card/assets/12862966/e5d0618e-b4f8-4534-8e68-130cd220b618)


