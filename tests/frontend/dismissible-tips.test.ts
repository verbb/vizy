import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { wireDismissibleTips } from '../../src/web/assets/field/src/ts/dismissible-tips';

describe('dismissible FieldLayout tips', () => {
    let root: HTMLElement;

    beforeEach(() => {
        root = document.createElement('div');
        document.body.append(root);
        (window as any).Craft = {
            systemUid: 'test-system',
            getLocalStorage: (_key: string, fallback: unknown) => fallback,
            setLocalStorage: () => {},
        };
    });

    afterEach(() => {
        root.remove();
        delete (window as any).Craft;
    });

    it('removes tips already listed in dismissedTips and wires dismiss clicks', () => {
        const remembered: string[] = ['tip-uid-a'];
        (window as any).Craft.getLocalStorage = (key: string, fallback: unknown) => (
            key === 'dismissedTips' ? [...remembered] : fallback
        );
        (window as any).Craft.setLocalStorage = (key: string, value: unknown) => {
            if (key === 'dismissedTips' && Array.isArray(value)) {
                remembered.splice(0, remembered.length, ...value.map(String));
            }
        };

        root.innerHTML = `
            <div data-layout-element="tip-uid-a">
                <div class="pane tip dismissible">
                    <button type="button" class="tip-dismiss-btn"></button>
                    <p>Already gone</p>
                </div>
            </div>
            <div data-layout-element="tip-uid-b">
                <div class="pane warning dismissible">
                    <button type="button" class="tip-dismiss-btn"></button>
                    <p>Still here</p>
                </div>
                <script>if (JSON.parse(localStorage['x']).includes('tip-uid-b')) {}</script>
            </div>
            <div data-layout-element="field-uid" class="field">
                <input type="text" />
            </div>
        `;

        const dispose = wireDismissibleTips(root);
        expect(root.querySelector('[data-layout-element="tip-uid-a"]')).toBeNull();
        expect(root.querySelector('[data-layout-element="tip-uid-b"]')).toBeTruthy();
        expect(root.querySelector('[data-layout-element="field-uid"]')).toBeTruthy();

        root.querySelector('.tip-dismiss-btn')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(root.querySelector('[data-layout-element="tip-uid-b"]')).toBeNull();
        expect(remembered).toContain('tip-uid-b');

        dispose();
    });

    it('reads UID from Tip.php hide script when data-layout-element is true', () => {
        const remembered: string[] = [];
        (window as any).Craft.setLocalStorage = (key: string, value: unknown) => {
            if (key === 'dismissedTips' && Array.isArray(value)) {
                remembered.splice(0, remembered.length, ...value.map(String));
            }
        };

        root.innerHTML = `
            <div data-layout-element="true">
                <div class="pane tip dismissible">
                    <button type="button" class="tip-dismiss-btn"></button>
                    <p>Tip</p>
                </div>
                <script>
if (
  typeof localStorage !== 'undefined' &&
  typeof localStorage['Craft-x.dismissedTips'] !== 'undefined' &&
  JSON.parse(localStorage['Craft-x.dismissedTips']).includes('real-tip-uid')
) {
  document.getElementById('tip1').remove();
}
</script>
            </div>
        `;

        const dispose = wireDismissibleTips(root);
        root.querySelector('.tip-dismiss-btn')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(remembered).toEqual(['real-tip-uid']);
        dispose();
    });
});
