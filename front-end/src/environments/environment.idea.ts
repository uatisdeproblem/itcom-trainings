import { parameters } from '../../../back-end/deploy/environments';

/**
 * The stage to use for API (and websocket) requests.
 */
const STAGE = 'prod';

/**
 * Variables to configure an ITER IDEA's cloud app, together with its inner modules.
 */
export const environment = {
  idea: {
    project: 'itcom-trainings',
    ionicExtraModules: ['common'],
    app: {
      version: '0.0.1',
      bundle: 'itcom-trainings',
      mediaUrl: 'https://'.concat(parameters.mediaDomain)
    },
    api: { url: parameters.apiDomain, stage: STAGE }
  }
};
