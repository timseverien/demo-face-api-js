export default (element) => {
  const elementContent = document.getElementById('feedback-box-content');
  const elementSpinner = document.getElementById('feedback-box-spinner');

  return {
    hide() {
      element.hidden = true;
    },

    show(message, { withSpinner = false } = {}) {
      elementContent.textContent = message;
      elementSpinner.hidden = !withSpinner;

      element.hidden = false;
    },
  };
};
