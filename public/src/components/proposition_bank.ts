import Vue from '../vue.js'

import Term from '../data/terms/term.js'
import { litTerm } from '../data/terms/literal.js'
import Predicate from '../data/predicates/predicate.js'

class PropositionBankProps {
  readonly assumptions: Predicate[] = [];
  readonly deductions: Predicate[] = [];
  readonly terms: Term[] = [];
  readonly existentialTerms: Term[] = [];
  readonly universalTerms: Term[] = [];
  readonly universalIntroductionPresent: boolean = false;
}

const frak = ["𝔞","𝔟","𝔠","𝔡","𝔢","𝔣","𝔤","𝔥","𝔦","𝔧","𝔨","𝔩","𝔪","𝔫","𝔬","𝔭","𝔮","𝔯","𝔰","𝔱","𝔲","𝔳","𝔴","𝔵","𝔶","𝔷","𝔄","𝔅","ℭ","𝔇","𝔈","𝔉","𝔊","ℌ","ℑ","𝔍","𝔎","𝔏","𝔐","𝔑","𝔒","𝔓","𝔔","ℜ","𝔖","𝔗","𝔘","𝔙","𝔚","𝔛","𝔜","ℨ"];

function predicateToLI(p: Predicate) {
  return Vue.h("li", {
    style: {'margin-top': '2px', 'margin-bottom': '2px'},
    innerHTML: p.toHTMLString(),
  });
}

const PropositionBankComponent = {
  props: Object.keys(new PropositionBankProps()),
  setup(props: PropositionBankProps) {
    function nextUniversal(): Term {
      let length = 0;
      while (true) {
        length += 1;
        let counter = [];
        for (let i = 0; i < length; ++i) {
          counter.push(0);
        }
        let exaustedCounter = false;
        while (!exaustedCounter) {
          let t = litTerm(counter.map(i => frak[i]).join(""));
          let isNew = true;
          for (const alreadyThere of props.universalTerms) {
            if (alreadyThere.equals(t)) {
              isNew = false;
              break;
            }
          }
          if (isNew) {
            return t;
          }
          let index = length - 1;
          counter[index] += 1;
          while (counter[index] >= frak.length) {
            counter[index] = 0;
            index -= 1;
            if (index < 0) {
              exaustedCounter = true;
              break;
            } else {
              counter[index] += 1;
            }
          }
        }
      }
    }

    return () => {
      let items = [];

      if (props.assumptions.length > 0) {
	items.push(Vue.h('h3', {}, 'Assumptions'));
        items.push(Vue.h('ul', {}, props.assumptions.map(predicateToLI)));
      }

      if (props.deductions.length > 0) {
        items.push(Vue.h('h3', {}, 'Deductions'));
	items.push(Vue.h('ul', {}, props.deductions.map(predicateToLI)));
      }

      if (props.terms.length > 0 || props.existentialTerms.length > 0 || props.universalTerms.length > 0 || props.universalIntroductionPresent) {
        if (props.universalIntroductionPresent) {
          items.push(Vue.h('h3', {}, [
            'Terms - ',
            Vue.h('button', {
              onClick: () => {
                props.universalTerms.push(nextUniversal());
              },
            }, 'Add Universal Term'),
          ]));
        } else {
          items.push(Vue.h('h3', {}, 'Terms'));
        }
        const termsList = Vue.h('ul', {style: {display: 'inline-block'}}, props.terms.map(t => Vue.h('li', {}, t.toString())));
        const existentialList = Vue.h('ul', {style: {display: 'inline-block'}}, props.existentialTerms.map(t => Vue.h('li', {}, t.toString())));
        const universalList = Vue.h('ul', {style: {display: 'inline-block'}}, props.universalTerms.map(t => Vue.h('li', {}, t.toString())));
        const allLists = [];
        if (props.terms.length > 0) {
          allLists.push(termsList);
        }
        if (props.existentialTerms.length > 0) {
          allLists.push(existentialList);
        }
        if (props.universalTerms.length > 0) {
          allLists.push(universalList);
        }
        items.push(Vue.h('div', {
          style: {
            'display': 'flex',
            'wrap': 'nowrap',
            'align-items': 'flex-start',
          },
        }, allLists))
      }

      return Vue.h('div', { class: 'proposition-bank' }, items);
    }
  }
}

export function makePropositionBank(p: PropositionBankProps, extra: any = {}) {
  return Vue.h(PropositionBankComponent, Object.assign(p, extra));
}
