//
//  Credentials.m
//  PhoneGapSpeechTest
//
//  Created by Adam on 10/15/12.
//
//

#import "Credentials.h"

const unsigned char SpeechKitApplicationKey[] = {0xf2, 0xdd, 0xf6, 0x66, 0xd8, 0xa7, 0x2b, 0xeb, 0xf4, 0xa5, 0xfe, 0xd2, 0xf1, 0xcc, 0x99, 0xcd, 0x5a, 0xc5, 0xbc, 0x6d, 0x7b, 0x75, 0x09, 0xc3, 0x41, 0x84, 0x94, 0x51, 0x84, 0x7d, 0xf4, 0x76, 0x5a, 0xea, 0xdc, 0x32, 0x91, 0x07, 0x1e, 0x85, 0xad, 0x1c, 0x57, 0x9e, 0xe9, 0xf0, 0x6c, 0x43, 0xb6, 0x28, 0xb1, 0x31, 0x9d, 0xba, 0xf4, 0xde, 0x3e, 0x89, 0x2f, 0xc3, 0x06, 0x24, 0x39, 0x61};

@implementation Credentials 
@synthesize appId, appKey;

NSString* APP_ID = @"NMDPPRODUCTION_Dmitry_Panasenko_BauVoice_20141203193910";

-(NSString *) getAppId {
    return [NSString stringWithString:APP_ID];
};

@end