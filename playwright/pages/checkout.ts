import { Page, Locator, test } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    // Shipping form
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly addressInput: Locator;
    readonly continueButton: Locator;

    // Payment form
    readonly cardNumberInput: Locator;
    readonly cardNameInput: Locator;
    readonly expiryDateInput: Locator;
    readonly cvvInput: Locator;
    readonly placeOrderButton: Locator;

    // Order placed confirmation
    readonly orderPlacedConfirmation: Locator;
    readonly transactionId: Locator;

    // Error messages
    readonly paymentError: Locator;

    constructor(page: Page) {
        this.page = page;
        // Shipping form
        this.nameInput = page.locator('input[data-testid="shipping-name"]').describe('name input');
        this.emailInput = page.locator('input[data-testid="shipping-email"]').describe('email input');
        this.addressInput = page.locator('[data-testid="shipping-address"]').describe('address input');
        this.continueButton = page.locator('button[data-testid="continue-to-payment-button"]').describe('continue to payment button');
        // Payment form
        this.cardNumberInput = page.locator('input[data-testid="card-number-input"]').describe('card number input');
        this.cardNameInput = page.locator('input[data-testid="card-name-input"]').describe('card name input');
        this.expiryDateInput = page.locator('input[data-testid="expiry-date-input"]').describe('expiry date input');
        this.cvvInput = page.locator('input[data-testid="cvv-input"]').describe('cvv input');
        this.placeOrderButton = page.locator('button[data-testid="place-order-button"]').describe('place order button');
        // Order placed confirmation
        this.orderPlacedConfirmation = page.locator('h2').describe('order placed confirmation');
        this.transactionId = page.locator('[data-testid="transaction-id"]').describe('transaction id');
        // Error messages
        this.paymentError = page.locator('[data-testid="payment-error"]').describe('payment error message');
    }
    readonly url: string = '/checkout';

    async fillShippingForm(name: string, email: string, address: string) {
        await test.step('Filling the shipping form', async () => {
            await this.nameInput.fill(name);
            await this.emailInput.fill(email);
            await this.addressInput.fill(address);
            await this.continueButton.click();
        });
    }
    async fillPaymentForm(cardNumber: string, cardName: string, expiryDate: string, cvv: string) {
        await test.step('Filling the payment form', async () => {
            await this.cardNumberInput.fill(cardNumber);
            await this.cardNameInput.fill(cardName);
            await this.expiryDateInput.fill(expiryDate);
            await this.cvvInput.fill(cvv);
            await this.placeOrderButton.click();
        });
    }
}