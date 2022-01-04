import Vue from '../../vue.js'

class SelectProps {
  readonly selected: number = 0;
  readonly objectType: string = "";
  readonly options: string[] = [];
}

export default {
  props: Object.keys(new SelectProps()),
  emits: ['change'],

  setup(props: SelectProps, {attrs, slots, emit}: any) {
    function onChange(e: InputEvent) {
      e.stopImmediatePropagation();

      const target: HTMLSelectElement = e.target as HTMLSelectElement;
      if (target.value === "") {
        emit('change', null);
      } else {
        emit('change', parseInt(target.value));
      }
    }

    return () => {
      const options: any = [];
      if (props.objectType && props.objectType.length > 0) {
        options.push(Vue.h('option', { value: "" }, `Select ${props.objectType}` ));
      }
      for (let i = 0; i < props.options.length; ++i) {
        options.push(Vue.h('option', {
          value: i,
          selected: i == props.selected,
        }, props.options[i]));
      }
      return Vue.h('select', { onChange: onChange }, options);
    }
  }
}
