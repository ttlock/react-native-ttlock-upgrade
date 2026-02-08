import { View, StyleSheet, Button } from 'react-native';
import { TtlockDFU, TtGatewayDFU } from 'react-native-ttlock-upgrade';

const lockData = "9J+QyZ/5W4s2khQb9vZ3kbz1t/jTXxnwu5rEepqg3jmkA5IaHZC2RkfZ12LfabtufUd1rSnOGvQwvVtlwOYubKMs+EZvBSaV5y3WWoVxybmtrYs1F2/tAqevCl5J1ekYkHFuNocNuUMPC9rrKO02SiwDRAIP8QyupgtGBpkglZmUI+2/YqRza/7ESLdmjO35JEymjQ6+DJby0zRfWZ4WTjdu38Fos4dbb6y3t4tsw9Wvccw4WeiqtnT5bvM990m4mk704ksssmOtrHOECgqnlDIAMSAtTYr5xRQSKzdKNOKIqOOr0oJvnlsMy9LaaQ8UH1zKEg7mxCQRxlN9RywKAHpxs55deV+dqK5bVqQBy6PyKDwAVoT6O6id/yQrFdA3JGIbdotjhcYNUeYHkuegPb4YRNXk/BZohjKXjLOn/OKci9OqRpMZiyjh5kq1VVNq0ABxcgIycb1b5XStn2d8VdYNgJa1sxTpeZgzVHYYIiyrOhKzqJptXIFLBwKT4U3tphopCus2jnUHc01PKN7Yg5PHjRzD+/37X2Boi9DZtsRsn5aJ+whxP8KNXggK1UNJFpqNiGdZhD8Yl0YD2Nw92D/o5gtumU4Zb4TK4V8yX9AzCz1tptHetnLClsUh+KDiCy2+4yhE08ufa2XBeP4ZpY0PBuTCFHUU/kqwyESTXwqm4aUD/0gR433cI06vF6MIco2fosEsoPV+m+GbRCKH+LdBMXdc32YQAz4OMJ1PZ7evjzPq6lJtFWWxmvkR8OWV2rEzQ8W9xpBtvKHqY9Dr89afu9CECTLkbpRq8oK9I3hpBNEOL5Bjnb0E7cCnz8kTWjAkvUjMSR7yvLvrk6o0e5J3VvlZG9WEfoPxehsOP80odd9m+Fn66CNrppXIhEvaTTILrKLZCl2AHxwCHUp+5CUiXY/9Ppu+TGm7c+e93turoXhmmgdF15sxTQw8GhtPPVs+Mp0GielYUOFqHRjByCaeYFNXX9pBMHF6XdIRjoxOx8vR7vhFFGlTd09TQMGuIZMayPt2n5R/vMo/tBYMG8k7r/UWQE7GbkI9K1/MnuJ/rbGvyMFmfJcSu93EGXup0jHtE1nAG3fXwOxLPm4RaAzrABmHKWP78mLo734qpzv/IdCTnw1eC9Lhf/Bnn3jCqaLWCgqY7ZonG7dy4tNdGrlQV0aipa+o8f5joTzAAO9gDadR2VeQ6jHbuMr9JnuvUtAndjo7ylUnvaX7q6+7038U1RzBeYDg+6LmYpjP9NHAJDQCuzk=";
const gatewayMac = "FB:A5:3E:CA:BA:9F";
const lockFirmwarePackage = "LTksLTgyLC0yNCwtMjMsLTE3LC0yLC0xMSwtNCwtOCwtMjcsLTI5LC0zMCwtNTcsLTIzLC0xMSwtODIsLTc0LC04MiwtNjcsLTY5LC02NSwtNjksLTY1LC03MSwtNzAsLTc2LC02OSwtNzIsLTY2LC02NSwtNzAsLTY4LC02OCwtNjgsLTgyLC05NiwtODIsLTcsLTIsLTMyLC04MiwtNzQsLTgyLC0yOCwtOCwtOCwtNCwtMSwtNzQsLTkzLC05MywtMywtMjcsLTMwLC0yNywtNywtNCwtMTksLTE3LC0yNSwtMTksLTIxLC0yMywtOTQsLTEsLTE3LC0yNywtMjMsLTMwLC0yMywtMiwtOTQsLTE3LC0zMCwtOTMsLTIyLC0yNywtMiwtMzEsLTUsLTE5LC0yLC0yMywtOTMsLTMzLC02MiwtNDUsLTcxLC02OCwtNjUsLTQ1LC0zOCwtNjcsLTk0LC03MCwtOTQsLTY4LC05MiwtOTIsLTMzLC03MSwtNjgsLTY1LC05MSwtNDUsLTkyLC0zMywtNjIsLTcxLC02OCwtNjUsLTk1LC00MCwtNzIsLTc2LC05NSwtMzcsLTU5LC01NCwtNTksLTU2LC05NSwtNTAsLTU1LC02NCwtNjQsLTk1LC0zNCwtNDksLTU5LC05NSwtNjQsLTU3LC05MSwtNDUsLTkxLC05MiwtNjQsLTU3LC05MSwtNDUsLTM4LC03MCwtOTQsLTcxLC05NCwtNjYsLTY4LC05NCwtNjYsLTcyLC02OCwtNzUsLTY2LC03MiwtOTIsLTY1LC05MSwtOTQsLTE4LC0yNywtMzAsLTgyLC0xNSw2Ng==";
const gatewayFirmwarePackage = "LTEwOSwtNTQsLTExNiwtMTE1LC0xMTcsLTEwMiwtMTExLC0xMDQsLTEwMCwtMTI3LC0xMjEsLTEyMiwtOTMsLTExNSwtMTExLC01NCwtNDYsLTU0LC0zOSwtMzQsLTQ3LC0zNSwtNDgsLTM0LC0zNiwtMzgsLTM0LC0zNiwtMzksLTM5LC0zOSwtNDAsLTQwLC00MCwtNTQsLTYwLC01NCwtOTksLTEwMiwtMTI0LC01NCwtNDYsLTU0LC0xMjgsLTEwMCwtMTAwLC0xMDQsLTQ2LC01NywtNTcsLTEwMywtMTI3LC0xMjIsLTEyNywtOTksLTEwNCwtMTE5LC0xMTcsLTEyNSwtMTE5LC0xMTMsLTExNSwtNTgsLTEwMSwtMTE3LC0xMjcsLTExNSwtMTIyLC0xMTUsLTEwMiwtNTgsLTExNywtMTIyLC01NywtMTE0LC0xMjcsLTEwMiwtMTIzLC05NywtMTE5LC0xMDIsLTExNSwtNTcsLTY5LC05MCwtNzMsLTM4LC0zOCwtMzMsLTczLC02NiwtMzksLTU4LC0zOSwtNTgsLTM4LC02NCwtMTIyLC03MCwtODIsLTM1LC0zOSwtNzMsLTkwLC04OSwtMzcsLTM4LC05MywtNjMsLTczLC02NiwtMzksLTU4LC0zOCwtNTgsLTM4LC0zNywtNTgsLTQwLC00NywtMzgsLTM1LC01OCwtMTEwLC0xMjcsLTEwNCwtNTQsLTEwNywxMDA=";

export default function App() {
  return (
    <View style={styles.container}>
      <Button title="Lock Start Upgrade" onPress={() => {
        TtlockDFU.startUpgradeByFirmwarePackage(lockFirmwarePackage, lockData, (status, percentage) => {
          console.log(`Progress: ${status}, ${percentage}%`);
        }, (newLockData) => {
          console.log(`Upgrade successful: ${newLockData}`);
        }, (error) => {
          console.log(`Upgrade failed: ${error}`);
        });
      }} />
      <Button title="LockStop Upgrade" onPress={() => {
        TtlockDFU.stopUpgrade();
      }} />
      <Button title="Gateway Start Upgrade" onPress={() => {
        TtGatewayDFU.startUpgradeByFirmwarePackage(gatewayFirmwarePackage, gatewayMac, (status, percentage) => {
          console.log(`Progress: ${status}, ${percentage}%`);
        }, () => {
          console.log("Upgrade successful");
        }, (error) => {
          console.log(`Upgrade failed: ${error}`);
        });
      }} />
      <Button title="Gateway Stop Upgrade" onPress={() => {
        TtGatewayDFU.stopUpgrade();
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
