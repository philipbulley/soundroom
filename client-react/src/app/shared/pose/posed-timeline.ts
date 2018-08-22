import timeline from 'popmotion/lib/animations/timeline';
import { Instruction, AnimationDefinition, Tracks } from 'popmotion/lib/animations/timeline/types';
import { ValueMap } from 'popmotion/lib/reactions/value';
import { Easing } from 'popmotion/lib/easing';

function isTracklessAnimationDefinition(
	instruction: TracklessInstruction
): instruction is TracklessAnimationDefinition {
	return typeof instruction === 'object';
}

export interface TracklessAnimationDefinition {
	to?: ValueMap;
	duration?: number;
	ease?: Easing;
	at?: number;
}

export declare type TracklessInstruction = number | string | TracklessAnimationDefinition;

export interface ExtractedToValue {
	num: number;
	suffix?: string;
}

function extractToValue(toValue: number | string): ExtractedToValue {
	if (typeof toValue === 'string') {
		let match = toValue.match(/[^\d]+$/);
		if (match) {
			return {
				num: parseFloat(toValue),
				suffix: match[1]
			};
		}
		return {
			num: parseFloat(toValue)
		};
	}

	return {
		num: toValue
	};
}

function posedTimeline(instructions: TracklessInstruction[]): {} {
	let prevAnimDef: TracklessAnimationDefinition;
	instructions = instructions.map(instruction => {
		if (isTracklessAnimationDefinition(instruction)) {
			if (prevAnimDef) {
				instruction = { ...instruction };
				instruction.to = {
					...prevAnimDef.to,
					...instruction.to
				};
			}

			prevAnimDef = instruction;
			return instruction;
		}
		return instruction;
	});

	const transition = ({ key: track, from }: { key: string; from: ValueMap }) => {
		let hasAddedFirstAnimationDef = false;

		/** If value contains a suffix, then it is assumed that all values within this track will be of the same format */
		let extractedToValue: ExtractedToValue;
		const trackInstructions: Instruction[] = instructions.map(instruction => {
			if (isTracklessAnimationDefinition(instruction)) {
				console.log('from', track, from);
				extractedToValue = extractToValue(instruction.to[track]);
				const animationDef: AnimationDefinition = {
					...instruction,
					track,
					to: extractedToValue.num
				};

				if (!hasAddedFirstAnimationDef) {
					animationDef.from = from;
					hasAddedFirstAnimationDef = true;
				}
				return animationDef;
			} else {
				extractedToValue = extractToValue(instruction);
				return extractedToValue.num;
			}
		});

		return timeline(trackInstructions).pipe(
			(v: Tracks) => (extractedToValue.suffix ? v[track] + extractedToValue.suffix : v[track])
		);
	};

	return {
		transition,
		// Add final state values
		...instructions.reduce(
			(acc: ValueMap, instruction: TracklessAnimationDefinition) =>
				isTracklessAnimationDefinition(instruction)
					? {
							...acc,
							...instruction.to
					  }
					: acc,
			{}
		)
	};
}

export default posedTimeline;
