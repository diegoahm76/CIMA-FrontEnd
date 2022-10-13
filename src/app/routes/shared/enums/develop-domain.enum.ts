export enum DevelopDomainTypeEnum {
  LOCATION = 'location',
  MEASUREMENT_UNIT = 'measurement_unit',
}

export const DevelopDomainTypeValues: {[key: string]: string} = {
  [DevelopDomainTypeEnum.LOCATION]: 'Ubicación',
  [DevelopDomainTypeEnum.MEASUREMENT_UNIT]: 'Unidad de medida',
};

export enum DevelopDomainStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export const DevelopDomainStatusValues: {[key: string]: string} = {
  [DevelopDomainStatusEnum.ACTIVE]: 'Activo',
  [DevelopDomainStatusEnum.INACTIVE]: 'Inactivo',
};
