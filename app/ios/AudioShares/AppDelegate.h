#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
// RNAppAuth
#import "RNAppAuthAuthorizationFlowManager.h"
// Expo Unimodules
#import <UMCore/UMAppDelegateWrapper.h>

// RNAppAuth
// was: @interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>
// Expo Unimodules
// was: @interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, RNAppAuthAuthorizationFlowManager>
// changed:
@interface AppDelegate : UMAppDelegateWrapper <UIApplicationDelegate, RCTBridgeDelegate, RNAppAuthAuthorizationFlowManager>

@property (nonatomic, strong) UIWindow *window;
@property(nonatomic, weak)id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;

@end
