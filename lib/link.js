const xs = require("xstream").default;
const _ = require("lodash");
const Constraints = require("./constraints.js");

const stateUpdate = {
  "init": (state, msg) => ({
    ...state,
    initt: msg.data,
    path: [{
      type: "step",
      step: {
        from: "",
        to: msg.data,
        rule: ""
      }
    }]
  }),
  "target": (state, msg) => {
    state.targett = msg.data[0];
    return state;
  },
  "error": (state, msg) => {
    // console.log(msg.data);
    state.error = state.error + "\n" + msg.data
    return state;
  },
  "step": (state, msg) => {
    let from = msg.from;
    let to = msg.to;
    state.edges = Object.assign({}, state.edges);
    state.edges[from] = (state.edges[from] || [])
      .concat([{from, to}])
    // TODO - frontier
    return state;
  },
  // TODO - rename all to blob
  "blob": (state, msg) => {
    let state_ = {
      ...state,
      nodes: {
        ...state.nodes,
        [msg.blobid]: msg.blob
      }
    }
    if(msg.blob.term.att) {
      let tags = (msg.blob.term.att
        .match(/tag\(([^\)]*)\)/g) || [])
        .map(s => s.slice(4, -1))
      if(tags.indexOf("step") > -1) {
        state_.steps = {
          ...state_.steps,
          [msg.blobid]: true
        };
      }
    }
    return state_;
  },
  "normalnode": (state, msg) => {
    state.normalnodes = Object.assign({}, state.normalnodes, {[msg.data[0]]: true});
    return state;
  },
  "specialnode": (state, msg) => {
    state[msg.data[0]] = Object.assign({}, state[msg.data[0]], {[msg.data[1]]: true});
    return state;
  },
  "crash": (state, msg) => {
    state.crash = Object.assign({}, state.crash, {[msg.data[0]]: true});
    return state;
  },
  "z3feedbackdata": (state, msg) => {
    state.z3feedbackdata = (state.z3feedbackdata || {})
    state.z3feedbackdata[msg.z3feedbackid] = msg.data
    return state;
  },
  "z3feedback": (state, msg) => {
    let term_id = msg.data[0];
    state.z3feedback = Object.assign({}, state.z3feedback);
    if(!(term_id in state.z3feedback)) state.z3feedback[term_id] = [];
    let z3id = msg.data[1];
    state.z3feedback[term_id] = state.z3feedback[term_id].concat(z3id);
    return state;
  },
  "status": (state, msg) => {
    state.status = msg.data;
    return state;
  }
}



module.exports = (K) => {

  // update state based on K messeges
  const link$ = K
    .filter(msg => msg.type in stateUpdate)
    .map(msg => state => {
      return Object.assign({}, stateUpdate[msg.type](state, msg))
    })

  return link$;
}