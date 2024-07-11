#import "TtlockUpgrade.h"
#import <TTLockDFUOnPremise/TTLockDFUOnPremise.h>
#import <TTLockDFUOnPremise/TTGatewayDFU.h>
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



RCT_EXPORT_METHOD(startLockDfuByFirmwarePackage:(NSString *)firmwarePackage lockData:(NSString *) lockData  fail:(RCTResponseSenderBlock)fail)
{
    [[TTLockDFUOnPremise shareInstance] startDfuWithFirmwarePackage:firmwarePackage lockData:lockData successBlock:^(UpgradeOpration type, NSInteger process) {
        [self sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(type),@(process)]];
    } failBlock:^(UpgradeOpration type, UpgradeErrorCode code) {
        fail(@[@(code)]);
    }];
}


RCT_EXPORT_METHOD(stopLockUpgrade)
{
    [[TTLockDFUOnPremise shareInstance] endUpgrade];
}


RCT_EXPORT_METHOD(startGatewayDfuByFirmwarePackage:(NSString *)firmwarePackage gatewayMac:(NSString *) gatewayMac  fail:(RCTResponseSenderBlock)fail)
{
    [[TTGatewayDFU shareInstance] startDfuWithFirmwarePackage:firmwarePackage gatewayMac:gatewayMac successBlock:^(UpgradeOpration type, NSInteger process) {
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

