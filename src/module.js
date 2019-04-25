import _ from 'lodash';
import moment from 'moment';

import constants from './constants';

function addMeta(oldRequest, request) {
  const pending = request.status === constants.PENDING;

  request = _.merge(oldRequest, request, {
    _started: oldRequest._started || moment(),
    _stopped: !pending ? moment() : oldRequest._stopped || null,
  });

  return _.set(request, '_duration', duration(request));
}

function duration({ _started, _stopped }) {
  return _stopped ? moment.duration(_stopped.diff(_started)).as('ms') : null;
}

function updateRequest(state, { identifier, message }, status) {
  const oldRequest = _.get(state.requests, identifier, {});
  const newRequest = _.set({}, identifier, addMeta(oldRequest, { status, message }));

  return Object.assign({}, state.requests, newRequest);
}

export default {
  namespaced: true,

  getters: {
    requests: state => state.requests,
  },

  mutations: {
    end(state, payload) {
      state.requests = updateRequest(state, payload, constants.DONE);
    },

    fail(state, payload) {
      state.requests = updateRequest(state, payload, constants.FAILED);
    },

    reset(state) {
      state.requests = {};
    },

    start(state, payload) {
      state.requests = updateRequest(state, payload, constants.PENDING);
    },
  },

  state: {
    requests: {},
  },
};
