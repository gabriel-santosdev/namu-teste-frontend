const JSDOMEnvironment = require('jest-environment-jsdom').default;

const NODE_GLOBALS = {
  TextDecoder,
  TextEncoder,
  TextDecoderStream,
  TextEncoderStream,
  ReadableStream,
  TransformStream,
  WritableStream,
  Blob,
  Headers,
  Request,
  Response,
  fetch,
  AbortController,
  AbortSignal,
  BroadcastChannel,
  structuredClone,
  URL,
  URLSearchParams,
};

class MswJSDOMEnvironment extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context);
    this.customExportConditions = [''];
    Object.assign(this.global, NODE_GLOBALS);
  }
}

module.exports = MswJSDOMEnvironment;
