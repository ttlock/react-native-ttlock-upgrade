
//  Created by TTLock on 2017/8/9.
//  Copyright © 2017年 TTLock. All rights reserved.
//  version:1.0.0

#import <Foundation/Foundation.h>
#import "TTDFUMacros.h"
#import "TTGatewayDFU.h"
#import <TTLockOnPremise/TTLock.h>

@interface TTLockDFUOnPremise : NSObject

+ (instancetype _Nonnull  )shareInstance;

/** Start Dfu,  SDK will set the lock to enter upgrade mode and upgrade it,
 */
- (void)startDfuWithFirmwarePackage:(NSString *_Nonnull)firmwarePackage
                           lockData:(NSString *_Nonnull)lockData
                       successBlock:(TTLockDFUSuccessBlock _Nullable )sblock
                          failBlock:(TTLockDFUFailBlock _Nullable )fblock;
/**
 When you receive a failBlock, you can call this method to retry
 */
- (void)retry;

- (void)endUpgrade;

@end
