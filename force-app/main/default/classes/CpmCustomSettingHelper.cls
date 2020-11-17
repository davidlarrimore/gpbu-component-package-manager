public with sharing class CpmCustomSettingHelper {


    public static Cpm_Client_Settings__c getAppSettings(){ 
        System.debug('Running CpmCustomSettingHelper.CpmCustomSettingHelper');
        Cpm_Client_Settings__c appSetting = new Cpm_Client_Settings__c();
        List<Cpm_Client_Settings__c> appSettings = [SELECT Id, Last_Library_Refresh_Date__c, Initial_Config_Flag__c, Sandbox_Flag__c, App_Deployer_URL__c FROM Cpm_Client_Settings__c];

        if(appSettings.size() == 0){
            System.debug('No Cpm_Client_Settings__c Found. Initializing');
            appSetting = CpmCustomSettingHelper.initializeAppSettings();
        }else{
            appSetting = appSettings[0];
        }

        return appSetting;
    }    

    public static Cpm_Client_Settings__c initializeAppSettings(){ 
        System.debug('Running CpmCustomSettingHelper.initializeAppSettings');
        List<Cpm_Client_Settings__c> appSettings = [SELECT Id, Last_Library_Refresh_Date__c, Initial_Config_Flag__c, Sandbox_Flag__c, App_Deployer_URL__c FROM Cpm_Client_Settings__c];

        if(appSettings.size() != 0){
            delete appSettings;
        }

        Cpm_Client_Settings__c appSetting = new Cpm_Client_Settings__c();
        System.debug('Initializing appSettings');
        Organization organization = [SELECT IsSandbox FROM Organization LIMIT 1];
        if(organization.IsSandbox){
            appSetting.Sandbox_Flag__c = true; 
            appSetting.App_Deployer_URL__c = 'http://localhost:8443/byoo';
        }else{
            appSetting.Sandbox_Flag__c = false;
            appSetting.App_Deployer_URL__c = 'https://gpbu-deployer.herokuapp.com/byoo';           
        }   


        insert appSetting;

        return appSetting;
    }    



}