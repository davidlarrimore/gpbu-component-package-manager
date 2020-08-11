public with sharing class PackageInstallerController {
    @AuraEnabled
    public String recordId { get; set; }

    @AuraEnabled(cacheable=true)
    public static list<GPBU_Package__c> getDependentPackages(String searchKey){
        List<Package_Dependency__c> packageDependencies = new List<Package_Dependency__c>([SELECT Dependent_Package__c FROM Package_Dependency__c WHERE GPBU_Package__c = 'a003F0000046QvjQAE' ]);
        Set<Id> Ids = new Set<Id>();
        for(Package_Dependency__c packageDependency:packageDependencies){
            Ids.add(packageDependency.Dependent_Package__c);
        }   
        List<GPBU_Package__c> dependentPackages = new List<GPBU_Package__c>([SELECT Id, Installed__c, Title__c FROM GPBU_Package__c WHERE Id in :Ids]);
        system.debug('found the following packages');
        system.debug(dependentPackages);
        return dependentPackages;
    }

}