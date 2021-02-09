import { VTooltip } from 'v-tooltip';

export default Vue => {
    Vue.directive('tooltip', VTooltip);
    
    VTooltip.options.defaultTemplate = '<div class="vui-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';
};
