import { z } from 'zod';

// ==========================================
// AUTH & USER PROFILE VALIDATORS
// ==========================================

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    designation: z.enum(['BROTHER', 'SISTER', 'FRIEND'], {
      message: 'Please select whether you are a Brother, Sister, or Friend',
    }),
    ecclesia: z.string().optional(),
    baptismDate: z.string().optional(),
    phoneNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if ((data.designation === 'BROTHER' || data.designation === 'SISTER') && !data.baptismDate) {
        return false;
      }
      return true;
    },
    {
      message: 'Baptism date is required for Brothers and Sisters',
      path: ['baptismDate'],
    }
  );

export const updateProfileSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    designation: z.enum(['BROTHER', 'SISTER', 'FRIEND']),
    ecclesia: z.string().optional(),
    baptismDate: z.string().optional(),
    phoneNumber: z.string().optional(),
  })
  .refine(
    (data) => {
      if ((data.designation === 'BROTHER' || data.designation === 'SISTER') && !data.baptismDate) {
        return false;
      }
      return true;
    },
    {
      message: 'Baptism date is required for Brothers and Sisters',
      path: ['baptismDate'],
    }
  );

// ==========================================
// EVENT VALIDATORS
// ==========================================

export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  theme: z.string().optional(),
  bannerUrl: z.string().url('Invalid banner URL').optional().or(z.literal('')),
  startDate: z.string().datetime({ message: 'Invalid start date format' }),
  endDate: z.string().datetime({ message: 'Invalid end date format' }),
  location: z.string().min(3, 'Location is required'),
  isPublished: z.boolean().default(false),
  maxAttendees: z.number().int().positive().optional(),
  registrationDeadline: z.string().datetime().optional(),
});

// ==========================================
// MERCHANDISE VALIDATORS
// ==========================================

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(10, 'Description is required'),
  price: z.number().positive('Price must be greater than 0'),
  category: z.string().default('Apparel'),
  stockQuantity: z.number().int().nonnegative('Stock cannot be negative'),
  imageUrls: z.array(z.string().url()).min(1, 'At least one product image is required'),
  availableSizes: z.array(z.string()).default(['XS', 'S', 'M', 'L', 'XL', '2XL']),
  isAvailable: z.boolean().default(true),
  isPreorder: z.boolean().default(false),
});

// ==========================================
// ORDER & PAYMENT VALIDATORS
// ==========================================

export const checkoutSchema = z.object({
  recipientName: z.string().min(2, 'Recipient name is required'),
  contactNumber: z.string().min(7, 'Valid contact number is required'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
        selectedSize: z.string().optional(),
      })
    )
    .min(1, 'Order must contain at least one item'),
});

export const paymentReceiptUploadSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  receiptImageUrl: z.string().url('Proof of payment image URL is required'),
  paymentMethod: z.enum(['GCASH', 'PALAWAN_PAY', 'BANK_TRANSFER', 'MAYA', 'OTHER']),
  referenceNumber: z.string().min(3, 'Reference number is required'),
  amountPaid: z.number().positive('Amount paid must be greater than 0'),
});

export const receiptVerificationSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(['APPROVED', 'REJECTED']),
  verificationNotes: z.string().optional(),
});
