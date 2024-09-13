#import "TtlockUpgrade.h"
#import <TTLockDFU/TTLockDFU.h>
#import <TTLockDFU/TTGatewayDFU.h>
#import <TTLock/TTLock.h>
#import <TTLock/TTGateway.h>
#import <objc/message.h>

#define NOT_NULL_STRING(string) (string ?: @"")

#define EVENT_UPGRADE_PROGRESS @"EventUpgradeProgress"


@implementation TtlockUpgrade

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}



//暴露出支持的事件
- (NSArray<NSString *> *)supportedEvents
{
  return @[EVENT_UPGRADE_PROGRESS];
}


RCT_EXPORT_METHOD(startLockDfuByClient:(NSString *)clientId accessToken:(NSString *)accessToken lockId: (nonnull NSNumber *)lockId lockData:(NSString *) lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    __weak TtlockUpgrade *weakSelf = self;
    [TTLock enterUpgradeModeWithLockData:lockData success:^{
           [[TTLockDFU shareInstance] startDfuWithClientId:clientId accessToken:accessToken lockId:lockId lockData:lockData successBlock:^(UpgradeOpration type, NSInteger process) {
               if (type == UpgradeOprationSuccess) {
                   [TTLock getLockFeatureValueWithLockData:lockData success:^(NSString *newLockData) {
                       success(@[newLockData]);
                   } failure:^(TTError errorCode, NSString *errorMsg) {
                       success(@[lockData]);
                   }];
               }else{
                   [weakSelf sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(type),@(process)]];
               }
           } failBlock:^(UpgradeOpration type, UpgradeErrorCode code) {
               fail(@[@(code)]);
           }];
       } failure:^(TTError errorCode, NSString *errorMsg) {
           NSNumber *code = errorCode == TTErrorConnectionTimeout ? @2 : @6;
           fail(@[code,NOT_NULL_STRING(errorMsg)]);
       }];
}

RCT_EXPORT_METHOD(startLockDfuByFirmwarePackage:(NSString *)firmwarePackage lockData:(NSString *) lockData  success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    __weak TtlockUpgrade *weakSelf = self;
    [TTLock enterUpgradeModeWithLockData:lockData success:^{
           [[TTLockDFU shareInstance] startDfuWithFirmwarePackage:firmwarePackage lockData:lockData successBlock:^(UpgradeOpration type, NSInteger process) {
               if (type == UpgradeOprationSuccess) {
                   [TTLock getLockFeatureValueWithLockData:lockData success:^(NSString *newLockData) {
                       success(@[newLockData]);
                   } failure:^(TTError errorCode, NSString *errorMsg) {
                       success(@[lockData]);
                   }];
               }else{
                   [weakSelf sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(type),@(process)]];
               }
           } failBlock:^(UpgradeOpration type, UpgradeErrorCode code) {
               fail(@[@(code)]);
           }];
       } failure:^(TTError errorCode, NSString *errorMsg) {
           NSNumber *code = errorCode == TTErrorConnectionTimeout ? @2 : @6;
           fail(@[code,NOT_NULL_STRING(errorMsg)]);
       }];
}


RCT_EXPORT_METHOD(stopLockUpgrade)
{
    [[TTLockDFU shareInstance] endUpgrade];
}


RCT_EXPORT_METHOD(startGatewayDfuByType:(nonnull NSNumber *)type clientId:(NSString *)clientId accessToken:(NSString *)accessToken gatewayId: (nonnull NSNumber *)gatewayId gatewayMac:(NSString *) gatewayMac  success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    TTGatewayDFUType dfuType = type.intValue == 0 ? TTGatewayDFUTypeByNet : TTGatewayDFUTypeByBluetooth;

    __weak TtlockUpgrade *weakSelf = self;
    [TTGateway connectGatewayWithGatewayMac:gatewayMac block:^(TTGatewayConnectStatus connectStatus) {
           if (connectStatus == TTGatewayConnectSuccess) {
               [TTGateway upgradeGatewayWithGatewayMac:gatewayMac block:^(TTGatewayStatus status) {
                   if (status == TTGatewaySuccess) {
                       [[TTGatewayDFU shareInstance] startDfuWithType:dfuType clientId:clientId accessToken:accessToken gatewayId:gatewayId gatewayMac:gatewayMac successBlock:^(UpgradeOpration type, NSInteger process) {
                           if (type == UpgradeOprationSuccess) {
                               success(@[]);
                           }else{
                               [weakSelf sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(type),@(process)]];
                           }
                       } failBlock:^(UpgradeOpration type, UpgradeErrorCode code) {
                               fail(@[@(code)]);
                       }];
                   }else{
                       fail(@[@(6)]);
                   }
               }];
           }else{
               fail(@[@(2)]);
           }
       }];
}


RCT_EXPORT_METHOD(endGatewayUpgrade)
{
    [[TTGatewayDFU shareInstance] endUpgrade];
}

@end

