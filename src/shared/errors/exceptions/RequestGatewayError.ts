import { GatewayError } from './GatewayErrorException';

export class RequestGatewayError extends GatewayError {
  constructor(message = 'Failed to process request') {
    super(message, 'REQUEST_GATEWAY_ERROR');
  }
}
