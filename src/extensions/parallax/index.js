import "./styles/style.scss";
import "./styles/editor.scss";

const { assign } = lodash;

const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, SelectControl, ToggleControl } = wp.components;
const { addFilter } = wp.hooks;
const { __ } = wp.i18n;

// Enable ratio control on the following blocks
const enableRatioControlOnBlocks = ["core/image"];

// Available ratio control options
const ratioControlOptions = [
	{
		label: __("Normal"),
		value: ""
	},
	{
		label: __("4:1"),
		value: "plx-img:4x1"
	},
	{
		label: __("3:1"),
		value: "plx-img:3x1"
	},
	{
		label: __("2:1"),
		value: "plx-img:2x1"
	},
	{
		label: __("16:9"),
		value: "plx-img:16x9"
	},
	{
		label: __("3:2"),
		value: "plx-img:3x2"
	},
	{
		label: __("7:5"),
		value: "plx-img:7x5"
	},
	{
		label: __("1:1"),
		value: "plx-img:1x1"
	}
];

/**
 * Add ratio control attribute to block.
 *
 * @param {object} settings Current block settings.
 * @param {string} name Name of block.
 *
 * @returns {object} Modified block settings.
 */
const addRatioControlAttributes = (settings, name) => {
	// Do nothing if it's another block than our defined ones.
	if (!enableRatioControlOnBlocks.includes(name)) {
		return settings;
	}

	// Use Lodash's assign to gracefully handle if attributes are undefined
	settings.attributes = assign(settings.attributes, {
		ratio: {
			type: "string",
			default: ratioControlOptions[0].value
		},
		parallax: {
			type: "boolean",
			default: false
		}
	});
	return settings;
};

addFilter(
	"blocks.registerBlockType",
	"parallaxtiv/attribute/ratio",
	addRatioControlAttributes
);

/**
 * Create HOC to add ratio control to inspector controls of block.
 */
const withRatioControl = createHigherOrderComponent(BlockEdit => {
	return props => {
		// Do nothing if it's another block than our defined ones.
		if (!enableRatioControlOnBlocks.includes(props.name)) {
			return <BlockEdit {...props} />;
		}

		const { ratio, parallax } = props.attributes;

		if (parallax) {
			props.attributes.className = `plx-img ${ratio}`;
		} else {
			props.attributes.className = "";
		}

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__("Parallax Image Options")} initialOpen={true}>
						<ToggleControl
							label={__("Add Parallax to Image")}
							checked={parallax}
							onChange={toggleParallax => {
								props.setAttributes({
									parallax: toggleParallax
								});
							}}
						/>
						{parallax && (
							<SelectControl
								label={__("Aspect Ratio to display")}
								value={ratio}
								options={ratioControlOptions}
								onChange={selectedRatioOption => {
									props.setAttributes({
										ratio: selectedRatioOption
									});
								}}
							/>
						)}
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, "withRatioControl");

addFilter(
	"editor.BlockEdit",
	"parallaxtiv/with-ratio-control",
	withRatioControl
);
