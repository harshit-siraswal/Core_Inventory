export const LOCATION_TYPES = ['WAREHOUSE', 'STORE', 'INTERNAL'] as const;
export type LocationType = (typeof LOCATION_TYPES)[number];

export const LOCATION_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
export type LocationStatus = (typeof LOCATION_STATUSES)[number];
