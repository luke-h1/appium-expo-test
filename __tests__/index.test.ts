import { BrowserObject, remote } from "webdriverio";
// We run these tests against Expo Go in another tab. If you
// have multiple Expo Go instances running at the same time, then
// please shut these down (because they cause the port number to differ)
const EXPO_URL = "exp://127.0.0.1:19000/";
// jest.setTimeout(60000);
let client: BrowserObject = {} as unknown as BrowserObject;

async function reloadExpo() {
  await client.shake();
  const reloadSelector =
    "type == 'XCUIElementTypeOther' && name CONTAINS 'Reload'";
  const reload = await client.$(`-ios predicate string:${reloadSelector}`);
  await reload.click();
}
beforeAll(async () => {
  client = await remote({
    path: "/wd/hub",
    port: 4723,
    capabilities: {
      // You must have this emulator available on your machine
      deviceName: "iPhone 13",
      platformName: "iOS",
      // Within your emulator, make sure the number just under the
      // device name (e.g. iPhone 11) matches the following:
      platformVersion: "15.2",
    },
    logLevel: "warn",
  });
  // Load app afresh between every test
  await client.url(EXPO_URL);
  // This timeout applies when searching for elements with $('')
  await client.setTimeout({ implicit: 10000 });
});
beforeEach(async () => {
  await reloadExpo();
  await client.pause(100);
});
afterAll(async () => {
  if (client) {
    await client.deleteSession();
  }
});
test("Dashboard Screen works", async () => {
  // This uses accessibilityLabel props as query targets
  const dashboardScreen = await client.$('email')
  console.log(dashboardScreen)
  expect(await dashboardScreen.isDisplayed()).toBeTruthy();
});
