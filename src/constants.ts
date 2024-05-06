enum AppConstants {
  Category = 'category',
  Status = 'status',
  Source = 'source',
  Species = 'species',
}

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Disabled prefer-default-export as more constant/enum vars will be added in the future
 * and exporting a named var avoids needing to update import statements when more are added
 */
// eslint-disable-next-line import/prefer-default-export
export { AppConstants, IS_PRODUCTION };
