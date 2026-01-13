import * as React from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import {TtGatewayDFU, TtlockDFU, TtUpgradeError, TtUpgradeProgress} from 'react-native-ttlock-upgrade'

const LOCK_DATA = "9J+QyZ/5W4s2khQb9vZ3kbz1t/jTXxnwu5rEepqg3jmkA5IaHZC2RkfZ12LfabtuirNTFMY6Ax9at7wKfo9rtTmclz6kXIHu0T5Gdpka5q8z8LA1Xo+QC9SrH9dMn40+p59Es9q0IfScSAkTcLrPgw9sHRU5frkFwH9eFoFkByWKAYeXm4/qL28Xhus6MokG/T45WQ9p1fQnB4kfVLB1KsFZ7vxSxpWxLYpjuqo+1BcxNE5M7o0/o/+GLWm/cgDV1KwZNfjE+RbFeUuUD0z8SDSBZgkKva3hIZCV3WY4v5rkMShhMXy4uW/ywUyRzOrtknXUE1Ge7IeuPeDPKqFN6tlmYZTbKN1VuRcW1psRlhgb/eAcyxxeWhvyHkxH+Sbkm+soDG8NQW8EuBAAMJS2I3IiVgSrDZ9BeLZbbgirgdTbVZSvlG68uYiHyUQY9gyxdHeeuTOy6d8AaQ8KaEg/Gxiy1JHVgkmE+ZdXc+UFK/1HqK1ZCwWqgn1gullyGXY8/yj1p9c3w8uErQgMHidHtZH1HssE7TfavHJoWxPxW5GGVSJ7YzygSLnGrMIepATI0QGkH1XsFZz1VDYiTmkAdFeFBUdKa9EztGMqRlmBIm1zA+O9zGlGeS3vT8o9PbZyif18xz4GwUilngQWToEurjT3yy5MBs8WrDfkgvkQvB8IzCAXw9KwgKmkisHpTC1WY5eyBJOYeZNir1hOIMdydgVoSAfCtD/0eCUfAB5+K5+MXOUHDcopydeyqhpESiI+MdWOS2VzbPgFW8SI/72bkRGx7cr2iJ+Uqvt3CSeX0WWLahp9bdKma6/zT/NPpbFXI0r3AiMBextokaL25Bd5bkTOQpF1QbS8Bo+r/VwFQzjNap8vGwzhKuYhgLemRl4JgJ3sax+UTUg9fQyNEVAruJF9QTyMrv2MeRTOq9NWlGIX59ugUWBjKUTAdyiSxVRJSVz1CNTUbFSsPX93J3K3FAK4JawTfIxZwdlMIqGoxKImBC+/TNjwlSgZQIi8MVUPnoQmeopPNF38SN5VfeqEp/gu2AQdBjwEDKbmofskGnI3vOiJXCOnV4C/jYt0701++H9SIrPl7nUlcL3l6Axu6PWXD0IEWc7JRshO0mdvQ7WigGTr1F+FyCqwwb/xEhD60gKNJWmbjBz2/Avvi4gKgXrIjh95z3OfqV1TCO0mGHtVd3ZysA3YZdwY02uJSH2xKL4vgHODTGOxo+Gh2WNIQJyPdca+pGAlUsMXvJu0bfHAJDQCuzk=";
const FRIMWARE_PKG = "LTk3LC01OCwtMTI4LC0xMjcsLTEyMSwtMTA2LC05OSwtMTA4LC0xMTIsLTExNSwtMTE3LC0xMTgsLTgxLC0xMjcsLTk5LC01OCwtMzQsLTU4LC00MywtNDUsLTQxLC00NSwtNDEsLTQ3LC00NiwtMzYsLTQ1LC00OCwtNDIsLTQxLC00NiwtNDQsLTQ0LC00NCwtNTgsLTU2LC01OCwtMTExLC0xMDYsLTEyMCwtNTgsLTM0LC01OCwtMTE2LC0xMTIsLTExMiwtMTA4LC0xMDUsLTM0LC01MywtNTMsLTEwNywtMTE1LC0xMTgsLTExNSwtMTExLC0xMDgsLTEyMywtMTIxLC0xMTMsLTEyMywtMTI1LC0xMjcsLTU0LC0xMDUsLTEyMSwtMTE1LC0xMjcsLTExOCwtMTI3LC0xMDYsLTU0LC0xMjEsLTExOCwtNTMsLTEyNiwtMTE1LC0xMDYsLTExOSwtMTA5LC0xMjMsLTEwNiwtMTI3LC01MywtNzMsLTg2LC02OSwtNDcsLTQ0LC00MSwtNjksLTc4LC00MywtNTQsLTQ2LC01NCwtNDQsLTUyLC01MiwtNzMsLTQ3LC00NCwtNDEsLTUxLC02OSwtNTIsLTczLC04NiwtNDcsLTQ0LC00MSwtNTUsLTgwLC00OCwtMzYsLTU1LC03NywtODMsLTk0LC04MywtOTYsLTU1LC05MCwtOTUsLTg4LC04OCwtNTUsLTc0LC04OSwtODMsLTU1LC04OCwtODEsLTUxLC02OSwtNTEsLTUyLC04OCwtODEsLTUxLC02OSwtNzgsLTQ2LC01NCwtNDcsLTU0LC00MiwtNDQsLTU0LC00MiwtNDgsLTQ0LC0zNSwtNDIsLTQ4LC01MiwtNDEsLTUxLC01NCwtMTIyLC0xMTUsLTExOCwtNTgsLTEwMyw0Mg==";

const MainPage = ({ navigation }: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={[styles.touchButton]}
        onPress={() => {
          TtlockDFU.startUpgradeByFirmwarePackage(FRIMWARE_PKG,  LOCK_DATA, (status:TtUpgradeProgress, percentage: number) => {
            console.log('返回数据:' +  status + "    进度：" + percentage)
          }, (newLockData: string) => {
            console.log("新锁数据：" + newLockData)
          },(error: TtUpgradeError) => {
            console.log("错误码：" + error)
          });
        }}>
        <Text style={styles.touchButtonText}>Lock</Text>
      </TouchableHighlight>



      <TouchableHighlight
        style={[styles.touchButton]}
        onPress={() => {
          TtGatewayDFU.startUpgrade("firmwarePackage download from ttlock api", "gatewa mac", (status:TtUpgradeProgress, percentage: number) => {
            console.log('返回数据:' +  status + "    进度：" + percentage)
          }, () => {
            console.log("升级成功")
          }, (error: TtUpgradeError) => {
            console.log("错误码：" + error)
          })
        }}>
        <Text style={styles.touchButtonText}>Gateway</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "column",
    justifyContent: "center"
  },


  touchButton: {
    backgroundColor: "white",
    marginTop: 80,
    marginHorizontal: 100,
    height: 150,

    borderRadius: 20,
    borderColor: "lightgray",
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  touchButtonText: {
    color: '#333333',
    textAlign: 'center',
  }
});

export default MainPage;
