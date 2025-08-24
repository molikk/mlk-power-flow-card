import { svg } from 'lit';
import { Utils } from './utils';

export const renderCircle = (
	condition: boolean,
	id: string,
	lineWidth: number,
	minLineWidth: number,
	fill: string,
	duration: number,
	keyPoints: string,
	invertKeyPoints: boolean,
	mpathHref: string,
	x: number=0,
	y: number=0,
) => {
	return condition ? svg`
        <circle id="${id}" cx="${x}" cy="${y}" 
        	r="${Math.min(2 + lineWidth + Math.max(minLineWidth - 2, 0), 8)}" 
        	fill="${fill}">
            <animateMotion dur="${duration}s" repeatCount="indefinite"
                keyPoints="${invertKeyPoints?Utils.invertKeyPoints(keyPoints):keyPoints}"
                keyTimes="0;1" calcMode="linear">
                <mpath href="${mpathHref}"/>
            </animateMotion>
        </circle>`:svg``;
};