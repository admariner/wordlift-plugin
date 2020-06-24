/**
 * TinyMceToolbarHandler handles the toolbar button.
 * @since 3.26.0
 * @author Naveen Muthusamy <naveen@wordlift.io>
 */

/**
 * Internal dependencies.
 */
import {on, trigger} from "backbone";
import {FAQ_EVENT_HANDLER_SELECTION_CHANGED, FAQ_ITEMS_CHANGED} from "../../constants/faq-hook-constants";
import FaqValidator from "../validators/faq-validator";

const TINYMCE_TOOLBAR_BUTTON_NAME = "wl-faq-toolbar-button";

class TinymceToolbarHandler {
  /**
   * Construct the TinymceToolbarHandler
   * @param editor {tinymce.Editor} instance.
   * @param highlightHandler {TinymceHighlightHandler} instance.
   */
  constructor(editor, highlightHandler) {
    this.editor = editor;
    this.highlightHandler = highlightHandler;
    this.faqItems = [];
    this.addQuestionText = this.editor.translate("Add Question");
    this.addAnswerText = this.editor.translate("Add Answer");
    this.addQuestionOrAnswerText = this.editor.translate("Add Question / Answer");
    // Listen to store changes on faq items and set the tool bar
    // button state based on it.
    on(FAQ_ITEMS_CHANGED, faqItems => {
      this.faqItems = faqItems;
    });
  }

  /**
   * Sets the button text based on the text selected by user.
   * @param selectedText The text selected by user.
   * @param button Button present in toolbar.
   * @param container This container holds the button.
   */
  setButtonTextBasedOnSelectedText(selectedText, button, container) {
    if (FaqValidator.isQuestion(selectedText)) {
      button.innerText = this.addQuestionText;
      container.setAttribute("aria-label", this.addQuestionText);
    } else {
      button.innerText = this.addAnswerText;
      container.setAttribute("aria-label", this.addAnswerText);
    }
  }

  /**
   * Disable toolbar button
   */
  disableButton(container, button) {
    container.classList.add("mce-disabled");
    button.disabled = true;
  }

  /**
   * Enable toolbar button
   */
  enableButton(container, button) {
    container.classList.remove("mce-disabled");
    button.disabled = false;
  }

  /**
   * Determine if the tool bar button needed to be disabled.
   * Conditions for disabling the button
   * 1. If there is no selected text
   * 2. If an answer is selected and there are no unanswered questions.
   * @return {Boolean} True if we need to disable button, false if we dont want to.
   */
  static shouldDisableButton(selectedText, faqItems) {
    if (0 === selectedText.length || typeof selectedText === "undefined") {
      return true;
    }
    // If there is some selected text then check if it is an answer.
    const questionsWithoutAnswer = faqItems.filter(e => e.answer === "").length;
    if (0 === questionsWithoutAnswer && !FaqValidator.isQuestion(selectedText)) {
      // There are no questions without answer and selected text is answer then disable it.
      return true;
    }
    // Return false if no conditions are matching.
    return false;
  }

  /**
   * When there is no selection disable the button, determine
   * if it is question or answer and change the button text.
   */
  changeButtonStateOnSelectedText() {
    const editor = this.editor;
    const selectedText = editor.selection.getContent({ format: "text" });
    const container = document.getElementById(TINYMCE_TOOLBAR_BUTTON_NAME);
    // If we cant find the toolbar buttons, then return early.
    if (container === null) {
      return;
    }
    const button = container.getElementsByTagName("button")[0];
    if (TinymceToolbarHandler.shouldDisableButton(selectedText, this.faqItems)) {
      this.disableButton(container, button);
    } else {
      this.enableButton(container, button);
    }
    const contentEditable = editor.getBody().getAttribute("contenteditable");
    if (contentEditable === "false" || contentEditable === false) {
      // then dont allow user to highlight text, analysis is going on, allowing user to
      // highlighting text might break the html
      this.disableButton(container, button);
    }
    this.setButtonTextBasedOnSelectedText(selectedText, button, container);
  }

  /**
   * Listen for node changes, and alter the state of
   * the button according to the text selected.
   */
  changeToolBarButtonStateBasedOnTextSelected() {
    const editor = this.editor;
    editor.on("NodeChange", e => {
      this.changeButtonStateOnSelectedText();
    });
    editor.on("selectionchange", e => {
      this.changeButtonStateOnSelectedText();
    });
  }

  /**
   * Adds the button to the toolbar.
   */
  addButtonToToolBar() {
    const editor = this.editor;
    const self = this;
    editor.addButton(TINYMCE_TOOLBAR_BUTTON_NAME, {
      text: "Add Question or Answer",
      id: TINYMCE_TOOLBAR_BUTTON_NAME,
      onclick: function() {
        const selectedText = editor.selection.getContent({ format: "text" });
        const selectedHTML = editor.selection.getContent({ format: "html" });
        /**
         * Make the highlight handler to save the selection.
         */
        self.highlightHandler.saveSelection();
        trigger(FAQ_EVENT_HANDLER_SELECTION_CHANGED, {
          selectedText: selectedText,
          selectedHTML: selectedHTML
        });
      }
    });
    this.changeToolBarButtonStateBasedOnTextSelected();
  }
}

export default TinymceToolbarHandler;
