import { createLocalVue, mount } from '@vue/test-utils';

import VueCallStore from '../src';

const identifier = 'identifier';
let localVue;
let wrapper;

const component = {
  template: `
    <div>
      <div v-call:done="'${identifier}'" class="done">Hello World</div>
      <div v-call:failed="['${identifier}', 'second']" class="failed">Hello World</div>
      <div v-call:pending="['${identifier}', 'third']" class="pending">Hello World</div>
    </div>
  `
};

beforeEach(() => {
  localVue = createLocalVue();
  localVue.use(VueCallStore);
  wrapper = mount(component, { localVue });
});

describe('directive.js', () => {
  it('should update components', async () => {
    wrapper.vm.$startCall(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBe(false);
    expect(wrapper.find('.failed').exists()).toBe(false);
    expect(wrapper.find('.pending').exists()).toBe(true);

    wrapper.vm.$endCall(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBe(true);
    expect(wrapper.find('.failed').exists()).toBe(false);
    expect(wrapper.find('.pending').exists()).toBe(false);

    wrapper.vm.$failCall(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBe(false);
    expect(wrapper.find('.failed').exists()).toBe(true);
    expect(wrapper.find('.pending').exists()).toBe(false);
  });
});
