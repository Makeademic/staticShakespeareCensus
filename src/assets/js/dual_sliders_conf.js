let yearSlider = $('yearSlider');

const MAX_YEAR = 1700;
const yearPipsStep = 25;
let yearPips = [1]
for (let v = yearPipsStep; v <= MAX_YEAR ; v += yearPipsStep) {
    yearPips.push(v);
}

// Remove the dummy HTML slider
yearSlider.innerHTML = ""
yearSlider.classList.add("slider-styled");
noUiSlider.create(yearSlider, {
    start: [1, MAX_YEAR],
    connect: true,
    step: 1,
    tooltips: true,
    format: {
        to: (numberValue) => Math.round(numberValue),
        from: (stringValue) => Number(stringValue.replace(',-', ''))
    },
    pips: {
        mode: 'values',
        values: yearPips,
        density: 4
    },
    range: {
        'min': 1,
        'max': MAX_YEAR
    },
    handleAttributes: [
        {"aria-label": "Minimum year"},
        {"aria-label": "Maximum year"}
    ]
});

// Ignore all parameters passed to the callback
yearSlider.noUiSlider.on("change",
    noUiSliderCallbackArgs => updatePostGrid(yearSlider));

/* Layers can go up to 32 in QMK but it's very unlikely to encounter more than
 * 16 layers in a keymap so in order to make the slider more comfortable to use,
 * we limit the max to 16. However, we can and should change that if we do find
 * a keymap with more 16 layers.
 *
 * EDIT: 32-layer keymap found! See posts/keymaps/rafaelromao.md @ PR#66
 */


// Source: https://refreshless.com/nouislider/examples/#section-merging-tooltips
/**
 * @param slider HtmlElement with an initialized slider
 * @param threshold Minimum proximity (in percentages) to merge tooltips
 * @param separator String joining tooltips
 */
function mergeTooltips(slider, threshold, separator) {

    var textIsRtl = getComputedStyle(slider).direction === 'rtl';
    var isRtl = slider.noUiSlider.options.direction === 'rtl';
    var isVertical = slider.noUiSlider.options.orientation === 'vertical';
    var tooltips = slider.noUiSlider.getTooltips();
    var origins = slider.noUiSlider.getOrigins();

    // Move tooltips into the origin element. The default stylesheet handles this.
    tooltips.forEach(function (tooltip, index) {
        if (tooltip) {
            origins[index].appendChild(tooltip);
        }
    });

    slider.noUiSlider.on('update', function (values, handle, unencoded, tap, positions) {

        var pools = [[]];
        var poolPositions = [[]];
        var poolValues = [[]];
        var atPool = 0;

        // Assign the first tooltip to the first pool, if the tooltip is configured
        if (tooltips[0]) {
            pools[0][0] = 0;
            poolPositions[0][0] = positions[0];
            poolValues[0][0] = values[0];
        }

        for (var i = 1; i < positions.length; i++) {
            if (!tooltips[i] || (positions[i] - positions[i - 1]) > threshold) {
                atPool++;
                pools[atPool] = [];
                poolValues[atPool] = [];
                poolPositions[atPool] = [];
            }

            if (tooltips[i]) {
                pools[atPool].push(i);
                poolValues[atPool].push(values[i]);
                poolPositions[atPool].push(positions[i]);
            }
        }

        pools.forEach(function (pool, poolIndex) {
            var handlesInPool = pool.length;

            for (var j = 0; j < handlesInPool; j++) {
                var handleNumber = pool[j];

                if (j === handlesInPool - 1) {
                    var offset = 0;

                    poolPositions[poolIndex].forEach(function (value) {
                        offset += 1000 - value;
                    });

                    var direction = isVertical ? 'bottom' : 'right';
                    var last = isRtl ? 0 : handlesInPool - 1;
                    var lastOffset = 1000 - poolPositions[poolIndex][last];
                    offset = (textIsRtl && !isVertical ? 100 : 0) + (offset / handlesInPool) - lastOffset;

                    // Filter out duplicate tool tip values
                    var tooltipValues = poolValues[poolIndex].filter((v, i, a) => a.indexOf(v) === i);

                    // Center this tooltip over the affected handles
                    tooltips[handleNumber].innerHTML = tooltipValues.join(separator);
                    tooltips[handleNumber].style.display = 'block';
                    tooltips[handleNumber].style[direction] = offset + '%';
                } else {
                    // Hide this tooltip
                    tooltips[handleNumber].style.display = 'none';
                }
            }
        });
    });
}

// Not an ASCII hyphen, the separator is an en-dash
//<–> 8211, Hex 2013, Oct 20023, Digr -N
mergeTooltips(yearSlider, 25, '–');

