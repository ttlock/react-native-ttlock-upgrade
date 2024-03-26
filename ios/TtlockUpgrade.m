#import "TtlockUpgrade.h"
#import <TTLockDFU/TTLockDFU.h>
#import <TTLockDFU/TTGatewayDFU.h>
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


RCT_EXPORT_METHOD(startLockDfuByClient:(NSString *)clientId accessToken:(NSString *)accessToken lockId: (NSNumber *)lockId lockData:(NSString *) lockData  fail:(RCTResponseSenderBlock)fail)
{   
    [[TTLockDFU shareInstance] startDfuWithClientId:clientId accessToken:accessToken lockId:lockId lockData:lockData successBlock:^(UpgradeOpration type, NSInteger process) {
        [self sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(type),@(process)]];
    } failBlock:^(UpgradeOpration type, UpgradeErrorCode code) {
        fail(@[@(code)]);
    }];
}

RCT_EXPORT_METHOD(startLockDfuByFirmwarePackage:(NSString *)firmwarePackage lockData:(NSString *) lockData  fail:(RCTResponseSenderBlock)fail)
{
    [[TTLockDFU shareInstance] startDfuWithFirmwarePackage:firmwarePackage lockData:lockData successBlock:^(UpgradeOpration type, NSInteger process) {
        [self sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(type),@(process)]];
    } failBlock:^(UpgradeOpration type, UpgradeErrorCode code) {
        fail(@[@(code)]);
    }];
}


RCT_EXPORT_METHOD(stopLockUpgrade)
{
    [[TTLockDFU shareInstance] endUpgrade];
}


RCT_EXPORT_METHOD(startGatewayDfuByType:(NSNumber *)type clientId:(NSString *)clientId accessToken:(NSString *)accessToken gatewayId: (NSNumber *)gatewayId gatewayMac:(NSString *) gatewayMac  fail:(RCTResponseSenderBlock)fail)
{
    TTGatewayDFUType dfuType = type.intValue == 0 ? TTGatewayDFUTypeByNet : TTGatewayDFUTypeByBluetooth;
    [[TTGatewayDFU shareInstance] startDfuWithType:dfuType clientId:clientId accessToken:accessToken gatewayId:gatewayId gatewayMac:gatewayMac successBlock:^(UpgradeOpration type, NSInteger process) {
        [self sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(type),@(process)]];
    } failBlock:^(UpgradeOpration type, UpgradeErrorCode code) {
        fail(@[@(code)]);
    }];
}


RCT_EXPORT_METHOD(endGatewayUpgrade)
{
    [[TTGatewayDFU shareInstance] endUpgrade];
}

@end

