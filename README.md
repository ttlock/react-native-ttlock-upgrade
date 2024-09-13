# react-native-ttlock-upgrade



##### Developers Email && Quick Response

ttlock-developers-email-list@googlegroups.com

## Installation

```js
package.json

{
  "name": "your-project",
  "dependencies": {
    "react-native-ttlock-upgrade": "https://github.com/ttlock/react-native-ttlock-upgrade.git#premise"
  }
}
```

##  Upgrade



#### Lock

```js
import {TtlockDFU, TtUpgradeError, TtUpgradeProgress} from 'react-native-ttlock-upgrade'

//The lock will be restored to factory Settings after the upgrade is complete
TtlockDFU.startUpgradeByFirmwarePackage(firmwarePackage,  lockData, (status:TtUpgradeProgress, percentage: number) => {
            console.log("status：" + progress + "    percentage：" + percentage)
          }, (newLockData: string) => {
            console.log("upgrade success newLockData：" + newLockData)
          },(error: TtUpgradeError) => {
            console.log("fail：" + error)
          });


//Stop Upgrade
TtlockDFU.stopUpgrade()


```



#### Gateway

```js
import {TtGatewayDFU, TtlockDFU, TtUpgradeError, TtUpgradeProgress, TtUpgradeType} from 'react-native-ttlock-upgrade'

//Upgrade the gateway 
//Note: Before upgrading the gateway, you need to power it on again. In this case, the red and blue indicators are blinking alternately
TtGatewayDFU.startUpgrade(
    firmwarePackage,
     gatewaMac, 
     (status:TtUpgradeProgress, percentage: number) => {
        console.log("status：" + progress + "    percentage：" + percentage)
    }, ()=>{
        console.log("upgrade success")
    },(error: TtUpgradeError) => {
        console.log("fail: " + error)
    }
)

//Stop Upgrade
TtGatewayDFU.stopUpgrade()

```

 



