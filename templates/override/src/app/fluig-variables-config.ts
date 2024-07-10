abstract class FluigUrlSettings {

    public static APP_ROOT = (window as any)['_app_baseUrl'];
    public static APP_PAGE_CODE = (window as any)['_app_pageCode'];

    /**
     * base url + application prefix
     */

    public static APP_BASE =
        FluigUrlSettings.APP_ROOT && FluigUrlSettings.APP_PAGE_CODE
            ? FluigUrlSettings.APP_ROOT + '/' + FluigUrlSettings.APP_PAGE_CODE
            : '';
}

export { FluigUrlSettings as FLUIG_URL_CONFIG };