const menuItems = [
  [
    // {
    //   id: 'sidebar.home.heading',
    //   text: 'Main Navigation',
    //   heading: true
    // },
    {
      id: 'sidebar.home.dashboard',
      text: 'Inicio',
      link: '/inicio',
      icon: 'icon-home',
    },
    // {
    //   id: 'sidebar.submenu.dashboard',
    //   text: 'Submenu',
    //   link: '/submenu',
    //   icon: 'icon-list',
    // },
  ],
  [
    {
      id: 'sidebar.admin.heading',
      text: 'Modulos',
      heading: true,
    },
    {
      id: 'module.admin.users',
      text: 'Desempeño y gestión institucional',
      link: '/submodule',
    },
    {
      id: 'module.admin.users',
      text: 'Estado de los recursos naturales',
      link: '/submodule',
    },
    {
      id: 'module.admin.users',
      text: 'Prioridades de gobierno',
      link: '/submodule',
    },
  ],
  [
    // {
    //   id: 'sidebar.develop.heading',
    //   text: 'Develop',
    //   heading: true,
    // },
    // {
    //   id: 'sidebar.develop.users',
    //   text: 'CRUD',
    //   link: '/develop/crud',
    //   icon: 'icon-list',
    // },
    // {
    //   id: 'sidebar.develop.uploadFile',
    //   text: 'Upload file',
    //   link: '/develop/upload-file',
    //   icon: 'icon-cloud-upload',
    // },
    // {
    //   id: 'sidebar.develop.charts',
    //   text: 'Charts',
    //   link: '/develop/charts',
    //   icon: 'icon-chart',
    // },
    // {
    //   id: 'sidebar.develop.visor',
    //   text: 'Visor geográfico',
    //   link: '/develop/visor',
    //   icon: 'icon-globe-alt',
    // },
    // {
    //   id: 'sidebar.develop.domains',
    //   text: 'Dominios controlados',
    //   link: '/develop/domains',
    //   icon: 'icon-book-open',
    // },
    // {
    //   id: 'sidebar.develop.translations',
    //   text: 'Translations',
    //   link: '/develop/translations',
    //   icon: 'icon-globe',
    // },
    // {
    //   id: 'sidebar.develop.notifications',
    //   text: 'Notifications',
    //   link: '/develop/notifications',
    //   icon: 'icon-speech',
    // },
    // {
    //   id: 'sidebar.develop.forbiddenResource',
    //   text: 'Forbidden',
    //   link: '/develop/forbidden-resource',
    //   icon: 'icon-list',
    // },
    // {
    //   id: 'sidebar.develop.notFound',
    //   text: 'Not found',
    //   link: '/develop/zzz',
    //   icon: 'icon-list',
    // },
  ],
  [
    {
      id: 'sidebar.account.heading',
      text: 'Su cuenta',
      heading: true,
    },
    {
      id: 'sidebar.account.profile',
      text: 'Datos personales',
      link: '/cuenta/informacion',
      icon: 'icon-user',
    },
    {
      id: 'sidebar.account.password',
      text: 'Cambio de contraseña',
      link: '/cuenta/contrasenia',
      icon: 'icon-key',
    },
    {
      id: 'sidebar.account.logout',
      text: 'Cerrar sesión',
      click: 'logout',
      icon: 'icon-logout',
    },
  ],
];

export let menu = [];
for (const section of menuItems) {
  menu = menu.concat(section);
}
