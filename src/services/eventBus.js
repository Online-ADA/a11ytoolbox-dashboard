import Vue from 'vue';

export const EventBus = new Vue({
  data: () => ({
    originElements: [],
  }),
  methods: {
    openModal(emit, $origin, callback = false) {
      if (emit) {
        if (!callback) {
          callback = () => { this.$emit(emit, true); };
        }
      }

      let target = $origin;
      // Check if $event is a ClickEvent or a DOM Node
      if (!$origin.tagName) {
        target = $origin.target;
      }
      this.originElements.push(target);

      const { classList } = document.body;
      if (!classList.contains('modalOpen')) {
        classList.add('modalOpen');
      }
      callback();
    },
    transitionModal(close, open) {
      this.$emit(close, false);
      this.$emit(open, true);
    },
    closeModal(callback) {
      const { classList } = document.body;
      if (classList.contains('modalOpen')) {
        classList.remove('modalOpen');
      }
      if (this.originElements.length) {
        const origin = this.originElements[this.originElements.length - 1];
        this.originElements.splice(this.originElements.length - 1, 1);
        // Looks like there are instances for creating a modal where the "origin" is never defined
        if (origin) origin.focus();
      }

      callback();
    },
  },
});
