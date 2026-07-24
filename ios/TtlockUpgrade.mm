
#import "TtlockUpgrade.h"
#import <TTLockDFUOnPremise/TTLockDFUOnPremise.h>
#import <TTLockDFUOnPremise/TTGatewayDFU.h>
#import <TTLockOnPremise/TTLock.h>
#import <TTLockOnPremise/TTGateway.h>
#import <objc/message.h>

#define NOT_NULL_STRING(string) (string ?: @"")

#define EVENT_UPGRADE_PROGRESS @"EventUpgradeProgress"

@implementation TtlockUpgrade



RCT_EXPORT_MODULE()

- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeTtlockUpgradeSpecJSI>(params);
}



+ (BOOL)requiresMainQueueSetup
{
    return YES;
}



//暴露出支持的事件
- (NSArray<NSString *> *)supportedEvents
{
  return @[EVENT_UPGRADE_PROGRESS];
}



RCT_EXPORT_METHOD(startLockDfuByFirmwarePackage:(NSString *)firmwarePackage lockData:(NSString *) lockData  success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    __weak TtlockUpgrade *weakSelf = self;
  [[TTLockDFUOnPremise shareInstance] startDfuWithFirmwarePackage:firmwarePackage lockData:lockData successBlock:^(UpgradeOpration type, NSInteger process) {
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
}


RCT_EXPORT_METHOD(stopLockUpgrade)
{
    [[TTLockDFUOnPremise shareInstance] endUpgrade];
}

RCT_EXPORT_METHOD(startGatewayDfuByFirmwarePackage:(NSString *)firmwarePackage gatewayMac:(NSString *)gatewayMac success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    __weak TtlockUpgrade *weakSelf = self;
    [[TTGatewayDFU shareInstance] startDfuWithFirmwarePackage:firmwarePackage gatewayMac:gatewayMac successBlock:^(UpgradeOpration type, NSInteger process) {
        if (type == UpgradeOprationSuccess) {
            success(@[]);
        } else {
            [weakSelf sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(type), @(process)]];
        }
    } failBlock:^(UpgradeOpration type, UpgradeErrorCode code) {
        fail(@[@(code)]);
    }];
}


RCT_EXPORT_METHOD(stopGatewayUpgrade)
{
    [[TTGatewayDFU shareInstance] endUpgrade];
}

@end
