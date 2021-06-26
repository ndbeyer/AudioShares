#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
// RNAppAuth
#import "RNAppAuthAuthorizationFlowManager.h"

// RNAppAuth
// was: @interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>
// changed:
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, RNAppAuthAuthorizationFlowManager>

@property (nonatomic, strong) UIWindow *window;
@property(nonatomic, weak)id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;

@end
