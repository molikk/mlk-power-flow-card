# Power FlowCard by Molikk

An animated Home Assistant card to emulate the power flow that's shown on the Sunsynk Inverter screen. 
You can use this to display data from many inverters e.g. Sunsynk, Deye, Solis, Lux, FoxESS, Goodwe, Huawei etc as long as you have the required sensor data. 
This project was based and heavily influenced by [sunsynk-power-flow-card](https://github.com/slipx06/sunsynk-power-flow-card)

See the project's [documentation](https://molikk.github.io/mlk-power-flow-card/index.html) for integration methods and examples.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=molikk&repository=mlk-power-flow-card&category=plugin)
![GitHub latest version](https://img.shields.io/github/v/release/molikk/mlk-power-flow-card?include_prereleases&style=for-the-badge&label=Latest%20version)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/molikk/mlk-power-flow-card?style=for-the-badge) 
<a href="https://www.buymeacoffee.com/molikk"><img src="https://img.buymeacoffee.com/button-api/?text=&nbsp;&slug=molikk&button_colour=5F7FFF&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" height="28" width="60" /></a>
<!-- [![Community Forum](https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge)](https://community.home-assistant.io/t/sunsynk-deye-inverter-power-flow-card/562933/1) -->
## Features

* Animated power flow based on positive/negative/zero sensor values with configurable dynamic speed.
* Grid connected status.
* Dynamic battery image based on SOC with battery banks detailed info
* Configurable battery size and shutdown SOC to calculate and display remaining battery runtime based on current battery usage and system time slot setting i.e. SOC, Grid Charge. Can be toggled off.
* Daily Totals that can be toggled on or off.
* Hide all solar data if not installed or specify number of mppts in use (up to 5 MPPTs). Set custom MPPT labels.
* Panel mode & wide view mode for bigger card.
* AUX and Non-essential can be hidden from the full card or assigned configurable labels.
* Customisable - Change colours and images.
* Most entities can be clicked to show more-info dialog.
* Optional data points include self-sufficiency and ratio percentages, battery temperature, AC and DC temperature.
* Display additional grid/non-essential (up to 6 items), essential (up to 23 items) and AUX loads (up to 5 items).
* Display energy cost per kWh and solar sell status.
* Select your inverter model for custom inverter status and battery status messages i.e. Sunsynk, Lux, Goodwe, Solis, Easun.
* "Use Timer" setting and "Energy Pattern" setting (Priority Load or Priority Battery) shown as dynamic icons, with the ability to hide if not required. If setup as switches can be toggled by clicking on the card.

## Screenshots
### non solar view
![image](https://github.com/molikk/mlk-power-flow-card/assets/12862966/25d458f7-9137-442e-a2c0-85e179ee07d0)
### non battery view
![image](https://github.com/molikk/mlk-power-flow-card/assets/12862966/3cfcff4b-a609-41b6-9da1-eea63ff44c2d)
### offgrid view (no grid view)
![image](https://github.com/molikk/mlk-power-flow-card/assets/12862966/a269a066-f8e1-41a7-af1f-1411d89cd438)
### Detailed solar production up to 5 MPPTs with solar production & prediction
![image](https://github.com/molikk/mlk-power-flow-card/assets/12862966/256c43de-4062-48f9-b0b4-f9cb0153d71f)
### Fully detailed view with grid/non-essential, aux & essential Loads and battery bank details
![image](https://github.com/user-attachments/assets/20c7f756-c307-4793-8a36-41f96b65efa7)
### Wide view mode
![image](https://github.com/user-attachments/assets/f44e14ac-84ec-4e0a-84d0-ef352f994064)

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

### Credits
This project was based and heavily influenced by [sunsynk-power-flow-card](https://github.com/slipx06/sunsynk-power-flow-card). Thanks for such a great starting point!


