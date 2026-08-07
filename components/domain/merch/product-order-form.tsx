'use client';

import React, { useState, useActionState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ui/image-upload';
import { createOrderAction, OrderActionResult } from '@/app/actions/orders';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/lib/db/schema/products';
import type { Profile } from '@/lib/db/schema/users';
import {
  ShoppingBag,
  Truck,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  Info,
  Calendar,
} from 'lucide-react';

interface ProductOrderFormProps {
  product: Product;
  user: Profile;
}

const initialState: OrderActionResult = {
  success: false,
};

const COURIER_FEE = 120;

export function ProductOrderForm({ product, user }: ProductOrderFormProps) {
  const [state, formAction, isPending] = useActionState(createOrderAction, initialState);

  const availableSizes = product.availableSizes && product.availableSizes.length > 0
    ? product.availableSizes
    : ['One Size'];

  const hasSizes = availableSizes.length > 1 || (availableSizes[0] && availableSizes[0] !== 'One Size' && availableSizes[0] !== 'N/A');

  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [fulfillmentType, setFulfillmentType] = useState<'EVENT_PICKUP' | 'DELIVERY'>('EVENT_PICKUP');
  const [showReceiptUpload, setShowReceiptUpload] = useState<boolean>(false);

  const unitPrice = Number(product.price);
  const itemSubtotal = unitPrice * quantity;
  const shippingFee = fulfillmentType === 'DELIVERY' ? COURIER_FEE : 0;
  const totalAmount = itemSubtotal + shippingFee;

  // Order Success Screen
  if (state?.success && state.orderNumber) {
    return (
      <Card className="border-[#2e7d32]/30 bg-[#fefcf1] shadow-xl overflow-hidden animate-fadeIn">
        <div className="bg-[#2e7d32] text-white p-6 text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-white/20 text-white mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="font-serif text-2xl font-bold">Order Received!</h3>
          <p className="text-xs text-white/90">
            Order Reference: <span className="font-mono font-bold tracking-wider">{state.orderNumber}</span>
          </p>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="p-4 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb] space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-[#e6dfcb] pb-2">
              <span className="text-[#707666]">Item</span>
              <strong className="text-[#2c3324]">{product.name}</strong>
            </div>
            {hasSizes && (
              <div className="flex justify-between items-center text-sm border-b border-[#e6dfcb] pb-2">
                <span className="text-[#707666]">Selected Size</span>
                <Badge variant="gold" size="sm">{selectedSize}</Badge>
              </div>
            )}
            <div className="flex justify-between items-center text-sm border-b border-[#e6dfcb] pb-2">
              <span className="text-[#707666]">Quantity</span>
              <span className="font-bold text-[#2c3324]">{quantity} pc(s)</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-[#e6dfcb] pb-2">
              <span className="text-[#707666]">Fulfillment</span>
              <span className="font-medium text-[#2c3324]">
                {fulfillmentType === 'EVENT_PICKUP' ? '🎪 Event Pickup (Upcoming Camp)' : '🚚 Courier Delivery'}
              </span>
            </div>
            <div className="flex justify-between items-center text-base font-serif font-bold text-[#2c3324] pt-1">
              <span>Total Payable</span>
              <span className="text-[#9a6423] text-lg">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#f0f4eb] border border-[#d3dec2] space-y-3 text-xs text-[#505748]">
            <div className="flex items-center gap-2 font-bold text-[#2c3324]">
              <QrCode className="h-4 w-4 text-[#2e7d32]" />
              <span>Next Step: GCash Payment</span>
            </div>
            <p>
              Please send <strong>{formatCurrency(totalAmount)}</strong> to the official PCYC GCash:
            </p>
            <div className="p-3 rounded-xl bg-white border border-[#d3dec2] font-mono text-center text-sm font-bold text-[#2c3324]">
              0917-829-1926 (PCYC / Treas. Mark S.)
            </div>
            <p className="text-[11px] text-[#707666]">
              Upload your receipt in the Member Portal to fast-track verification.
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <Link href="/portal" className="w-full">
            <Button variant="primary" size="lg" className="w-full gap-2 shadow-sm">
              <span>Open Member Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/merch" className="w-full">
            <Button variant="outline" size="lg" className="w-full">
              <span>Continue Shopping</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-[#e6dfcb] shadow-lg bg-[#fefcf1]">
      <form action={formAction}>
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="selectedSize" value={selectedSize} />
        <input type="hidden" name="quantity" value={quantity} />
        <input type="hidden" name="fulfillmentType" value={fulfillmentType} />

        <CardHeader className="border-b border-[#e6dfcb] pb-4">
          <div className="flex items-center justify-between">
            <Badge variant="gold" size="sm">
              {product.isPreorder ? 'Pre-Order Open' : 'In Stock'}
            </Badge>
            <span className="font-serif text-xl font-bold text-[#9a6423]">
              {formatCurrency(unitPrice)}
            </span>
          </div>
          <CardTitle className="text-lg sm:text-xl text-[#2c3324] pt-1">
            Place Member Order
          </CardTitle>
          <CardDescription className="text-xs">
            Ordering as <strong className="text-[#2c3324]">{user.firstName} {user.lastName}</strong> ({user.ecclesia || 'PCYC Youth'})
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {state?.error && (
            <div className="p-3.5 rounded-xl bg-[#fdf2f2] border border-[#f5c6cb] text-[#c0392b] text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {/* 1. Size Selection (if applicable) */}
          {hasSizes && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#2c3324] uppercase tracking-wider">
                  Select Size <span className="text-[#c0392b]">*</span>
                </label>
                <span className="text-xs text-[#707666]">
                  Selected: <strong className="text-[#2c3324]">{selectedSize}</strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-10 px-3.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#2c3324] text-[#fefcf1] shadow-sm ring-2 ring-[#e0a861]'
                          : 'bg-[#f8f4e3] border border-[#e6dfcb] text-[#505748] hover:bg-[#e6dfcb]/50'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Quantity Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2c3324] uppercase tracking-wider block">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#e6dfcb] rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3.5 py-2 text-[#505748] hover:bg-[#f8f4e3] font-bold text-sm transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-bold text-[#2c3324] min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(50, prev + 1))}
                  className="px-3.5 py-2 text-[#505748] hover:bg-[#f8f4e3] font-bold text-sm transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-[#707666]">
                Subtotal: <strong className="text-[#2c3324]">{formatCurrency(itemSubtotal)}</strong>
              </span>
            </div>
          </div>

          {/* 3. Fulfillment Mode (Event Pickup vs Courier Delivery) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2c3324] uppercase tracking-wider block">
              Fulfillment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType('EVENT_PICKUP')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  fulfillmentType === 'EVENT_PICKUP'
                    ? 'border-[#2c3324] bg-[#2c3324]/5 shadow-xs ring-1 ring-[#2c3324]'
                    : 'border-[#e6dfcb] bg-[#f8f4e3]/50 hover:bg-[#f8f4e3]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-[#2c3324]">
                  <Calendar className="h-4 w-4 text-[#e0a861]" />
                  <span>Event Pickup (Free)</span>
                </div>
                <p className="text-[11px] text-[#707666] mt-1">
                  Claim at upcoming PCYC Youth Camp registration desk.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('DELIVERY')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  fulfillmentType === 'DELIVERY'
                    ? 'border-[#2c3324] bg-[#2c3324]/5 shadow-xs ring-1 ring-[#2c3324]'
                    : 'border-[#e6dfcb] bg-[#f8f4e3]/50 hover:bg-[#f8f4e3]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-[#2c3324]">
                  <Truck className="h-4 w-4 text-[#e0a861]" />
                  <span>Door Delivery (+₱120)</span>
                </div>
                <p className="text-[11px] text-[#707666] mt-1">
                  Delivered straight to your address via courier.
                </p>
              </button>
            </div>
          </div>

          {/* Conditional Delivery Address Form */}
          {fulfillmentType === 'DELIVERY' && (
            <div className="p-4 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb] space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2c3324]">
                <MapPin className="h-4 w-4 text-[#9a6423]" />
                <span>Courier Delivery Details</span>
              </div>

              <Input
                label="Recipient Full Name"
                name="recipientName"
                defaultValue={`${user.firstName} ${user.lastName}`}
                required
              />

              <Input
                label="Contact Phone Number"
                name="contactNumber"
                defaultValue={user.phoneNumber || ''}
                placeholder="0917 123 4567"
                required
              />

              <Input
                label="Street Address / Building / Unit"
                name="deliveryAddress"
                placeholder="Block 12 Lot 5, Sampaguita St., Brgy..."
                required
                error={state?.fieldErrors?.deliveryAddress?.[0]}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="City / Municipality"
                  name="city"
                  placeholder="e.g. Quezon City"
                  required
                />
                <Input
                  label="Province / Region"
                  name="province"
                  placeholder="e.g. Metro Manila"
                  required
                />
              </div>

              <Input
                label="Postal ZIP Code (Optional)"
                name="zipCode"
                placeholder="e.g. 1100"
              />
            </div>
          )}

          {/* Event Pickup Note */}
          {fulfillmentType === 'EVENT_PICKUP' && (
            <div className="p-3.5 rounded-xl bg-[#f0f4eb] border border-[#d3dec2] text-xs text-[#505748] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#2c3324]">
                <Info className="h-3.5 w-3.5 text-[#2e7d32]" />
                <span>Pre-Order Pickup Protocol</span>
              </div>
              <p>
                Your order will be packaged and prepared for claiming at the official PCYC Registration Desk during the next fellowship camp. No shipping fee required.
              </p>
            </div>
          )}

          {/* Recipient Special Notes */}
          <Textarea
            label="Order Notes / Special Instructions (Optional)"
            name="notes"
            placeholder="e.g. Please inform brother John upon arrival, preferred packaging..."
            rows={2}
          />

          {/* Optional Direct Proof of Payment Attachment */}
          <div className="border-t border-[#e6dfcb] pt-4 space-y-3">
            <button
              type="button"
              onClick={() => setShowReceiptUpload(!showReceiptUpload)}
              className="text-xs font-bold text-[#9a6423] hover:underline flex items-center gap-1.5"
            >
              <QrCode className="h-4 w-4" />
              <span>{showReceiptUpload ? '− Hide GCash Receipt Upload' : '+ Pay Now via GCash & Attach Screenshot (Optional)'}</span>
            </button>

            {showReceiptUpload && (
              <div className="p-4 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb] space-y-4 animate-fadeIn">
                <div className="text-xs text-[#505748] space-y-1">
                  <p className="font-bold text-[#2c3324]">PCYC Official GCash:</p>
                  <p className="font-mono text-sm font-bold text-[#9a6423]">0917-829-1926 (Mark S.)</p>
                  <p className="text-[11px] text-[#707666]">
                    Amount to send: <strong>{formatCurrency(totalAmount)}</strong>
                  </p>
                </div>

                <Input
                  label="GCash Reference Number"
                  name="referenceNumber"
                  placeholder="e.g. 1004 8920 1827"
                />

                <ImageUpload
                  label="Screenshot of GCash Receipt"
                  name="receiptImage"
                  helperText="Attach GCash payment confirmation screenshot (PNG/JPG)."
                />
              </div>
            )}
          </div>

          {/* Summary Calculation */}
          <div className="p-4 rounded-xl bg-[#2c3324] text-[#fefcf1] space-y-2">
            <div className="flex justify-between text-xs text-[#fefcf1]/70">
              <span>Items Subtotal ({quantity}x)</span>
              <span>{formatCurrency(itemSubtotal)}</span>
            </div>
            {fulfillmentType === 'DELIVERY' && (
              <div className="flex justify-between text-xs text-[#fefcf1]/70">
                <span>Courier Delivery Fee</span>
                <span>{formatCurrency(COURIER_FEE)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-[#fefcf1] border-t border-[#3d4632] pt-2">
              <span>Total Order Amount</span>
              <span className="text-[#e0a861] text-base">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-[#e6dfcb] pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full gap-2 shadow-md"
            isLoading={isPending}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Confirm & Place Order ({formatCurrency(totalAmount)})</span>
          </Button>

          <p className="text-center text-[11px] text-[#707666]">
            By placing this order, you support PCYC youth fellowship and camp subsidies.
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
