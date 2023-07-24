import { isNotEmptyString } from '@rnw-community/shared';

import { PaymentResponse } from './payment-response';

import type { IosCNPhoneNumber } from '../../@standard/ios/response/ios-cn-phone-number';
import type { IosCNPostalAddress } from '../../@standard/ios/response/ios-cn-postal-address';
import type { IosNSPersonNameComponents } from '../../@standard/ios/response/ios-ns-person-name-components';
import type { IosPKPayment } from '../../@standard/ios/response/ios-pk-payment';
import type { IosPKToken } from '../../@standard/ios/response/ios-pk-token';
import type { PaymentResponseAddressInterface } from '../../interface/payment-response-address.interface';

export class IosPaymentResponse extends PaymentResponse<IosPKToken> {
    constructor(requestId: string, methodName: string, jsonData: string) {
        const data = JSON.parse(jsonData) as IosPKPayment;

        super(requestId, methodName, {
            billingAddress: IosPaymentResponse.parsePKContact(data.billingContact?.postalAddress),
            details: data.token,
            payerEmail: data.shippingContact?.emailAddress ?? '',
            payerName: IosPaymentResponse.parseNSPersonNameComponents(data.shippingContact?.name),
            payerPhone: IosPaymentResponse.parseCNPhoneNumber(data.shippingContact?.phoneNumber),
            shippingAddress: IosPaymentResponse.parsePKContact(data.shippingContact?.postalAddress),
        });
    }

    // TODO: Validate if this mapping is correct
    private static parsePKContact(input?: IosCNPostalAddress): PaymentResponseAddressInterface {
        return {
            countryCode: input?.ISOCountryCode ?? '',
            postalCode: input?.postalCode ?? '',
            address1: input?.street ?? '',
            address2: input?.city ?? '',
            address3: input?.state ?? '',
            administrativeArea: input?.subAdministrativeArea ?? '',
            locality: input?.subLocality ?? '',
            sortingCode: '',
        };
    }

    // TODO: Validate if this is correct
    private static parseNSPersonNameComponents(input?: IosNSPersonNameComponents): string {
        return [input?.familyName, input?.middleName, input?.givenName].filter(isNotEmptyString).join('');
    }

    // TODO: Validate if this is correct
    private static parseCNPhoneNumber(input?: IosCNPhoneNumber): string {
        return input?.stringValue ?? '';
    }
}