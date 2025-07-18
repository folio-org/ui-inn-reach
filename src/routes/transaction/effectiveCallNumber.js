import compact from 'lodash/compact';

export const effectiveCallNumber = (instanceItem) => {
  const rootItem = instanceItem?.item ?? instanceItem;

  const prefix = rootItem?.effectiveCallNumberComponents?.prefix || rootItem?.callNumberComponents?.prefix;
  const suffix = rootItem?.effectiveCallNumberComponents?.suffix || rootItem?.callNumberComponents?.suffix;
  const callNumber = rootItem?.effectiveCallNumberComponents?.callNumber || rootItem?.callNumberComponents?.callNumber;

  const result = compact([
    prefix,
    callNumber,
    suffix,
    rootItem?.displaySummary,
    rootItem?.volume,
    rootItem?.enumeration,
    rootItem?.chronology,
    rootItem?.copyNumber,
  ]);

  return result.join(' ');
};
