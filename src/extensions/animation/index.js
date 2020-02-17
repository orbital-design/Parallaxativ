import "./styles/style.scss";
import "./styles/editor.scss";

const { assign } = lodash;

const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, SelectControl, ToggleControl, RangeControl } = wp.components;
const { addFilter } = wp.hooks;
const { __ } = wp.i18n;

// Enable ratio control on the following blocks
const enableAnimationControlsOnBlocks = ["core/image"];

// Available ratio control options
const animationTypeOptions = [
	{
		label: __("Entrances"),
		value: "entrances"
	},
	{
		label: __("Exits"),
		value: "exits"
	}
];

const entranceOptions = [
	{
		label: __("Fade In"),
		value: "fade-in"
	},
	{
		label: __("Fade In - Top Left"),
		value: "fade-in-tl"
	},
	{
		label: __("Fade In - Top"),
		value: "fade-in-top"
	},
	{
		label: __("Fade In - Top Right"),
		value: "fade-in-tr"
	},
	{
		label: __("Fade In - Right"),
		value: "fade-in-right"
	},
	{
		label: __("Fade In - Bottom Right"),
		value: "fade-in-br"
	},
	{
		label: __("Fade In - Bottom"),
		value: "fade-in-bottom"
	},
	{
		label: __("Fade In - Bottom Left"),
		value: "fade-in-bl"
	},
	{
		label: __("Fade In - Left"),
		value: "fade-in-left"
	},
	{
		label: __("Fade In - Forward"),
		value: "fade-in-fwd"
	},
	{
		label: __("Fade In - Back"),
		value: "fade-in-back"
	},
	{
		label: __("Flip In - Horizontal"),
		value: "flip-in-hor"
	},
	{
		label: __("Flip In - Horizontal Alt"),
		value: "flip-in-hor-alt"
	},
	{
		label: __("Flip In - Vertical"),
		value: "flip-in-ver"
	},
	{
		label: __("Flip In - Vertical Alt"),
		value: "flip-in-ver-alt"
	},
	{
		label: __("Slit In - Horizontal"),
		value: "slit-in-hor"
	},
	{
		label: __("Slit In - Vertical"),
		value: "slit-in-ver"
	},
	{
		label: __("Swing In - Forward Top"),
		value: "swing-in-fwd-top"
	},
	{
		label: __("Swing In - Forward Right"),
		value: "swing-in-fwd-right"
	},
	{
		label: __("Swing In - Forward Bottom"),
		value: "swing-in-fwd-bottom"
	},
	{
		label: __("Swing In - Forward Left"),
		value: "swing-in-fwd-left"
	}
];

const exitOptions = [
	{
		label: __("Fade Out"),
		value: "fade-out"
	},
	{
		label: __("Fade Out - Top Left"),
		value: "fade-out-tl"
	},
	{
		label: __("Fade Out - Top"),
		value: "fade-out-top"
	},
	{
		label: __("Fade Out - Top Right"),
		value: "fade-out-tr"
	},
	{
		label: __("Fade Out - Right"),
		value: "fade-out-right"
	},
	{
		label: __("Fade Out - Bottom Right"),
		value: "fade-out-br"
	},
	{
		label: __("Fade Out - Bottom"),
		value: "fade-out-bottom"
	},
	{
		label: __("Fade Out - Bottom Left"),
		value: "fade-out-bl"
	},
	{
		label: __("Fade Out - Left"),
		value: "fade-out-left"
	},
	{
		label: __("Fade Out - Forward"),
		value: "fade-out-fwd"
	},
	{
		label: __("Fade Out - Back"),
		value: "fade-out-back"
	},
	{
		label: __("Flip Out - Horizontal"),
		value: "flip-out-hor"
	},
	{
		label: __("Flip Out - Horizontal Alt"),
		value: "flip-out-hor-alt"
	},
	{
		label: __("Flip Out - Vertical"),
		value: "flip-out-ver"
	},
	{
		label: __("Flip Out - Vertical Alt"),
		value: "flip-out-ver-alt"
	},
	{
		label: __("Slit Out - Horizontal"),
		value: "slit-out-hor"
	},
	{
		label: __("Slit Out - Vertical"),
		value: "slit-out-ver"
	},
	{
		label: __("Swing Out - Forward Top"),
		value: "swing-out-fwd-top"
	},
	{
		label: __("Swing Out - Forward Right"),
		value: "swing-out-fwd-right"
	},
	{
		label: __("Swing Out - Forward Bottom"),
		value: "swing-out-fwd-bottom"
	},
	{
		label: __("Swing Out - Forward Left"),
		value: "swing-out-fwd-left"
	}
];

const timingOptions = [
	{
		label: __("Ease"),
		value: "--ani-ease"
	},
	{
		label: __("Ease In"),
		value: "--ani-easeIn"
	},
	{
		label: __("Ease Out"),
		value: "--ani-easeOut"
	},
	{
		label: __("Ease In Out"),
		value: "--ani-easeInOut"
	},
	{
		label: __("Ease Linear"),
		value: "--ani-linear"
	},
	{
		label: __("Ease In Sine"),
		value: "--ani-easeInSine"
	},
	{
		label: __("Ease Out Sine"),
		value: "--ani-easeOutSine"
	},
	{
		label: __("Ease In Out Sine"),
		value: "--ani-easeInOutSine"
	},
	{
		label: __("Ease In Cubic"),
		value: "--ani-easeInCubic"
	},
	{
		label: __("Ease Out Cubic"),
		value: "--ani-easeOutCubic"
	},
	{
		label: __("Ease In Out Cubic"),
		value: "--ani-easeInOutCubic"
	},
	{
		label: __("Ease In Quint"),
		value: "--ani-easeInQuint"
	},
	{
		label: __("Ease Out Quint"),
		value: "--ani-easeOutQuint"
	},
	{
		label: __("Ease In Out Quint"),
		value: "--ani-easeInOutQuint"
	},
	{
		label: __("Ease In Circ"),
		value: "--ani-easeInCirc"
	},
	{
		label: __("Ease Out Circ"),
		value: "--ani-easeOutCirc"
	},
	{
		label: __("Ease In Out Circ"),
		value: "--ani-easeInOutCirc"
	},
	{
		label: __("Ease In Quad"),
		value: "--ani-easeInQuad"
	},
	{
		label: __("Ease Out Quad"),
		value: "--ani-easeOutQuad"
	},
	{
		label: __("Ease In Out Quad"),
		value: "--ani-easeInOutQuad"
	},
	{
		label: __("Ease In Quart"),
		value: "--ani-easeInQuart"
	},
	{
		label: __("Ease Out Quart"),
		value: "--ani-easeOutQuart"
	},
	{
		label: __("Ease In Out Quart"),
		value: "--ani-easeInOutQuart"
	},
	{
		label: __("Ease In Expo"),
		value: "--ani-easeInExpo"
	},
	{
		label: __("Ease Out Expo"),
		value: "--ani-easeOutExpo"
	},
	{
		label: __("Ease In Out Expo"),
		value: "--ani-easeInOutExpo"
	},
	{
		label: __("Ease In Back"),
		value: "--ani-easeInBack"
	},
	{
		label: __("Ease Out Back"),
		value: "--ani-easeOutBack"
	},
	{
		label: __("Ease In Out Back"),
		value: "--ani-easeInOutBack"
	}
];

/**
 * Add animation control attributes to block.
 *
 * @param {object} settings Current block settings.
 * @param {string} name Name of block.
 *
 * @returns {object} Modified block settings.
 */
const addAnimationControlAttributes = (settings, name) => {
	// Do nothing if it's another block than our defined ones.
	if (!enableAnimationControlsOnBlocks.includes(name)) {
		return settings;
	}

	// Use Lodash's assign to gracefully handle if attributes are undefined
	settings.attributes = assign(settings.attributes, {
		addEntranceAnimation: {
			type: "boolean",
			default: false
		},
		entranceType: {
			type: "string",
			default: entranceOptions[0].value
		},
		entranceSpeed: {
			type: "number",
			default: 250
		},
		entranceDelay: {
			type: "number",
			default: 0
		},
		entranceTiming: {
			type: "string",
			default: timingOptions[0].value
		},
		addExitAnimation: {
			type: "boolean",
			default: false
		},
		exitType: {
			type: "string",
			default: animationTypeOptions[0].value
		},
		exitSpeed: {
			type: "number",
			default: 250
		},
		exitDelay: {
			type: "number",
			default: 0
		},
		exitTiming: {
			type: "string",
			default: timingOptions[0].value
		}
	});
	return settings;
};

addFilter(
	"blocks.registerBlockType",
	"parallaxtiv/attribute/animation",
	addAnimationControlAttributes
);

/**
 * Create HOC to add animation control to inspector controls of block.
 */
const withAnimationControl = createHigherOrderComponent(BlockEdit => {
	return props => {
		// Do nothing if it's another block than our defined ones.
		// if (!enableAnimationControlsOnBlocks.includes(props.name)) {
		// 	return <BlockEdit {...props} />;
		// }

		const {
			addEntranceAnimation,
			entranceType,
			entranceSpeed,
			entranceDelay,
			entranceTiming,
			addExitAnimation,
			exitType,
			exitSpeed,
			exitDelay,
			exitTiming
		} = props.attributes;

		let classNames = [];

		if (addEntranceAnimation || addExitAnimation) {
			classNames.push("ani:trigger");
		}

		if (addEntranceAnimation) {
			classNames.push("ani-in:false");
		}

		if (addExitAnimation) {
			classNames.push("ani-out:false");
		}

		props.attributes.className =
			props.attributes.className + " " + classNames.join(" ");
		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__("Block Animations")} initialOpen={true}>
						<ToggleControl
							label={__("Add Entrance Animation")}
							checked={addEntranceAnimation}
							onChange={toggleEntranceAnimation => {
								props.setAttributes({
									addEntranceAnimation: toggleEntranceAnimation
								});
							}}
						/>

						{addEntranceAnimation && (
							<SelectControl
								label={__("Entrance Type")}
								value={entranceType}
								options={entranceOptions}
								onChange={selectedEntranceOption => {
									props.setAttributes({
										entranceType: selectedEntranceOption
									});
								}}
							/>
						)}

						{addEntranceAnimation && (
							<RangeControl
								label={__("Entrance Speed (ms)")}
								value={entranceSpeed}
								onChange={value => {
									props.setAttributes({
										entranceSpeed: value
									});
								}}
								min={50}
								max={5000}
								step={50}
							/>
						)}

						{addEntranceAnimation && (
							<RangeControl
								label={__("Entrance Delay (ms)")}
								value={entranceDelay}
								onChange={value => {
									props.setAttributes({
										entranceDelay: value
									});
								}}
								min={0}
								max={5000}
								step={50}
							/>
						)}

						{addEntranceAnimation && (
							<SelectControl
								label={__("Entrance Timing")}
								value={entranceTiming}
								options={timingOptions}
								onChange={selectedEntranceTiming => {
									props.setAttributes({
										entranceTiming: selectedEntranceTiming
									});
								}}
							/>
						)}

						<ToggleControl
							label={__("Add Exit Animation")}
							checked={addExitAnimation}
							onChange={toggleExitAnimation => {
								props.setAttributes({
									addExitAnimation: toggleExitAnimation
								});
							}}
						/>

						{addExitAnimation && (
							<SelectControl
								label={__("Exit Type")}
								value={exitType}
								options={exitOptions}
								onChange={selectedExitOption => {
									props.setAttributes({
										exitType: selectedExitOption
									});
								}}
							/>
						)}

						{addExitAnimation && (
							<RangeControl
								label={__("Exit Speed (ms)")}
								value={exitSpeed}
								onChange={value => {
									props.setAttributes({
										exitSpeed: value
									});
								}}
								min={50}
								max={5000}
								step={50}
							/>
						)}

						{addExitAnimation && (
							<RangeControl
								label={__("Exit Delay (ms)")}
								value={exitDelay}
								onChange={value => {
									props.setAttributes({
										exitDelay: value
									});
								}}
								min={0}
								max={5000}
								step={50}
							/>
						)}

						{addExitAnimation && (
							<SelectControl
								label={__("Exit Timing")}
								value={exitTiming}
								options={timingOptions}
								onChange={selectedExitTiming => {
									props.setAttributes({
										exitTiming: selectedExitTiming
									});
								}}
							/>
						)}
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, "withAnimationControl");

addFilter(
	"editor.BlockEdit",
	"parallaxtiv/with-animation-control",
	withAnimationControl
);

/**
 * Add margin style attribute to save element of block.
 *
 * @param {object} saveElementProps Props of save element.
 * @param {Object} blockType Block type information.
 * @param {Object} attributes Attributes of block.
 *
 * @returns {object} Modified props of save element.
 */
const addAnimationExtraProps = (saveElementProps, blockType, attributes) => {
	// Do nothing if it's another block than our defined ones.
	// if (!enableAnimationControlsOnBlocks.includes(blockType.name)) {
	// 	return saveElementProps;
	// }

	let inAttrs, outAttrs;
	if (attributes.addEntranceAnimation) {
		inAttrs = {
			"--ani-in-name": attributes.entranceType,
			"--ani-in-speed": attributes.entranceSpeed + `ms`,
			"--ani-in-timing": `var(${attributes.entranceTiming})`,
			"--ani-in-delay": attributes.entranceDelay + `ms`
		};
	}

	if (attributes.addExitAnimation) {
		outAttrs = {
			"--ani-out-name": attributes.exitType,
			"--ani-out-speed": attributes.exitSpeed + `ms`,
			"--ani-out-timing": `var(${attributes.exitTiming})`,
			"--ani-out-delay": attributes.exitDelay + `ms`
		};
	}

	var styleObject = { ...inAttrs, ...outAttrs };
	assign(saveElementProps, {
		style: styleObject
	});

	return saveElementProps;
};

addFilter(
	"blocks.getSaveContent.extraProps",
	"parallaxtiv/get-save-content/extra-props",
	addAnimationExtraProps
);
