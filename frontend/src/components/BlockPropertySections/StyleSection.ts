import BackgroundHandler from "@/components/BackgroundHandler.vue";
import ColorInput from "@/components/Controls/ColorInput.vue";
import StylePropertyControl from "@/components/Controls/StylePropertyControl.vue";
import blockController from "@/utils/blockController";
import RangeInput from "../Controls/RangeInput.vue";
import ShadowHandler from "@/components/ShadowHandler.vue";

const overflowOptions = [
	{
		label: __("Unset"),
		value: "unset",
	},
	{
		label: __("Auto"),
		value: "auto",
	},
	{
		label: __("Visible"),
		value: "visible",
	},
	{
		label: __("Hidden"),
		value: "hidden",
	},
	{
		label: __("Scroll"),
		value: "scroll",
	},
];

const styleSectionProperties = [
	{
		component: StylePropertyControl,
		getProps: () => {
			return {
				label: __("Opacity"),
				propertyKey: "opacity",
				enableSlider: false,
				component: RangeInput,
				getModelValue: () => {
					return blockController.getStyle("opacity") || 1;
				},
				min: 0,
				max: 1,
				step: 0.01,
				default: 1,
			};
		},
		condition: () => !blockController.multipleBlocksSelected() && !blockController.isRoot(),
	},
	{
		component: BackgroundHandler,
		getProps: () => {},
		searchKeyWords:
			"Background, BackgroundImage, Background Image, Background Position, Background Repeat, Background Size, BG, BGImage, BG Image, BGPosition, BG Position, BGRepeat, BG Repeat, BGSize, BG Size",
	},
	{
		component: StylePropertyControl,
		getProps: () => {
			return {
				propertyKey: "color",
				component: ColorInput,
				label: __("Text Color"),
				popoverOffset: 120,
			};
		},
		searchKeyWords: "Text, Color, TextColor, Text Color",
	},
	{
		component: StylePropertyControl,
		getProps: () => {
			return {
				component: ColorInput,
				propertyKey: "borderColor",
				popoverOffset: 120,
				label: __("Border Color"),
			};
		},
		searchKeyWords: "Border, Color, BorderColor, Border Color",
		events: {
			"update:modelValue": (val: StyleValue) => {
				if (val) {
					if (!blockController.getStyle("borderWidth")) {
						blockController.setStyle("borderWidth", "1px");
						blockController.setStyle("borderStyle", "solid");
					}
				} else {
					blockController.setStyle("borderWidth", null);
					blockController.setStyle("borderStyle", null);
				}
			},
		},
	},
	{
		component: StylePropertyControl,
		getProps: () => {
			return {
				label: __("Border Width"),
				propertyKey: "borderWidth",
				enableSlider: true,
				unitOptions: ["px", "%", "em", "rem"],
				minValue: 0,
			};
		},
		searchKeyWords: "Border, Width, BorderWidth, Border Width",
		condition: () => blockController.getStyle("borderColor") || blockController.getStyle("borderWidth"),
	},
	{
		component: StylePropertyControl,
		getProps: () => {
			return {
				label: __("Border Style"),
				propertyKey: "borderStyle",
				type: "select",
				options: [
					{ value: "solid", label: __("Solid") },
					{ value: "dashed", label: __("Dashed") },
					{ value: "dotted", label: __("Dotted") },
				],
			};
		},
		searchKeyWords: "Border, Style, BorderStyle, Border Style, Solid, Dashed, Dotted",
		condition: () => blockController.getStyle("borderColor"),
	},
	{
		component: ShadowHandler,
		getProps: () => {},
		searchKeyWords: "Shadow, BoxShadow, Box Shadow",
	},
	{
		component: StylePropertyControl,
		getProps: () => {
			return {
				label: __("Radius"),
				propertyKey: "borderRadius",
				enableSlider: true,
				unitOptions: ["px", "%"],
				minValue: 0,
			};
		},
		searchKeyWords: "Border, Radius, BorderRadius, Border Radius",
		events: {
			"update:modelValue": (val: StyleValue) => {
				blockController.setStyle("borderRadius", val);
				if (val) {
					if (!blockController.getStyle("overflowX")) {
						blockController.setStyle("overflowX", "hidden");
					}
					if (!blockController.getStyle("overflowY")) {
						blockController.setStyle("overflowY", "hidden");
					}
				}
			},
		},
	},
	{
		component: StylePropertyControl,
		getProps: () => {
			return {
				label: __("Z-Index"),
				propertyKey: "zIndex",
			};
		},
		searchKeyWords: "Z, Index, ZIndex, Z Index, Z-index, Z-Index",
		condition: () =>
			!blockController.multipleBlocksSelected() &&
			!blockController.isRoot() &&
			blockController.getStyle("position") !== "static",
	},
	{
		component: StylePropertyControl,
		getProps: () => {
			return {
				label: __("Overflow X"),
				type: "select",
				propertyKey: "overflowX",
				options: overflowOptions,
				setModelValue: (val: StyleValue) => {
					if (val === "unset") {
						val = null;
					}
					blockController.setStyle("overflowX", val);
				},
			};
		},
		searchKeyWords:
			"Overflow, X, OverflowX, Overflow X, Auto, Visible, Hide, Scroll, horizontal scroll, horizontalScroll",
	},
	{
		component: StylePropertyControl,
		getProps: () => {
			return {
				label: __("Overflow Y"),
				propertyKey: "overflowY",
				type: "select",
				options: overflowOptions,
				setModelValue: (val: StyleValue) => {
					if (val === "unset") {
						val = null;
					}
					blockController.setStyle("overflowY", val);
				},
			};
		},
		searchKeyWords:
			"Overflow, Y, OverflowY, Overflow Y, Auto, Visible, Hide, Scroll, vertical scroll, verticalScroll",
	},
	{
		component: StylePropertyControl,
		getProps: () => {
			return {
				label: __("Cursor"),
				propertyKey: "cursor",
				type: "select",
				options: [
					{ value: null, label: __("Default") },
					{ value: "pointer", label: __("Pointer") },
					{ value: "move", label: __("Move") },
					{ value: "text", label: __("Text") },
					{ value: "crosshair", label: __("Crosshair") },
					{ value: "not-allowed", label: __("Not Allowed") },
				],
			};
		},
		searchKeyWords: "Cursor, Pointer, Move, Text, Crosshair, NotAllowed, Not Allowed",
	},
];

export default {
	name: __("Style"),
	properties: styleSectionProperties,
};
