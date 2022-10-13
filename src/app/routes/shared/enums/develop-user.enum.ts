export enum DevelopUserRoleEnum {
  ADMIN = 'admin',
  USER = 'user'
}

export const DevelopUserRoleValues: {[key: string]: string} = {
  [DevelopUserRoleEnum.ADMIN]: 'Admin',
  [DevelopUserRoleEnum.USER]: 'Usuario'
};

export enum DevelopUserStatusEnum {
  NEW = 'new',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export const DevelopUserStatusValues: {[key: string]: string} = {
  [DevelopUserStatusEnum.NEW]: 'Nuevo',
  [DevelopUserStatusEnum.ACTIVE]: 'Activo',
  [DevelopUserStatusEnum.INACTIVE]: 'Inactivo'
};
