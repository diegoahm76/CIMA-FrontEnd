import {Permissions} from '@shared/interfaces';

export const permissions: Permissions = {
  admin: {
    // Modules

    'module.home': [{action: 'view'}],

    'module.admin.users': [{action: 'view'}],

    'module.develop.users': [{action: 'view'}],
    'module.develop.uploadFile': [{action: 'view'}],
    'module.develop.charts': [{action: 'view'}],
    'module.develop.visor': [{action: 'view'}],
    'module.develop.domains': [{action: 'view'}],
    'module.develop.translations': [{action: 'view'}],
    'module.develop.notifications': [{action: 'view'}],
    'module.develop.forbiddenResource': [],

    // Sidebar

    'sidebar.home.heading': [{action: 'view'}],
    'sidebar.home.dashboard': [{action: 'view'}],

    'sidebar.admin.heading': [{action: 'view'}],
    'sidebar.admin.users': [{action: 'view'}],

    'sidebar.account.heading': [{action: 'view'}],
    // 'sidebar.account.profile': [
    //   {action: 'view'}
    // ],
    // 'sidebar.account.password': [
    //   {action: 'view'}
    // ],
    'sidebar.account.logout': [{action: 'view'}],

    'sidebar.develop.heading': [{action: 'view'}],
    'sidebar.develop.users': [{action: 'view'}],
    'sidebar.develop.uploadFile': [{action: 'view'}],
    'sidebar.develop.charts': [{action: 'view'}],
    'sidebar.develop.visor': [{action: 'view'}],
    'sidebar.develop.domains': [{action: 'view'}],
    'sidebar.develop.translations': [{action: 'view'}],
    'sidebar.develop.notifications': [{action: 'view'}],
    'sidebar.develop.forbiddenResource': [{action: 'view'}],
    'sidebar.develop.notFound': [{action: 'view'}],
  },
};
