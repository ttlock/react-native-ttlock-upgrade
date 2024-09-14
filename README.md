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

### Lock

```js
import {TtlockDFU, TtUpgradeError, TtUpgradeProgress} from 'react-native-ttlock-upgrade'

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



### Gateway

```js
import {TtGatewayDFU, TtlockDFU, TtUpgradeError, TtUpgradeProgress, TtUpgradeType} from 'react-native-ttlock-upgrade'

//Upgrade the gateway 

// Note: Before upgrading the gateway, you need to re-power it. In this case, the red and blue indicators are blinking alternately.If you don't want to re-power the gateway manually, you can also call the server api gateway/enterUpgradeMode instead 

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

 



