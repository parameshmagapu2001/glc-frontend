import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import SvgColor from 'src/components/svg-color';
// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  settings: icon('ic_settings'),
  addressRequest: icon('ic_address_request'),
  deleteAccount: icon('ic_delete_account'),
  roleManager: icon('ic_manage_role'),
  dashboardNew: icon('ic_dashboard_new'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('Home'),
        items: [
          {
            id: 'dashboard',
            title: t('Dashboard'),
            path: paths.rm.root,
            icon: ICONS.dashboardNew,
          }
        ],
      },
      // {
      //   subheader: t('Analytics'),
      //   items: [
      //     // USER
      //     {
      //       id: 'userRoles',
      //       title: t("F's"),
      //       path: paths.admin.roles_users.root,
      //       icon: ICONS.lock,
      //     },
      //     {
      //       id: 'users',
      //       title: t("Users's"),
      //       path: paths.admin.roles_users.root,
      //       icon: ICONS.lock,
      //     },
      //     {
      //       id: 'settings',
      //       title: t('settings'),
      //       path: paths.admin.app_settings.root,
      //       icon: ICONS.label,
      //       children: [
      //         {
      //           id: 'COMMUNICATIONP',
      //           title: t('communication'),
      //           path: paths.admin.app_settings.root
      //         },
      //         {
      //           id: 'PAYMENTGP',
      //           title: t('payment gateways'),
      //           path: paths.admin.app_settings.gateways
      //         },
      //         {
      //           id: 'SMSP',
      //           title: t('sms providers'),
      //           path: paths.admin.app_settings.sms_providers
      //         },
      //         {
      //           id: 'WELCOMEP',
      //           title: t('welcome screens'),
      //           path: paths.admin.app_settings.welcome_screens
      //         },
      //         {
      //           id: 'CONTACTUS',
      //           title: t('Contact Us'),
      //           path: paths.admin.app_settings.contact_us
      //         }
      //       ],
      //     }
      //   ],
      // },
      // {
      //   subheader: t('Team'),
      //   items: [
      //     // USER
      //     {
      //       id: 'userRoles',
      //       title: t("Employee's"),
      //       path: paths.admin.roles_users.root,
      //       icon: ICONS.lock,
      //     },
      //     {
      //       id: 'users',
      //       title: t("Users's"),
      //       path: paths.admin.roles_users.root,
      //       icon: ICONS.lock,
      //     },
      //     {
      //       id: 'settings',
      //       title: t('settings'),
      //       path: paths.admin.app_settings.root,
      //       icon: ICONS.label,
      //       children: [
      //         {
      //           id: 'COMMUNICATIONP',
      //           title: t('communication'),
      //           path: paths.admin.app_settings.root
      //         },
      //         {
      //           id: 'PAYMENTGP',
      //           title: t('payment gateways'),
      //           path: paths.admin.app_settings.gateways
      //         },
      //         {
      //           id: 'SMSP',
      //           title: t('sms providers'),
      //           path: paths.admin.app_settings.sms_providers
      //         },
      //         {
      //           id: 'WELCOMEP',
      //           title: t('welcome screens'),
      //           path: paths.admin.app_settings.welcome_screens
      //         },
      //         {
      //           id: 'CONTACTUS',
      //           title: t('Contact Us'),
      //           path: paths.admin.app_settings.contact_us
      //         }
      //       ],
      //     }
      //   ],
      // },
    ],
    [t]
  );

  return data;
}
