/**
 * Editor runtime — loaded after the field entry stub so a definition-time
 * crash in Block header cannot prevent the boot-failure UI from registering.
 */
import './components/VizyBlockElement';
import './components/VizyInsertionListElement';
import './components/VizyLayoutElement';
import './layout/preset-chooser';
import './toolbar/VizyToolbarElement';
import './toolbar/VizyBubbleElement';
import './VizyEditorElement';
