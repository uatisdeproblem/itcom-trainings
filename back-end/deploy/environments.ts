/**
 * The codename of the project.
 */
export const PROJECT = 'itcom-trainings';
/**
 * The purchased domain to use.
 */
export const DOMAIN = 'itcom-trainings.link';

export const parameters: Parameters = {
  project: PROJECT,
  apiDomain: 'api.'.concat(DOMAIN),
  mediaDomain: 'media.'.concat(DOMAIN),
  firstAdminEmail: 'itcom@matteocarbone.com'
};

export const stages: { [stage: string]: Stage } = {
  prod: {
    domain: DOMAIN,
    destroyDataOnDelete: false,
    logLevel: 'INFO'
  },
  dev: {
    domain: 'dev.'.concat(DOMAIN),
    destroyDataOnDelete: true,
    logLevel: 'DEBUG'
  }
};

export interface Parameters {
  /**
   * Project key (unique to the AWS account).
   */
  project: string;
  /**
   * API for each environment will be available at `${apiDomain}/${env.stage}`.
   */
  apiDomain: string;
  /**
   * The domain name where to reach the front-end's media files.
   */
  mediaDomain: string;
  /**
   * The email address of the first (admin) user.
   */
  firstAdminEmail: string;
}

export interface Stage {
  /**
   * The domain name where to reach the front-end.
   */
  domain: string;
  /**
   * Whether to delete the data when the environment is deleted.
   * It should be True for dev and False for prod environments.
   */
  destroyDataOnDelete: boolean;
  /**
   * The minimum level of log to print in functions (default: `INFO`).
   */
  logLevel?: 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
}
